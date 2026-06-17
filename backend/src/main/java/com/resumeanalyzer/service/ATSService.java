package com.resumeanalyzer.service;

import com.resumeanalyzer.utility.ATSCalculator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ATSService {

    private final ATSCalculator atsCalculator;

    public List<String> getMatched(List<String> resumeSkills, List<String> requiredSkills) {
        return atsCalculator.getMatched(resumeSkills, requiredSkills);
    }

    public List<String> getMissing(List<String> resumeSkills, List<String> requiredSkills) {
        return atsCalculator.getMissing(resumeSkills, requiredSkills);
    }

    public int calculateScore(List<String> matched, List<String> required) {
        return atsCalculator.calculateScore(matched, required);
    }
}
