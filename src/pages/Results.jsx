import React from "react";
import { useLocation, Link } from "react-router-dom";
import { exportSummaryPdf } from "../utils/pdfExport.js";
import { shareReport } from "../services/api.js";

const Row = ({ label, value }) => (
  <div className="flex justify-between py-1">
    <span className="text-slate-500">{label}</span>
    <span className="font-medium">{value || "—"}</span>
  </div>
);

export default function Results() {
  const { state } = useLocation();
  const summary = state?.summary || null;
  const filename = state?.filename || "";

  const handleDownload = () => exportSummaryPdf(summary, filename);
  const handleShare = async () => {
    const email = prompt("Send to email:");
    if (!email) return;
    await shareReport(email, summary, filename);
    alert("Report sent.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">Analysis Complete</h1>
          {filename && <p className="text-slate-600 text-sm mt-1">{filename}</p>}
        </div>
        <div className="flex gap-2">
          <button onClick={handleDownload} className="rounded-lg bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700">
            Download Report
          </button>
          <button onClick={handleShare} className="rounded-lg bg-slate-900 text-white px-4 py-2 hover:bg-black">
            Share Report
          </button>
        </div>
      </div>

      {/* Contract Summary – fills from summary if provided */}
      <section className="rounded-2xl bg-white shadow-sm border p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="h-6 w-6 rounded-full bg-indigo-600" />
          <div>
            <h2 className="text-2xl font-bold">Contract Summary</h2>
            <p className="text-slate-600">Key terms and conditions at a glance</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="rounded-xl bg-slate-50 p-4">
            <h3 className="font-semibold mb-2">Property Details</h3>
            <Row label="Address:" value={summary?.property?.address} />
            <Row label="Lot/Plan:" value={summary?.property?.lot_plan} />
            <Row label="Land Size:" value={summary?.property?.land_size} />
            <Row label="Zoning:" value={summary?.property?.zoning} />
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <h3 className="font-semibold mb-2">Financial Terms</h3>
            <Row label="Purchase Price:" value={summary?.financial?.price} />
            <Row label="Deposit:" value={summary?.financial?.deposit} />
            <Row label="Balance:" value={summary?.financial?.balance} />
            <Row label="Stamp Duty:" value={summary?.financial?.stamp_duty} />
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <h3 className="font-semibold mb-2">Key Dates</h3>
            <Row label="Settlement:" value={summary?.dates?.settlement} />
            <Row label="Finance Due:" value={summary?.dates?.finance_due} />
            <Row label="Cooling Off:" value={summary?.dates?.cooling_off} />
            <Row label="Possession:" value={summary?.dates?.possession} />
          </div>
        </div>

        {!summary && (
          <p className="mt-4 text-slate-600">
            No summary available. Please <Link to="/analysis" className="text-indigo-600 underline">upload a contract</Link>.
          </p>
        )}
      </section>
    </div>
  );
}