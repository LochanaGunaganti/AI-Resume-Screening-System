import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { getAnalysis, getInterviewQuestions } from "../services/api";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { computeVerdict } from "../utils/helpers";
import ScoreCard from "../components/ScoreCard";
import SkillCard from "../components/SkillCard";
import VerdictCard from "../components/VerdictCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

function Section({ title, icon, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-100">
        <span className="text-lg">{icon}</span>
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function ListItem({ text, type }) {
  const colors = {
    strength: "text-green-700",
    weakness: "text-red-700",
    suggestion: "text-blue-700",
  };
  const bullets = { strength: "✓", weakness: "✗", suggestion: "→" };
  return (
    <li className={`flex items-start gap-2 text-sm ${colors[type] || "text-gray-700"}`}>
      <span className="font-bold mt-0.5 flex-shrink-0">{bullets[type] || "•"}</span>
      {text}
    </li>
  );
}

export default function AnalysisResult() {
  const [, setLocation] = useLocation();
  const [analysisId] = useLocalStorage("analysisId", null);
  const [candidateName] = useLocalStorage("candidateName", null);
  const [, setQuestions] = useLocalStorage("questions", null);

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [generatingQ, setGeneratingQ] = useState(false);

  const fetchAnalysis = async () => {
    if (!analysisId) { setLocation("/"); return; }
    setLoading(true); setError("");
    try {
      const data = await getAnalysis(analysisId);
      setAnalysis(data);
    } catch {
      setError("Failed to load analysis results.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAnalysis(); }, [analysisId]);

  const handleGenerateQuestions = async () => {
    setGeneratingQ(true);
    try {
      const data = await getInterviewQuestions(analysisId);
      setQuestions(data);
      setLocation("/interview-questions");
    } catch {
      setGeneratingQ(false);
    }
  };

  if (!analysisId) return null;

  if (loading) return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
      <LoadingSpinner message="Analysing your resume…" />
    </div>
  );

  if (error) return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
      <ErrorMessage message={error} onRetry={fetchAnalysis} />
    </div>
  );

  const verdict = computeVerdict(analysis.atsScore);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analysis Dashboard</h1>
            {candidateName && (
              <p className="text-gray-500 mt-1">Results for <span className="font-semibold text-gray-700">{candidateName}</span></p>
            )}
          </div>
          <button
            onClick={() => setLocation("/")}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            New Analysis
          </button>
        </div>

        {/* Section 1 — ATS Score */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 flex flex-col sm:flex-row items-center gap-8">
          <ScoreCard score={analysis.atsScore} />
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-bold text-gray-900 mb-2">ATS Compatibility Score</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              This score reflects how well your resume's keywords and skills align with the job description.
              A score above 75 is generally competitive for most applications.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-green-700">{analysis.matchedSkills.length}</p>
                <p className="text-xs text-green-600 font-medium">Skills Matched</p>
              </div>
              <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-red-700">{analysis.missingSkills.length}</p>
                <p className="text-xs text-red-600 font-medium">Skills Missing</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2 — Matched Skills */}
        <Section title="Matched Skills" icon="✅">
          {analysis.matchedSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {analysis.matchedSkills.map((skill) => (
                <SkillCard key={skill} skill={skill} type="matched" />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No matching skills detected.</p>
          )}
        </Section>

        {/* Section 3 — Missing Skills */}
        <Section title="Missing Skills" icon="⚠️">
          {analysis.missingSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {analysis.missingSkills.map((skill) => (
                <SkillCard key={skill} skill={skill} type="missing" />
              ))}
            </div>
          ) : (
            <p className="text-sm text-green-600 font-medium">All required skills are present in your resume.</p>
          )}
        </Section>

        {/* Section 4+5 — Strengths & Weaknesses */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Section title="Strengths" icon="💪">
            <ul className="space-y-2">
              {analysis.strengths.map((s, i) => <ListItem key={i} text={s} type="strength" />)}
            </ul>
          </Section>
          <Section title="Weaknesses" icon="🔍">
            <ul className="space-y-2">
              {analysis.weaknesses.map((w, i) => <ListItem key={i} text={w} type="weakness" />)}
            </ul>
          </Section>
        </div>

        {/* Section 6 — Improvement Suggestions */}
        <Section title="Improvement Suggestions" icon="💡">
          <ul className="space-y-2">
            {analysis.suggestions.map((s, i) => <ListItem key={i} text={s} type="suggestion" />)}
          </ul>
        </Section>

        {/* Section 7 — Candidate Verdict */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-100">
            <span className="text-lg">🏆</span>
            <h2 className="text-base font-semibold text-gray-900">Candidate Verdict</h2>
          </div>
          <div className="p-6">
            <VerdictCard verdict={verdict} />
          </div>
        </div>

        {/* CTA */}
        <div className="bg-blue-600 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Ready to prepare for the interview?</h3>
          <p className="text-blue-100 text-sm mb-6">Generate AI-tailored interview questions based on the job requirements and your skill profile.</p>
          <button
            onClick={handleGenerateQuestions}
            disabled={generatingQ}
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 disabled:opacity-70 transition-colors shadow-sm"
          >
            {generatingQ ? (
              <><span className="w-4 h-4 border-2 border-blue-300 border-t-blue-700 rounded-full animate-spin" />Generating…</>
            ) : (
              <>Generate Interview Questions <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
