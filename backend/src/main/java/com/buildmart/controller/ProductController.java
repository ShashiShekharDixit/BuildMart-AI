package com.buildmart.controller;

import com.buildmart.service.ProductService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // ── PUBLIC ───────────────────────────────────────────────────────────────

    @GetMapping("/public/search")
    public ResponseEntity<?> search(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "0")      int page,
            @RequestParam(defaultValue = "20")     int size,
            @RequestParam(defaultValue = "rating") String sort) {
        return ResponseEntity.ok(
            productService.searchProducts(q, category, minPrice, maxPrice, page, size, sort));
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<?> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/public/featured")
    public ResponseEntity<?> getFeatured() {
        return ResponseEntity.ok(productService.getFeaturedProducts());
    }

    @GetMapping("/public/categories")
    public ResponseEntity<?> getCategories() {
        return ResponseEntity.ok(List.of(
            Map.of("id", "CEMENT",    "label", "Cement",    "icon", "🏗️"),
            Map.of("id", "BRICKS",    "label", "Bricks",    "icon", "🧱"),
            Map.of("id", "SAND",      "label", "Sand",      "icon", "⛱️"),
            Map.of("id", "IRON_RODS", "label", "Iron Rods", "icon", "🔩"),
            Map.of("id", "TILES",     "label", "Tiles",     "icon", "🪟"),
            Map.of("id", "MARBLE",    "label", "Marble",    "icon", "💎"),
            Map.of("id", "PIPES",     "label", "Pipes",     "icon", "🔧"),
            Map.of("id", "AGGREGATE", "label", "Aggregate", "icon", "🪨"),
            Map.of("id", "PAINT",     "label", "Paint",     "icon", "🎨"),
            Map.of("id", "HARDWARE",  "label", "Hardware",  "icon", "🔨")
        ));
    }

    @GetMapping("/public/nearby")
    public ResponseEntity<?> getNearby(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "25") int radiusKm) {
        return ResponseEntity.ok(List.of());
    }

    @GetMapping("/public/compare")
    public ResponseEntity<?> compare(@RequestParam List<Long> ids) {
        return ResponseEntity.ok(productService.compareProducts(ids));
    }

    // ── REVIEWS (authenticated) ──────────────────────────────────────────────

    @PostMapping("/{id}/review")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> addReview(
            @PathVariable Long id,
            @Valid @RequestBody ReviewRequest req) {
        // In production get customerId from SecurityContextHolder
        return ResponseEntity.ok(
            productService.addReview(1L, id, req.getRating(), req.getComment()));
    }

    @GetMapping("/{id}/reviews")
    public ResponseEntity<?> getReviews(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page) {
        return ResponseEntity.ok(Map.of("reviews", List.of()));
    }

    // ── VENDOR ───────────────────────────────────────────────────────────────

    @PostMapping("/vendor/add")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<?> addProduct(@Valid @RequestBody ProductRequest req) {
        return ResponseEntity.ok(Map.of("message", "Product added successfully.", "id", 1));
    }

    @PutMapping("/vendor/{id}")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductRequest req) {
        return ResponseEntity.ok(Map.of("message", "Product updated."));
    }

    @PatchMapping("/vendor/{id}/stock")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<?> updateStock(
            @PathVariable Long id,
            @RequestBody Map<String, Double> body) {
        productService.updateStock(1L, id, body.get("quantity"));
        return ResponseEntity.ok(Map.of("message", "Stock updated.", "newStock", body.get("quantity")));
    }

    @PostMapping("/vendor/{id}/images")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<?> uploadImages(
            @PathVariable Long id,
            @RequestParam("files") List<MultipartFile> files) {
        List<String> urls = productService.uploadProductImages(1L, id, files);
        return ResponseEntity.ok(Map.of("uploaded", urls.size(), "urls", urls));
    }

    @DeleteMapping("/vendor/{id}")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of("message", "Product removed."));
    }

    @GetMapping("/vendor/my-products")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<?> getMyProducts(
            @RequestParam(defaultValue = "0") int page) {
        return ResponseEntity.ok(Map.of("products", List.of(), "page", page));
    }

    // ── DTOs ─────────────────────────────────────────────────────────────────

    @Data
    public static class ProductRequest {
        @NotBlank                              private String name;
        private String                                        description;
        private String                                        brand;
        @NotBlank                              private String category;
        @NotNull @DecimalMin("0.01")           private BigDecimal basePrice;
        @NotNull @DecimalMin("0.01")           private BigDecimal currentPrice;
        @NotBlank                              private String unit;
        @NotNull @Min(0)                       private Double stockQuantity;
        private Double                                        minOrderQuantity;
        private String                                        qualityGrade;
        private String                                        specifications;
        private Double                                        bulkMinQuantity;
        private BigDecimal                                    bulkPrice;
    }

    @Data
    public static class ReviewRequest {
        @NotNull @Min(1) @Max(5) private Integer rating;
        @Size(max = 1000)        private String  comment;
    }
}
