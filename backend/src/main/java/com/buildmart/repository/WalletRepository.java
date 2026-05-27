package com.buildmart.repository;

import com.buildmart.entity.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface WalletRepository extends JpaRepository<Wallet, Long> {
    Optional<Wallet> findByUserId(Long userId);
    @Modifying
    @Query("UPDATE Wallet w SET w.balance = w.balance + :amount WHERE w.user.id = :userId")
    void credit(@Param("userId") Long userId, @Param("amount") BigDecimal amount);
    @Modifying
    @Query("UPDATE Wallet w SET w.balance = w.balance - :amount WHERE w.user.id = :userId AND w.balance >= :amount")
    int debit(@Param("userId") Long userId, @Param("amount") BigDecimal amount);
}
