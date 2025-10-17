import React, { useState } from "react";

export default function ShareBar({ fileName, onExportPDF, onShareEmail }) {
  const [email, setEmail] = useState("");

  const handleShare = async () => {
    if (!email) return;
    const ok = await onShareEmail?.({ to: email });
    if (ok) {
      alert("Shared (or opened your email client).");
      setEmail("");
    } else {
      alert("Could not send email. Try again or check SMTP.");
    }
  };

  return (
    <div className="bg-white border rounded-lg p-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
      <div className="font-semibold">{fileName || "Summary"}</div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <button
          onClick={onExportPDF}
          className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          Export PDF
        </button>
        <div className="flex items-center gap-2">
          <input
            placeholder="share to email@example.com"
            className="border rounded px-3 py-2 w-64"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={handleShare}
            className="rounded border px-4 py-2 hover:bg-gray-50"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
}