package com.buildmart.controller;

import lombok.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

// ========== VENDOR PORTAL CONTROLLER ==========
@RestController
@RequestMapping("/vendor")
@RequiredArgsConstructor
class VendorController {

    /** GET /api/vendor/profile */
    @GetMapping("/profile")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<?> getProfile() {
        return ResponseEntity.ok(Map.of("businessName", "Your Business", "verificationStatus", "PENDING"));
    }

    /** PUT /api/vendor/profile */
    @PutMapping("/profile")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<?> updateProfile(@Valid @RequestBody VendorProfileRequest req) {
        return ResponseEntity.ok(Map.of("message", "Profile updated."));
    }

    /** POST /api/vendor/documents - Upload GST, trade license */
    @PostMapping("/documents")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<?> uploadDocuments(@RequestParam("files") List<MultipartFile> files) {
        return ResponseEntity.ok(Map.of("uploaded", files.size(), "message", "Documents submitted for verification."));
    }

    /** GET /api/vendor/dashboard - Analytics overview */
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<?> getDashboard() {
        return ResponseEntity.ok(Map.of(
            "totalOrders", 0,
            "pendingOrders", 0,
            "totalRevenue", 0,
            "totalProducts", 0,
            "lowStockProducts", List.of(),
            "recentOrders", List.of(),
            "monthlyRevenue", List.of(),
            "topProducts", List.of()
        ));
    }

    /** GET /api/vendor/analytics - Detailed analytics */
    @GetMapping("/analytics")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<?> getAnalytics(
            @RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(Map.of(
            "revenueByDay", List.of(),
            "ordersByCategory", List.of(),
            "topCustomers", List.of(),
            "conversionRate", 0.0,
            "avgOrderValue", 0.0
        ));
    }

    /** GET /api/vendor/public/{id} - Public vendor profile */
    @GetMapping("/public/{id}")
    public ResponseEntity<?> getPublicVendorProfile(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of("id", id, "businessName", "Sample Vendor", "rating", 4.5));
    }

    /** GET /api/vendor/public/nearby - Vendors near location */
    @GetMapping("/public/nearby")
    public ResponseEntity<?> getNearbyVendors(
            @RequestParam double lat, @RequestParam double lng,
            @RequestParam(defaultValue = "25") int radiusKm) {
        return ResponseEntity.ok(List.of());
    }

    /** POST /api/vendor/bulk-offers - Create bulk pricing offer */
    @PostMapping("/bulk-offers")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<?> createBulkOffer(@RequestBody Map<String, Object> offer) {
        return ResponseEntity.ok(Map.of("message", "Bulk offer created."));
    }

    /** POST /api/vendor/flash-offers - Create flash sale */
    @PostMapping("/flash-offers")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<?> createFlashOffer(@RequestBody Map<String, Object> offer) {
        return ResponseEntity.ok(Map.of("message", "Flash offer created."));
    }

    @Data static class VendorProfileRequest {
        private String businessName;
        private String gstNumber;
        private String businessAddress;
        private String city;
        private String state;
        private String pincode;
        private Integer deliveryRadiusKm;
        private String warehouseDetails;
        private String businessDescription;
    }
}

// ========== USER PROFILE CONTROLLER ==========
@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
class UserController {

    @GetMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getProfile() {
        return ResponseEntity.ok(Map.of("firstName", "User", "email", "user@example.com"));
    }

    @PutMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> updates) {
        return ResponseEntity.ok(Map.of("message", "Profile updated."));
    }

    @PostMapping("/change-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(Map.of("message", "Password changed successfully."));
    }

    // Addresses
    @GetMapping("/addresses")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getAddresses() {
        return ResponseEntity.ok(List.of());
    }

    @PostMapping("/addresses")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> addAddress(@RequestBody Map<String, Object> address) {
        return ResponseEntity.ok(Map.of("message", "Address saved.", "id", 1));
    }

    @PutMapping("/addresses/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateAddress(@PathVariable Long id, @RequestBody Map<String, Object> address) {
        return ResponseEntity.ok(Map.of("message", "Address updated."));
    }

    @DeleteMapping("/addresses/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deleteAddress(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of("message", "Address removed."));
    }

    // Wallet
    @GetMapping("/wallet")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getWallet() {
        return ResponseEntity.ok(Map.of("balance", 0.0, "transactions", List.of()));
    }

    // Notifications
    @GetMapping("/notifications")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getNotifications() {
        return ResponseEntity.ok(List.of());
    }

    @PatchMapping("/notifications/{id}/read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> markRead(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of("message", "Marked as read."));
    }

    // Support tickets
    @PostMapping("/support")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> createTicket(@RequestBody Map<String, String> ticket) {
        return ResponseEntity.ok(Map.of("ticketNumber", "TKT-2024-001", "message", "Ticket created."));
    }

    @GetMapping("/support")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getTickets() {
        return ResponseEntity.ok(List.of());
    }
}

// ========== ADMIN CONTROLLER ==========
@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
class AdminController {

    /** GET /api/admin/dashboard */
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getDashboard() {
        return ResponseEntity.ok(Map.of(
            "totalUsers", 0,
            "totalVendors", 0,
            "totalOrders", 0,
            "totalRevenue", 0,
            "pendingVendorApprovals", 0,
            "fraudAlerts", 0,
            "activeOrders", 0
        ));
    }

    /** GET /api/admin/analytics */
    @GetMapping("/analytics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAnalytics() {
        return ResponseEntity.ok(Map.of(
            "demandHeatmap", List.of(),
            "priceTrends", List.of(),
            "mostOrderedItems", List.of(),
            "customerSegments", List.of(),
            "seasonalPredictions", List.of(),
            "fraudAlerts", List.of()
        ));
    }

    /** GET /api/admin/vendors */
    @GetMapping("/vendors")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllVendors(@RequestParam(defaultValue = "PENDING") String status) {
        return ResponseEntity.ok(List.of());
    }

    /** PATCH /api/admin/vendors/{id}/verify */
    @PatchMapping("/vendors/{id}/verify")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> verifyVendor(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(Map.of("message", "Vendor status updated to " + body.get("status")));
    }

    /** GET /api/admin/users */
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUsers(@RequestParam(defaultValue = "0") int page) {
        return ResponseEntity.ok(Map.of("users", List.of()));
    }

    /** PATCH /api/admin/users/{id}/toggle */
    @PatchMapping("/users/{id}/toggle")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> toggleUser(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of("message", "User status toggled."));
    }

    /** GET /api/admin/orders */
    @GetMapping("/orders")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllOrders(@RequestParam(defaultValue = "0") int page) {
        return ResponseEntity.ok(Map.of("orders", List.of()));
    }

    /** POST /api/admin/coupons */
    @PostMapping("/coupons")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createCoupon(@RequestBody Map<String, Object> coupon) {
        return ResponseEntity.ok(Map.of("message", "Coupon created.", "code", coupon.get("code")));
    }

    /** GET /api/admin/audit-logs */
    @GetMapping("/audit-logs")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAuditLogs(@RequestParam(defaultValue = "0") int page) {
        return ResponseEntity.ok(Map.of("logs", List.of()));
    }

    /** GET /api/admin/fraud-alerts */
    @GetMapping("/fraud-alerts")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getFraudAlerts() {
        return ResponseEntity.ok(List.of());
    }
}

// ========== COUPON / PROMO CONTROLLER ==========
@RestController
@RequestMapping("/coupons")
@RequiredArgsConstructor
class CouponController {

    @PostMapping("/validate")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> validateCoupon(@RequestBody Map<String, Object> body) {
        String code = (String) body.get("code");
        // CouponService.validate(code, cartTotal, userId)
        return ResponseEntity.ok(Map.of(
            "valid", true,
            "discountType", "PERCENTAGE",
            "discountValue", 10,
            "maxDiscount", 500,
            "message", "10% off (max ₹500)"
        ));
    }
}
