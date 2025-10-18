// src/components/UploadZone.jsx
import React, { useState } from "react";
import { uploadFile } from "../services/API";

export default function UploadZone({ onComplete }) {
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(1);
  const [error, setError] = useState("");

  const handlePick = (e) => {
    setFile(e.target.files?.[0] || null);
    setError("");
  };

  const doUpload = async () => {
    if (!file) return;
    setBusy(true);
    setError("");
    setStage(2);
    setProgress(0);

    try {
      const result = await uploadFile(file, {
        ocr: "auto",
        onProgress: ({ pct }) => setProgress(pct),
      });

      // Stepper animation stages
      setStage(3);
      setTimeout(() => setStage(4), 400);
      setTimeout(() => setStage(5), 800);

      if (!result || result.status !== "done") {
        throw new Error(result?.detail || "Upload failed");
      }
      if (!result.raw_text?.trim()) {
        setError("No text could be extracted. Enable OCR or provide a text-based file.");
      }
      onComplete?.(result);
    } catch (e) {
      setError(e.message || "Failed to upload or parse the file.");
    } finally {
      setBusy(false);
      setProgress(100);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="text-xl font-semibold">Upload</h3>

      <div
        className="mt-4 border-2 border-dashed rounded-xl p-8 text-center"
        style={{ borderColor: "#D7DFEF", background: "#F7FAFF" }}
      >
        <input
          id="f"
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handlePick}
          className="hidden"
        />
        <label htmlFor="f" className="inline-flex cursor-pointer">
          <button
            type="button"
            className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold shadow hover:shadow-md"
          >
            {file ? "Choose another file" : "Upload contract"}
          </button>
        </label>

        <div className="mt-4 text-slate-500 flex items-center gap-3 justify-center text-sm">
          <span className="px-3 py-1 rounded-full border">PDF</span>
          <span className="px-3 py-1 rounded-full border">DOC/DOCX</span>
          <span className="px-3 py-1 rounded-full border">Up to 10MB</span>
        </div>

        {file && (
          <div className="mt-3 text-slate-700 text-sm">{file.name}</div>
        )}

        <div className="mt-6">
          <button
            onClick={doUpload}
            disabled={!file || busy}
            className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold shadow hover:shadow-md disabled:opacity-50"
          >
            {busy ? "Uploading..." : "Upload contract"}
          </button>
        </div>

        {/* Right-hand processing panel mimic */}
        <div className="mt-8 grid gap-2 max-w-md mx-auto">
          <div className="h-2 w-full bg-slate-200 rounded">
            <div
              className="h-2 rounded bg-indigo-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <ul className="text-sm">
            <li className={`mb-1 ${stage >= 2 ? "text-green-700" : "text-slate-400"}`}>1. Document uploaded & verified</li>
            <li className={`mb-1 ${stage >= 3 ? "text-green-700" : "text-slate-400"}`}>2. OCR text extraction</li>
            <li className={`mb-1 ${stage >= 4 ? "text-green-700" : "text-slate-400"}`}>3. AI legal analysis</li>
            <li className={`${stage >= 5 ? "text-green-700" : "text-slate-400"}`}>4. Generating report</li>
          </ul>
        </div>
      </div>

      {!!error && (
        <p className="mt-4 text-red-600 font-medium">
          {error}
        </p>
      )}
    </div>
  );
}