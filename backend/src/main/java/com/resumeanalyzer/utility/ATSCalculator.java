package com.resumeanalyzer.utility;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Component
public class ATSCalculator {

    public List<String> getMatched(List<String> resumeSkills, List<String> requiredSkills) {
        List<String> matched = new ArrayList<>();
        for (String req : requiredSkills) {
            if (resumeSkills.stream().anyMatch(rs -> rs.equalsIgnoreCase(req))) {
                matched.add(req);
            }
        }
        return matched;
    }

    public List<String> getMissing(List<String> resumeSkills, List<String> requiredSkills) {
        List<String> missing = new ArrayList<>();
        for (String req : requiredSkills) {
            if (resumeSkills.stream().noneMatch(rs -> rs.equalsIgnoreCase(req))) {
                missing.add(req);
            }
        }
        return missing;
    }

    public int calculateScore(List<String> matched, List<String> required) {
        if (required == null || required.isEmpty()) return 0;
        return (int) Math.round((matched.size() * 100.0) / required.size());
    }
}
