import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { getInterviewQuestions } from "../services/api";
import { useLocalStorage } from "../hooks/useLocalStorage";
import QuestionCard from "../components/QuestionCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

const TABS = [
  { key: "easy", label: "Easy", color: "text-green-700", bg: "bg-green-50", border: "border-green-200", activeBg: "bg-green-600" },
  { key: "medium", label: "Medium", color: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-200", activeBg: "bg-yellow-500" },
  { key: "hard", label: "Hard", color: "text-red-700", bg: "bg-red-50", border: "border-red-200", activeBg: "bg-red-600" },
];

export default function InterviewQuestions() {
  const [, setLocation] = useLocation();
  const [analysisId] = useLocalStorage("analysisId", null);
  const [cachedQuestions] = useLocalStorage("questions", null);

  const [questions, setQuestions] = useState(null);
  const [activeTab, setActiveTab] = useState("easy");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchQuestions = async () => {
    setLoading(true); setError("");
    try {
      if (cachedQuestions) {
        setQuestions(cachedQuestions);
        setLoading(false);
        return;
      }
      if (!analysisId) { setLocation("/"); return; }
      const data = await getInterviewQuestions(analysisId);
      setQuestions(data);
    } catch {
      setError("Failed to load interview questions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQuestions(); }, [analysisId]);

  if (!analysisId && !cachedQuestions) return null;

  if (loading) return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
      <LoadingSpinner message="Generating interview questions…" />
    </div>
  );

  if (error) return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
      <ErrorMessage message={error} onRetry={fetchQuestions} />
    </div>
  );

  const current = questions?.[activeTab] || [];
  const tab = TABS.find((t) => t.key === activeTab);
  const totalCount = TABS.reduce((sum, t) => sum + (questions?.[t.key]?.length || 0), 0);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Interview Questions</h1>
            <p className="text-gray-500 mt-1">{totalCount} tailored questions across 3 difficulty levels</p>
          </div>
          <button
            onClick={() => setLocation("/analysis")}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back to Analysis
          </button>
        </div>

        {/* Difficulty tabs */}
        <div className="flex gap-2 mb-6">
          {TABS.map(({ key, label, color, bg, border, activeBg }) => {
            const count = questions?.[key]?.length || 0;
            const active = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                  active
                    ? `${activeBg} text-white border-transparent shadow-sm`
                    : `${bg} ${color} ${border} hover:opacity-80`
                }`}
              >
                {label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  active ? "bg-white/20 text-white" : "bg-white text-gray-600"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Question list */}
        {current.length > 0 ? (
          <div className="space-y-3">
            {current.map((question, i) => (
              <QuestionCard key={i} question={question} difficulty={activeTab} index={i} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-gray-400 text-sm">No {activeTab} questions available.</p>
          </div>
        )}

        {/* Footer tip */}
        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl px-5 py-4">
          <p className="text-sm text-blue-700">
            <strong>Tip:</strong> Click on any question to expand it for a better reading experience, or use the copy button to paste it into your practice notes.
          </p>
        </div>
      </div>
    </div>
  );
}
