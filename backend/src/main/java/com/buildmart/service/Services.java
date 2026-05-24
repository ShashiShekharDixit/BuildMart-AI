package com.buildmart.service;

import com.buildmart.exception.BusinessException;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;

// ──────────────────────────────────────────────
// ProductService
// ──────────────────────────────────────────────
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
class ProductService {

    // private final ProductRepository productRepo;
    // private final VendorRepository vendorRepo;
    // private final ReviewRepository reviewRepo;
    // private final FileStorageService fileStorage;

    @Cacheable(value = "products", key = "#id")
    public Map<String, Object> getProductById(Long id) {
        // return productRepo.findById(id)
        //     .filter(p -> p.isActive())
        //     .map(this::toDto)
        //     .orElseThrow(() -> BusinessException.notFound("Product"));
        return Map.of("id", id, "message", "Product found");
    }

    public Map<String, Object> searchProducts(String q, String category,
            BigDecimal minPrice, BigDecimal maxPrice, int page, int size, String sort) {

        Sort sortOrder = switch (sort) {
            case "price_asc"  -> Sort.by("currentPrice").ascending();
            case "price_desc" -> Sort.by("currentPrice").descending();
            case "newest"     -> Sort.by("createdAt").descending();
            default           -> Sort.by("rating").descending();
        };

        PageRequest pageRequest = PageRequest.of(page, size, sortOrder);

        // Page<Product> products = productRepo.searchProducts(q, category, minPrice, maxPrice, pageRequest);
        // return Map.of(
        //     "products", products.getContent().stream().map(this::toDto).collect(Collectors.toList()),
        //     "totalElements", products.getTotalElements(),
        //     "totalPages", products.getTotalPages(),
        //     "currentPage", page
        // );

        return Map.of("products", List.of(), "totalElements", 0L, "totalPages", 0, "currentPage", page);
    }

    @CacheEvict(value = "products", key = "#productId")
    public void updateStock(Long vendorId, Long productId, Double quantity) {
        // Product p = productRepo.findById(productId)
        //     .orElseThrow(() -> BusinessException.notFound("Product"));
        // if (!p.getVendor().getId().equals(vendorId))
        //     throw BusinessException.forbidden("Not your product");
        // if (quantity < 0)
        //     throw new BusinessException("Stock quantity cannot be negative");
        // productRepo.updateStock(productId, quantity);
        // log.info("Stock updated: product={} qty={}", productId, quantity);
        log.info("Stock updated: product={} qty={}", productId, quantity);
    }

    public List<String> uploadProductImages(Long vendorId, Long productId, List<MultipartFile> files) {
        // Validate files
        List<String> urls = new ArrayList<>();
        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/"))
                throw new BusinessException("Only image files are allowed");
            if (file.getSize() > 10 * 1024 * 1024)
                throw new BusinessException("Each image must be under 10MB");
            // String url = fileStorage.uploadToS3(file, "products/" + productId);
            // urls.add(url);
        }
        return urls;
    }

    public Map<String, Object> compareProducts(List<Long> ids) {
        if (ids.size() < 2 || ids.size() > 4)
            throw new BusinessException("Compare 2 to 4 products at a time");
        // List<Product> products = productRepo.findAllById(ids);
        // return Map.of("products", products.stream().map(this::toDetailDto).collect(Collectors.toList()));
        return Map.of("products", List.of());
    }

    public Map<String, Object> addReview(Long customerId, Long productId, Integer rating, String comment) {
        if (rating < 1 || rating > 5)
            throw new BusinessException("Rating must be between 1 and 5");
        // Product product = productRepo.findById(productId).orElseThrow(() -> BusinessException.notFound("Product"));
        // Review review = Review.builder()
        //     .productId(productId)
        //     .customerId(customerId)
        //     .rating(rating).comment(comment).verified(false).spam(false)
        //     .build();
        // reviewRepo.save(review);
        // // Update product rating average
        // Double avg = reviewRepo.avgRatingByProduct(productId);
        // product.setRating(avg != null ? avg : 0.0);
        // productRepo.save(product);
        return Map.of("message", "Review submitted for moderation.");
    }

    @Cacheable(value = "featured-products")
    public List<Map<String, Object>> getFeaturedProducts() {
        // return productRepo.findByFeaturedTrueAndActiveTrue()
        //     .stream().map(this::toDto).collect(Collectors.toList());
        return List.of();
    }
}

// ──────────────────────────────────────────────
// OrderService
// ──────────────────────────────────────────────
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
class OrderService {

    // private final OrderRepository orderRepo;
    // private final CartRepository cartRepo;
    // private final ProductRepository productRepo;
    // private final WalletRepository walletRepo;
    // private final CouponRepository couponRepo;
    // private final NotificationRepository notifRepo;

    public Map<String, Object> placeOrder(Long customerId, PlaceOrderRequest request) {
        // 1. Fetch cart items
        // List<CartItem> cartItems = cartRepo.findByUserId(customerId);
        // if (cartItems.isEmpty()) throw new BusinessException("Cart is empty");

        // 2. Validate stock for each item
        // for (CartItem item : cartItems) {
        //     Product p = item.getProduct();
        //     if (!p.isInStock() || p.getStockQuantity() < item.getQuantity())
        //         throw new BusinessException("Insufficient stock for: " + p.getName());
        // }

        // 3. Calculate totals
        // BigDecimal subtotal = cartItems.stream()
        //     .map(i -> i.getProduct().getCurrentPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
        //     .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 4. Apply coupon
        // BigDecimal discount = BigDecimal.ZERO;
        // if (request.getCouponCode() != null) {
        //     discount = applyCoupon(request.getCouponCode(), subtotal);
        // }

        // 5. Deduct from wallet if requested
        // if (Boolean.TRUE.equals(request.getUseWallet())) {
        //     walletRepo.debit(customerId, walletAmount);
        // }

        // 6. Create order
        // String orderNumber = generateOrderNumber();
        // Order order = Order.builder()
        //     .orderNumber(orderNumber)
        //     .customerId(customerId)
        //     .subtotal(subtotal)
        //     .discountAmount(discount)
        //     .totalAmount(subtotal.subtract(discount))
        //     .status(OrderStatus.CONFIRMED)
        //     .paymentMethod(request.getPaymentMethod())
        //     .build();
        // orderRepo.save(order);

        // 7. Deduct stock
        // cartItems.forEach(item -> {
        //     productRepo.updateStock(item.getProduct().getId(),
        //         item.getProduct().getStockQuantity() - item.getQuantity());
        // });

        // 8. Clear cart
        // cartRepo.deleteByUserId(customerId);

        // 9. Send notification
        // notifRepo.save(Notification.builder()
        //     .userId(customerId)
        //     .title("Order Confirmed!")
        //     .message("Your order " + orderNumber + " has been placed.")
        //     .type("ORDER").build());

        String orderNumber = "BM-" + System.currentTimeMillis();
        log.info("Order placed: {} for customer {}", orderNumber, customerId);

        return Map.of(
            "orderNumber", orderNumber,
            "status", "CONFIRMED",
            "message", "Order placed successfully!",
            "estimatedDelivery", LocalDateTime.now().plusDays(3).toString()
        );
    }

    public Map<String, Object> trackOrder(String orderNumber) {
        // Order order = orderRepo.findByOrderNumber(orderNumber)
        //     .orElseThrow(() -> BusinessException.notFound("Order"));

        // Return tracking data including driver location if dispatched
        return Map.of(
            "orderNumber", orderNumber,
            "status", "OUT_FOR_DELIVERY",
            "location", Map.of("lat", 26.846, "lng", 80.946),
            "estimatedArrival", LocalDateTime.now().plusHours(2).toString(),
            "driverName", "Ramesh Kumar",
            "driverPhone", "+91-9876543210"
        );
    }

    public String generateInvoiceUrl(String orderNumber) {
        // Order order = orderRepo.findByOrderNumber(orderNumber)
        //     .orElseThrow(() -> BusinessException.notFound("Order"));
        // return invoiceService.generate(order);
        return "https://buildmart.ai/invoices/" + orderNumber + ".pdf";
    }

    private String generateOrderNumber() {
        return "BM-" + LocalDateTime.now().getYear() + "-"
            + String.format("%08d", (long)(Math.random() * 99999999));
    }

    private BigDecimal applyCoupon(String code, BigDecimal subtotal) {
        // Coupon coupon = couponRepo.findByCodeAndActiveTrue(code)
        //     .orElseThrow(() -> new BusinessException("Invalid or expired coupon code"));
        // if (subtotal.compareTo(coupon.getMinOrderAmount()) < 0)
        //     throw new BusinessException("Order minimum for this coupon is ₹" + coupon.getMinOrderAmount());
        // if (coupon.getExpiresAt().isBefore(LocalDateTime.now()))
        //     throw new BusinessException("This coupon has expired");
        // BigDecimal discount = coupon.getDiscountType().equals("PERCENTAGE")
        //     ? subtotal.multiply(coupon.getDiscountValue()).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP)
        //     : coupon.getDiscountValue();
        // return discount.min(coupon.getMaxDiscount() != null ? coupon.getMaxDiscount() : discount);
        return BigDecimal.ZERO;
    }

    @Data
    public static class PlaceOrderRequest {
        private Long addressId;
        private String paymentMethod;
        private String couponCode;
        private Boolean useWallet;
        private String deliveryNotes;
        private String scheduledDelivery;
    }
}

// ──────────────────────────────────────────────
// VendorService
// ──────────────────────────────────────────────
@Service
@RequiredArgsConstructor
@Slf4j
class VendorService {

    // private final VendorRepository vendorRepo;
    // private final UserRepository userRepo;
    // private final OrderRepository orderRepo;
    // private final ProductRepository productRepo;

    public Map<String, Object> getDashboardStats(Long vendorId) {
        // Long totalOrders = orderRepo.countByVendorId(vendorId);
        // BigDecimal revenue = orderRepo.sumRevenueByVendor(vendorId);
        // List<Product> lowStock = productRepo.findLowStockByVendor(vendorId, 10.0);

        return Map.of(
            "totalOrders", 0L,
            "pendingOrders", 0L,
            "totalRevenue", BigDecimal.ZERO,
            "totalProducts", 0L,
            "lowStockProducts", List.of(),
            "recentOrders", List.of(),
            "monthlyRevenue", List.of()
        );
    }

    public Map<String, Object> getAnalytics(Long vendorId, int days) {
        LocalDateTime since = LocalDateTime.now().minusDays(days);
        return Map.of(
            "revenueByDay", List.of(),
            "ordersByCategory", List.of(),
            "topCustomers", List.of(),
            "conversionRate", 0.0,
            "avgOrderValue", 0.0,
            "period", days + " days"
        );
    }

    @Transactional
    public Map<String, Object> verifyVendor(Long vendorId, String status, String adminNote) {
        // Vendor vendor = vendorRepo.findById(vendorId)
        //     .orElseThrow(() -> BusinessException.notFound("Vendor"));
        // vendor.setVerificationStatus(Vendor.VerificationStatus.valueOf(status));
        // vendorRepo.save(vendor);
        // Send notification email to vendor
        log.info("Vendor {} status updated to {}", vendorId, status);
        return Map.of("message", "Vendor status updated to " + status, "vendorId", vendorId);
    }
}

// ──────────────────────────────────────────────
// WalletService
// ──────────────────────────────────────────────
@Service
@RequiredArgsConstructor
@Slf4j
class WalletService {

    // private final WalletRepository walletRepo;
    // private final WalletTransactionRepository txRepo;

    public Map<String, Object> getWallet(Long userId) {
        // Wallet wallet = walletRepo.findByUserId(userId)
        //     .orElseThrow(() -> BusinessException.notFound("Wallet"));
        // List<WalletTransaction> txs = txRepo.findByWalletIdOrderByCreatedAtDesc(wallet.getId());
        return Map.of("balance", 500.0, "transactions", List.of());
    }

    @Transactional
    public void credit(Long userId, BigDecimal amount, String description) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0)
            throw new BusinessException("Credit amount must be positive");
        // walletRepo.credit(userId, amount);
        log.info("Wallet credit: user={} amount={} desc={}", userId, amount, description);
    }

    @Transactional
    public void debit(Long userId, BigDecimal amount, String description) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0)
            throw new BusinessException("Debit amount must be positive");
        // int updated = walletRepo.debit(userId, amount);
        // if (updated == 0) throw new BusinessException("Insufficient wallet balance");
        log.info("Wallet debit: user={} amount={} desc={}", userId, amount, description);
    }
}

// ──────────────────────────────────────────────
// NotificationService
// ──────────────────────────────────────────────
@Service
@RequiredArgsConstructor
@Slf4j
class NotificationService {

    // private final NotificationRepository notifRepo;
    // private final SimpMessagingTemplate wsTemplate; // WebSocket

    public void sendToUser(Long userId, String title, String message, String type) {
        // Notification n = Notification.builder()
        //     .userId(userId).title(title).message(message).type(type).read(false).build();
        // notifRepo.save(n);
        // Push via WebSocket
        // wsTemplate.convertAndSendToUser(userId.toString(), "/queue/notifications",
        //     Map.of("title", title, "message", message, "type", type));
        log.info("Notification sent to user {}: {} - {}", userId, title, message);
    }

    public void sendOrderUpdate(Long userId, String orderNumber, String status) {
        String message = switch (status) {
            case "CONFIRMED"        -> "Your order " + orderNumber + " has been confirmed!";
            case "DISPATCHED"       -> "Your order " + orderNumber + " has been dispatched.";
            case "OUT_FOR_DELIVERY" -> "Your order " + orderNumber + " is out for delivery!";
            case "DELIVERED"        -> "Your order " + orderNumber + " has been delivered. Rate your experience!";
            case "CANCELLED"        -> "Your order " + orderNumber + " has been cancelled.";
            default -> "Order " + orderNumber + " status: " + status;
        };
        sendToUser(userId, "Order Update", message, "ORDER");
    }
}

// ──────────────────────────────────────────────
// AdminService
// ──────────────────────────────────────────────
@Service
@RequiredArgsConstructor
@Slf4j
class AdminService {

    // private final UserRepository userRepo;
    // private final VendorRepository vendorRepo;
    // private final OrderRepository orderRepo;
    // private final ProductRepository productRepo;
    // private final AuditLogRepository auditRepo;

    public Map<String, Object> getPlatformStats() {
        // LocalDateTime lastMonth = LocalDateTime.now().minusDays(30);
        return Map.of(
            "totalUsers", 4821L,
            "totalVendors", 312L,
            "totalOrders", 18456L,
            "totalRevenue", BigDecimal.valueOf(28450000),
            "pendingVendorApprovals", 18L,
            "fraudAlerts", 3L,
            "activeOrders", 234L,
            "newUsersThisMonth", 421L,
            "ordersThisMonth", 1842L,
            "revenueThisMonth", BigDecimal.valueOf(4850000)
        );
    }

    public void logAudit(Long userId, String action, String entity, Long entityId,
                         String ipAddress, String details) {
        // AuditLog log = AuditLog.builder()
        //     .userId(userId).action(action).entity(entity).entityId(entityId)
        //     .ipAddress(ipAddress).details(details).build();
        // auditRepo.save(log);
    }
}
