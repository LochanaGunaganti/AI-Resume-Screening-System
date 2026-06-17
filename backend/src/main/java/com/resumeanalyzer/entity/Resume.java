package com.resumeanalyzer.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "sb_resumes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String candidateName;

    @Column(columnDefinition = "TEXT")
    private String resumeText;

    @Convert(converter = StringListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<String> skills;

    @Column(nullable = false)
    private LocalDateTime uploadDate;

    @PrePersist
    protected void onCreate() {
        uploadDate = LocalDateTime.now();
    }
}
