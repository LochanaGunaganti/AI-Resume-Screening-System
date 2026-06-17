CREATE DATABASE IF NOT EXISTS resume_analyzer;

USE resume_analyzer;

CREATE TABLE resume (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    candidate_name VARCHAR(100),
    resume_text LONGTEXT,
    skills JSON,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE job_description (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    job_title VARCHAR(255),
    experience_required VARCHAR(50),
    eligibility TEXT,
    required_skills TEXT,
    preferred_skills TEXT,
    responsibilities TEXT,
    description LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE analysis (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    resume_id BIGINT,
    job_description_id BIGINT,

    ats_score INT,

    matched_skills JSON,
    missing_skills JSON,

    strengths JSON,
    weaknesses JSON,
    suggestions JSON,

    candidate_verdict VARCHAR(100),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (resume_id) REFERENCES resume(id),
    FOREIGN KEY (job_description_id) REFERENCES job_description(id)
);

CREATE TABLE question (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    analysis_id BIGINT,

    question TEXT,
    difficulty VARCHAR(20),

    FOREIGN KEY (analysis_id) REFERENCES analysis(id)
);