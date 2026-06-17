import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { createJobDescription, uploadJdPdf, analyzeResume } from "../services/api";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { buildJdText, validatePdfFile, formatFileSize } from "../utils/helpers";
import { SAMPLE_JD, MAX_FILE_SIZE_MB } from "../utils/constants";
import LoadingSpinner from "../components/LoadingSpinner";

const EMPTY_FORM = { jobTitle: "", experience: "", eligibility: "", requiredSkills: "", preferredSkills: "", responsibilities: "" };

function CharCounter({ value, min }) {
  const len = value.length;
  const ok = !min || len >= min;
  return (
    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
      len === 0 ? "text-gray-400 bg-gray-100" : ok ? "text-blue-600 bg-blue-50" : "text-red-600 bg-red-50"
    }`}>
      {len} chars
    </span>
  );
}

export default function JobDescription() {
  const [, setLocation] = useLocation();
  const [resumeId] = useLocalStorage("resumeId", null);
  const [, setAnalysisId] = useLocalStorage("analysisId", null);

  const [tab, setTab] = useState("paste");

  // Persisted paste form
  const [form, setForm] = useLocalStorage("jd-form", EMPTY_FORM);

  // PDF tab state
  const [pdfFile, setPdfFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pdfError, setPdfError] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!resumeId) setLocation("/");
  }, [resumeId]);

  const setField = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const pasteValid = form.jobTitle.trim() && form.requiredSkills.trim() && form.eligibility.trim();

  const runAnalysis = async (jobDescriptionId) => {
    const { analysisId } = await analyzeResume(resumeId, jobDescriptionId);
    setAnalysisId(analysisId);
    setLocation("/analysis");
  };

  const handleAnalyzePaste = async () => {
    if (!pasteValid) return;
    setIsLoading(true); setError("");
    try {
      const jdText = buildJdText(form);
      const { jobDescriptionId } = await createJobDescription(jdText);
      await runAnalysis(jobDescriptionId);
    } catch (err) {
      setError(err.response?.data?.error || "Analysis failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzePdf = async () => {
    if (!pdfFile) return;
    setIsLoading(true); setError("");
    try {
      const { jobDescriptionId } = await uploadJdPdf(pdfFile);
      await runAnalysis(jobDescriptionId);
    } catch (err) {
      setError(err.response?.data?.error || "PDF upload failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePdfSelect = (file) => {
    setPdfError("");
    const err = validatePdfFile(file);
    if (err) { setPdfError(err); return; }
    setPdfFile(file);
  };

  if (!resumeId) return null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Job Description Input</h1>
          <p className="text-gray-500">Provide the job description you are targeting. Our AI will compare it against your resume.</p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6 max-w-xs">
          {[["paste", "Paste JD"], ["upload", "Upload PDF JD"]].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-colors ${
                tab === key ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          {/* ── Paste JD ── */}
          {tab === "paste" && (
            <>
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Job Details</h2>
                  <p className="text-sm text-gray-500">Fields marked * are required</p>
                </div>
                <button
                  onClick={() => setForm({ ...SAMPLE_JD })}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  Load Sample
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Row 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-sm font-medium text-gray-700">Job Title <span className="text-red-500">*</span></label>
                      <CharCounter value={form.jobTitle} min={1} />
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. Senior Java Developer"
                      value={form.jobTitle}
                      onChange={setField("jobTitle")}
                      disabled={isLoading}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-sm font-medium text-gray-700">Experience Required</label>
                      <CharCounter value={form.experience} />
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. 3-5 Years"
                      value={form.experience}
                      onChange={setField("experience")}
                      disabled={isLoading}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                </div>

                {/* Eligibility */}
                {[
                  { field: "eligibility", label: "Eligibility", required: true, placeholder: "e.g.\nB.Tech in CSE/IT\nMinimum 60% throughout", rows: 3 },
                  { field: "requiredSkills", label: "Required Skills", required: true, placeholder: "e.g.\nJava\nSpring Boot\nMySQL\nREST APIs", rows: 4 },
                  { field: "preferredSkills", label: "Preferred Skills", required: false, placeholder: "e.g.\nDocker\nMicroservices\nAWS", rows: 3 },
                  { field: "responsibilities", label: "Responsibilities", required: false, placeholder: "e.g.\nDevelop backend services\nDesign APIs\nDatabase optimisation", rows: 4 },
                ].map(({ field, label, required, placeholder, rows }) => (
                  <div key={field}>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-sm font-medium text-gray-700">
                        {label} {required && <span className="text-red-500">*</span>}
                      </label>
                      <CharCounter value={form[field]} min={required ? 3 : undefined} />
                    </div>
                    <textarea
                      rows={rows}
                      placeholder={placeholder}
                      value={form[field]}
                      onChange={setField(field)}
                      disabled={isLoading}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y disabled:bg-gray-50"
                    />
                  </div>
                ))}

                {!pasteValid && (form.jobTitle || form.requiredSkills || form.eligibility) && (
                  <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Job Title, Eligibility, and Required Skills are required.
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-2xl">
                <div className="flex gap-2">
                  <button onClick={() => setLocation("/")} disabled={isLoading} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50">
                    Back
                  </button>
                  <button
                    onClick={() => setForm({ ...EMPTY_FORM })}
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    Clear Form
                  </button>
                </div>
                <button
                  onClick={handleAnalyzePaste}
                  disabled={!pasteValid || isLoading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  {isLoading ? (
                    <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Analyzing…</>
                  ) : (
                    <>Analyze Resume <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></>
                  )}
                </button>
              </div>
            </>
          )}

          {/* ── Upload PDF JD ── */}
          {tab === "upload" && (
            <>
              <div className="px-6 pt-6 pb-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Upload Job Description PDF</h2>
                <p className="text-sm text-gray-500">PDF only · up to {MAX_FILE_SIZE_MB} MB — text will be extracted automatically.</p>
              </div>

              <div className="p-6">
                {!pdfFile ? (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files?.[0]; if (f) handlePdfSelect(f); }}
                    onClick={() => document.getElementById("jd-pdf-input")?.click()}
                    className={`border-2 border-dashed rounded-xl p-14 flex flex-col items-center justify-center cursor-pointer transition-all ${
                      isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      id="jd-pdf-input"
                      type="file"
                      accept=".pdf,application/pdf"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handlePdfSelect(e.target.files[0])}
                    />
                    <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="text-base font-semibold text-gray-700 mb-1">Drag & drop your JD PDF here</p>
                    <p className="text-sm text-gray-400">or click to browse from your computer</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <div className="w-11 h-11 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{pdfFile.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(pdfFile.size)}</p>
                    </div>
                    <button
                      onClick={() => setPdfFile(null)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}

                {pdfError && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {pdfError}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-2xl">
                <button onClick={() => setLocation("/")} disabled={isLoading} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50">
                  Back
                </button>
                <button
                  onClick={handleAnalyzePdf}
                  disabled={!pdfFile || isLoading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  {isLoading ? (
                    <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Analyzing…</>
                  ) : (
                    <>Analyze Resume <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></>
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
