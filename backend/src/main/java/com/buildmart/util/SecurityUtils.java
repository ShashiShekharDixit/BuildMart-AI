package com.buildmart.util;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Rate Limiting Filter — limits requests per IP per minute.
 * For production, use Redis-backed rate limiting (e.g., Bucket4j + Redis).
 */
@Component
@Slf4j
public class RateLimitFilter implements Filter {

    @Value("${app.rate-limit.requests-per-minute:60}")
    private int requestsPerMinute;

    // Simple in-memory store: IP -> [count, windowStart]
    private final Map<String, long[]> requestCounts = new ConcurrentHashMap<>();

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String ip = getClientIp(httpRequest);
        String path = httpRequest.getRequestURI();

        // Skip rate limiting for health checks and static assets
        if (path.startsWith("/api/actuator") || path.startsWith("/static")) {
            chain.doFilter(request, response);
            return;
        }

        long now = System.currentTimeMillis();
        long windowMs = 60_000; // 1 minute window

        long[] data = requestCounts.computeIfAbsent(ip, k -> new long[]{0, now});

        // Reset counter if window has passed
        if (now - data[1] > windowMs) {
            data[0] = 0;
            data[1] = now;
        }

        data[0]++;

        // Add rate limit headers
        httpResponse.setHeader("X-RateLimit-Limit", String.valueOf(requestsPerMinute));
        httpResponse.setHeader("X-RateLimit-Remaining", String.valueOf(Math.max(0, requestsPerMinute - (int)data[0])));
        httpResponse.setHeader("X-RateLimit-Reset", String.valueOf((data[1] + windowMs) / 1000));

        if (data[0] > requestsPerMinute) {
            log.warn("Rate limit exceeded for IP: {}", ip);
            httpResponse.setStatus(429);
            httpResponse.setContentType("application/json");
            httpResponse.getWriter().write(
                "{\"status\":429,\"error\":\"Too Many Requests\"," +
                "\"message\":\"Rate limit exceeded. Try again in a minute.\"}");
            return;
        }

        chain.doFilter(request, response);
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) return xRealIp;
        return request.getRemoteAddr();
    }

    @Override
    public void init(FilterConfig filterConfig) {}

    @Override
    public void destroy() { requestCounts.clear(); }
}

// ── Input Sanitizer ──
class InputSanitizer {
    private static final String[] XSS_PATTERNS = {
        "<script>", "</script>", "javascript:", "onload=", "onerror=",
        "<iframe>", "</iframe>", "eval(", "document.cookie",
    };

    public static String sanitize(String input) {
        if (input == null) return null;
        String sanitized = input;
        for (String pattern : XSS_PATTERNS) {
            sanitized = sanitized.replaceAll("(?i)" + java.util.regex.Pattern.quote(pattern), "");
        }
        return sanitized.trim();
    }

    public static boolean containsSqlInjection(String input) {
        if (input == null) return false;
        String lower = input.toLowerCase();
        return lower.contains("' or '") || lower.contains("1=1") ||
               lower.contains("drop table") || lower.contains("union select") ||
               lower.contains("insert into") || lower.contains("delete from");
    }
}

// ── Password Policy Validator ──
class PasswordValidator {
    public static void validate(String password) {
        if (password == null || password.length() < 8)
            throw new com.buildmart.exception.BusinessException("Password must be at least 8 characters");
        if (!password.matches(".*[A-Z].*"))
            throw new com.buildmart.exception.BusinessException("Password must contain at least one uppercase letter");
        if (!password.matches(".*[a-z].*"))
            throw new com.buildmart.exception.BusinessException("Password must contain at least one lowercase letter");
        if (!password.matches(".*[0-9].*"))
            throw new com.buildmart.exception.BusinessException("Password must contain at least one digit");
        if (!password.matches(".*[!@#$%^&*()_+\\-=\\[\\]{}|;':\",./<>?].*"))
            throw new com.buildmart.exception.BusinessException("Password must contain at least one special character");
    }
}
