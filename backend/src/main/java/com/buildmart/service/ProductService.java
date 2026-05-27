package com.buildmart.service;

import com.buildmart.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ProductService {

    // Uncomment when wiring repository:
    // private final ProductRepository productRepo;
    // private final VendorRepository vendorRepo;
    // private final ReviewRepository reviewRepo;

    @Cacheable(value = "products", key = "#id")
    public Map<String, Object> getProductById(Long id) {
        // return productRepo.findById(id)
        //     .filter(Product::isActive)
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
        return Map.of("products", List.of(), "totalElements", 0L, "totalPages", 0, "currentPage", page);
    }

    @CacheEvict(value = "products", key = "#productId")
    public void updateStock(Long vendorId, Long productId, Double quantity) {
        if (quantity < 0) throw new BusinessException("Stock quantity cannot be negative");
        // Product p = productRepo.findById(productId).orElseThrow(() -> BusinessException.notFound("Product"));
        // if (!p.getVendor().getId().equals(vendorId)) throw BusinessException.forbidden("Not your product");
        // productRepo.updateStock(productId, quantity);
        log.info("Stock updated: product={} qty={}", productId, quantity);
    }

    public List<String> uploadProductImages(Long vendorId, Long productId, List<MultipartFile> files) {
        List<String> urls = new ArrayList<>();
        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/"))
                throw new BusinessException("Only image files are allowed");
            if (file.getSize() > 10 * 1024 * 1024)
                throw new BusinessException("Each image must be under 10MB");
            // String url = fileStorageService.uploadToS3(file, "products/" + productId + "/");
            // urls.add(url);
        }
        return urls;
    }

    public Map<String, Object> addReview(Long customerId, Long productId, Integer rating, String comment) {
        if (rating < 1 || rating > 5)
            throw new BusinessException("Rating must be between 1 and 5");
        // Review review = Review.builder()
        //     .product(productRepo.getReferenceById(productId))
        //     .customer(userRepo.getReferenceById(customerId))
        //     .rating(rating).comment(comment).spam(false).verified(false).build();
        // reviewRepo.save(review);
        // Double avg = reviewRepo.avgRatingByProduct(productId);
        // productRepo.findById(productId).ifPresent(p -> { p.setRating(avg != null ? avg : 0.0); });
        return Map.of("message", "Review submitted for moderation.");
    }

    @Cacheable(value = "featured-products")
    public List<Map<String, Object>> getFeaturedProducts() {
        // return productRepo.findByFeaturedTrueAndActiveTrue()
        //     .stream().map(this::toDto).collect(Collectors.toList());
        return List.of();
    }
}
