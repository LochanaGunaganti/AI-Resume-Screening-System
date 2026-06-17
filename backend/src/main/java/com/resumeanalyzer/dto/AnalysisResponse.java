package com.resumeanalyzer.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AnalysisResponse {
    private Long analysisId;
    private int atsScore;
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private List<String> strengths;
    private List<String> weaknesses;
    private List<String> suggestions;
    private String candidateVerdict;
}
