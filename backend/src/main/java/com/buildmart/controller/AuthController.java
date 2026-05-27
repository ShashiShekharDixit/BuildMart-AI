package com.buildmart.controller;

import com.buildmart.security.JwtService;
import com.buildmart.security.UserDetailsServiceImpl;
import com.buildmart.service.AuthService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsServiceImpl userDetailsService;
    private final JwtService             jwtService;
    private final AuthService            authService;

    /** POST /api/auth/register */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        return ResponseEntity.ok(authService.register(
            toServiceRequest(req)));
    }

    /** POST /api/auth/login → returns JWT + refreshToken */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body(Map.of(
                "error",   "Authentication Failed",
                "message", "Invalid email or password"));
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(req.getEmail());
        String accessToken  = jwtService.generateToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);
        String role = userDetails.getAuthorities().stream()
            .findFirst()
            .map(a -> a.getAuthority().replace("ROLE_", ""))
            .orElse("CUSTOMER");

        log.info("Login OK: {} ({})", req.getEmail(), role);

        return ResponseEntity.ok(Map.of(
            "accessToken",  accessToken,
            "refreshToken", refreshToken,
            "tokenType",    "Bearer",
            "role",         role,
            "email",        req.getEmail(),
            "expiresIn",    86400
        ));
    }

    /** POST /api/auth/refresh */
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> body) {
        String refreshToken = body.get("refreshToken");
        if (refreshToken == null || refreshToken.isBlank())
            return ResponseEntity.badRequest().body(Map.of("message", "Refresh token required"));
        try {
            String email = jwtService.extractUsername(refreshToken);
            UserDetails ud = userDetailsService.loadUserByUsername(email);
            if (jwtService.isTokenValid(refreshToken, ud))
                return ResponseEntity.ok(Map.of(
                    "accessToken", jwtService.generateToken(ud),
                    "tokenType",   "Bearer"));
            return ResponseEntity.status(401).body(Map.of("message", "Invalid refresh token"));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid or expired refresh token"));
        }
    }

    /** GET /api/auth/verify-email?token=xxx */
    @GetMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {
        return ResponseEntity.ok(authService.verifyEmail(token));
    }

    /** POST /api/auth/send-otp */
    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> body) {
        String phone = body.get("phone");
        if (phone == null || !phone.matches("[6-9]\\d{9}"))
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid phone number"));
        return ResponseEntity.ok(authService.sendOtp(phone));
    }

    /** POST /api/auth/verify-otp */
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(authService.verifyOtp(
            body.get("phone"), body.get("otp")));
    }

    /** POST /api/auth/forgot-password */
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(authService.forgotPassword(body.get("email")));
    }

    /** POST /api/auth/reset-password */
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest req) {
        return ResponseEntity.ok(authService.resetPassword(req.getToken(), req.getNewPassword()));
    }

    /** POST /api/auth/logout */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        // In production: blacklist token in Redis
        return ResponseEntity.ok(Map.of("message", "Logged out successfully."));
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private AuthService.RegisterRequest toServiceRequest(RegisterRequest req) {
        AuthService.RegisterRequest sr = new AuthService.RegisterRequest();
        sr.setEmail(req.getEmail());
        sr.setPassword(req.getPassword());
        sr.setFirstName(req.getFirstName());
        sr.setLastName(req.getLastName());
        sr.setPhone(req.getPhone());
        sr.setRole(req.getRole());
        return sr;
    }

    // ── Request DTOs ─────────────────────────────────────────────────────────

    @Data
    public static class RegisterRequest {
        @NotBlank @Email                               private String email;
        @NotBlank @Size(min = 8)                       private String password;
        @NotBlank @Size(max = 50)                      private String firstName;
        @NotBlank @Size(max = 50)                      private String lastName;
        @Pattern(regexp = "^[6-9]\\d{9}$|^$")         private String phone;
        @NotBlank @Pattern(regexp = "CUSTOMER|VENDOR") private String role;
    }

    @Data
    public static class LoginRequest {
        @NotBlank @Email   private String email;
        @NotBlank          private String password;
    }

    @Data
    public static class ResetPasswordRequest {
        @NotBlank          private String token;
        @NotBlank @Size(min = 8) private String newPassword;
    }
}
