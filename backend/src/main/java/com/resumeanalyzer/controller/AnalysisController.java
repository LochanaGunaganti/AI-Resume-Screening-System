package com.resumeanalyzer.controller;

import com.resumeanalyzer.dto.AnalysisRequest;
import com.resumeanalyzer.dto.AnalysisResponse;
import com.resumeanalyzer.service.AnalysisService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/analysis")
@RequiredArgsConstructor
public class AnalysisController {

    private final AnalysisService analysisService;

    @PostMapping
    public ResponseEntity<Map<String, Long>> analyze(@Valid @RequestBody AnalysisRequest request) {
        return ResponseEntity.ok(analysisService.analyze(request));
    }

    @GetMapping("/{analysisId}")
    public ResponseEntity<AnalysisResponse> getAnalysis(@PathVariable Long analysisId) {
        return ResponseEntity.ok(analysisService.getById(analysisId));
    }

    @GetMapping("/healthz")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "ok"));
    }
}
