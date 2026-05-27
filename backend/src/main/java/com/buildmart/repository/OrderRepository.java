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
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderNumber(String orderNumber);
    Page<Order> findByCustomerIdOrderByCreatedAtDesc(Long customerId, Pageable pageable);
    @Query("SELECT o FROM Order o JOIN o.items i WHERE i.vendor.id = :vendorId ORDER BY o.createdAt DESC")
    Page<Order> findByVendorId(@Param("vendorId") Long vendorId, Pageable pageable);
    @Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt >= :since")
    long countOrdersSince(@Param("since") LocalDateTime since);
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.paymentStatus = 'PAID' AND o.createdAt >= :since")
    BigDecimal sumRevenueSince(@Param("since") LocalDateTime since);
}
