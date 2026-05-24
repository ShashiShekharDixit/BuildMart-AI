package com.buildmart.security;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Spring Security UserDetailsService implementation.
 *
 * In production this queries the database:
 *   userRepository.findByEmail(email) -> builds UserDetails
 *
 * For demo/H2 mode it returns hardcoded demo accounts so the app
 * works without a real database connection.
 */
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    // Uncomment when repository layer is wired:
    // private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        // ── Production: uncomment this block ──
        // return userRepository.findByEmail(email)
        //     .map(user -> User.builder()
        //         .username(user.getEmail())
        //         .password(user.getPassword())
        //         .authorities(List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())))
        //         .accountLocked(user.isLocked())
        //         .disabled(!user.isActive())
        //         .build())
        //     .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        // ── Demo mode: hardcoded accounts (BCrypt of "Demo@1234") ──
        String demoHash = "$2a$12$LcV8n4jQFZ8P9kX7mN2d2.8TJxGJ9vRWnHfNGdKdGe5yNMGpkixcO";

        return switch (email) {
            case "customer@demo.com" -> buildUser(email, demoHash, "CUSTOMER");
            case "vendor@demo.com"   -> buildUser(email, demoHash, "VENDOR");
            case "admin@demo.com",
                 "admin@buildmart.ai" -> buildUser(email, demoHash, "ADMIN");
            default -> throw new UsernameNotFoundException("User not found: " + email);
        };
    }

    private UserDetails buildUser(String email, String password, String role) {
        return User.builder()
            .username(email)
            .password(password)
            .authorities(List.of(new SimpleGrantedAuthority("ROLE_" + role)))
            .build();
    }
}
