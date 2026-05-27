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
public interface ReviewRepository extends JpaRepository<Review, Long> {
    Page<Review> findByProductIdAndSpamFalseOrderByCreatedAtDesc(Long productId, Pageable pageable);
    Page<Review> findByVendorIdAndSpamFalseOrderByCreatedAtDesc(Long vendorId, Pageable pageable);
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.id = :pid AND r.spam = false")
    Double avgRatingByProduct(@Param("pid") Long productId);
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.vendor.id = :vid AND r.spam = false")
    Double avgRatingByVendor(@Param("vid") Long vendorId);
}
