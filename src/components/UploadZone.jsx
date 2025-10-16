import React from 'react';

export default function UploadZone({ onSelectFile, disabled }) {
  const onChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ok = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf') || file.name.toLowerCase().endsWith('.docx');
    if (!ok) {
      alert('Please select a PDF or DOCX file.');
      return;
    }
    onSelectFile(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const ok = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf') || file.name.toLowerCase().endsWith('.docx');
    if (!ok) {
      alert('Please select a PDF or DOCX file.');
      return;
    }
    onSelectFile(file);
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-8 text-center hover:border-blue-400 transition-colors"
    >
      <p className="text-gray-700 mb-3 font-medium">Upload Contract (PDF or DOCX)</p>
      <label className={`inline-flex items-center justify-center px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition ${disabled ? 'opacity-60 pointer-events-none' : ''}`}>
        Upload Contract
        <input type="file" accept=".pdf,.docx" className="hidden" onChange={onChange} disabled={disabled} />
      </label>
      <p className="mt-3 text-sm text-gray-500">…or drag &amp; drop a file here</p>
    </div>
  );
}
