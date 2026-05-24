package com.buildmart.controller;

import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@Slf4j
public class ProductController {

    // ========== PUBLIC ENDPOINTS ==========

    /**
     * GET /api/products/public/search
     * Full-text product search with filters
     * Params: q, category, city, minPrice, maxPrice, minRating, page, size, sort
     */
    @GetMapping("/public/search")
    public ResponseEntity<?> searchProducts(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "rating") String sort) {

        // ProductService.search(...) uses Elasticsearch or JPA depending on config
        return ResponseEntity.ok(Map.of(
            "products", List.of(),
            "totalElements", 0,
            "totalPages", 0,
            "currentPage", page
        ));
    }

    /**
     * GET /api/products/public/{id}
     * Get product details
     */
    @GetMapping("/public/{id}")
    public ResponseEntity<?> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of("id", id, "name", "Cement 50kg Bag"));
    }

    /**
     * GET /api/products/public/compare
     * Compare 2-4 products side by side
     */
    @GetMapping("/public/compare")
    public ResponseEntity<?> compareProducts(@RequestParam List<Long> ids) {
        return ResponseEntity.ok(Map.of("products", List.of()));
    }

    /**
     * GET /api/products/public/categories
     */
    @GetMapping("/public/categories")
    public ResponseEntity<?> getCategories() {
        return ResponseEntity.ok(List.of(
            Map.of("id", "CEMENT", "label", "Cement", "icon", "🏗️"),
            Map.of("id", "BRICKS", "label", "Bricks", "icon", "🧱"),
            Map.of("id", "SAND", "label", "Sand", "icon", "⛱️"),
            Map.of("id", "IRON_RODS", "label", "Iron Rods", "icon", "🔩"),
            Map.of("id", "TILES", "label", "Tiles", "icon", "🪟"),
            Map.of("id", "PIPES", "label", "Pipes", "icon", "🪛"),
            Map.of("id", "MARBLE", "label", "Marble", "icon", "💎"),
            Map.of("id", "AGGREGATE", "label", "Aggregate", "icon", "🪨"),
            Map.of("id", "PAINT", "label", "Paint", "icon", "🎨"),
            Map.of("id", "HARDWARE", "label", "Hardware", "icon", "🔧")
        ));
    }

    /**
     * GET /api/products/public/featured
     * Featured / flash offer products
     */
    @GetMapping("/public/featured")
    public ResponseEntity<?> getFeaturedProducts() {
        return ResponseEntity.ok(List.of());
    }

    /**
     * GET /api/products/public/nearby
     * Products from vendors near a location
     */
    @GetMapping("/public/nearby")
    public ResponseEntity<?> getNearbyProducts(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "25") int radiusKm) {
        return ResponseEntity.ok(List.of());
    }

    // ========== CUSTOMER ENDPOINTS ==========

    /**
     * POST /api/products/{id}/review
     */
    @PostMapping("/{id}/review")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> addReview(
            @PathVariable Long id,
            @Valid @RequestBody ReviewRequest request) {
        return ResponseEntity.ok(Map.of("message", "Review submitted for moderation."));
    }

    /**
     * GET /api/products/{id}/reviews
     */
    @GetMapping("/{id}/reviews")
    public ResponseEntity<?> getReviews(@PathVariable Long id,
            @RequestParam(defaultValue = "0") int page) {
        return ResponseEntity.ok(Map.of("reviews", List.of()));
    }

    // ========== VENDOR ENDPOINTS ==========

    /**
     * POST /api/products/vendor/add
     * Vendor adds a new product
     */
    @PostMapping("/vendor/add")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<?> addProduct(@Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(Map.of("message", "Product added successfully.", "id", 1));
    }

    /**
     * PUT /api/products/vendor/{id}
     * Update product details
     */
    @PutMapping("/vendor/{id}")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<?> updateProduct(@PathVariable Long id,
            @RequestBody ProductRequest request) {
        return ResponseEntity.ok(Map.of("message", "Product updated."));
    }

    /**
     * PATCH /api/products/vendor/{id}/stock
     * Real-time stock update
     */
    @PatchMapping("/vendor/{id}/stock")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<?> updateStock(@PathVariable Long id,
            @RequestBody Map<String, Double> body) {
        return ResponseEntity.ok(Map.of("message", "Stock updated.", "newStock", body.get("quantity")));
    }

    /**
     * POST /api/products/vendor/{id}/images
     * Upload product images
     */
    @PostMapping("/vendor/{id}/images")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<?> uploadImages(@PathVariable Long id,
            @RequestParam("files") List<MultipartFile> files) {
        return ResponseEntity.ok(Map.of("uploaded", files.size()));
    }

    /**
     * DELETE /api/products/vendor/{id}
     */
    @DeleteMapping("/vendor/{id}")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of("message", "Product removed."));
    }

    /**
     * GET /api/products/vendor/my-products
     */
    @GetMapping("/vendor/my-products")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<?> getMyProducts(@RequestParam(defaultValue = "0") int page) {
        return ResponseEntity.ok(Map.of("products", List.of()));
    }

    // ========== DTOs ==========
    @Data public static class ProductRequest {
        @NotBlank private String name;
        private String description;
        private String brand;
        @NotBlank private String category;
        @NotNull @DecimalMin("0.01") private BigDecimal basePrice;
        @NotNull @DecimalMin("0.01") private BigDecimal currentPrice;
        @NotBlank private String unit;
        @NotNull @Min(0) private Double stockQuantity;
        private Double minOrderQuantity;
        private String qualityGrade;
        private String specifications;
        // Bulk pricing
        private Double bulkMinQuantity;
        private BigDecimal bulkPrice;
    }

    @Data public static class ReviewRequest {
        @NotNull @Min(1) @Max(5) private Integer rating;
        @Size(max = 1000) private String comment;
    }
}
