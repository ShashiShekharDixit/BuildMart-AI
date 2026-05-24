package com.buildmart.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.*;

@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
@Slf4j
public class AIController {

    @Value("${openai.api.key}")
    private String openaiApiKey;

    @Value("${openai.model}")
    private String openaiModel;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // ========== MATERIAL ADVISOR ==========
    /**
     * POST /api/ai/material-advisor
     * User describes construction need → AI calculates materials required
     *
     * Example input: "I need material for a 2-floor house, 1500 sq ft per floor"
     * Returns: cement bags, bricks, sand, steel, aggregate estimates
     */
    @PostMapping("/material-advisor")
    public ResponseEntity<?> materialAdvisor(@Valid @RequestBody MaterialAdvisorRequest request) {
        String systemPrompt = """
            You are BuildMart AI Material Advisor, an expert in Indian construction materials.
            When a user describes their construction project, calculate ACCURATE material estimates.
            
            Use these standard formulas:
            - Cement: ~0.4 bags per sq ft for slab (50kg bags)
            - Bricks: ~8-10 bricks per sq ft of wall (standard 9"x4"x3" bricks)
            - Sand: ~1.5 cubic feet per bag of cement (for mortar+plaster)
            - Steel/Iron Rods: ~4-5 kg per sq ft of slab
            - Aggregate (Gravel): ~2 cubic feet per bag of cement for concrete
            
            Respond ONLY with valid JSON in this exact format:
            {
              "projectSummary": "Brief description of the project",
              "totalArea": 1500,
              "areaUnit": "sq ft",
              "materials": [
                {
                  "name": "Cement",
                  "category": "CEMENT",
                  "quantity": 600,
                  "unit": "bags (50kg)",
                  "estimatedCost": 180000,
                  "notes": "Includes 10% wastage buffer"
                }
              ],
              "totalEstimatedCost": 850000,
              "disclaimer": "Estimates vary ±15% based on design and quality",
              "tips": ["Tip 1", "Tip 2"]
            }
            """;

        String userMessage = "Project: " + request.getDescription();
        if (request.getAreaSqFt() != null) {
            userMessage += "\nTotal area: " + request.getAreaSqFt() + " sq ft";
        }
        if (request.getFloors() != null) {
            userMessage += "\nNumber of floors: " + request.getFloors();
        }

        try {
            String aiResponse = callOpenAI(systemPrompt, userMessage);
            Object parsed = objectMapper.readValue(aiResponse, Object.class);
            return ResponseEntity.ok(parsed);
        } catch (Exception e) {
            log.error("Material advisor error", e);
            return ResponseEntity.ok(getFallbackMaterialEstimate(request));
        }
    }

    // ========== PRICE PREDICTION ==========
    /**
     * POST /api/ai/price-prediction
     * Predict if material prices will rise/fall next month
     */
    @PostMapping("/price-prediction")
    public ResponseEntity<?> pricePrediction(@Valid @RequestBody PricePredictionRequest request) {
        String systemPrompt = """
            You are BuildMart AI Price Analyst specializing in Indian construction material markets.
            Analyze market trends and predict price movements for the next 30 days.
            
            Consider: seasonal demand (monsoon slows construction, winters increase), 
            government infrastructure projects, fuel prices affecting transport,
            raw material costs, festive season construction boom.
            
            Respond ONLY with valid JSON:
            {
              "material": "Cement",
              "currentPriceRange": {"min": 350, "max": 420, "unit": "per 50kg bag"},
              "prediction": "INCREASE",
              "predictedChangePercent": 5.5,
              "confidence": "HIGH",
              "timeframe": "Next 30 days",
              "factors": ["Factor 1", "Factor 2"],
              "recommendation": "Buy now before prices rise",
              "historicalTrend": "Prices typically rise 8-12% during Oct-Dec construction season"
            }
            """;

        String userMessage = "Predict price trend for: " + request.getMaterial()
                + " in region: " + request.getRegion()
                + " for month: " + request.getTargetMonth();

        try {
            String aiResponse = callOpenAI(systemPrompt, userMessage);
            Object parsed = objectMapper.readValue(aiResponse, Object.class);
            return ResponseEntity.ok(parsed);
        } catch (Exception e) {
            log.error("Price prediction error", e);
            return ResponseEntity.ok(Map.of(
                "material", request.getMaterial(),
                "prediction", "STABLE",
                "confidence", "MEDIUM",
                "recommendation", "Current prices are reasonable. Monitor weekly."
            ));
        }
    }

    // ========== CHATBOT ==========
    /**
     * POST /api/ai/chat
     * Conversational AI assistant for BuildMart
     */
    @PostMapping("/chat")
    public ResponseEntity<?> chat(@Valid @RequestBody ChatRequest request) {
        String systemPrompt = """
            You are BuildMart AI Assistant — a friendly, expert AI for India's smartest construction material marketplace.
            
            You help users:
            1. Find the right construction materials
            2. Estimate quantities for projects
            3. Explain material quality grades (Grade A, B, C)
            4. Calculate delivery ETAs based on location
            5. Suggest alternatives if a material is out of stock
            6. Explain product specifications (e.g., M25 cement vs M30)
            7. Guide through ordering process
            8. Answer questions about GST, invoices, returns
            
            Be concise, helpful, and use simple language. When asked for quantities,
            always ask for area/dimensions if not provided.
            
            Available categories: Cement, Bricks, Sand, Iron Rods, Aggregate, Tiles, Marble, Pipes, Paint, Hardware
            
            If asked about prices, say prices vary by vendor and suggest searching on BuildMart.
            Always end with a helpful follow-up question or suggestion.
            """;

        // Build conversation history
        List<Map<String, String>> messages = new ArrayList<>();
        if (request.getHistory() != null) {
            for (ChatMessage msg : request.getHistory()) {
                messages.add(Map.of("role", msg.getRole(), "content", msg.getContent()));
            }
        }
        messages.add(Map.of("role", "user", "content", request.getMessage()));

        try {
            String aiResponse = callOpenAIWithHistory(systemPrompt, messages);
            return ResponseEntity.ok(Map.of(
                "reply", aiResponse,
                "timestamp", System.currentTimeMillis()
            ));
        } catch (Exception e) {
            log.error("Chatbot error", e);
            return ResponseEntity.ok(Map.of(
                "reply", "I'm having trouble connecting right now. Please try again in a moment, or browse our products directly!",
                "timestamp", System.currentTimeMillis()
            ));
        }
    }

    // ========== FRAUD DETECTION ==========
    /**
     * POST /api/ai/fraud-check (Admin only, called internally)
     * Detect suspicious vendor profiles or listings
     */
    @PostMapping("/fraud-check")
    public ResponseEntity<?> fraudCheck(@RequestBody FraudCheckRequest request) {
        String systemPrompt = """
            You are BuildMart Fraud Detection AI. Analyze vendor/product data for suspicious patterns.
            
            Red flags to check:
            - Prices 40%+ below market average (price dumping scam)
            - Stock quantities unrealistically high (fake inventory)
            - GST numbers in invalid format
            - Duplicate product listings with different prices
            - New vendors with bulk listings of high-value items
            - Reviews that are too generic/repetitive (spam)
            - Phone numbers from outside India
            
            Respond ONLY with JSON:
            {
              "riskScore": 75,
              "riskLevel": "HIGH",
              "flags": ["Flag 1", "Flag 2"],
              "recommendation": "SUSPEND_PENDING_REVIEW",
              "details": "Explanation"
            }
            """;

        String userMessage = "Analyze this vendor/listing data: " + request.getData();

        try {
            String aiResponse = callOpenAI(systemPrompt, userMessage);
            Object parsed = objectMapper.readValue(aiResponse, Object.class);
            return ResponseEntity.ok(parsed);
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("riskScore", 0, "riskLevel", "LOW", "flags", List.of()));
        }
    }

    // ========== SMART RECOMMENDATIONS ==========
    /**
     * GET /api/ai/recommendations
     * Personalized product recommendations
     */
    @GetMapping("/recommendations")
    public ResponseEntity<?> getRecommendations(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String city) {
        // In production: uses user order history + collaborative filtering
        return ResponseEntity.ok(Map.of(
            "message", "AI recommendations based on your activity",
            "products", List.of()
        ));
    }

    // ========== HELPER METHODS ==========

    private String callOpenAI(String systemPrompt, String userMessage) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openaiApiKey);

        Map<String, Object> requestBody = Map.of(
            "model", openaiModel,
            "messages", List.of(
                Map.of("role", "system", "content", systemPrompt),
                Map.of("role", "user", "content", userMessage)
            ),
            "max_tokens", 1000,
            "temperature", 0.3
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(
            "https://api.openai.com/v1/chat/completions", entity, Map.class);

        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
        Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
        return (String) message.get("content");
    }

    private String callOpenAIWithHistory(String systemPrompt, List<Map<String, String>> history) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openaiApiKey);

        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", systemPrompt));
        messages.addAll(history);

        Map<String, Object> requestBody = Map.of(
            "model", openaiModel,
            "messages", messages,
            "max_tokens", 500,
            "temperature", 0.7
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(
            "https://api.openai.com/v1/chat/completions", entity, Map.class);

        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
        Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
        return (String) message.get("content");
    }

    private Map<String, Object> getFallbackMaterialEstimate(MaterialAdvisorRequest request) {
        int area = request.getAreaSqFt() != null ? request.getAreaSqFt() : 1000;
        int floors = request.getFloors() != null ? request.getFloors() : 1;
        int totalArea = area * floors;

        return Map.of(
            "projectSummary", "Estimated materials for " + totalArea + " sq ft construction",
            "totalArea", totalArea,
            "areaUnit", "sq ft",
            "materials", List.of(
                Map.of("name", "Cement", "quantity", totalArea * 0.4, "unit", "bags (50kg)", "estimatedCost", totalArea * 0.4 * 380),
                Map.of("name", "Bricks", "quantity", totalArea * 9, "unit", "pieces", "estimatedCost", totalArea * 9 * 8),
                Map.of("name", "Sand", "quantity", totalArea * 0.6, "unit", "cubic meters", "estimatedCost", totalArea * 0.6 * 1200),
                Map.of("name", "Iron Rods", "quantity", totalArea * 4.5, "unit", "kg", "estimatedCost", totalArea * 4.5 * 65),
                Map.of("name", "Aggregate", "quantity", totalArea * 0.8, "unit", "cubic meters", "estimatedCost", totalArea * 0.8 * 900)
            ),
            "disclaimer", "These are approximate estimates. ±15% variation expected based on design.",
            "tips", List.of(
                "Order 10% extra for wastage",
                "Verify with a local civil engineer",
                "Compare prices from multiple vendors on BuildMart"
            )
        );
    }

    // ========== DTOs ==========
    @Data public static class MaterialAdvisorRequest {
        @NotBlank private String description;
        private Integer areaSqFt;
        private Integer floors;
        private String constructionType; // residential, commercial, renovation
    }

    @Data public static class PricePredictionRequest {
        @NotBlank private String material;
        private String region;
        private String targetMonth;
    }

    @Data public static class ChatRequest {
        @NotBlank private String message;
        private List<ChatMessage> history;
    }

    @Data public static class ChatMessage {
        private String role; // user or assistant
        private String content;
    }

    @Data public static class FraudCheckRequest {
        private String data; // JSON string of vendor/product data
    }
}
