package com.resumeanalyzer.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.resumeanalyzer.config.GeminiConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GeminiService {

    private final GeminiConfig geminiConfig;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public record AnalysisResult(
            List<String> strengths,
            List<String> weaknesses,
            List<String> suggestions,
            String candidateVerdict
    ) {}

    public record QuestionResult(
            List<String> easy,
            List<String> medium,
            List<String> hard
    ) {}

    // ── Analysis prompt ───────────────────────────────────────────────────────

    public AnalysisResult generateAnalysis(String prompt,
                                       List<String> matchedSkills,
                                       List<String> missingSkills,
                                       int atsScore) {
    try {
        String raw = callGemini(prompt);
        JsonNode json = objectMapper.readTree(extractJson(raw));

        return new AnalysisResult(
                toList(json.get("strengths")),
                toList(json.get("weaknesses")),
                toList(json.get("suggestions")),
                json.get("candidateVerdict").asText("Moderate Match")
        );

    } catch (Exception e) {
        e.printStackTrace();
        throw new RuntimeException("Failed to generate analysis using Gemini API", e);
    }
}

    // ── Interview questions prompt ────────────────────────────────────────────

    public QuestionResult generateQuestions(String prompt,
                                        List<String> matchedSkills,
                                        List<String> missingSkills) {
    try {
        String raw = callGemini(prompt);
        JsonNode json = objectMapper.readTree(extractJson(raw));

        return new QuestionResult(
                toList(json.get("easy")),
                toList(json.get("medium")),
                toList(json.get("hard"))
        );

    } catch (Exception e) {
        e.printStackTrace();
        throw new RuntimeException("Failed to generate interview questions using Gemini API", e);
    }
}

    // ── Gemini HTTP call ─────────────────────────────────────────────────────

    private String callGemini(String prompt) throws Exception {
    System.out.println("Calling Gemini API...");

    String url = geminiConfig.getApiUrl() + "?key=" + geminiConfig.getApiKey();

    String body = objectMapper.writeValueAsString(Map.of(
            "contents", List.of(Map.of(
                    "parts", List.of(Map.of("text", prompt))
            ))
    ));

    HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(url))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(body))
            .build();

    HttpResponse<String> response = HttpClient.newHttpClient()
            .send(request, HttpResponse.BodyHandlers.ofString());

    if (response.statusCode() != 200) {
        throw new RuntimeException(
                "Gemini API Error: " +
                response.statusCode() +
                " -> " +
                response.body()
        );
    }

    JsonNode root = objectMapper.readTree(response.body());

    return root.at("/candidates/0/content/parts/0/text").asText();
}

    private String extractJson(String text) {
        int start = text.indexOf('{');
        int end = text.lastIndexOf('}');
        if (start == -1 || end == -1) return "{}";
        return text.substring(start, end + 1);
    }

    private List<String> toList(JsonNode node) {
        List<String> list = new ArrayList<>();
        if (node != null && node.isArray()) {
            node.forEach(n -> list.add(n.asText()));
        }
        return list;
    }

    

}