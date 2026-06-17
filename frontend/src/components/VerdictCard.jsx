const STYLES = {
  strong: {
    bg: "bg-green-50",
    border: "border-green-200",
    badge: "bg-green-100 text-green-800",
    icon: "text-green-500",
    title: "text-green-900",
    text: "text-green-800",
  },
  moderate: {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    badge: "bg-yellow-100 text-yellow-800",
    icon: "text-yellow-500",
    title: "text-yellow-900",
    text: "text-yellow-800",
  },
  weak: {
    bg: "bg-red-50",
    border: "border-red-200",
    badge: "bg-red-100 text-red-800",
    icon: "text-red-500",
    title: "text-red-900",
    text: "text-red-800",
  },
};

export default function VerdictCard({ verdict }) {
  const { level, label, message } = verdict;
  const s = STYLES[level] || STYLES.moderate;

  return (
    <div className={`rounded-xl border-2 p-6 ${s.bg} ${s.border}`}>
      <div className="flex items-start gap-4">
        <div className={`mt-0.5 flex-shrink-0 ${s.icon}`}>
          {level === "strong" ? (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : level === "moderate" ? (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          ) : (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className={`text-lg font-bold ${s.title}`}>Candidate Verdict</h3>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.badge}`}>{label}</span>
          </div>
          <p className={`text-sm leading-relaxed ${s.text}`}>{message}</p>
        </div>
      </div>
    </div>
  );
}
