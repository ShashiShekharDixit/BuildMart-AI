package com.buildmart.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "coupons")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    private String description;

    @Enumerated(EnumType.STRING)
    private DiscountType discountType;

    @Column(precision = 12, scale = 2)
    private BigDecimal discountValue;

    @Column(precision = 12, scale = 2)
    private BigDecimal maxDiscount;

    @Column(precision = 12, scale = 2)
    private BigDecimal minOrderAmount;

    private Integer usageLimit;

    @Builder.Default
    private Integer usedCount = 0;

    private LocalDateTime expiresAt;

    @Builder.Default
    private boolean active = true;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public enum DiscountType {
        PERCENTAGE, FIXED
    }
}
