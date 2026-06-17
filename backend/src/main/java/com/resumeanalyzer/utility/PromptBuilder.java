package com.resumeanalyzer.utility;

import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PromptBuilder {

    public String buildAnalysisPrompt(String resumeText, String jdText,
                                      List<String> matchedSkills, List<String> missingSkills,
                                      int atsScore) {
        return """
                You are an expert HR consultant and resume analyst.
                Analyze the following resume against the job description.

                ATS Score: %d%%
                Matched Skills: %s
                Missing Skills: %s

                Resume:
                %s

                Job Description:
                %s

                Return ONLY a valid JSON object (no markdown, no explanation) with this exact structure:
                {
                  "strengths": ["strength1", "strength2", "strength3"],
                  "weaknesses": ["weakness1", "weakness2"],
                  "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
                  "candidateVerdict": "Strong Match"
                }

                candidateVerdict must be exactly one of: "Strong Match", "Moderate Match", or "Weak Match"
                based on the ATS score: >= 80 = Strong Match, >= 60 = Moderate Match, < 60 = Weak Match.
                """.formatted(atsScore, matchedSkills, missingSkills,
                truncate(resumeText, 2000), truncate(jdText, 1000));
    }

    public String buildInterviewPrompt(String jobTitle, List<String> matchedSkills,
                                       List<String> missingSkills, String resumeText) {
        return """
                You are an expert technical interviewer.
                Generate interview questions for a %s role.

                Candidate's matched skills: %s
                Candidate's missing skills (focus harder questions here): %s

                Return ONLY a valid JSON object (no markdown) with this exact structure:
                {
                  "easy": ["question1", "question2", "question3", "question4", "question5"],
                  "medium": ["question1", "question2", "question3", "question4", "question5"],
                  "hard": ["question1", "question2", "question3", "question4", "question5"]
                }

                Easy: Basic conceptual questions about the matched skills.
                Medium: Intermediate application-level questions.
                Hard: Advanced design/architecture questions, focusing on missing skills.
                """.formatted(jobTitle, matchedSkills, missingSkills);
    }

    private String truncate(String text, int maxLen) {
        if (text == null) return "";
        return text.length() > maxLen ? text.substring(0, maxLen) + "..." : text;
    }
}
