package com.resumeanalyzer.controller;

import com.resumeanalyzer.dto.JobDescriptionRequest;
import com.resumeanalyzer.service.JobDescriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/job-descriptions")
@RequiredArgsConstructor
public class JobDescriptionController {

    private final JobDescriptionService jobDescriptionService;

    @PostMapping
    public ResponseEntity<Map<String, Long>> create(@RequestBody JobDescriptionRequest request) {
        return ResponseEntity.ok(jobDescriptionService.create(request));
    }

    @PostMapping("/upload-pdf")
    public ResponseEntity<Map<String, Long>> uploadPdf(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(jobDescriptionService.uploadPdf(file));
    }
}
