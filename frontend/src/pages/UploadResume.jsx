import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { uploadResume } from "../services/api";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { validatePdfFile, formatFileSize } from "../utils/helpers";
import LoadingSpinner from "../components/LoadingSpinner";

export default function UploadResume() {
  const [, setLocation] = useLocation();
  const [, setResumeId] = useLocalStorage("resumeId", null);
  const [, setCandidateName] = useLocalStorage("candidateName", null);

  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleSelect = (selected) => {
    setError("");
    const err = validatePdfFile(selected);
    if (err) { setError(err); return; }
    setFile(selected);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) handleSelect(dropped);
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setProgress(10);
    const timer = setInterval(() => setProgress((p) => (p < 85 ? p + 10 : p)), 250);
    try {
      const data = await uploadResume(file);
      localStorage.removeItem("jd-form");
      clearInterval(timer);
      setProgress(100);
      setResumeId(data.resumeId);
      setCandidateName(data.candidateName);
      setTimeout(() => setLocation("/job-description"), 400);
    } catch (err) {
      clearInterval(timer);
      setProgress(0);
      setError(err.response?.data?.error || "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
            Analyze Your Resume
          </h1>
          <p className="text-lg text-gray-500 max-w-md mx-auto">
            Upload your resume to get your ATS score, skill gap analysis, and tailored interview questions.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-8 pt-8 pb-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Upload Resume</h2>
            <p className="text-sm text-gray-500 mt-1">Supported format: PDF &nbsp;·&nbsp; Maximum size: 20 MB</p>
          </div>

          <div className="p-8">
            {!file ? (
              /* Drop zone */
              <div
                data-testid="upload-dropzone"
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-14 flex flex-col items-center justify-center cursor-pointer transition-all ${
                  isDragging ? "border-blue-500 bg-blue-50 scale-[1.01]" : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  className="hidden"
                  data-testid="input-file"
                  onChange={(e) => e.target.files?.[0] && handleSelect(e.target.files[0])}
                />
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-base font-semibold text-gray-700 mb-1">Drag & drop your PDF here</p>
                <p className="text-sm text-gray-400">or click to browse from your computer</p>
                <p className="text-xs text-gray-400 mt-3">PDF only · up to 20 MB</p>
              </div>
            ) : (
              /* File preview */
              <div className="space-y-5">
                <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <div className="w-11 h-11 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                  {!isUploading && (
                    <button
                      data-testid="button-remove-file"
                      onClick={() => { setFile(null); setProgress(0); setError(""); }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                {isUploading && (
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                      <span>Uploading…</span><span>{progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {!isUploading && (
                  <button
                    data-testid="button-upload"
                    onClick={handleUpload}
                    className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 active:scale-[0.99] transition-all shadow-sm"
                  >
                    Analyze This Resume
                  </button>
                )}
              </div>
            )}

            {error && (
              <div className="mt-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Feature pills */}
        <div className="mt-10 grid grid-cols-3 gap-4">
          {[
            { label: "ATS Score", desc: "See how your resume is scored by recruiters' software." },
            { label: "Skill Gap Analysis", desc: "Find the missing keywords holding you back." },
            { label: "Interview Questions", desc: "Practice AI-generated questions for this role." },
          ].map(({ label, desc }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-xs font-semibold text-gray-800 mb-1">{label}</p>
              <p className="text-xs text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
