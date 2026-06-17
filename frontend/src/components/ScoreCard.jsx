function getScoreLabel(score) {
  if (score >= 80) return { label: "Excellent Match", color: "#16a34a" };
  if (score >= 60) return { label: "Good Match", color: "#ca8a04" };
  if (score >= 40) return { label: "Average Match", color: "#ea580c" };
  return { label: "Poor Match", color: "#dc2626" };
}

export default function ScoreCard({ score }) {
  const { label, color } = getScoreLabel(score);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-36 h-36">
        <svg className="w-36 h-36 -rotate-90" viewBox="0 0 144 144">
          <circle
            cx="72" cy="72" r={radius}
            fill="none" stroke="#e5e7eb" strokeWidth="12"
          />
          <circle
            cx="72" cy="72" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-gray-900">{score}</span>
          <span className="text-xs text-gray-500 font-medium">/ 100</span>
        </div>
      </div>
      <span
        className="text-sm font-semibold px-3 py-1 rounded-full"
        style={{ backgroundColor: color + "18", color }}
      >
        {label}
      </span>
    </div>
  );
}
