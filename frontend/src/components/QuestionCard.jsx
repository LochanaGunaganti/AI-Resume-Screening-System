import { useState } from "react";

const BADGE = {
  easy: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  hard: "bg-red-100 text-red-700",
};

export default function QuestionCard({ question, difficulty, index }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(question).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      {/* Header row — NOT a button; click area handled via onClick on the div */}
      <div
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        onClick={() => setExpanded((e) => !e)}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setExpanded((v) => !v)}
        className="flex items-start gap-3 p-4 text-left cursor-pointer"
      >
        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center mt-0.5 select-none">
          {index + 1}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${BADGE[difficulty] || BADGE.easy}`}>
              {difficulty}
            </span>
          </div>
          <p className={`text-sm text-gray-800 font-medium leading-relaxed ${!expanded ? "line-clamp-2" : ""}`}>
            {question}
          </p>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0 ml-2 mt-0.5">
          {/* Copy button — plain div styled as button to avoid nested <button> */}
          <span
            role="button"
            tabIndex={0}
            title="Copy question"
            onClick={handleCopy}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleCopy(e)}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            {copied ? (
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </span>

          <svg
            className={`w-4 h-4 text-gray-400 transition-transform select-none ${expanded ? "rotate-180" : ""}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-0 ml-10">
          <p className="text-sm text-gray-700 leading-relaxed border-t border-gray-100 pt-3">{question}</p>
        </div>
      )}
    </div>
  );
}
