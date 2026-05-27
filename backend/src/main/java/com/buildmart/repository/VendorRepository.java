package com.buildmart.repository;

import com.buildmart.entity.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, Long> {

    Optional<Vendor> findByUserId(Long userId);

    boolean existsByGstNumber(String gstNumber);

    List<Vendor> findByVerificationStatus(Vendor.VerificationStatus status);

    List<Vendor> findByVerificationStatusAndActiveTrue(Vendor.VerificationStatus status);

    @Query(value = """
        SELECT v.* FROM vendors v
        WHERE v.verification_status = 'VERIFIED' AND v.active = 1
          AND (6371 * acos(
                cos(radians(:lat)) * cos(radians(v.latitude)) *
                cos(radians(v.longitude) - radians(:lng)) +
                sin(radians(:lat)) * sin(radians(v.latitude))
              )) <= :radiusKm
        ORDER BY v.rating DESC
        """, nativeQuery = true)
    List<Vendor> findNearbyVendors(@Param("lat") Double lat,
                                   @Param("lng") Double lng,
                                   @Param("radiusKm") Integer radiusKm);
}
