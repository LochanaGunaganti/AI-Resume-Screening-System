package com.resumeanalyzer.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ResumeResponse {
    private Long resumeId;
    private String candidateName;
}
