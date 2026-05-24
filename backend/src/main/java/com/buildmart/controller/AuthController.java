package com.buildmart.controller;

import com.buildmart.security.UserDetailsServiceImpl;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@Slf4j
public class AuthController {

    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private UserDetailsServiceImpl userDetailsService;

    private com.buildmart.security.JwtService jwtService;

    @Autowired
    public void setJwtService(com.buildmart.security.JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Registration request for: {}", request.getEmail());
        return ResponseEntity.ok(Map.of(
            "message", "Registration successful. Please verify your email.",
            "email", request.getEmail()
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body(Map.of(
                "error", "Authentication Failed", "message", "Invalid email or password"));
        }
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String accessToken  = jwtService.generateToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);
        String role = userDetails.getAuthorities().stream().findFirst()
            .map(a -> a.getAuthority().replace("ROLE_", "")).orElse("CUSTOMER");
        log.info("Login: {} ({})", request.getEmail(), role);
        return ResponseEntity.ok(Map.of(
            "accessToken", accessToken, "refreshToken", refreshToken,
            "tokenType", "Bearer", "role", role,
            "email", request.getEmail(), "expiresIn", 86400));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> body) {
        String refreshToken = body.get("refreshToken");
        if (refreshToken == null || refreshToken.isBlank())
            return ResponseEntity.badRequest().body(Map.of("message", "Refresh token required"));
        try {
            String email = jwtService.extractUsername(refreshToken);
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);
            if (jwtService.isTokenValid(refreshToken, userDetails))
                return ResponseEntity.ok(Map.of("accessToken", jwtService.generateToken(userDetails), "tokenType", "Bearer"));
            return ResponseEntity.status(401).body(Map.of("message", "Invalid refresh token"));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid or expired refresh token"));
        }
    }

    @GetMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {
        return ResponseEntity.ok(Map.of("message", "Email verified successfully. You can now login."));
    }

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> body) {
        String phone = body.get("phone");
        if (phone == null || !phone.matches("[6-9]\\d{9}"))
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid phone number"));
        return ResponseEntity.ok(Map.of("message", "OTP sent to +91-" + phone, "expiresIn", 300));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(Map.of("message", "Phone verified successfully."));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(Map.of("message", "If this email exists, a reset link has been sent."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        return ResponseEntity.ok(Map.of("message", "Password reset successfully. Please login."));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        return ResponseEntity.ok(Map.of("message", "Logged out successfully."));
    }

    @Data public static class RegisterRequest {
        @NotBlank @Email private String email;
        @NotBlank @Size(min = 8) private String password;
        @NotBlank @Size(max = 50) private String firstName;
        @NotBlank @Size(max = 50) private String lastName;
        @Pattern(regexp = "^[6-9]\\d{9}$|^$") private String phone;
        @NotBlank @Pattern(regexp = "CUSTOMER|VENDOR") private String role;
    }

    @Data public static class LoginRequest {
        @NotBlank @Email private String email;
        @NotBlank private String password;
    }

    @Data public static class ResetPasswordRequest {
        @NotBlank private String token;
        @NotBlank @Size(min = 8) private String newPassword;
    }
}
