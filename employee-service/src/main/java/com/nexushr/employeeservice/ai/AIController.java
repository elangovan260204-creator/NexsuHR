
package com.nexushr.employeeservice.ai;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final GeminiService geminiService;

    public AIController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping("/insights")
    public ResponseEntity<Map<String, String>> generateInsights(
            @RequestBody Map<String, String> request) {

        String prompt = request.get("prompt");

        if (prompt == null || prompt.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Prompt is required"));
        }

        if (prompt.length() > 5000) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Prompt must not exceed 5000 characters"));
        }

        try {
            String insight = geminiService.generateInsight(
                    "You are NexusHR, an HR workforce intelligence assistant. "
                    + "Provide clear, professional, evidence-based HR insights. "
                    + "Do not invent employee data or make unsupported conclusions.\n\n"
                    + prompt
            );

            return ResponseEntity.ok(Map.of("insight", insight));

        } catch (IllegalStateException exception) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("message", exception.getMessage()));

        } catch (Exception exception) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body(Map.of("message",
                            "Unable to generate AI insights. Check the API configuration and try again."));
        }
    }
}
