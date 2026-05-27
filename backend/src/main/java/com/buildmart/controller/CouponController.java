package com.buildmart.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/coupons")
@RequiredArgsConstructor
public class CouponController {

    @PostMapping("/validate")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> validateCoupon(@RequestBody Map<String, Object> body) {
        String code = (String) body.get("code");
        if (code == null || code.isBlank())
            return ResponseEntity.badRequest().body(Map.of("message", "Coupon code is required"));
        // In production: CouponRepository.findByCodeAndActiveTrue(code)
        return ResponseEntity.ok(Map.of(
            "valid",        true,
            "code",         code,
            "discountType", "PERCENTAGE",
            "discountValue", 10,
            "maxDiscount",  500,
            "message",      "10% off (max ₹500)"
        ));
    }
}
