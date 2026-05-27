package com.buildmart.repository;

import com.buildmart.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByPhone(String phone);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    @Query("SELECT u FROM User u WHERE u.role = :role AND u.active = true")
    Page<User> findActiveByRole(@Param("role") String role, Pageable pageable);

    @Modifying
    @Query("UPDATE User u SET u.failedLoginAttempts = 0, u.locked = false WHERE u.id = :id")
    void resetLoginAttempts(@Param("id") Long id);

    @Query("SELECT COUNT(u) FROM User u WHERE u.createdAt >= :since")
    long countNewUsersSince(@Param("since") LocalDateTime since);
}
