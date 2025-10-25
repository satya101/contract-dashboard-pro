import React, { useMemo, useState } from "react";
import { exportSummaryPdf } from "../utils/pdfExport.js";
import { shareReport } from "../services/api.js";

export default function Documents() {
  const [q, setQ] = useState("");
  const [date, setDate] = useState("");
  const data = JSON.parse(localStorage.getItem("auditHistory") || "[]");

  const rows = useMemo(() => {
    return data.filter(r => {
      const matchQ = q ? r.filename.toLowerCase().includes(q.toLowerCase()) : true;
      const matchDate = date ? r.when.slice(0,10) === date : true;
      return matchQ && matchDate;
    });
  }, [data, q, date]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">Document Management Center</h1>
        <p className="text-slate-600">
          Secure, organized, and intelligent document storage with comprehensive version control and collaboration tools.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search documents…"
          className="px-3 py-2 rounded-lg border bg-white"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-3 py-2 rounded-lg border bg-white"
        />
      </div>

      <div className="rounded-2xl border bg-white divide-y">
        {rows.length === 0 && <div className="p-6 text-slate-600">No documents found.</div>}
        {rows.map((r) => (
          <div key={r.id} className="p-4 flex items-center justify-between gap-3">
            <div>
              <div className="font-medium">{r.filename}</div>
              <div className="text-sm text-slate-500">{new Date(r.when).toLocaleString()}</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => exportSummaryPdf(r.summary, r.filename)}
                className="rounded-lg bg-indigo-600 text-white px-3 py-2 text-sm hover:bg-indigo-700"
              >
                Download summary
              </button>
              <button
                onClick={async () => {
                  const email = prompt("Send to email:");
                  if (!email) return;
                  await shareReport(email, r.summary, r.filename);
                  alert("Sent.");
                }}
                className="rounded-lg border px-3 py-2 text-sm hover:bg-slate-50"
              >
                Share
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}