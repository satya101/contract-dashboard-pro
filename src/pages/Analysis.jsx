import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadFile } from "../services/api.js";

export default function Analysis() {
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const handleSelect = (e) => setFile(e.target.files?.[0] ?? null);

  const handleUpload = async () => {
    if (!file || busy) return;
    try {
      setBusy(true);
      setProgress(10);
      // call backend (ocr=true to help scanned PDFs)
      const res = await uploadFile(file, { ocr: true, onProgress: setProgress });
      setProgress(95);

      // persist to audit history for Documents page
      const audit = JSON.parse(localStorage.getItem("auditHistory") || "[]");
      audit.unshift({
        id: crypto.randomUUID(),
        filename: file.name,
        when: new Date().toISOString(),
        summary: res?.summary ?? null,
      });
      localStorage.setItem("auditHistory", JSON.stringify(audit));

      // go to results
      navigate("/results", { state: { summary: res?.summary || null, filename: file.name } });
    } catch (e) {
      console.error(e);
      alert("Upload failed. Please try again.");
    } finally {
      setBusy(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-8">
      {/* Steps bar */}
      <div className="rounded-2xl border bg-white p-4">
        <ol className="flex items-center justify-between text-sm">
          <li className="flex items-center gap-2">
            <span className="h-6 w-6 grid place-items-center rounded-full bg-indigo-600 text-white">1</span>
            Upload Document
          </li>
          <li className="flex items-center gap-2">
            <span className={`h-6 w-6 grid place-items-center rounded-full ${busy ? "bg-indigo-600 text-white" : "bg-slate-200"}`}>2</span>
            AI Processing
          </li>
          <li className="flex items-center gap-2">
            <span className="h-6 w-6 grid place-items-center rounded-full bg-slate-200">3</span>
            View Results
          </li>
        </ol>
      </div>

      {/* Upload panel */}
      <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-8">
        <h2 className="text-2xl font-bold mb-6">Upload</h2>

        <div className="mx-auto max-w-xl text-center">
          <label className="inline-flex">
            <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleSelect} />
            <button
              type="button"
              className="inline-flex items-center rounded-lg bg-indigo-600 text-white px-5 py-3 font-medium hover:bg-indigo-700"
              onClick={(e) => e.currentTarget.previousSibling.click()}
            >
              Upload contract
            </button>
          </label>

          {/* pills */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-700">PDF</span>
            <span className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-700">DOC/DOCX</span>
            <span className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-700">Up to 10MB</span>
          </div>

          {file && (
            <div className="mt-4 text-sm text-slate-600">{file.name}</div>
          )}

          <div className="mt-6">
            <button
              onClick={handleUpload}
              disabled={!file || busy}
              className={`inline-flex items-center rounded-lg px-5 py-3 font-medium ${
                !file || busy
                  ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                  : "bg-emerald-600 text-white hover:bg-emerald-700"
              }`}
            >
              {busy ? "Processing…" : "Start analysis"}
            </button>
          </div>

          {/* progress & staged steps */}
          {busy && (
            <div className="mt-6 space-y-3">
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-2 bg-indigo-600 transition-all" style={{ width: `${progress}%` }} />
              </div>
              <ul className="text-sm text-slate-600 text-left max-w-sm mx-auto list-decimal list-inside">
                <li className={progress >= 10 ? "text-emerald-700 font-medium" : ""}>Document uploaded & verified</li>
                <li className={progress >= 40 ? "text-emerald-700 font-medium" : ""}>OCR text extraction</li>
                <li className={progress >= 70 ? "text-emerald-700 font-medium" : ""}>AI legal analysis</li>
                <li className={progress >= 90 ? "text-emerald-700 font-medium" : ""}>Generating report</li>
              </ul>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}