package com.buildmart.controller;

import com.buildmart.service.OrderService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    /** POST /api/orders/place */
    @PostMapping("/place")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> placeOrder(@RequestBody OrderService.PlaceOrderRequest req) {
        // In production get customerId from SecurityContextHolder
        return ResponseEntity.ok(orderService.placeOrder(1L, req));
    }

    /** GET /api/orders */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getMyOrders(
            @RequestParam(defaultValue = "0") int page) {
        return ResponseEntity.ok(Map.of("orders", List.of(), "page", page));
    }

    /** GET /api/orders/{orderNumber} */
    @GetMapping("/{orderNumber}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getOrder(@PathVariable String orderNumber) {
        return ResponseEntity.ok(Map.of("orderNumber", orderNumber));
    }

    /** GET /api/orders/{orderNumber}/track */
    @GetMapping("/{orderNumber}/track")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> trackOrder(@PathVariable String orderNumber) {
        return ResponseEntity.ok(orderService.trackOrder(orderNumber));
    }

    /** GET /api/orders/{orderNumber}/invoice */
    @GetMapping("/{orderNumber}/invoice")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getInvoice(@PathVariable String orderNumber) {
        return ResponseEntity.ok(
            Map.of("invoiceUrl", orderService.generateInvoiceUrl(orderNumber)));
    }

    /** POST /api/orders/{orderNumber}/cancel */
    @PostMapping("/{orderNumber}/cancel")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> cancelOrder(
            @PathVariable String orderNumber,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(
            Map.of("message", "Order cancellation request submitted.",
                   "orderNumber", orderNumber));
    }

    /** POST /api/orders/{orderNumber}/return */
    @PostMapping("/{orderNumber}/return")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> returnRequest(
            @PathVariable String orderNumber,
            @RequestBody ReturnRequest req) {
        return ResponseEntity.ok(
            Map.of("message", "Return request submitted. Refund in 3-5 business days."));
    }

    /** POST /api/orders/repeat/{orderNumber} */
    @PostMapping("/repeat/{orderNumber}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> repeatOrder(@PathVariable String orderNumber) {
        return ResponseEntity.ok(
            Map.of("message", "Items added to cart. Review and checkout."));
    }

    // ── Vendor order management ───────────────────────────────────────────────

    @GetMapping("/vendor/incoming")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<?> getIncoming(
            @RequestParam(defaultValue = "0") int page) {
        return ResponseEntity.ok(Map.of("orders", List.of(), "page", page));
    }

    @PatchMapping("/vendor/{orderNumber}/status")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<?> updateStatus(
            @PathVariable String orderNumber,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(
            Map.of("message", "Order status updated to " + body.get("status")));
    }

    // ── Cart ─────────────────────────────────────────────────────────────────

    @GetMapping("/cart")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getCart() {
        return ResponseEntity.ok(Map.of("items", List.of(), "total", 0));
    }

    @PostMapping("/cart/add")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> addToCart(@RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(Map.of("message", "Item added to cart.", "cartCount", 1));
    }

    @PatchMapping("/cart/item/{itemId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateCartQty(
            @PathVariable Long itemId,
            @RequestBody Map<String, Double> body) {
        return ResponseEntity.ok(Map.of("message", "Quantity updated."));
    }

    @DeleteMapping("/cart/item/{itemId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> removeCartItem(@PathVariable Long itemId) {
        return ResponseEntity.ok(Map.of("message", "Item removed."));
    }

    @DeleteMapping("/cart/clear")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> clearCart() {
        return ResponseEntity.ok(Map.of("message", "Cart cleared."));
    }

    // ── Wishlist ─────────────────────────────────────────────────────────────

    @GetMapping("/wishlist")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getWishlist() {
        return ResponseEntity.ok(List.of());
    }

    @PostMapping("/wishlist/{productId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> addWishlist(@PathVariable Long productId) {
        return ResponseEntity.ok(Map.of("message", "Added to wishlist."));
    }

    @DeleteMapping("/wishlist/{productId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> removeWishlist(@PathVariable Long productId) {
        return ResponseEntity.ok(Map.of("message", "Removed from wishlist."));
    }

    // ── DTO ───────────────────────────────────────────────────────────────────

    @Data
    public static class ReturnRequest {
        private String reason;
        private String description;
    }
}
