import React, { useRef, useState } from "react";

export default function UploadZone({ onSelect, disabled }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const onFile = (f) => {
    if (!f) return;
    const ok =
      f.type === "application/pdf" ||
      f.name?.toLowerCase().endsWith(".pdf") ||
      f.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      f.name?.toLowerCase().endsWith(".docx");
    if (!ok) {
      alert("Please select a .pdf or .docx file");
      return;
    }
    onSelect?.(f);
  };

  const handleChange = (e) => onFile(e.target.files?.[0]);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    onFile(f);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`rounded-lg border-2 border-dashed p-6 text-center ${
        dragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
        className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        Upload contract
      </button>
      <p className="mt-2 text-xs text-gray-500">…or drag & drop a PDF/DOCX here</p>
    </div>
  );
}