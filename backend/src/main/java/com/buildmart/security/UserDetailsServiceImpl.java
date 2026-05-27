package com.buildmart.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * UserDetailsService — loads user for Spring Security authentication.
 *
 * DEMO MODE (no database):
 *   Three hardcoded demo accounts so the app works out-of-the-box.
 *   Password hash = BCrypt(12) of "Demo@1234"
 *
 * PRODUCTION MODE (with database):
 *   Uncomment the UserRepository lines and remove the switch block.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UserDetailsServiceImpl implements UserDetailsService {

    // Uncomment when UserRepository is wired and DB is configured:
    // private final UserRepository userRepository;

    /** BCrypt(12) hash of "Demo@1234" */
    private static final String DEMO_HASH =
        "$2a$12$LcV8n4jQFZ8P9kX7mN2d2.8TJxGJ9vRWnHfNGdKdGe5yNMGpkixcO";

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        // ── PRODUCTION ── uncomment this block, remove the switch below ──────
        // return userRepository.findByEmail(email)
        //     .map(u -> User.builder()
        //         .username(u.getEmail())
        //         .password(u.getPassword())
        //         .authorities(List.of(
        //             new SimpleGrantedAuthority("ROLE_" + u.getRole().name())))
        //         .accountLocked(u.isLocked())
        //         .disabled(!u.isActive())
        //         .build())
        //     .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        // ── DEMO MODE ─────────────────────────────────────────────────────────
        log.debug("Loading user: {}", email);

        return switch (email) {
            case "customer@demo.com"  -> build(email, "CUSTOMER");
            case "vendor@demo.com"    -> build(email, "VENDOR");
            case "admin@demo.com",
                 "admin@buildmart.ai" -> build(email, "ADMIN");
            default -> throw new UsernameNotFoundException("User not found: " + email);
        };
    }

    private UserDetails build(String email, String role) {
        return User.builder()
            .username(email)
            .password(DEMO_HASH)
            .authorities(List.of(new SimpleGrantedAuthority("ROLE_" + role)))
            .accountLocked(false)
            .disabled(false)
            .build();
    }
}
