package com.buildmart.controller;

import com.buildmart.service.AdminService;
import com.buildmart.service.VendorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService  adminService;
    private final VendorService vendorService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getDashboard() {
        return ResponseEntity.ok(adminService.getPlatformStats());
    }

    @GetMapping("/analytics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAnalytics() {
        return ResponseEntity.ok(Map.of(
            "demandHeatmap",       List.of(),
            "priceTrends",         List.of(),
            "mostOrderedItems",    List.of(),
            "customerSegments",    List.of(),
            "seasonalPredictions", List.of(),
            "fraudAlerts",         List.of()
        ));
    }

    @GetMapping("/vendors")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllVendors(
            @RequestParam(defaultValue = "PENDING") String status) {
        return ResponseEntity.ok(List.of());
    }

    @PatchMapping("/vendors/{id}/verify")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> verifyVendor(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(vendorService.verifyVendor(id, body.get("status")));
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUsers(
            @RequestParam(defaultValue = "0") int page) {
        return ResponseEntity.ok(Map.of("users", List.of(), "page", page));
    }

    @PatchMapping("/users/{id}/toggle")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> toggleUser(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of("message", "User status toggled."));
    }

    @GetMapping("/orders")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllOrders(
            @RequestParam(defaultValue = "0") int page) {
        return ResponseEntity.ok(Map.of("orders", List.of(), "page", page));
    }

    @PostMapping("/coupons")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createCoupon(@RequestBody Map<String, Object> coupon) {
        return ResponseEntity.ok(
            Map.of("message", "Coupon created.", "code", coupon.get("code")));
    }

    @GetMapping("/audit-logs")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAuditLogs(
            @RequestParam(defaultValue = "0") int page) {
        return ResponseEntity.ok(Map.of("logs", List.of(), "page", page));
    }

    @GetMapping("/fraud-alerts")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getFraudAlerts() {
        return ResponseEntity.ok(List.of());
    }
}
