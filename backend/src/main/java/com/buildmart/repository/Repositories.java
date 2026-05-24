package com.buildmart.repository;

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

/**
 * All JPA Repositories for BuildMart entities.
 * Each interface extends JpaRepository providing full CRUD + pagination.
 */

// ── User Repository ──
@Repository
interface UserRepository extends JpaRepository<com.buildmart.entity.User, Long> {
    Optional<com.buildmart.entity.User> findByEmail(String email);
    Optional<com.buildmart.entity.User> findByPhone(String phone);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);

    @Query("SELECT u FROM User u WHERE u.role = :role AND u.active = true")
    Page<com.buildmart.entity.User> findByRole(@Param("role") String role, Pageable pageable);

    @Modifying
    @Query("UPDATE User u SET u.failedLoginAttempts = 0, u.locked = false WHERE u.id = :id")
    void resetLoginAttempts(@Param("id") Long id);

    @Query("SELECT COUNT(u) FROM User u WHERE u.createdAt >= :since")
    long countNewUsersSince(@Param("since") LocalDateTime since);
}

// ── Vendor Repository ──
@Repository
interface VendorRepository extends JpaRepository<com.buildmart.entity.Vendor, Long> {
    Optional<com.buildmart.entity.Vendor> findByUserId(Long userId);
    boolean existsByGstNumber(String gstNumber);
    List<com.buildmart.entity.Vendor> findByVerificationStatus(String status);

    @Query("SELECT v FROM Vendor v WHERE v.verificationStatus = 'VERIFIED' AND v.active = true AND v.city = :city")
    List<com.buildmart.entity.Vendor> findVerifiedByCity(@Param("city") String city);

    // Nearby vendors using Haversine formula
    @Query(value = """
        SELECT v.* FROM vendors v
        WHERE v.verification_status = 'VERIFIED'
          AND v.active = 1
          AND (6371 * acos(
                cos(radians(:lat)) * cos(radians(v.latitude)) *
                cos(radians(v.longitude) - radians(:lng)) +
                sin(radians(:lat)) * sin(radians(v.latitude))
              )) <= :radiusKm
        ORDER BY v.rating DESC
        """, nativeQuery = true)
    List<com.buildmart.entity.Vendor> findNearbyVendors(
        @Param("lat") Double lat, @Param("lng") Double lng, @Param("radiusKm") Integer radiusKm);
}

// ── Product Repository ──
@Repository
interface ProductRepository extends JpaRepository<com.buildmart.entity.Product, Long> {
    Page<com.buildmart.entity.Product> findByActiveTrue(Pageable pageable);
    Page<com.buildmart.entity.Product> findByCategoryAndActiveTrue(String category, Pageable pageable);
    List<com.buildmart.entity.Product> findByVendorIdAndActiveTrue(Long vendorId);
    List<com.buildmart.entity.Product> findByFeaturedTrueAndActiveTrue();

    @Query("SELECT p FROM Product p WHERE p.active = true AND p.inStock = true " +
           "AND (:category IS NULL OR p.category = :category) " +
           "AND (:minPrice IS NULL OR p.currentPrice >= :minPrice) " +
           "AND (:maxPrice IS NULL OR p.currentPrice <= :maxPrice) " +
           "AND (:q IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%',:q,'%')) " +
           "     OR LOWER(p.description) LIKE LOWER(CONCAT('%',:q,'%')))")
    Page<com.buildmart.entity.Product> searchProducts(
        @Param("q") String q,
        @Param("category") String category,
        @Param("minPrice") BigDecimal minPrice,
        @Param("maxPrice") BigDecimal maxPrice,
        Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.vendorId = :vendorId AND p.stockQuantity <= :threshold AND p.active = true")
    List<com.buildmart.entity.Product> findLowStockByVendor(@Param("vendorId") Long vendorId, @Param("threshold") Double threshold);

    @Modifying
    @Query("UPDATE Product p SET p.stockQuantity = :qty, p.inStock = (:qty > 0) WHERE p.id = :id")
    void updateStock(@Param("id") Long id, @Param("qty") Double qty);
}

// ── Order Repository ──
@Repository
interface OrderRepository extends JpaRepository<com.buildmart.entity.Order, Long> {
    Optional<com.buildmart.entity.Order> findByOrderNumber(String orderNumber);
    Page<com.buildmart.entity.Order> findByCustomerIdOrderByCreatedAtDesc(Long customerId, Pageable pageable);
    Page<com.buildmart.entity.Order> findByStatusOrderByCreatedAtDesc(String status, Pageable pageable);

    @Query("SELECT o FROM Order o JOIN o.items i WHERE i.vendorId = :vendorId ORDER BY o.createdAt DESC")
    Page<com.buildmart.entity.Order> findByVendorId(@Param("vendorId") Long vendorId, Pageable pageable);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt >= :since")
    long countOrdersSince(@Param("since") LocalDateTime since);

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.paymentStatus = 'PAID' AND o.createdAt >= :since")
    BigDecimal sumRevenueSince(@Param("since") LocalDateTime since);

    @Query("SELECT o.status, COUNT(o) FROM Order o GROUP BY o.status")
    List<Object[]> countByStatus();
}

// ── Cart Repository ──
@Repository
interface CartRepository extends JpaRepository<com.buildmart.entity.CartItem, Long> {
    List<com.buildmart.entity.CartItem> findByUserId(Long userId);
    Optional<com.buildmart.entity.CartItem> findByUserIdAndProductId(Long userId, Long productId);
    void deleteByUserId(Long userId);
    long countByUserId(Long userId);
}

// ── Wishlist Repository ──
@Repository
interface WishlistRepository extends JpaRepository<com.buildmart.entity.WishlistItem, Long> {
    List<com.buildmart.entity.WishlistItem> findByUserId(Long userId);
    Optional<com.buildmart.entity.WishlistItem> findByUserIdAndProductId(Long userId, Long productId);
    boolean existsByUserIdAndProductId(Long userId, Long productId);
    void deleteByUserIdAndProductId(Long userId, Long productId);
}

// ── Review Repository ──
@Repository
interface ReviewRepository extends JpaRepository<com.buildmart.entity.Review, Long> {
    Page<com.buildmart.entity.Review> findByProductIdAndSpamFalseOrderByCreatedAtDesc(Long productId, Pageable pageable);
    Page<com.buildmart.entity.Review> findByVendorIdAndSpamFalseOrderByCreatedAtDesc(Long vendorId, Pageable pageable);
    List<com.buildmart.entity.Review> findByCustomerIdOrderByCreatedAtDesc(Long customerId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.productId = :productId AND r.spam = false")
    Double avgRatingByProduct(@Param("productId") Long productId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.vendorId = :vendorId AND r.spam = false")
    Double avgRatingByVendor(@Param("vendorId") Long vendorId);
}

// ── Address Repository ──
@Repository
interface AddressRepository extends JpaRepository<com.buildmart.entity.Address, Long> {
    List<com.buildmart.entity.Address> findByUserId(Long userId);
    Optional<com.buildmart.entity.Address> findByUserIdAndIsDefaultTrue(Long userId);

    @Modifying
    @Query("UPDATE Address a SET a.isDefault = false WHERE a.userId = :userId")
    void clearDefaultByUser(@Param("userId") Long userId);
}

// ── Coupon Repository ──
@Repository
interface CouponRepository extends JpaRepository<com.buildmart.entity.Coupon, Long> {
    Optional<com.buildmart.entity.Coupon> findByCodeAndActiveTrue(String code);
    boolean existsByCode(String code);
}

// ── Wallet Repository ──
@Repository
interface WalletRepository extends JpaRepository<com.buildmart.entity.Wallet, Long> {
    Optional<com.buildmart.entity.Wallet> findByUserId(Long userId);

    @Modifying
    @Query("UPDATE Wallet w SET w.balance = w.balance + :amount WHERE w.userId = :userId")
    void credit(@Param("userId") Long userId, @Param("amount") BigDecimal amount);

    @Modifying
    @Query("UPDATE Wallet w SET w.balance = w.balance - :amount WHERE w.userId = :userId AND w.balance >= :amount")
    int debit(@Param("userId") Long userId, @Param("amount") BigDecimal amount);
}

// ── Notification Repository ──
@Repository
interface NotificationRepository extends JpaRepository<com.buildmart.entity.Notification, Long> {
    List<com.buildmart.entity.Notification> findByUserIdOrderByCreatedAtDesc(Long userId);
    long countByUserIdAndReadFalse(Long userId);

    @Modifying
    @Query("UPDATE Notification n SET n.read = true WHERE n.userId = :userId")
    void markAllReadByUser(@Param("userId") Long userId);
}

// ── Audit Log Repository ──
@Repository
interface AuditLogRepository extends JpaRepository<com.buildmart.entity.AuditLog, Long> {
    Page<com.buildmart.entity.AuditLog> findByUserIdOrderByTimestampDesc(Long userId, Pageable pageable);
    Page<com.buildmart.entity.AuditLog> findAllByOrderByTimestampDesc(Pageable pageable);
}

// ── Support Ticket Repository ──
@Repository
interface SupportTicketRepository extends JpaRepository<com.buildmart.entity.SupportTicket, Long> {
    Optional<com.buildmart.entity.SupportTicket> findByTicketNumber(String ticketNumber);
    Page<com.buildmart.entity.SupportTicket> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    Page<com.buildmart.entity.SupportTicket> findByStatusOrderByCreatedAtDesc(String status, Pageable pageable);
    long countByStatus(String status);
}
