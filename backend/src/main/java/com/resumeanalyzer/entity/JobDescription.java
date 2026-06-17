package com.resumeanalyzer.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "sb_job_descriptions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobDescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String jobTitle;
    private String experienceRequired;

    @Column(columnDefinition = "TEXT")
    private String eligibility;

    @Column(columnDefinition = "TEXT")
    private String requiredSkills;

    @Column(columnDefinition = "TEXT")
    private String preferredSkills;

    @Column(columnDefinition = "TEXT")
    private String responsibilities;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
