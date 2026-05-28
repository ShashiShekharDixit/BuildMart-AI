package com.buildmart.service;

import com.buildmart.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private static final Logger log = LoggerFactory.getLogger(OrderService.class);


    // private final OrderRepository orderRepo;
    // private final CartRepository cartRepo;
    // private final ProductRepository productRepo;
    // private final WalletRepository walletRepo;
    // private final CouponRepository couponRepo;
    // private final NotificationService notificationService;

    public Map<String, Object> placeOrder(Long customerId, PlaceOrderRequest request) {
        // 1. Fetch and validate cart
        // List<CartItem> cartItems = cartRepo.findByUserId(customerId);
        // if (cartItems.isEmpty()) throw new BusinessException("Cart is empty");

        // 2. Check stock for each item
        // for (CartItem item : cartItems) {
        //     if (!item.getProduct().isInStock() || item.getProduct().getStockQuantity() < item.getQuantity())
        //         throw new BusinessException("Insufficient stock: " + item.getProduct().getName());
        // }

        // 3. Calculate totals
        // BigDecimal subtotal = cartItems.stream()
        //     .map(i -> i.getProduct().getCurrentPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
        //     .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 4. Apply coupon
        // BigDecimal discount = request.getCouponCode() != null ? applyCoupon(request.getCouponCode(), subtotal) : BigDecimal.ZERO;

        // 5. Create and save order
        // String orderNumber = generateOrderNumber();
        // Order order = Order.builder().orderNumber(orderNumber).customerId(customerId)
        //     .subtotal(subtotal).discountAmount(discount)
        //     .totalAmount(subtotal.subtract(discount))
        //     .status(Order.OrderStatus.CONFIRMED)
        //     .paymentMethod(request.getPaymentMethod()).build();
        // orderRepo.save(order);

        // 6. Deduct stock & clear cart
        // cartItems.forEach(i -> productRepo.updateStock(i.getProduct().getId(), i.getProduct().getStockQuantity() - i.getQuantity()));
        // cartRepo.deleteByUserId(customerId);

        String orderNumber = "BM-" + System.currentTimeMillis();
        log.info("Order placed: {} for customer {}", orderNumber, customerId);

        return Map.of(
            "orderNumber", orderNumber,
            "status", "CONFIRMED",
            "message", "Order placed successfully!",
            "estimatedDelivery", LocalDateTime.now().plusDays(3).toString()
        );
    }

    public Map<String, Object> trackOrder(String orderNumber) {
        // Order order = orderRepo.findByOrderNumber(orderNumber)
        //     .orElseThrow(() -> BusinessException.notFound("Order"));
        return Map.of(
            "orderNumber", orderNumber,
            "status", "OUT_FOR_DELIVERY",
            "driverName", "Ramesh Kumar",
            "driverPhone", "+91-9876543210",
            "estimatedArrival", LocalDateTime.now().plusHours(2).toString()
        );
    }

    public String generateInvoiceUrl(String orderNumber) {
        return "https://buildmart.ai/invoices/" + orderNumber + ".pdf";
    }

    private String generateOrderNumber() {
        return "BM-" + LocalDateTime.now().getYear() + "-"
            + String.format("%08d", (long)(Math.random() * 99999999));
    }

    public static class PlaceOrderRequest {
        private Long addressId;
        private String paymentMethod;
        private String couponCode;
        private Boolean useWallet;
        private String deliveryNotes;
        private String scheduledDelivery;

    // --- Generated getters and setters ---
        public Long getAddressId() { return this.addressId; }
        public void setAddressId(Long addressId) { this.addressId = addressId; }
        public String getPaymentMethod() { return this.paymentMethod; }
        public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
        public String getCouponCode() { return this.couponCode; }
        public void setCouponCode(String couponCode) { this.couponCode = couponCode; }
        public Boolean getUseWallet() { return this.useWallet; }
        public void setUseWallet(Boolean useWallet) { this.useWallet = useWallet; }
        public String getDeliveryNotes() { return this.deliveryNotes; }
        public void setDeliveryNotes(String deliveryNotes) { this.deliveryNotes = deliveryNotes; }
        public String getScheduledDelivery() { return this.scheduledDelivery; }
        public void setScheduledDelivery(String scheduledDelivery) { this.scheduledDelivery = scheduledDelivery; }
}
}
