package com.buildmart.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "vendors")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vendor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String businessName;

    private String gstNumber;
    private String panNumber;
    private String tradeLicenseNumber;

    private String businessAddress;
    private String city;
    private String state;
    private String pincode;

    private Double latitude;
    private Double longitude;
    private Integer deliveryRadiusKm;

    private String warehouseDetails;
    private String businessDescription;
    private String logoUrl;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private VerificationStatus verificationStatus = VerificationStatus.PENDING;

    @Builder.Default
    private Double rating = 0.0;
    @Builder.Default
    private Integer totalRatings = 0;
    @Builder.Default
    private Boolean featured = false;
    @Builder.Default
    private Boolean active = true;

    @ElementCollection
    @CollectionTable(name = "vendor_documents", joinColumns = @JoinColumn(name = "vendor_id"))
    @Column(name = "document_url")
    private List<String> documentUrls;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum VerificationStatus {
        PENDING, VERIFIED, REJECTED, SUSPENDED
    }
}
