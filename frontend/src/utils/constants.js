export const MAX_FILE_SIZE_MB = 20;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const ACCEPTED_MIME = ["application/pdf"];
export const ACCEPTED_EXT = [".pdf"];

export const SAMPLE_JD = {
  jobTitle: "Senior Java Developer",
  experience: "3-5 Years",
  eligibility:
    "B.Tech / B.E. in Computer Science, IT, or related field\nMinimum 60% throughout academics\nStrong understanding of OOP principles",
  requiredSkills: "Java\nSpring Boot\nMySQL\nREST APIs\nJUnit",
  preferredSkills: "Docker\nKubernetes\nAWS\nRedis\nKafka",
  responsibilities:
    "Design and develop scalable backend services using Java and Spring Boot\nBuild and maintain RESTful APIs\nOptimise database queries and schema design in MySQL\nWrite unit and integration tests\nCollaborate with frontend and DevOps teams",
};

export const VERDICT_LABELS = {
  strong: "Strong Match",
  moderate: "Moderate Match",
  weak: "Weak Match",
};
