// src/components/UploadZone.jsx
import React, { useRef, useState } from "react";
import { uploadFile } from "../services/API"; // keeps your existing API call

/**
 * UploadZone
 * - Single primary button (no duplicate).
 * - One hidden <input type="file"> that is triggered when no file is chosen.
 * - Once a file is selected, the same button uploads it.
 * - Drag & drop supported.
 * - Small badges for PDF/DOCX/size.
 * - Emits onUploadComplete(result) when backend finishes.
 */
export default function UploadZone({ onUploadComplete }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(0); // 0 idle, 1 verified, 2 ocr, 3 legal, 4 generating

  const openPicker = () => inputRef.current?.click();

  const onFiles = (files) => {
    const f = files?.[0];
    if (!f) return;
    if (!/\.(pdf|doc|docx)$/i.test(f.name)) {
      setError("Please select a PDF or DOC/DOCX file.");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("File is larger than 10MB.");
      return;
    }
    setError("");
    setFile(f);
  };

  const handleInput = (e) => onFiles(e.target.files);

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    onFiles(e.dataTransfer.files);
  };

  const handleUpload = async () => {
    if (!file) {
      // no file yet -> open picker
      openPicker();
      return;
    }
    try {
      setIsUploading(true);
      setError("");

      // simple staged UI progress (frontend only)
      setStep(1); // uploaded & verified
      await new Promise((r) => setTimeout(r, 250));

      setStep(2); // OCR
      // call backend (your API returns { ok, summary, message, filename } )
      const result = await uploadFile(file);

      setStep(3); // legal analysis
      await new Promise((r) => setTimeout(r, 200));

      setStep(4); // generating report
      await new Promise((r) => setTimeout(r, 150));

      if (!result || result.error) {
        throw new Error(result?.error || "Failed to upload or parse the file.");
      }

      onUploadComplete?.(result);
    } catch (err) {
      setError(err.message || "Failed to upload or parse the file.");
      setIsUploading(false);
      setStep(0);
    }
  };

  return (
    <div className="space-y-4">
      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        onChange={handleInput}
      />

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`rounded-2xl border-2 border-dashed p-8 transition-colors ${
          dragOver ? "border-indigo-400 bg-indigo-50/40" : "border-slate-300 bg-slate-50/50"
        }`}
      >
        <div className="flex flex-col items-center gap-5">
          {/* SINGLE primary button */}
          <button
            type="button"
            onClick={handleUpload}
            disabled={isUploading}
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-500 disabled:opacity-50"
          >
            {file ? (isUploading ? "Uploading..." : "Upload contract") : "Upload contract"}
          </button>

          {/* badges */}
          <div className="flex items-center gap-3 text-sm">
            <span className="px-3 py-1 rounded-full bg-white border text-slate-600">PDF</span>
            <span className="px-3 py-1 rounded-full bg-white border text-slate-600">DOC/DOCX</span>
            <span className="px-3 py-1 rounded-full bg-white border text-slate-600">Up to 10MB</span>
          </div>

          {/* filename */}
          {file && (
            <div className="text-slate-500 text-sm">
              Selected: <span className="font-medium text-slate-700">{file.name}</span>
            </div>
          )}

          {/* progress bar + steps (visible while uploading) */}
          {isUploading && (
            <div className="w-full max-w-md mt-2">
              <div className="h-1.5 rounded bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-indigo-600 transition-all"
                  style={{ width: `${(step / 4) * 100}%` }}
                />
              </div>
              <ol className="mt-3 space-y-1 text-slate-600 text-sm">
                <li className={step >= 1 ? "font-semibold text-slate-800" : ""}>
                  1. Document uploaded & verified
                </li>
                <li className={step >= 2 ? "font-semibold text-slate-800" : ""}>
                  2. OCR text extraction
                </li>
                <li className={step >= 3 ? "font-semibold text-slate-800" : ""}>
                  3. AI legal analysis
                </li>
                <li className={step >= 4 ? "font-semibold text-slate-800" : ""}>
                  4. Generating report
                </li>
              </ol>
            </div>
          )}

          {/* error */}
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>
      </div>
    </div>
  );
}