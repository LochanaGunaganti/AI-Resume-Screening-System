import axios from "axios";

const API_BASE = "http://localhost:8080/api";

const api = axios.create({ baseURL: API_BASE });

// ─── Mock data (fallback when backend is unavailable) ───────────────────────
const MOCK_ANALYSIS = {
  analysisId: 0,
  atsScore: 82,
  matchedSkills: ["Java", "Spring Boot", "MySQL", "REST APIs", "Git"],
  missingSkills: ["Docker", "Kubernetes", "AWS"],
  strengths: [
    "Strong Java foundation with hands-on project experience",
    "Good knowledge of SQL and database design",
    "Solid understanding of Spring Boot and REST API development",
  ],
  weaknesses: [
    "No containerisation or Docker experience",
    "No cloud platform exposure (AWS / Azure / GCP)",
  ],
  suggestions: [
    "Build and deploy a Dockerised Spring Boot project on GitHub",
    "Obtain an AWS Cloud Practitioner certification",
    "Add Kubernetes basics to your skill set",
    "Mention REST API design patterns explicitly in your resume",
  ],
};

const MOCK_QUESTIONS = {
  easy: [
    "What is Java and why is it considered platform-independent?",
    "Explain the difference between JDK, JRE, and JVM.",
    "What is Spring Boot and how does it differ from Spring MVC?",
    "What is a REST API? Describe the key HTTP methods.",
    "What is a primary key in a relational database?",
  ],
  medium: [
    "Explain Dependency Injection and how Spring implements it.",
    "How does Spring Boot auto-configuration work?",
    "Describe the difference between @RestController and @Controller.",
    "How do you handle exceptions globally in a Spring Boot application?",
    "Explain database indexing and when you would use it.",
  ],
  hard: [
    "Design a scalable microservices architecture for an e-commerce platform using Spring Boot.",
    "How would you implement JWT authentication in a Spring Boot REST API?",
    "Explain the CAP theorem and how it applies to distributed systems.",
    "How would you migrate a monolithic application to microservices with zero downtime?",
    "Describe how you would optimise a slow SQL query returning 1 million rows.",
  ],
};

// ─── Resume ──────────────────────────────────────────────────────────────────
export async function uploadResume(file) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await axios.post(`${API_BASE}/resumes/upload`, formData);
  return data; // { resumeId, candidateName }
}

// ─── Job Description ─────────────────────────────────────────────────────────
export async function createJobDescription(description) {
  const { data } = await api.post("/job-descriptions", { description });
  return data; // { jobDescriptionId }
}

export async function uploadJdPdf(file) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await axios.post(`${API_BASE}/job-descriptions/upload-pdf`, formData);
  return data; // { jobDescriptionId, description }
}

// ─── Analysis ────────────────────────────────────────────────────────────────
export async function analyzeResume(resumeId, jobDescriptionId) {
  const { data } = await api.post("/analysis", { resumeId, jobDescriptionId });
  return data; // { analysisId }
}

export async function getAnalysis(analysisId) {
  try {
    const { data } = await api.get(`/analysis/${analysisId}`);
    return data;
  } catch {
    return { ...MOCK_ANALYSIS, analysisId };
  }
}

export async function getInterviewQuestions(analysisId) {
  try {
    const { data } = await api.get(`/interview/questions/${analysisId}`);
    return data;
  } catch {
    return MOCK_QUESTIONS;
  }
}
