package com.buildmart.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


/**
 * AuthService — registration, OTP, password reset, token management.
 *
 * Spring Security authentication (loadUserByUsername) lives in
 * UserDetailsServiceImpl to avoid circular bean dependency.
 *
 * Repository calls are commented out so the app boots without a DB.
 * Uncomment them once MySQL / H2 is wired.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);


    // private final UserRepository userRepository;
    // private final WalletRepository walletRepository;
    // private final PasswordEncoder passwordEncoder;
    // private final RedisTemplate<String, String> redisTemplate;
    // private final JavaMailSender mailSender;

    @Value("${app.email.from:noreply@buildmart.ai}")
    private String fromEmail;

    @Value("${app.jwt.expiration:86400000}")
    private long jwtExpiration;

    // ── Register ─────────────────────────────────────────────────────────────

    @Transactional
    public Map<String, Object> register(RegisterRequest req) {
        // if (userRepository.existsByEmail(req.getEmail()))
        //     throw BusinessException.conflict("Email already registered");

        // User user = User.builder()
        //     .email(req.getEmail())
        //     .password(passwordEncoder.encode(req.getPassword()))
        //     .firstName(req.getFirstName()).lastName(req.getLastName())
        //     .phone(req.getPhone())
        //     .role(User.Role.valueOf(req.getRole()))
        //     .emailVerified(false).active(true).build();
        // userRepository.save(user);

        // Wallet wallet = Wallet.builder().user(user).balance(BigDecimal.ZERO).build();
        // walletRepository.save(wallet);

        // sendVerificationEmail(user.getEmail());

        log.info("New registration: {}", req.getEmail());
        return Map.of(
            "message", "Registration successful. Please verify your email.",
            "email",   req.getEmail()
        );
    }

    // ── OTP ──────────────────────────────────────────────────────────────────

    public Map<String, Object> sendOtp(String phone) {
        String otp = String.valueOf(ThreadLocalRandom.current().nextInt(100000, 999999));
        // redisTemplate.opsForValue().set("otp:" + phone, otp, Duration.ofMinutes(5));
        // smsService.send(phone, "Your BuildMart OTP: " + otp);
        log.info("OTP for +91-{}: {} (not sent — SMS gateway not configured)", phone, otp);
        return Map.of("message", "OTP sent to +91-" + phone, "expiresIn", 300);
    }

    public Map<String, Object> verifyOtp(String phone, String otp) {
        // String stored = redisTemplate.opsForValue().get("otp:" + phone);
        // if (!otp.equals(stored)) throw BusinessException.unauthorized("Invalid or expired OTP");
        // redisTemplate.delete("otp:" + phone);
        // userRepository.findByPhone(phone).ifPresent(u -> { u.setPhoneVerified(true); userRepository.save(u); });
        return Map.of("message", "Phone verified successfully.");
    }

    // ── Password reset ────────────────────────────────────────────────────────

    public Map<String, Object> forgotPassword(String email) {
        String token = UUID.randomUUID().toString();
        // redisTemplate.opsForValue().set("pwd-reset:" + token, email, Duration.ofHours(1));
        // sendPasswordResetEmail(email, token);
        log.info("Password reset requested for: {}", email);
        return Map.of("message", "If this email exists, a reset link has been sent.");
    }

    public Map<String, Object> resetPassword(String token, String newPassword) {
        // String email = redisTemplate.opsForValue().get("pwd-reset:" + token);
        // if (email == null) throw BusinessException.unauthorized("Invalid or expired reset token");
        // PasswordValidator.validate(newPassword);
        // userRepository.findByEmail(email).ifPresent(u -> {
        //     u.setPassword(passwordEncoder.encode(newPassword));
        //     userRepository.save(u);
        // });
        // redisTemplate.delete("pwd-reset:" + token);
        return Map.of("message", "Password reset successfully. Please login.");
    }

    // ── Email verification ────────────────────────────────────────────────────

    public Map<String, Object> verifyEmail(String token) {
        // String email = redisTemplate.opsForValue().get("email-verify:" + token);
        // if (email == null) throw BusinessException.unauthorized("Invalid or expired token");
        // userRepository.findByEmail(email).ifPresent(u -> { u.setEmailVerified(true); userRepository.save(u); });
        // redisTemplate.delete("email-verify:" + token);
        return Map.of("message", "Email verified successfully. You can now login.");
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private void sendVerificationEmail(String email) {
        String token = UUID.randomUUID().toString();
        // redisTemplate.opsForValue().set("email-verify:" + token, email, Duration.ofHours(24));
        // SimpleMailMessage mail = new SimpleMailMessage();
        // mail.setFrom(fromEmail);
        // mail.setTo(email);
        // mail.setSubject("Verify your BuildMart account");
        // mail.setText("Click to verify: https://buildmart.ai/verify-email?token=" + token);
        // mailSender.send(mail);
        log.info("Verification email would be sent to: {} (mail not configured)", email);
    }

    // ── DTOs ──────────────────────────────────────────────────────────────────

    public static class RegisterRequest {
        private String email;
        private String password;
        private String firstName;
        private String lastName;
        private String phone;
        private String role; // CUSTOMER | VENDOR

    // --- Generated getters and setters ---
        public String getEmail() { return this.email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return this.password; }
        public void setPassword(String password) { this.password = password; }
        public String getFirstName() { return this.firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        public String getLastName() { return this.lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
        public String getPhone() { return this.phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getRole() { return this.role; }
        public void setRole(String role) { this.role = role; }
}
}
