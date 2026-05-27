package com.buildmart.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // In-memory broker for /topic (broadcast) and /queue (user-specific)
        config.enableSimpleBroker("/topic", "/queue");
        // Client sends to /app/... which routes to @MessageMapping methods
        config.setApplicationDestinationPrefixes("/app");
        // User-specific destinations  e.g. /user/42/queue/notifications
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry
            .addEndpoint("/ws")
            .setAllowedOriginPatterns("*")
            .withSockJS();   // fallback for browsers without native WebSocket
    }

    /*
     * WebSocket topics used in BuildMart:
     *
     * /topic/stock/{productId}          — live stock updates  (vendor → customers)
     * /topic/prices                     — price change alerts (admin → all)
     * /topic/flash-offers               — new flash sale      (admin → all)
     *
     * /user/{id}/queue/notifications    — private notification per user
     * /user/{id}/queue/order-updates    — order status updates
     *
     * Example — vendor sends real-time stock update:
     *   simpMessagingTemplate.convertAndSend(
     *       "/topic/stock/" + productId,
     *       Map.of("productId", productId, "stock", newQty, "unit", "bags"));
     *
     * Example — order tracker:
     *   simpMessagingTemplate.convertAndSendToUser(
     *       userId.toString(), "/queue/order-updates",
     *       Map.of("orderNumber","BM-001","status","OUT_FOR_DELIVERY","lat",26.84,"lng",80.94));
     */
}
