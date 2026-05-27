package com.buildmart.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    // private final NotificationRepository notifRepo;
    // private final SimpMessagingTemplate wsTemplate;

    public void sendToUser(Long userId, String title, String message, String type) {
        // Notification n = Notification.builder()
        //     .user(userRepo.getReferenceById(userId))
        //     .title(title).message(message).type(type).read(false).build();
        // notifRepo.save(n);
        // wsTemplate.convertAndSendToUser(userId.toString(), "/queue/notifications",
        //     Map.of("title", title, "message", message, "type", type));
        log.info("Notification -> user={} title={}", userId, title);
    }

    public void sendOrderUpdate(Long userId, String orderNumber, String status) {
        String message = switch (status) {
            case "CONFIRMED"        -> "Your order " + orderNumber + " has been confirmed!";
            case "DISPATCHED"       -> "Your order " + orderNumber + " has been dispatched.";
            case "OUT_FOR_DELIVERY" -> "Your order " + orderNumber + " is out for delivery!";
            case "DELIVERED"        -> "Your order " + orderNumber + " delivered. Rate your experience!";
            case "CANCELLED"        -> "Your order " + orderNumber + " has been cancelled.";
            default -> "Order " + orderNumber + " status: " + status;
        };
        sendToUser(userId, "Order Update", message, "ORDER");
    }
}
