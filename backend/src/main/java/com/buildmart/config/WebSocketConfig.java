package com.buildmart.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * WebSocket configuration for real-time features:
 * - Live stock updates (vendor updates → customer sees instantly)
 * - Order status tracking
 * - Real-time notifications
 * - Price change alerts
 *
 * Frontend connects via: new WebSocket('ws://localhost:8080/api/ws')
 * Or STOMP: client.connect({}, () => client.subscribe('/topic/stock', msg => ...))
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Enable simple in-memory broker for topic & queue
        config.enableSimpleBroker("/topic", "/queue");
        // Application destination prefix for @MessageMapping methods
        config.setApplicationDestinationPrefixes("/app");
        // User-specific destinations for private notifications
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
            .setAllowedOriginPatterns("*")
            .withSockJS(); // fallback for browsers without native WebSocket
    }

    /**
     * WebSocket Topics:
     *
     * /topic/stock/{productId}     — real-time stock updates for a product
     * /topic/prices                — price change broadcasts
     * /topic/flash-offers          — new flash offer alerts
     * /user/{userId}/queue/notifications — private notifications per user
     * /user/{userId}/queue/order-updates — order status updates
     *
     * Example vendor sends stock update:
     *   simpMessagingTemplate.convertAndSend(
     *     "/topic/stock/" + productId,
     *     Map.of("productId", productId, "stock", newQty, "unit", "bags")
     *   );
     *
     * Example order tracker:
     *   simpMessagingTemplate.convertAndSendToUser(
     *     userId.toString(),
     *     "/queue/order-updates",
     *     Map.of("orderNumber", "BM-001", "status", "OUT_FOR_DELIVERY", "lat", 26.84, "lng", 80.94)
     *   );
     */
}
