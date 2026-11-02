
package com.nexushr.employeeservice.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    public GeminiService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(20))
                .build();
    }

    public String generateInsight(String prompt) throws Exception {
        String apiKey = System.getenv("GEMINI_API_KEY");

        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException(
                    "GEMINI_API_KEY environment variable is not configured");
        }

        
            String url =
                    "https://generativelanguage.googleapis.com/v1beta/models/"
                    + "gemini-3.5-flash:generateContent?key=" + apiKey;


        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", prompt)
                        ))
                )
        );

        String jsonBody = objectMapper.writeValueAsString(requestBody);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .timeout(Duration.ofSeconds(60))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .build();

        HttpResponse<String> response = httpClient.send(
                request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() < 200 || response.statusCode() >= 300) {
    throw new IllegalStateException(
            "Gemini API request failed with HTTP "
            + response.statusCode()
            + ": " + response.body());
}

        JsonNode root = objectMapper.readTree(response.body());
        JsonNode textNode = root.at("/candidates/0/content/parts/0/text");

        if (textNode.isMissingNode() || textNode.isNull()) {
            throw new IllegalStateException(
                    "Gemini returned no text. Check the API response.");
        }

        return textNode.asText();
    }
}
