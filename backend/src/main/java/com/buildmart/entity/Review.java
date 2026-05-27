package com.buildmart.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "reviews")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Review {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne @JoinColumn(name = "product_id") private Product product;
    @ManyToOne @JoinColumn(name = "vendor_id")  private Vendor vendor;
    @ManyToOne @JoinColumn(name = "customer_id", nullable = false) private User customer;
    @Column(nullable = false) private Integer rating;
    private String comment;
    private boolean verified = false;
    private boolean spam     = false;
    @ElementCollection
    @CollectionTable(name = "review_images", joinColumns = @JoinColumn(name = "review_id"))
    @Column(name = "image_url")
    private List<String> imageUrls;
    @CreationTimestamp private LocalDateTime createdAt;
}
