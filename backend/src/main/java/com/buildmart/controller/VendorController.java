package com.buildmart.controller;

import com.buildmart.service.VendorService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/vendor")
@RequiredArgsConstructor
public class VendorController {

    private final VendorService vendorService;

    @GetMapping("/profile")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<?> getProfile() {
        return ResponseEntity.ok(Map.of(
            "businessName",      "Your Business",
            "verificationStatus","PENDING",
            "city",              "",
            "deliveryRadiusKm",  25
        ));
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<?> updateProfile(@RequestBody VendorProfileRequest req) {
        return ResponseEntity.ok(Map.of("message", "Profile updated."));
    }

    @PostMapping("/documents")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<?> uploadDocuments(
            @RequestParam("files") List<MultipartFile> files) {
        return ResponseEntity.ok(Map.of(
            "uploaded", files.size(),
            "message",  "Documents submitted for verification."));
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<?> getDashboard() {
        // In production get vendorId from SecurityContextHolder
        return ResponseEntity.ok(vendorService.getDashboardStats(1L));
    }

    @GetMapping("/analytics")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<?> getAnalytics(
            @RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(vendorService.getAnalytics(1L, days));
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<?> getPublicProfile(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of(
            "id",           id,
            "businessName", "Sample Vendor",
            "rating",       4.5,
            "city",         "Lucknow"
        ));
    }

    @GetMapping("/public/nearby")
    public ResponseEntity<?> getNearbyVendors(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "25") int radiusKm) {
        return ResponseEntity.ok(List.of());
    }

    @PostMapping("/bulk-offers")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<?> createBulkOffer(@RequestBody Map<String, Object> offer) {
        return ResponseEntity.ok(Map.of("message", "Bulk offer created."));
    }

    @PostMapping("/flash-offers")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<?> createFlashOffer(@RequestBody Map<String, Object> offer) {
        return ResponseEntity.ok(Map.of("message", "Flash offer created."));
    }

    @Data
    public static class VendorProfileRequest {
        private String  businessName;
        private String  gstNumber;
        private String  businessAddress;
        private String  city;
        private String  state;
        private String  pincode;
        private Integer deliveryRadiusKm;
        private String  warehouseDetails;
        private String  businessDescription;
    }
}
