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

<img width="1599" height="1599" alt="image" src="https://github.com/user-attachments/assets/7cba1294-9615-4adb-b0de-bbcae3ba6359" />
<img width="1599" height="1599" alt="image" src="https://github.com/user-attachments/assets/35ff1b5a-ab75-4bcb-bcca-785c5c272ca0" />
<img width="1599" height="1599" alt="image" src="https://github.com/user-attachments/assets/02571e9c-432e-4aa3-a731-79a90bee6ce7" />
<img width="1600" height="634" alt="image" src="https://github.com/user-attachments/assets/c562a59b-f209-42c3-9020-d317691b2592" />
<img width="1599" height="1599" alt="image" src="https://github.com/user-attachments/assets/fd986358-fdd5-416b-b4cd-6752cd7dad73" />
<img width="1600" height="769" alt="image" src="https://github.com/user-attachments/assets/6f50daa2-369a-48b2-8e21-47bef6709c51" />



## Future Enhancements

* Analysis History Dashboard
* PDF Report Download
* Authentication System
* Backup AI Provider Integration

## Author

Gunaganti Lochana
