package com.resumeanalyzer.service;

import com.resumeanalyzer.dto.QuestionResponse;
import com.resumeanalyzer.entity.Analysis;
import com.resumeanalyzer.entity.JobDescription;
import com.resumeanalyzer.entity.Question;
import com.resumeanalyzer.exception.ResourceNotFoundException;
import com.resumeanalyzer.repository.AnalysisRepository;
import com.resumeanalyzer.repository.JobDescriptionRepository;
import com.resumeanalyzer.repository.QuestionRepository;
import com.resumeanalyzer.utility.PromptBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InterviewQuestionService {

    private final AnalysisRepository analysisRepository;
    private final JobDescriptionRepository jobDescriptionRepository;
    private final QuestionRepository questionRepository;
    private final GeminiService geminiService;
    private final PromptBuilder promptBuilder;

    public QuestionResponse getOrGenerate(Long analysisId) {
        // Return cached questions if already generated
        if (questionRepository.existsByAnalysisId(analysisId)) {
            return buildResponse(questionRepository.findByAnalysisId(analysisId));
        }

        Analysis analysis = analysisRepository.findById(analysisId)
                .orElseThrow(() -> new ResourceNotFoundException("Analysis not found: " + analysisId));

        JobDescription jd = jobDescriptionRepository.findById(analysis.getJobDescriptionId())
                .orElseThrow(() -> new ResourceNotFoundException("Job Description not found"));

        String jobTitle = jd.getJobTitle() != null ? jd.getJobTitle() : "Software Developer";

        String prompt = promptBuilder.buildInterviewPrompt(
                jobTitle, analysis.getMatchedSkills(), analysis.getMissingSkills(), null);

        GeminiService.QuestionResult result = geminiService.generateQuestions(
                prompt, analysis.getMatchedSkills(), analysis.getMissingSkills());

        // Persist
        saveQuestions(analysisId, result.easy(), "easy");
        saveQuestions(analysisId, result.medium(), "medium");
        saveQuestions(analysisId, result.hard(), "hard");

        return QuestionResponse.builder()
                .easy(result.easy())
                .medium(result.medium())
                .hard(result.hard())
                .build();
    }

    private void saveQuestions(Long analysisId, List<String> questions, String difficulty) {
        questions.forEach(q -> questionRepository.save(Question.builder()
                .analysisId(analysisId)
                .question(q)
                .difficulty(difficulty)
                .build()));
    }

    private QuestionResponse buildResponse(List<Question> questions) {
        return QuestionResponse.builder()
                .easy(filter(questions, "easy"))
                .medium(filter(questions, "medium"))
                .hard(filter(questions, "hard"))
                .build();
    }

    private List<String> filter(List<Question> questions, String difficulty) {
        return questions.stream()
                .filter(q -> difficulty.equals(q.getDifficulty()))
                .map(Question::getQuestion)
                .collect(Collectors.toList());
    }
}
