package com.buildmart.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "vendor_id", nullable = false)
    private Vendor vendor;

    private Double quantity;
    private String unit;

    @Column(precision = 12, scale = 2)
    private BigDecimal unitPrice;

    @Column(precision = 12, scale = 2)
    private BigDecimal totalPrice;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Order.OrderStatus itemStatus = Order.OrderStatus.PENDING;
}
