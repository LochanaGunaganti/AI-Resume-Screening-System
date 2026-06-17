# AI-Resume Screening System

## Overview

AI-Powered Resume Screening & Interview Preparation System is a full-stack application that analyzes resumes against job descriptions, calculates ATS scores, identifies skill gaps, and generates personalized interview questions using Gemini AI.

## Features

* Upload Resume PDF
* Upload Job Description PDF
* Enter Job Description manually
* ATS Score Calculation
* Skill Matching
* Missing Skill Detection
* AI-generated Strengths and Weaknesses
* AI-generated Suggestions
* AI-generated Interview Questions
* PostgreSQL Database Integration
* Responsive React UI

## Tech Stack

### Frontend

* React.js
* Axios
* Vite
* Tailwind CSS

### Backend

* Spring Boot
* Spring Data JPA
* Maven

### Database

* PostgreSQL

### AI

* Google Gemini API

## Architecture

```text
React Frontend
       ↓
Spring Boot REST APIs
       ↓
PostgreSQL Database

       ↓
Gemini API
```

## Project Workflow

1. Upload Resume
2. Upload or Enter Job Description
3. ATS Score Calculation
4. Skill Gap Analysis
5. AI-based Suggestions
6. AI-generated Interview Questions

## Installation

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

### Backend

```bash
mvn clean install
mvn spring-boot:run
```

## Screenshots

<img width="1599" height="1599" alt="image" src="https://github.com/user-attachments/assets/7f40ccb4-f882-4a6a-99b2-2572c7f36ea0" />
<img width="1599" height="1599" alt="image" src="https://github.com/user-attachments/assets/c1dbc134-cc7a-48f3-84d3-b6a595833df6" />
<img width="1599" height="1599" alt="image" src="https://github.com/user-attachments/assets/b547f0b8-c2e8-4b54-91ce-db6a8ddc55c7" />
<img width="1600" height="634" alt="image" src="https://github.com/user-attachments/assets/96a4302d-5f10-4619-92ab-75bf3b7352f7" />
<img width="1599" height="1599" alt="image" src="https://github.com/user-attachments/assets/858e7bf1-618e-4ccf-bde8-ce31eb7c788f" />
<img width="1600" height="769" alt="image" src="https://github.com/user-attachments/assets/ad7bd6a6-bf3c-4451-b69f-f7854e0f4e50" />


## Future Enhancements

* Analysis History Dashboard
* PDF Report Download
* Authentication System
* Backup AI Provider Integration

## Author

Gunaganti Lochana
