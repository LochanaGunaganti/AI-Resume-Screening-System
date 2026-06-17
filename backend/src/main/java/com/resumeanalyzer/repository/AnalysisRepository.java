package com.resumeanalyzer.repository;

import com.resumeanalyzer.entity.Analysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnalysisRepository extends JpaRepository<Analysis, Long> {
}
