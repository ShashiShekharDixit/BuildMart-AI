package com.buildmart.repository;

import com.buildmart.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findByActiveTrue(Pageable pageable);

    Page<Product> findByCategoryAndActiveTrue(Product.MaterialCategory category, Pageable pageable);

    List<Product> findByVendorIdAndActiveTrue(Long vendorId);

    List<Product> findByFeaturedTrueAndActiveTrue();

    @Query("""
        SELECT p FROM Product p WHERE p.active = true AND p.inStock = true
        AND (:category IS NULL OR p.category = :category)
        AND (:minPrice IS NULL OR p.currentPrice >= :minPrice)
        AND (:maxPrice IS NULL OR p.currentPrice <= :maxPrice)
        AND (:q IS NULL
             OR LOWER(p.name) LIKE LOWER(CONCAT('%', :q, '%'))
             OR LOWER(p.description) LIKE LOWER(CONCAT('%', :q, '%')))
        """)
    Page<Product> searchProducts(@Param("q") String q,
                                 @Param("category") Product.MaterialCategory category,
                                 @Param("minPrice") BigDecimal minPrice,
                                 @Param("maxPrice") BigDecimal maxPrice,
                                 Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.vendor.id = :vendorId AND p.stockQuantity <= :threshold AND p.active = true")
    List<Product> findLowStockByVendor(@Param("vendorId") Long vendorId,
                                       @Param("threshold") Double threshold);

    @Modifying
    @Query("UPDATE Product p SET p.stockQuantity = :qty, p.inStock = (:qty > 0) WHERE p.id = :id")
    void updateStock(@Param("id") Long id, @Param("qty") Double qty);
}
