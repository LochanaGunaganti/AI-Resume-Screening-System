package com.resumeanalyzer.dto;

import lombok.Data;

@Data
public class JobDescriptionRequest {
    private String jobTitle;
    private String experienceRequired;
    private String eligibility;
    private String requiredSkills;
    private String preferredSkills;
    private String responsibilities;
    // Plain-text fallback (used when frontend sends combined text)
    private String description;
}
