package com.buildmart.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    @JsonIgnore
    private String password;

    private String firstName;
    private String lastName;
    private String phone;
    private String profileImage;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false)
    private boolean emailVerified = false;

    private boolean phoneVerified = false;
    private boolean active = true;
    private boolean locked = false;

    private String city;
    private String state;
    private String pincode;

    private int failedLoginAttempts = 0;
    private LocalDateTime lockedUntil;
    private LocalDateTime lastLogin;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum Role {
        CUSTOMER, VENDOR, ADMIN
    }
}
