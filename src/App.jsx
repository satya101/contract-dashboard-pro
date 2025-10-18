// src/App.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Stepper, Step, StepLabel, Box } from "@mui/material";
import UploadZone from "./components/UploadZone.jsx";
import ProcessingPanel from "./components/ProcessingPanel.jsx";
import { uploadFile } from "./services/API.js";
import { saveToHistory, saveLastSummary } from "./services/storage.js";

const PROCESS_STAGES = [
  "Document uploaded & verified",
  "OCR text extraction",
  "AI legal analysis",
  "Generating report",
];

export default function App() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [stageIdx, setStageIdx] = useState(0);
  const [progressPct, setProgressPct] = useState(0);
  const [eta, setEta] = useState(30);

  const startVisual = () => {
    const t0 = Date.now();
    const id = setInterval(() => {
      const elapsed = (Date.now() - t0) / 1000;
      let pct = Math.min(98, Math.floor((elapsed / 30) * 100));
      let stage = 0;
      if (pct > 15) stage = 1;
      if (pct > 45) stage = 2;
      if (pct > 80) stage = 3;
      setStageIdx(stage); setProgressPct(pct);
      setEta(Math.max(3, 30 - Math.floor(elapsed / 1.2)));
    }, 400);
    return () => { clearInterval(id); setProgressPct(100); setEta(0); setStageIdx(3); };
  };

  const onSelect = async (file) => {
    setErr(""); setLoading(true);
    const stop = startVisual();
    try {
      const res = await uploadFile(file);
      stop();
      const summary = res?.summary;
      const name = res?.file || file.name || "Uploaded Document";
      saveLastSummary({ summary, fileName: name });
      saveToHistory({ name, summary });
      navigate("/results");
    } catch (e) {
      stop();
      setErr(e?.message || "Failed to upload or parse the file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Stepper header */}
      <Box className="bg-white border rounded-2xl mb-4" sx={{ py: 2 }}>
        <Box className="px-4">
          <Stepper activeStep={loading ? 1 : 0} alternativeLabel>
            <Step><StepLabel>Upload Document</StepLabel></Step>
            <Step><StepLabel>AI Processing</StepLabel></Step>
            <Step><StepLabel>View Results</StepLabel></Step>
          </Stepper>
        </Box>
      </Box>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UploadZone onSelect={onSelect} disabled={loading} />
          {err && <p className="text-sm text-red-600 mt-2">{err}</p>}
        </div>
        <div>
          {loading ? (
            <ProcessingPanel
              stages={PROCESS_STAGES}
              stageIdx={stageIdx}
              progressPct={progressPct}
              etaSeconds={eta}
            />
          ) : (
            <div className="bg-white border rounded-2xl p-6 shadow-sm">
              <p className="text-gray-600">
                Upload a PDF or DOCX to begin. Your document is processed securely and never shown publicly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}