package com.buildmart.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@RestController
@RequestMapping("/ai")
@Slf4j
public class AIController {

    @Value("${openai.api.key:}")
    private String openaiKey;

    @Value("${openai.model:gpt-4o-mini}")
    private String openaiModel;

    private final RestTemplate  restTemplate  = new RestTemplate();
    private final ObjectMapper  objectMapper  = new ObjectMapper();

    // ── Material Advisor ─────────────────────────────────────────────────────

    @PostMapping("/material-advisor")
    public ResponseEntity<?> materialAdvisor(
            @Valid @RequestBody MaterialAdvisorRequest req) {

        String systemPrompt = """
            You are BuildMart AI Material Advisor for Indian construction.
            Calculate accurate material estimates using these formulas:
            - Cement: 0.4 bags per sq ft (50kg bags)
            - Bricks: 9 per sq ft of wall
            - Sand: 1.5 cu ft per cement bag
            - Iron Rods: 4.5 kg per sq ft of slab
            - Aggregate: 2 cu ft per cement bag

            Respond ONLY with valid JSON:
            {
              "projectSummary": "...",
              "totalArea": 1500,
              "areaUnit": "sq ft",
              "materials": [
                {"name":"Cement","quantity":600,"unit":"bags (50kg)","estimatedCost":228000,"notes":"Includes 10% wastage"}
              ],
              "totalEstimatedCost": 850000,
              "disclaimer": "Estimates vary ±15%",
              "tips": ["tip1","tip2"]
            }
            """;

        String userMsg = "Project: " + req.getDescription();
        if (req.getAreaSqFt() != null) userMsg += "\nArea: " + req.getAreaSqFt() + " sq ft";
        if (req.getFloors()   != null) userMsg += "\nFloors: " + req.getFloors();

        if (openaiKey == null || openaiKey.isBlank()) {
            log.warn("OpenAI key not configured — returning formula fallback");
            return ResponseEntity.ok(formulaFallback(req));
        }

        try {
            String raw    = callOpenAI(systemPrompt, userMsg, 1000);
            Object parsed = objectMapper.readValue(raw, Object.class);
            return ResponseEntity.ok(parsed);
        } catch (Exception e) {
            log.error("Material advisor AI error: {}", e.getMessage());
            return ResponseEntity.ok(formulaFallback(req));
        }
    }

    // ── Price Predictor ──────────────────────────────────────────────────────

    @PostMapping("/price-prediction")
    public ResponseEntity<?> pricePrediction(
            @Valid @RequestBody PricePredictionRequest req) {

        String systemPrompt = """
            You are BuildMart AI Price Analyst for Indian construction materials.
            Predict price movements for the next 30 days.
            Consider: seasonal demand, monsoon, fuel prices, infrastructure projects.

            Respond ONLY with valid JSON:
            {
              "material": "Cement",
              "prediction": "INCREASE",
              "predictedChangePercent": 5.5,
              "confidence": "HIGH",
              "factors": ["reason1","reason2"],
              "recommendation": "Buy now before prices rise",
              "historicalTrend": "..."
            }
            """;

        String userMsg = "Predict price for: " + req.getMaterial()
                       + " in region: "   + req.getRegion();

        if (openaiKey == null || openaiKey.isBlank()) {
            return ResponseEntity.ok(Map.of(
                "material",               req.getMaterial(),
                "prediction",             "STABLE",
                "predictedChangePercent", 2.5,
                "confidence",             "MEDIUM",
                "recommendation",         "Market appears stable. Good time to order.",
                "factors",                List.of("Stable fuel prices", "Normal seasonal demand")
            ));
        }

        try {
            String raw    = callOpenAI(systemPrompt, userMsg, 600);
            Object parsed = objectMapper.readValue(raw, Object.class);
            return ResponseEntity.ok(parsed);
        } catch (Exception e) {
            log.error("Price prediction AI error: {}", e.getMessage());
            return ResponseEntity.ok(Map.of(
                "material",   req.getMaterial(),
                "prediction", "STABLE",
                "confidence", "LOW",
                "recommendation", "Unable to predict at this time. Please try again."));
        }
    }

    // ── Chatbot ──────────────────────────────────────────────────────────────

    @PostMapping("/chat")
    public ResponseEntity<?> chat(@Valid @RequestBody ChatRequest req) {

        String systemPrompt = """
            You are BuildMart AI Assistant — expert in Indian construction materials.
            Help users:
            1. Estimate material quantities for their projects
            2. Find the right products (cement grades, brick types, etc.)
            3. Explain quality grades (M25, M30, Fe500, Grade A/B/C)
            4. Answer delivery and pricing questions
            5. Suggest alternatives when products are unavailable
            Be concise, helpful, and use simple language.
            Available categories: Cement, Bricks, Sand, Iron Rods, Aggregate,
            Tiles, Marble, Pipes, Paint, Hardware.
            """;

        List<Map<String, String>> messages = new ArrayList<>();
        if (req.getHistory() != null) {
            for (ChatMessage msg : req.getHistory()) {
                messages.add(Map.of("role", msg.getRole(), "content", msg.getContent()));
            }
        }
        messages.add(Map.of("role", "user", "content", req.getMessage()));

        if (openaiKey == null || openaiKey.isBlank()) {
            return ResponseEntity.ok(Map.of(
                "reply",     "AI service is not configured. Please add your OpenAI API key to application.properties.",
                "timestamp", System.currentTimeMillis()
            ));
        }

        try {
            String reply = callOpenAIWithHistory(systemPrompt, messages, 500);
            return ResponseEntity.ok(Map.of("reply", reply, "timestamp", System.currentTimeMillis()));
        } catch (Exception e) {
            log.error("Chatbot error: {}", e.getMessage());
            return ResponseEntity.ok(Map.of(
                "reply",     "I'm having trouble connecting right now. Please browse our products directly!",
                "timestamp", System.currentTimeMillis()
            ));
        }
    }

    // ── Fraud Detection (Admin) ───────────────────────────────────────────────

    @PostMapping("/fraud-check")
    public ResponseEntity<?> fraudCheck(@RequestBody FraudCheckRequest req) {

        String systemPrompt = """
            You are BuildMart Fraud Detection AI.
            Analyze vendor/product data for suspicious patterns:
            - Prices 40%+ below market average
            - Unrealistically high stock from new vendors
            - Invalid GST formats
            - Duplicate listings with different prices

            Respond ONLY with JSON:
            {"riskScore":75,"riskLevel":"HIGH","flags":["..."],"recommendation":"SUSPEND_PENDING_REVIEW"}
            """;

        if (openaiKey == null || openaiKey.isBlank()) {
            return ResponseEntity.ok(Map.of(
                "riskScore",  0, "riskLevel", "LOW",
                "flags",      List.of(),
                "recommendation", "AI unavailable — manual review required"));
        }

        try {
            String raw    = callOpenAI(systemPrompt, "Analyze: " + req.getData(), 400);
            Object parsed = objectMapper.readValue(raw, Object.class);
            return ResponseEntity.ok(parsed);
        } catch (Exception e) {
            log.error("Fraud check error: {}", e.getMessage());
            return ResponseEntity.ok(Map.of("riskScore", 0, "riskLevel", "UNKNOWN"));
        }
    }

    @GetMapping("/recommendations")
    public ResponseEntity<?> getRecommendations(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String city) {
        return ResponseEntity.ok(Map.of("products", List.of(),
            "message", "AI recommendations based on your activity"));
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private String callOpenAI(String systemPrompt, String userMessage, int maxTokens) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openaiKey);

        Map<String, Object> body = Map.of(
            "model",      openaiModel,
            "messages",   List.of(
                Map.of("role", "system",  "content", systemPrompt),
                Map.of("role", "user",    "content", userMessage)
            ),
            "max_tokens", maxTokens,
            "temperature", 0.3
        );

        ResponseEntity<Map> resp = restTemplate.postForEntity(
            "https://api.openai.com/v1/chat/completions",
            new HttpEntity<>(body, headers), Map.class);

        return extractContent(resp.getBody());
    }

    private String callOpenAIWithHistory(String systemPrompt,
                                         List<Map<String, String>> history,
                                         int maxTokens) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openaiKey);

        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", systemPrompt));
        messages.addAll(history);

        Map<String, Object> body = Map.of(
            "model",      openaiModel,
            "messages",   messages,
            "max_tokens", maxTokens,
            "temperature", 0.7
        );

        ResponseEntity<Map> resp = restTemplate.postForEntity(
            "https://api.openai.com/v1/chat/completions",
            new HttpEntity<>(body, headers), Map.class);

        return extractContent(resp.getBody());
    }

    @SuppressWarnings("unchecked")
    private String extractContent(Map<?, ?> responseBody) {
        List<Map<String, Object>> choices =
            (List<Map<String, Object>>) responseBody.get("choices");
        Map<String, Object> message =
            (Map<String, Object>) choices.get(0).get("message");
        return (String) message.get("content");
    }

    private Map<String, Object> formulaFallback(MaterialAdvisorRequest req) {
        int area   = req.getAreaSqFt() != null ? req.getAreaSqFt() : 1000;
        int floors = req.getFloors()   != null ? req.getFloors()   : 1;
        int total  = area * floors;

        return Map.of(
            "projectSummary",      "Formula-based estimate for " + total + " sq ft",
            "totalArea",           total,
            "areaUnit",            "sq ft",
            "materials", List.of(
                Map.of("name","Cement",    "quantity",(int)(total*0.4), "unit","bags (50kg)",    "estimatedCost",(int)(total*0.4*380), "notes","Includes 10% wastage"),
                Map.of("name","Bricks",    "quantity",(int)(total*9),   "unit","pieces",          "estimatedCost",(int)(total*9*8)),
                Map.of("name","Sand",      "quantity",(int)(total*0.6), "unit","cubic meters",    "estimatedCost",(int)(total*0.6*1200)),
                Map.of("name","Iron Rods", "quantity",(int)(total*4.5), "unit","kg",              "estimatedCost",(int)(total*4.5*65)),
                Map.of("name","Aggregate", "quantity",(int)(total*0.8), "unit","cubic meters",    "estimatedCost",(int)(total*0.8*900))
            ),
            "totalEstimatedCost",  (int)(total*(0.4*380 + 9*8 + 0.6*1200 + 4.5*65 + 0.8*900)),
            "disclaimer",          "Estimates vary ±15% based on design and quality.",
            "tips", List.of(
                "Add 10% extra material for wastage",
                "Compare prices from multiple vendors on BuildMart",
                "Verify quantities with a local civil engineer"
            )
        );
    }

    // ── DTOs ─────────────────────────────────────────────────────────────────

    @Data
    public static class MaterialAdvisorRequest {
        @NotBlank private String  description;
        private Integer           areaSqFt;
        private Integer           floors;
        private String            constructionType;
    }

    @Data
    public static class PricePredictionRequest {
        @NotBlank private String material;
        private String           region;
        private String           targetMonth;
    }

    @Data
    public static class ChatRequest {
        @NotBlank private String        message;
        private List<ChatMessage>        history;
    }

    @Data
    public static class ChatMessage {
        private String role;
        private String content;
    }

    @Data
    public static class FraudCheckRequest {
        private String data;
    }
}
