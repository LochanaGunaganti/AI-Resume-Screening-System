package com.resumeanalyzer.service;

import com.resumeanalyzer.dto.AnalysisRequest;
import com.resumeanalyzer.dto.AnalysisResponse;
import com.resumeanalyzer.entity.Analysis;
import com.resumeanalyzer.entity.JobDescription;
import com.resumeanalyzer.entity.Resume;
import com.resumeanalyzer.exception.ResourceNotFoundException;
import com.resumeanalyzer.repository.AnalysisRepository;
import com.resumeanalyzer.repository.JobDescriptionRepository;
import com.resumeanalyzer.repository.ResumeRepository;
import com.resumeanalyzer.utility.PromptBuilder;
import com.resumeanalyzer.utility.SkillExtractor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AnalysisService {

    private final ResumeRepository resumeRepository;
    private final JobDescriptionRepository jobDescriptionRepository;
    private final AnalysisRepository analysisRepository;
    private final ATSService atsService;
    private final GeminiService geminiService;
    private final SkillExtractor skillExtractor;
    private final PromptBuilder promptBuilder;

    public Map<String, Long> analyze(AnalysisRequest request) {
        Resume resume = resumeRepository.findById(request.getResumeId())
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found: " + request.getResumeId()));

        JobDescription jd = jobDescriptionRepository.findById(request.getJobDescriptionId())
                .orElseThrow(() -> new ResourceNotFoundException("Job Description not found: " + request.getJobDescriptionId()));

        // Extract skills
        List<String> resumeSkills = resume.getSkills() != null && !resume.getSkills().isEmpty()
                ? resume.getSkills()
                : skillExtractor.extractFromText(resume.getResumeText());

        List<String> requiredSkills = resolveRequiredSkills(jd);

        // ATS computation
        List<String> matched = atsService.getMatched(resumeSkills, requiredSkills);
        List<String> missing = atsService.getMissing(resumeSkills, requiredSkills);
        int score = atsService.calculateScore(matched, requiredSkills);

        // AI analysis
        String prompt = promptBuilder.buildAnalysisPrompt(
                resume.getResumeText(), jd.getDescription(), matched, missing, score);
        GeminiService.AnalysisResult ai = geminiService.generateAnalysis(prompt, matched, missing, score);

        Analysis analysis = analysisRepository.save(Analysis.builder()
                .resumeId(resume.getId())
                .jobDescriptionId(jd.getId())
                .atsScore(score)
                .matchedSkills(matched)
                .missingSkills(missing)
                .strengths(ai.strengths())
                .weaknesses(ai.weaknesses())
                .suggestions(ai.suggestions())
                .candidateVerdict(ai.candidateVerdict())
                .build());

        return Map.of("analysisId", analysis.getId());
    }

    public AnalysisResponse getById(Long analysisId) {
        Analysis analysis = analysisRepository.findById(analysisId)
                .orElseThrow(() -> new ResourceNotFoundException("Analysis not found: " + analysisId));

        return AnalysisResponse.builder()
                .analysisId(analysis.getId())
                .atsScore(analysis.getAtsScore())
                .matchedSkills(analysis.getMatchedSkills())
                .missingSkills(analysis.getMissingSkills())
                .strengths(analysis.getStrengths())
                .weaknesses(analysis.getWeaknesses())
                .suggestions(analysis.getSuggestions())
                .candidateVerdict(analysis.getCandidateVerdict())
                .build();
    }

    private List<String> resolveRequiredSkills(JobDescription jd) {
        if (jd.getRequiredSkills() != null && !jd.getRequiredSkills().isBlank()) {
            return skillExtractor.extractFromCsv(jd.getRequiredSkills());
        }
        return skillExtractor.extractFromText(jd.getDescription());
    }
}
