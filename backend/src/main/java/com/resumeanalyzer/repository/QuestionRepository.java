package com.resumeanalyzer.repository;

import com.resumeanalyzer.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByAnalysisId(Long analysisId);
    boolean existsByAnalysisId(Long analysisId);
}
