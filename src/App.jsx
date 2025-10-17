import React, { useEffect, useRef, useState } from "react";
import UploadZone from "./components/UploadZone.jsx";
import AuditSection from "./components/AuditSection.jsx";
import ShareBar from "./components/ShareBar.jsx";
import AuditList from "./components/AuditList.jsx";
import LoadingAnimation from "./components/LoadingAnimation.jsx";
import ChatAssist from "./components/ChatAssist.jsx";
import { exportSummaryAsPDF } from "./utils/pdfExport.js";
import { uploadFile, askAssistant, shareEmail } from "./services/API.js";
import {
  saveToHistory,
  loadHistory,
  loadLastSummary,
  saveLastSummary,
  clearHistory,
} from "./services/storage.js";

export default function App() {
  const [summary, setSummary] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [history, setHistory] = useState(loadHistory());
  const [questionsLeft, setQuestionsLeft] = useState(3);

  const summaryRef = useRef(null);

  useEffect(() => {
    const last = loadLastSummary();
    if (last) {
      setSummary(last.summary);
      setFileName(last.fileName || "");
    }
  }, []);

  const handleUploadSelected = async (file) => {
    if (!file) return;
    setErr("");
    setLoading(true);
    try {
      const res = await uploadFile(file);
      const s = res?.summary;
      setSummary(s);
      setFileName(res?.file || file.name || "Uploaded Document");
      saveLastSummary({ summary: s, fileName: res?.file || file.name });
      const updated = saveToHistory({ name: res?.file || file.name, summary: s });
      setHistory(updated);
      setTimeout(() => {
        document.querySelector("#summary-root")?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    } catch (e) {
      setErr(
        e?.message ||
          "Failed to upload or parse the file. Please ensure it's a text-based PDF/DOCX or enable OCR on the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFromHistory = (doc) => {
    setSummary(doc.summary);
    setFileName(doc.name);
    saveLastSummary({ summary: doc.summary, fileName: doc.name });
    setTimeout(() => {
      document.querySelector("#summary-root")?.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  const handleClearHistory = () => setHistory(clearHistory());

  const handleReset = () => {
    setSummary(null);
    setFileName("");
    setErr("");
  };

  const handleExportPDF = async () => {
    if (!summaryRef.current) return;
    await exportSummaryAsPDF({ container: summaryRef.current, docTitle: fileName || "S32 Insights" });
  };

  const handleShareEmail = async ({ to }) => {
    if (!summary) return;
    const subject = `S32 Insights Summary – ${fileName || "Document"}`;
    const body = `Hi,

Please find the Section 32 (Vendor Statement) summary below.

${JSON.stringify(summary, null, 2)}

Regards,
S32 Insights Portal`;
    try {
      const resp = await shareEmail({ to, subject, body });
      if (!resp?.sent) {
        window.location.href = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      }
      return true;
    } catch {
      return false;
    }
  };

  const handleAsk = async (question) => {
    if (!question?.trim() || questionsLeft <= 0) return { answer: "Limit reached." };
    const context = JSON.stringify(summary || {}, null, 2).slice(0, 12000);
    const res = await askAssistant({ question, context });
    setQuestionsLeft((n) => Math.max(0, n - 1));
    return res;
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold">S32 Insights Portal</h1>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-500">Questions left: {questionsLeft}</span>
            <button onClick={handleClearHistory} className="px-3 py-1 border rounded hover:bg-gray-50" title="Clear local audit history">
              Clear History
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white border rounded-lg p-4">
            <h2 className="font-semibold mb-3">Upload</h2>
            <UploadZone onSelect={handleUploadSelected} disabled={loading} />
            {err && <p className="text-sm text-red-600 mt-2">{err}</p>}
          </div>

          <div className="bg-white border rounded-lg p-4">
            <AuditList docs={history} onSelect={handleOpenFromHistory} />
          </div>
        </aside>

        <section className="lg:col-span-3 space-y-4">
          {loading && (
            <div className="bg-white border rounded-lg p-8 flex items-center justify-center">
              <LoadingAnimation label="Processing contract..." />
            </div>
          )}

          {!loading && summary && (
            <>
              <ShareBar fileName={fileName} onExportPDF={handleExportPDF} onShareEmail={handleShareEmail} />
              <AuditSection ref={summaryRef} summary={summary} onReset={handleReset} />
            </>
          )}

          {!loading && !summary && (
            <div className="bg-white border rounded-lg p-8 text-center text-gray-600">
              Upload a PDF or DOCX to start. Your last summary will reappear after refresh.
            </div>
          )}

          {!loading && summary && <ChatAssist ask={handleAsk} />}
        </section>
      </main>
    </div>
  );
}