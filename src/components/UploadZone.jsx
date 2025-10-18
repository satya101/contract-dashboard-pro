// src/components/UploadZone.jsx
import React, { useRef, useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Chip, Stack } from "@mui/material";

export default function UploadZone({ onSelect, disabled }) {
  const inputRef = useRef(null);
  const [hover, setHover] = useState(false);
  const [file, setFile] = useState(null);

  const onDrop = (e) => {
    e.preventDefault();
    if (disabled) return;
    const f = e.dataTransfer.files?.[0];
    if (f) { setFile(f); onSelect?.(f); }
    setHover(false);
  };

  const onPick = (e) => {
    const f = e.target.files?.[0];
    if (f) { setFile(f); onSelect?.(f); }
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setHover(true); }}
      onDragLeave={() => setHover(false)}
      onDrop={onDrop}
      className={`rounded-2xl border-2 border-dashed p-8 text-center transition
        ${hover ? "border-blue-500 bg-blue-50/50" : "border-blue-200 bg-blue-50"}
        ${disabled ? "opacity-50 pointer-events-none" : ""}`}
    >
      <CloudUploadIcon color="action" sx={{ fontSize: 42 }} />
      <div className="text-lg font-semibold mt-2">Drop your contract here</div>
      <div className="text-sm text-gray-500">or click to browse your files</div>

      <Stack
        direction="row"
        spacing={1}
        justifyContent="center"
        sx={{ mt: 2, flexWrap: "wrap" }}
      >
        <Chip label="PDF" size="small" variant="outlined" color="success" />
        <Chip label="DOC/DOCX" size="small" variant="outlined" color="success" />
        <Chip label="Up to 10MB" size="small" variant="outlined" />
      </Stack>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white font-semibold shadow hover:shadow-md hover:bg-blue-700 transition"
      >
        Upload contract
      </button>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={onPick}
        className="hidden"
      />

      {file && <div className="mt-2 text-sm text-gray-600 truncate">{file.name}</div>}
    </div>
  );
}