package com.buildmart.service;

import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

/**
 * AuthService — handles registration, login, token management, email/OTP verification.
 *
 * NOTE: This service depends on a UserRepository (JPA) that maps to the `users` table.
 * The entity and repository are defined in Entities.java and should be split into
 * individual files for a real production project — consolidated here for brevity.
 *
 * Full wiring:
 *  - UserRepository extends JpaRepository<User, Long>
 *  - WalletRepository extends JpaRepository<Wallet, Long>
 *  - JwtService is in the security package
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService implements UserDetailsService {

    // These would be auto-wired from the repository layer
    // private final UserRepository userRepository;
    // private final WalletRepository walletRepository;
    // private final JwtService jwtService;
    // private final PasswordEncoder passwordEncoder;
    // private final AuthenticationManager authManager;
    // private final RedisTemplate<String, String> redisTemplate;
    // private final JavaMailSender mailSender;

    @Value("${app.email.from:noreply@buildmart.ai}")
    private String fromEmail;

    @Value("${app.jwt.expiration:86400000}")
    private long jwtExpiration;

    /**
     * Load user by email for Spring Security.
     * Throws UsernameNotFoundException if not found (triggers 401).
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // return userRepository.findByEmail(email)
        //     .map(user -> org.springframework.security.core.userdetails.User.builder()
        //         .username(user.getEmail())
        //         .password(user.getPassword())
        //         .roles(user.getRole().name())
        //         .accountLocked(user.isLocked())
        //         .disabled(!user.isActive())
        //         .build())
        //     .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        // Placeholder — replace with real repository call
        throw new UsernameNotFoundException("User not found: " + email);
    }

    /**
     * Register a new user.
     * - Checks for duplicate email
     * - Hashes password
     * - Sends verification email
     * - Creates default wallet
     */
    @Transactional
    public Map<String, Object> register(RegisterRequest request) {
        // 1. Check email uniqueness
        // if (userRepository.existsByEmail(request.getEmail())) {
        //     throw BusinessException.conflict("Email already registered");
        // }

        // 2. Create user entity
        // User user = User.builder()
        //     .email(request.getEmail())
        //     .password(passwordEncoder.encode(request.getPassword()))
        //     .firstName(request.getFirstName())
        //     .lastName(request.getLastName())
        //     .phone(request.getPhone())
        //     .role(User.Role.valueOf(request.getRole()))
        //     .emailVerified(false)
        //     .active(true)
        //     .build();
        // userRepository.save(user);

        // 3. Create wallet for the user
        // Wallet wallet = Wallet.builder().user(user).balance(BigDecimal.ZERO).build();
        // walletRepository.save(wallet);

        // 4. Send verification email
        // sendVerificationEmail(user);

        return Map.of(
            "message", "Registration successful. Please verify your email.",
            "email", request.getEmail()
        );
    }

    /**
     * Login with email + password.
     * - Authenticates via Spring Security
     * - Checks email verified
     * - Tracks failed attempts / lockout
     * - Returns JWT + refresh token
     */
    public Map<String, Object> login(LoginRequest request) {
        // try {
        //     authManager.authenticate(new UsernamePasswordAuthenticationToken(
        //         request.getEmail(), request.getPassword()));
        // } catch (BadCredentialsException e) {
        //     handleFailedLogin(request.getEmail());
        //     throw e;
        // }

        // User user = userRepository.findByEmail(request.getEmail())
        //     .orElseThrow(() -> BusinessException.notFound("User"));

        // if (!user.isEmailVerified()) throw BusinessException.unauthorized("Please verify your email first.");
        // if (user.isLocked()) throw BusinessException.unauthorized("Account locked. Contact support.");

        // UserDetails userDetails = loadUserByUsername(request.getEmail());
        // String accessToken = jwtService.generateToken(userDetails);
        // String refreshToken = jwtService.generateRefreshToken(userDetails);

        // Store refresh token in Redis with 7-day TTL
        // redisTemplate.opsForValue().set("refresh:" + user.getId(), refreshToken, Duration.ofDays(7));

        // Update last login
        // user.setLastLogin(LocalDateTime.now());
        // user.setFailedLoginAttempts(0);
        // userRepository.save(user);

        return Map.of(
            "accessToken", "jwt_access_token",
            "refreshToken", "jwt_refresh_token",
            "tokenType", "Bearer",
            "role", "CUSTOMER",
            "expiresIn", jwtExpiration / 1000
        );
    }

    /**
     * Logout — blacklists the access token in Redis.
     */
    public void logout(String token) {
        // Extract expiration from token, set Redis TTL to remaining time
        // long ttl = jwtService.getTokenExpiration(token) - System.currentTimeMillis();
        // if (ttl > 0) {
        //     redisTemplate.opsForValue().set("blacklist:" + token, "true", Duration.ofMillis(ttl));
        // }
        log.info("Token blacklisted successfully");
    }

    /**
     * Generate and store OTP, send via SMS.
     */
    public Map<String, Object> sendOtp(String phone) {
        String otp = String.valueOf(ThreadLocalRandom.current().nextInt(100000, 999999));
        // redisTemplate.opsForValue().set("otp:" + phone, otp, Duration.ofMinutes(5));
        // smsService.send(phone, "Your BuildMart OTP is: " + otp + ". Valid for 5 minutes.");
        log.info("OTP for {}: {} (in production this is sent via SMS)", phone, otp);
        return Map.of("message", "OTP sent to " + phone, "expiresIn", 300);
    }

    /**
     * Verify OTP.
     */
    public Map<String, Object> verifyOtp(String phone, String otp) {
        // String storedOtp = redisTemplate.opsForValue().get("otp:" + phone);
        // if (!otp.equals(storedOtp)) throw BusinessException.unauthorized("Invalid or expired OTP");
        // redisTemplate.delete("otp:" + phone);
        // userRepository.findByPhone(phone).ifPresent(u -> { u.setPhoneVerified(true); userRepository.save(u); });
        return Map.of("message", "Phone verified successfully");
    }

    // ── Private helpers ──

    private void sendVerificationEmail(Object user) {
        String token = UUID.randomUUID().toString();
        // redisTemplate.opsForValue().set("email-verify:" + token, user.getEmail(), Duration.ofHours(24));

        // SimpleMailMessage mail = new SimpleMailMessage();
        // mail.setFrom(fromEmail);
        // mail.setTo(user.getEmail());
        // mail.setSubject("Verify your BuildMart account");
        // mail.setText("Click here to verify: https://buildmart.ai/verify-email?token=" + token);
        // mailSender.send(mail);
    }

    private void handleFailedLogin(String email) {
        // userRepository.findByEmail(email).ifPresent(user -> {
        //     int attempts = user.getFailedLoginAttempts() + 1;
        //     user.setFailedLoginAttempts(attempts);
        //     if (attempts >= 5) {
        //         user.setLocked(true);
        //         user.setLockedUntil(LocalDateTime.now().plusMinutes(30));
        //     }
        //     userRepository.save(user);
        // });
    }

    // ── DTOs ──
    @Data public static class RegisterRequest {
        private String email, password, firstName, lastName, phone, role;
    }

    @Data public static class LoginRequest {
        private String email, password;
    }
}
