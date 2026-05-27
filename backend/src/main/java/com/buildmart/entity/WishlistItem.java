package com.buildmart.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "wishlist")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class WishlistItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne @JoinColumn(name = "user_id", nullable = false) private User user;
    @ManyToOne @JoinColumn(name = "product_id", nullable = false) private Product product;
    @CreationTimestamp private LocalDateTime addedAt;
}
