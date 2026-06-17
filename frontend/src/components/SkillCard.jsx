/**
 * @param {{ skill: string, type: "matched" | "missing" }} props
 */
export default function SkillCard({ skill, type }) {
  const matched = type === "matched";
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium ${
        matched
          ? "bg-green-50 border-green-200 text-green-800"
          : "bg-red-50 border-red-200 text-red-800"
      }`}
    >
      {matched ? (
        <svg className="w-4 h-4 flex-shrink-0 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4 flex-shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      {skill}
    </div>
  );
}
