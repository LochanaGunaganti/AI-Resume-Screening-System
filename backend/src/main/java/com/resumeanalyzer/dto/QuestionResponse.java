package com.resumeanalyzer.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class QuestionResponse {
    private List<String> easy;
    private List<String> medium;
    private List<String> hard;
}
