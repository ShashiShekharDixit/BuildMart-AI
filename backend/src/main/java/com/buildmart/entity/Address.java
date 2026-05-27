package com.buildmart.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "addresses")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Address {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne @JoinColumn(name = "user_id", nullable = false) private User user;
    private String label;
    private String fullAddress;
    private String city;
    private String state;
    private String pincode;
    private Double latitude;
    private Double longitude;
    private boolean isDefault;
}
