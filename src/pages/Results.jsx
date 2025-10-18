// src/pages/Results.jsx
import React, { useEffect, useRef, useState } from "react";
import ResultsHeader from "../components/ResultsHeader.jsx";
import SummaryKeyCards from "../components/SummaryKeyCards.jsx";
import ShareBar from "../components/ShareBar.jsx";
import AuditSection from "../components/AuditSection.jsx";
import FeedbackPanel from "../components/FeedbackPanel.jsx";
import { exportSummaryAsPDF } from "../utils/pdfExport.js";
import { loadLastSummary } from "../services/storage.js";
import { shareEmail } from "../services/API.js";

export default function Results() {
  const [fileName, setFileName] = useState("");
  const [summary, setSummary] = useState(null);
  const summaryRef = useRef(null);

  useEffect(() => {
    const last = loadLastSummary();
    setFileName(last?.fileName || "");
    setSummary(last?.summary || null);
  }, []);

  const onExportPDF = async () => {
    if (!summaryRef.current) return;
    await exportSummaryAsPDF({ container: summaryRef.current, docTitle: fileName || "S32 Insights" });
  };

  const onShareEmail = async ({ to }) => {
    if (!summary) return;
    const subject = `S32 Insights Summary – ${fileName || "Document"}`;
    const body = `Hi,\n\nPlease find the Section 32 summary below.\n\n${JSON.stringify(summary, null, 2)}\n\nRegards,\nS32 Insights Portal`;
    const resp = await shareEmail({ to, subject, body }).catch(()=>null);
    if (!resp?.sent) {
      window.location.href = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
  };

  if (!summary) {
    return (
      <div className="bg-white border rounded-2xl p-10 text-center shadow-sm">
        No result loaded. Please upload a contract on <a className="text-blue-600 underline" href="/dashboard">AI Analysis</a>.
      </div>
    );
  }

  return (
    <div>
      <ResultsHeader
        fileName={fileName}
        processedAt={Date.now()}
        processingSeconds={4.2}
        pages={undefined}
        onExportPDF={onExportPDF}
        onShareEmail={onShareEmail}
      />
      <div ref={summaryRef} className="space-y-4 mt-3">
        <SummaryKeyCards summary={summary} />
        <ShareBar fileName={fileName} onExportPDF={onExportPDF} onShareEmail={onShareEmail} />
        <AuditSection summary={summary} />
        <FeedbackPanel onSubmit={() => {}} />
      </div>
    </div>
  );
}