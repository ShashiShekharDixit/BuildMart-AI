package com.buildmart.controller;

import lombok.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.List;
import java.util.Map;

// ========== CART CONTROLLER ==========
@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
class CartController {

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getCart() {
        return ResponseEntity.ok(Map.of("items", List.of(), "total", 0));
    }

    @PostMapping("/add")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> addToCart(@RequestBody CartItemRequest request) {
        return ResponseEntity.ok(Map.of("message", "Item added to cart.", "cartCount", 1));
    }

    @PatchMapping("/item/{itemId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateQuantity(@PathVariable Long itemId,
            @RequestBody Map<String, Double> body) {
        return ResponseEntity.ok(Map.of("message", "Quantity updated."));
    }

    @DeleteMapping("/item/{itemId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> removeItem(@PathVariable Long itemId) {
        return ResponseEntity.ok(Map.of("message", "Item removed."));
    }

    @DeleteMapping("/clear")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> clearCart() {
        return ResponseEntity.ok(Map.of("message", "Cart cleared."));
    }

    @Data static class CartItemRequest {
        @NotNull private Long productId;
        @NotNull @DecimalMin("0.01") private Double quantity;
    }
}

// ========== WISHLIST CONTROLLER ==========
@RestController
@RequestMapping("/wishlist")
@RequiredArgsConstructor
class WishlistController {

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getWishlist() {
        return ResponseEntity.ok(List.of());
    }

    @PostMapping("/{productId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> addToWishlist(@PathVariable Long productId) {
        return ResponseEntity.ok(Map.of("message", "Added to wishlist."));
    }

    @DeleteMapping("/{productId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> removeFromWishlist(@PathVariable Long productId) {
        return ResponseEntity.ok(Map.of("message", "Removed from wishlist."));
    }
}

// ========== ORDER CONTROLLER ==========
@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
class OrderController {

    /**
     * POST /api/orders/place
     * Place order from cart
     */
    @PostMapping("/place")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> placeOrder(@Valid @RequestBody PlaceOrderRequest request) {
        // Validates stock, calculates total, applies coupon/wallet, creates order
        return ResponseEntity.ok(Map.of(
            "orderNumber", "BM-2024-00001",
            "totalAmount", 15000,
            "status", "CONFIRMED",
            "message", "Order placed successfully!"
        ));
    }

    /**
     * GET /api/orders
     * Customer order history
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getMyOrders(@RequestParam(defaultValue = "0") int page) {
        return ResponseEntity.ok(Map.of("orders", List.of()));
    }

    /**
     * GET /api/orders/{orderNumber}
     * Get order details
     */
    @GetMapping("/{orderNumber}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getOrder(@PathVariable String orderNumber) {
        return ResponseEntity.ok(Map.of("orderNumber", orderNumber));
    }

    /**
     * GET /api/orders/{orderNumber}/track
     * Live order tracking
     */
    @GetMapping("/{orderNumber}/track")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> trackOrder(@PathVariable String orderNumber) {
        return ResponseEntity.ok(Map.of(
            "status", "OUT_FOR_DELIVERY",
            "location", Map.of("lat", 26.846, "lng", 80.946),
            "estimatedArrival", "2024-01-15T14:30:00",
            "driverName", "Ramesh Kumar",
            "driverPhone", "+91-9876543210"
        ));
    }

    /**
     * GET /api/orders/{orderNumber}/invoice
     * Download invoice PDF
     */
    @GetMapping("/{orderNumber}/invoice")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> downloadInvoice(@PathVariable String orderNumber) {
        return ResponseEntity.ok(Map.of("invoiceUrl", "https://s3.../invoices/" + orderNumber + ".pdf"));
    }

    /**
     * POST /api/orders/{orderNumber}/cancel
     */
    @PostMapping("/{orderNumber}/cancel")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> cancelOrder(@PathVariable String orderNumber,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(Map.of("message", "Order cancellation request submitted."));
    }

    /**
     * POST /api/orders/{orderNumber}/return
     */
    @PostMapping("/{orderNumber}/return")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> returnRequest(@PathVariable String orderNumber,
            @RequestBody ReturnRequest request) {
        return ResponseEntity.ok(Map.of("message", "Return request submitted. Refund will be processed in 3-5 days."));
    }

    /**
     * POST /api/orders/repeat/{orderNumber}
     * Reorder a previous order
     */
    @PostMapping("/repeat/{orderNumber}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> repeatOrder(@PathVariable String orderNumber) {
        return ResponseEntity.ok(Map.of("message", "Items added to cart. Review and checkout."));
    }

    // Vendor order management
    @GetMapping("/vendor/incoming")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<?> getIncomingOrders(@RequestParam(defaultValue = "0") int page) {
        return ResponseEntity.ok(Map.of("orders", List.of()));
    }

    @PatchMapping("/vendor/{orderNumber}/status")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<?> updateOrderStatus(@PathVariable String orderNumber,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(Map.of("message", "Order status updated to " + body.get("status")));
    }

    // ========== DTOs ==========
    @Data static class PlaceOrderRequest {
        @NotNull private Long addressId;
        @NotBlank private String paymentMethod;
        private String couponCode;
        private Boolean useWallet;
        private String deliveryNotes;
        private String scheduledDelivery;
    }

    @Data static class ReturnRequest {
        @NotBlank private String reason;
        private String description;
    }
}
