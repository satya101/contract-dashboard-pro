import React, { useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import { exportSummaryPdf } from "../utils/pdfExport.js";
import { shareReport } from "../services/api.js";
import { normalizeSummary } from "../utils/normalize.js";

const useQuery = () => new URLSearchParams(useLocation().search);

const Row = ({ label, value }) => (
  <div className="flex justify-between py-1">
    <span className="text-slate-500">{label}</span>
    <span className="font-medium">{value || "—"}</span>
  </div>
);

export default function Results() {
  const { state } = useLocation();
  const q = useQuery();

  // Preferred: state from navigate; Fallback: localStorage by id; Final fallback: lastResultId
  const view = useMemo(() => {
    // 1) From state
    if (state?.summary) {
      const normalized = normalizeSummary(state.summary);
      return { summary: normalized, filename: state.filename || "" };
    }
    // 2) From id query
    const id = q.get("id") || localStorage.getItem("lastResultId");
    const audit = JSON.parse(localStorage.getItem("auditHistory") || "[]");
    const found = audit.find((r) => r.id === id) ?? audit[0];
    if (found) return { summary: normalizeSummary(found.summary ?? found.raw), filename: found.filename };
    return { summary: null, filename: "" };
  }, [state, q]);

  const summary = view.summary;
  const filename = view.filename;

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

      {!summary && (
        <div className="rounded-xl border bg-white p-6">
          <p className="text-slate-700">
            No summary available. Please{" "}
            <Link className="text-indigo-600 underline" to="/analysis">
              upload a contract
            </Link>
            .
          </p>
        </div>
      )}

      {summary && (
        <>
          {/* Contract Summary */}
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
          </section>

          {/* Disclosures */}
          <section className="rounded-2xl bg-white shadow-sm border p-6">
            <h2 className="text-xl font-bold mb-4">Section 32 Disclosures</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(summary.disclosures || {}).map(([k, v]) => (
                <div key={k} className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold capitalize">
                      {k.replace("_", " ")}
                    </h3>
                    <span
                      className={
                        v?.present === true
                          ? "text-emerald-700 text-sm"
                          : v?.present === false
                          ? "text-red-600 text-sm"
                          : "text-slate-500 text-sm"
                      }
                    >
                      {v?.present === true ? "Provided" : v?.present === false ? "Missing/Unclear" : "Unknown"}
                    </span>
                  </div>
                  {v?.detail && (
                    <p className="mt-2 text-sm text-slate-600 whitespace-pre-wrap">
                      {v.detail}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Raw text fallback if we only had a plain text summary */}
          {summary.rawText && (
            <section className="rounded-2xl bg-white shadow-sm border p-6">
              <h2 className="text-xl font-bold mb-3">Detailed Summary</h2>
              <pre className="text-sm text-slate-700 whitespace-pre-wrap">{summary.rawText}</pre>
            </section>
          )}
        </>
      )}
    </div>
  );
}