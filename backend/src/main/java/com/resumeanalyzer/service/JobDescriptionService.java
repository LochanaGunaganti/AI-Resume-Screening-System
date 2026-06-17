package com.resumeanalyzer.service;

import com.resumeanalyzer.dto.JobDescriptionRequest;
import com.resumeanalyzer.entity.JobDescription;
import com.resumeanalyzer.repository.JobDescriptionRepository;
import com.resumeanalyzer.utility.PdfExtractor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class JobDescriptionService {

    private final JobDescriptionRepository jobDescriptionRepository;
    private final PdfExtractor pdfExtractor;

    public Map<String, Long> create(JobDescriptionRequest req) {
        String description = buildDescription(req);

        JobDescription jd = jobDescriptionRepository.save(JobDescription.builder()
                .jobTitle(req.getJobTitle())
                .experienceRequired(req.getExperienceRequired())
                .eligibility(req.getEligibility())
                .requiredSkills(req.getRequiredSkills())
                .preferredSkills(req.getPreferredSkills())
                .responsibilities(req.getResponsibilities())
                .description(description)
                .build());

        return Map.of("jobDescriptionId", jd.getId());
    }

    public Map<String, Long> uploadPdf(MultipartFile file) {
        String text = pdfExtractor.extract(file);

        JobDescription jd = jobDescriptionRepository.save(JobDescription.builder()
                .description(text)
                .build());

        return Map.of("jobDescriptionId", jd.getId());
    }

    private String buildDescription(JobDescriptionRequest req) {
        if (req.getDescription() != null && !req.getDescription().isBlank()) {
            return req.getDescription();
        }
        StringBuilder sb = new StringBuilder();
        if (req.getJobTitle() != null)       sb.append("Job Title: ").append(req.getJobTitle()).append("\n\n");
        if (req.getExperienceRequired() != null) sb.append("Experience Required:\n").append(req.getExperienceRequired()).append("\n\n");
        if (req.getEligibility() != null)    sb.append("Eligibility:\n").append(req.getEligibility()).append("\n\n");
        if (req.getRequiredSkills() != null) sb.append("Required Skills:\n").append(req.getRequiredSkills()).append("\n\n");
        if (req.getPreferredSkills() != null) sb.append("Preferred Skills:\n").append(req.getPreferredSkills()).append("\n\n");
        if (req.getResponsibilities() != null) sb.append("Responsibilities:\n").append(req.getResponsibilities());
        return sb.toString().trim();
    }
}
