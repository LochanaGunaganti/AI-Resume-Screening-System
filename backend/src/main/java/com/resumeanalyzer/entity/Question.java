package com.resumeanalyzer.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "sb_questions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long analysisId;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String question;

    @Column(nullable = false)
    private String difficulty; // easy | medium | hard
}
