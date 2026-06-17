package com.resumeanalyzer.utility;

import jakarta.annotation.PostConstruct;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Component
public class SkillExtractor {

    private final List<String> masterSkills = new ArrayList<>();

    @PostConstruct
    public void loadSkills() {
        try {
            ClassPathResource resource = new ClassPathResource("skills.txt");
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    line = line.trim();
                    if (!line.isEmpty()) masterSkills.add(line);
                }
            }
        } catch (Exception e) {
            // Fallback minimal list
            masterSkills.addAll(List.of("Java", "Spring Boot", "MySQL", "REST API", "Docker", "Git"));
        }
    }

    /** Extract skills present in the given text (case-insensitive). */
    public List<String> extractFromText(String text) {
        if (text == null || text.isBlank()) return List.of();
        String lower = text.toLowerCase(Locale.ROOT);
        List<String> found = new ArrayList<>();
        for (String skill : masterSkills) {
            if (containsWord(lower, skill.toLowerCase(Locale.ROOT))) {
                found.add(skill);
            }
        }
        return found;
    }

    /** Extract skills from a comma/newline-separated string (JD required skills field). */
    public List<String> extractFromCsv(String csv) {
        if (csv == null || csv.isBlank()) return List.of();
        List<String> result = new ArrayList<>();
        for (String part : csv.split("[,\n]")) {
            String skill = part.trim();
            if (!skill.isEmpty()) result.add(skill);
        }
        return result;
    }

    private boolean containsWord(String text, String word) {
        int idx = text.indexOf(word);
        while (idx != -1) {
            boolean before = idx == 0 || !Character.isLetterOrDigit(text.charAt(idx - 1));
            boolean after = idx + word.length() >= text.length()
                    || !Character.isLetterOrDigit(text.charAt(idx + word.length()));
            if (before && after) return true;
            idx = text.indexOf(word, idx + 1);
        }
        return false;
    }

    public List<String> getMasterSkills() {
        return masterSkills;
    }
}
