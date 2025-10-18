import React, { useRef, useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export default function UploadZone({ onSelect, disabled }) {
  const inputRef = useRef(null);
  const [hover, setHover] = useState(false);
  const [file, setFile] = useState(null);

  const onDrop = (e) => {
    e.preventDefault();
    if (disabled) return;
    const f = e.dataTransfer.files?.[0];
    if (f) {
      setFile(f);
      onSelect?.(f);
    }
    setHover(false);
  };

  const onPick = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      onSelect?.(f);
    }
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setHover(true); }}
      onDragLeave={() => setHover(false)}
      onDrop={onDrop}
      className={`rounded-2xl border-2 border-dashed p-10 text-center transition
        ${hover ? "border-blue-500 bg-blue-50/50" : "border-blue-200 bg-blue-50"}
        ${disabled ? "opacity-50 pointer-events-none" : ""}`}
    >
      <CloudUploadIcon color="primary" sx={{ fontSize: 40 }} />
      <div className="text-lg font-semibold mt-3">Drop your contract here</div>
      <div className="text-sm text-gray-500">or click to browse your files</div>

      <div className="flex items-center justify-center gap-4 text-sm mt-4">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-600 inline-block" /> PDF Files
        </span>
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-600 inline-block" /> DOC/DOCX
        </span>
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-600 inline-block" /> Up to 10MB
        </span>
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white font-semibold shadow hover:shadow-md hover:bg-blue-700 transition"
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

      {file && <div className="mt-3 text-sm text-gray-600 truncate">{file.name}</div>}
    </div>
  );
}