package com.resumeanalyzer.controller;

import com.resumeanalyzer.dto.QuestionResponse;
import com.resumeanalyzer.service.InterviewQuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/interview")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewQuestionService interviewQuestionService;

    @GetMapping("/questions/{analysisId}")
    public ResponseEntity<QuestionResponse> getQuestions(@PathVariable Long analysisId) {
        return ResponseEntity.ok(interviewQuestionService.getOrGenerate(analysisId));
    }
}
