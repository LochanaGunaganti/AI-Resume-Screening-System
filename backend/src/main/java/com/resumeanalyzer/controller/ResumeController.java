package com.resumeanalyzer.controller;

import com.resumeanalyzer.dto.ResumeResponse;
import com.resumeanalyzer.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    @PostMapping("/upload")
    public ResponseEntity<ResumeResponse> upload(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(resumeService.upload(file));
    }
}
