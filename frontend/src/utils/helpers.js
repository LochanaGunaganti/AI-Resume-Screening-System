import { MAX_FILE_SIZE_BYTES, ACCEPTED_EXT } from "./constants";

export function validatePdfFile(file) {
  if (!file) return "No file selected.";
  const ext = "." + file.name.split(".").pop().toLowerCase();
  if (!ACCEPTED_EXT.includes(ext)) return "Only PDF files are allowed.";
  if (file.size > MAX_FILE_SIZE_BYTES) return `Maximum file size is ${MAX_FILE_SIZE_BYTES / 1024 / 1024} MB.`;
  return null;
}

export function buildJdText({ jobTitle, experience, eligibility, requiredSkills, preferredSkills, responsibilities }) {
  const lines = [`Job Title: ${jobTitle}`];
  if (experience) lines.push(`\nExperience Required:\n${experience}`);
  if (eligibility) lines.push(`\nEligibility:\n${eligibility}`);
  if (requiredSkills) lines.push(`\nRequired Skills:\n${requiredSkills}`);
  if (preferredSkills) lines.push(`\nPreferred Skills:\n${preferredSkills}`);
  if (responsibilities) lines.push(`\nResponsibilities:\n${responsibilities}`);
  return lines.join("\n");
}

export function computeVerdict(atsScore) {
  if (atsScore >= 80) {
    return {
      level: "strong",
      label: "Strong Match",
      color: "green",
      message: `Candidate matches ${atsScore}% of required skills. Recommended for interview.`,
    };
  }
  if (atsScore >= 60) {
    return {
      level: "moderate",
      label: "Moderate Match",
      color: "yellow",
      message: `Candidate shows potential but has notable skill gaps (${atsScore}% match). Consider for a junior or trainee role.`,
    };
  }
  return {
    level: "weak",
    label: "Weak Match",
    color: "red",
    message: `Candidate does not meet the minimum skill requirements (${atsScore}% match). Not recommended at this stage.`,
  };
}

export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
