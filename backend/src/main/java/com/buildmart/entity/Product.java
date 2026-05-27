package com.buildmart.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", nullable = false)
    private Vendor vendor;

    @Column(nullable = false)
    private String name;

    @Column(length = 2000)
    private String description;
    private String brand;
    private String sku;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MaterialCategory category;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal basePrice;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal currentPrice;

    @Column(nullable = false)
    private String unit;

    @Column(nullable = false)
    private Double stockQuantity;

    private Double minOrderQuantity;
    private Double maxOrderQuantity;

    @Builder.Default
    private Boolean inStock = true;
    @Builder.Default
    private Boolean active = true;
    @Builder.Default
    private Boolean featured = false;

    @ElementCollection
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url")
    private List<String> imageUrls;

    @Column(length = 2000)
    private String specifications;
    private String qualityGrade;

    @Builder.Default
    private Double rating = 0.0;
    @Builder.Default
    private Integer totalRatings = 0;
    @Builder.Default
    private Integer totalOrders = 0;

    private BigDecimal seasonalPrice;
    private LocalDateTime seasonalPriceStart;
    private LocalDateTime seasonalPriceEnd;

    private Double bulkMinQuantity;
    private BigDecimal bulkPrice;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum MaterialCategory {
        CEMENT, BRICKS, SAND, AGGREGATE, IRON_RODS,
        MARBLE, TILES, PIPES, HARDWARE, PAINT,
        WOOD, GLASS, ELECTRICAL, PLUMBING, OTHER
    }
}
