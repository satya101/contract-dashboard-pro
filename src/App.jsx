import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Stepper, Step, StepLabel, Box } from "@mui/material";

// Components
import UploadZone from "./components/UploadZone.jsx";
import AuditSection from "./components/AuditSection.jsx";
import ShareBar from "./components/ShareBar.jsx";
import AuditList from "./components/AuditList.jsx";
import LoadingAnimation from "./components/LoadingAnimation.jsx";
import ChatAssist from "./components/ChatAssist.jsx";
import ProcessingPanel from "./components/ProcessingPanel.jsx";
import FeedbackPanel from "./components/FeedbackPanel.jsx";

// Services / utils
import { uploadFile, askAssistant, shareEmail, submitFeedback } from "./services/API.js";
import { exportSummaryAsPDF } from "./utils/pdfExport.js";
import {
  saveToHistory, loadHistory, loadLastSummary, saveLastSummary, clearHistory,
} from "./services/storage.js";

const PROCESS_STAGES = [
  "Document uploaded & verified",
  "OCR text extraction",
  "AI legal analysis",
  "Generating report",
];

export default function App() {
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [history, setHistory] = useState(loadHistory());
  const [questionsLeft, setQuestionsLeft] = useState(3);

  // processing visual
  const [stageIdx, setStageIdx] = useState(0);
  const [progressPct, setProgressPct] = useState(0);
  const [eta, setEta] = useState(30); // seconds (rough estimate)

  const summaryRef = useRef(null);
  useEffect(() => {
    const last = loadLastSummary();
    if (last) {
      setSummary(last.summary);
      setFileName(last.fileName || "");
    }
  }, []);

  // active step for the top Stepper
  const activeStep = loading ? 1 : summary ? 2 : 0;

  const startProcessingVisual = () => {
    setStageIdx(0);
    setProgressPct(0);
    setEta(30);

    const t = Date.now();
    const timer = setInterval(() => {
      const elapsed = (Date.now() - t) / 1000;
      // simple progression mapping
      let pct = Math.min(98, Math.floor((elapsed / 30) * 100));
      let stage = 0;
      if (pct > 15) stage = 1;
      if (pct > 45) stage = 2;
      if (pct > 80) stage = 3;

      setProgressPct(pct);
      setStageIdx(stage);
      setEta(Math.max(3, 30 - Math.floor(elapsed / 1.2)));

    }, 400);

    // return cancel
    return () => clearInterval(timer);
  };

  const finishProcessingVisual = () => {
    setStageIdx(PROCESS_STAGES.length - 1);
    setProgressPct(100);
    setEta(0);
  };

  const handleUploadSelected = async (file) => {
    if (!file) return;
    setErr("");
    setLoading(true);
    const stop = startProcessingVisual();
    try {
      const res = await uploadFile(file);
      finishProcessingVisual();
      const s = res?.summary;
      setSummary(s);
      setFileName(res?.file || file.name || "Uploaded Document");
      saveLastSummary({ summary: s, fileName: res?.file || file.name });
      const updated = saveToHistory({ name: res?.file || file.name, summary: s });
      setHistory(updated);

      setTimeout(() => {
        document.querySelector("#summary-root")?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    } catch (e) {
      setErr(
        e?.message ||
          "Failed to upload or parse the file. Ensure it's a text-based PDF/DOCX or enable OCR on the backend."
      );
    } finally {
      stop && stop();
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

  const handleSubmitFeedback = async ({ rating, message, email }) => {
    try {
      const r = await submitFeedback({ rating, message, email, docName: fileName || "Unknown" });
      if (!r?.ok) throw new Error();
      alert("Thanks for your feedback!");
    } catch (e) {
      alert("Could not submit feedback. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold">AI Analysis</h1>
          <div className="flex items-center gap-3 text-sm">
            <button
              onClick={() => navigate("/")}
              className="px-3 py-1 border rounded hover:bg-gray-50"
              title="Back to landing"
            >
              ← Back
            </button>
            <span className="text-gray-500">Questions left: {questionsLeft}</span>
            <button
              onClick={handleClearHistory}
              className="px-3 py-1 border rounded hover:bg-gray-50"
              title="Clear local audit history"
            >
              Clear History
            </button>
          </div>
        </div>
      </header>

      {/* Stepper like your reference (1 Upload, 2 Processing, 3 Results) */}
      <Box className="bg-white border-b" sx={{ py: 2 }}>
        <Box className="mx-auto max-w-6xl px-4">
          <Stepper activeStep={activeStep} alternativeLabel>
            <Step><StepLabel>Upload Document</StepLabel></Step>
            <Step><StepLabel>AI Processing</StepLabel></Step>
            <Step><StepLabel>View Results</StepLabel></Step>
          </Stepper>
        </Box>
      </Box>

      <main className="mx-auto max-w-6xl px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Upload & Audit list */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold text-lg mb-3">Upload</h2>
            <UploadZone onSelect={handleUploadSelected} disabled={loading} />
            {err && <p className="text-sm text-red-600 mt-2">{err}</p>}
          </div>

          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <AuditList docs={history} onSelect={handleOpenFromHistory} />
          </div>
        </aside>

        {/* Right: Processing / Results */}
        <section className="lg:col-span-3 space-y-4">
          {loading && (
            <ProcessingPanel
              stages={PROCESS_STAGES}
              stageIdx={stageIdx}
              progressPct={progressPct}
              etaSeconds={eta}
            />
          )}

          {!loading && summary && (
            <>
              <ShareBar fileName={fileName} onExportPDF={handleExportPDF} onShareEmail={handleShareEmail} />
              <AuditSection ref={summaryRef} summary={summary} onReset={handleReset} />
              <ChatAssist ask={handleAsk} />
              <FeedbackPanel onSubmit={handleSubmitFeedback} />
            </>
          )}

          {!loading && !summary && (
            <div className="bg-white border rounded-2xl p-10 text-center text-gray-600 shadow-sm">
              Upload a PDF or DOCX to start. Your last summary will reappear after refresh.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}