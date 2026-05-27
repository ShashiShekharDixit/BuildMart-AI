package com.buildmart.util;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Slf4j
public class RateLimitFilter implements Filter {

    @Value("${app.rate-limit.requests-per-minute:60}")
    private int requestsPerMinute;

    private final Map<String, long[]> requestCounts = new ConcurrentHashMap<>();

    @Override
    public void doFilter(ServletRequest request, ServletResponse response,
                         FilterChain chain) throws IOException, ServletException {

        HttpServletRequest  httpReq  = (HttpServletRequest)  request;
        HttpServletResponse httpResp = (HttpServletResponse) response;

        String path = httpReq.getRequestURI();
        if (path.startsWith("/api/actuator") || path.startsWith("/static")) {
            chain.doFilter(request, response);
            return;
        }

        String ip  = getClientIp(httpReq);
        long   now = System.currentTimeMillis();
        long   win = 60_000L;

        long[] data = requestCounts.computeIfAbsent(ip, k -> new long[]{0, now});
        if (now - data[1] > win) { data[0] = 0; data[1] = now; }
        data[0]++;

        httpResp.setHeader("X-RateLimit-Limit",     String.valueOf(requestsPerMinute));
        httpResp.setHeader("X-RateLimit-Remaining", String.valueOf(Math.max(0, requestsPerMinute - (int) data[0])));
        httpResp.setHeader("X-RateLimit-Reset",     String.valueOf((data[1] + win) / 1000));

        if (data[0] > requestsPerMinute) {
            log.warn("Rate limit exceeded for IP: {}", ip);
            httpResp.setStatus(429);
            httpResp.setContentType("application/json");
            httpResp.getWriter().write(
                "{\"status\":429,\"error\":\"Too Many Requests\"," +
                "\"message\":\"Rate limit exceeded. Try again in a minute.\"}");
            return;
        }
        chain.doFilter(request, response);
    }

    private String getClientIp(HttpServletRequest req) {
        String xff = req.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isBlank()) return xff.split(",")[0].trim();
        String xri = req.getHeader("X-Real-IP");
        if (xri != null && !xri.isBlank()) return xri;
        return req.getRemoteAddr();
    }

    @Override public void init(FilterConfig cfg)  {}
    @Override public void destroy()                { requestCounts.clear(); }
}
