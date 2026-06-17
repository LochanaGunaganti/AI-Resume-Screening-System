package com.resumeanalyzer.service;

import com.resumeanalyzer.dto.ResumeResponse;
import com.resumeanalyzer.entity.Resume;
import com.resumeanalyzer.repository.ResumeRepository;
import com.resumeanalyzer.utility.PdfExtractor;
import com.resumeanalyzer.utility.SkillExtractor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final PdfExtractor pdfExtractor;
    private final SkillExtractor skillExtractor;

    public ResumeResponse upload(MultipartFile file) {
        String text = pdfExtractor.extract(file);
        String candidateName = deriveName(file.getOriginalFilename());
        List<String> skills = skillExtractor.extractFromText(text);

        Resume resume = resumeRepository.save(Resume.builder()
                .candidateName(candidateName)
                .resumeText(text)
                .skills(skills)
                .build());

        return new ResumeResponse(resume.getId(), resume.getCandidateName());
    }

    private String deriveName(String filename) {
        if (filename == null) return "Candidate";
        String base = filename.replaceAll("(?i)\\.pdf$", "");
        return Arrays.stream(base.split("[_\\-\\s]+"))
                .map(w -> w.isEmpty() ? "" : Character.toUpperCase(w.charAt(0)) + w.substring(1).toLowerCase())
                .collect(Collectors.joining(" "))
                .trim();
    }
}
