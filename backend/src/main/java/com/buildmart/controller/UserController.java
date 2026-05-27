package com.buildmart.controller;

import com.buildmart.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final WalletService walletService;

    @GetMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getProfile() {
        return ResponseEntity.ok(Map.of(
            "firstName", "Demo",
            "lastName",  "User",
            "email",     "user@example.com",
            "role",      "CUSTOMER"
        ));
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
    public ResponseEntity<?> updateAddress(
            @PathVariable Long id,
            @RequestBody Map<String, Object> address) {
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
        return ResponseEntity.ok(walletService.getWallet(1L));
    }

    @PostMapping("/wallet/add")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> addToWallet(@RequestBody Map<String, Object> body) {
        BigDecimal amount = new BigDecimal(body.get("amount").toString());
        walletService.credit(1L, amount, "Manual top-up");
        return ResponseEntity.ok(Map.of("message", "Wallet topped up successfully."));
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

    @PatchMapping("/notifications/read-all")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> markAllRead() {
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read."));
    }

    // Support tickets
    @PostMapping("/support")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> createTicket(@RequestBody Map<String, String> ticket) {
        return ResponseEntity.ok(Map.of(
            "ticketNumber", "TKT-2024-001",
            "message",      "Support ticket created. We'll respond within 24 hours."));
    }

    @GetMapping("/support")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getTickets() {
        return ResponseEntity.ok(List.of());
    }
}
