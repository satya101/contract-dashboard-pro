import React, { useState, forwardRef } from "react";

const ORDER = [
  "title","mortgages","planning_zoning","rates_outgoings",
  "insurance","building_permits","notices","special_conditions"
];

const SectionCard = ({ k, data }) => {
  const [open, setOpen] = useState(true);
  const title = k.replace(/_/g, " ").toUpperCase();
  const pages = Array.isArray(data?.page_refs) ? data.page_refs : [];
  const hasSupport = data?.supporting_doc_present;

  // build label:value lines (hide support/page_refs in body)
  const lines = Object.entries(data || {})
    .filter(([key]) => !["supporting_doc_present","page_refs"].includes(key))
    .map(([key, val]) => {
      const label = key.replace(/_/g, " ").replace(/\b\w/g, m => m.toUpperCase());
      const value = Array.isArray(val) ? val.join(", ") : (val ?? "");
      return `${label}: ${value}`;
    })
    .join("\n");

  return (
    <div
      className="bg-white border rounded-lg shadow-sm overflow-hidden"
      data-section-card
      data-section-title={title}
    >
      <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-3">
          <span className="text-xl" title={hasSupport ? "Supporting doc found" : "Supporting doc missing"}>
            {hasSupport ? "✅" : "⚠️"}
          </span>
          <div>
            <div className="font-bold">{title}</div>
            <div className="text-xs text-gray-500">
              {hasSupport ? "Supporting doc found" : "Supporting doc missing"}
              {pages.length ? ` • Pages: ${pages.join(", ")}` : ""}
            </div>
          </div>
        </div>
        <span className="text-blue-600">{open ? "Hide" : "Show"} details</span>
      </div>

      <div
        data-collapsible
        className={`grid transition-all duration-300 ${open ? "max-h-[9999px] opacity-100" : "max-h-0 opacity-0"} px-4 overflow-hidden`}
      >
        <div className="prose prose-sm max-w-none py-4 text-gray-700" data-panel>
          <pre className="whitespace-pre-wrap text-sm">{lines || "—"}</pre>

          {hasSupport === false && (
            <div className="mt-3 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded p-2">
              Follow-up: Ask vendor to provide a complete supporting document for this section.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const IssuesAccordion = ({ issues = [] }) => {
  const [open, setOpen] = useState(false);
  if (!issues.length) return null;
  return (
    <div className="bg-white border rounded-lg">
      <button className="w-full text-left p-4 font-semibold" onClick={() => setOpen(!open)}>
        {open ? "Hide" : "Show"} Issues (advanced) — {issues.length}
      </button>
      <div
        data-collapsible
        className={`transition-all duration-300 ${open ? "max-h-[9999px] opacity-100" : "max-h-0 opacity-0"} overflow-hidden px-4 pb-4`}
      >
        <ul className="list-disc pl-5 text-sm text-amber-800">
          {issues.map((m, i) => <li key={i}>{m}</li>)}
        </ul>
      </div>
    </div>
  );
};

const AuditSection = forwardRef(function AuditSection({ summary, onReset, title = "Review Summary" }, ref) {
  return (
    <div ref={ref} id="summary-root" className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        <button onClick={onReset} className="text-sm px-3 py-1 rounded border hover:bg-gray-50">Upload another</button>
      </div>

      {/* Customer-friendly cards */}
      {ORDER.filter(k => summary?.[k]).map((k) => (
        <SectionCard key={k} k={k} data={summary[k]} />
      ))}

      {/* Advanced: issues list (hidden by default) */}
      <IssuesAccordion issues={summary?.missing_or_unclear || []} />
    </div>
  );
});

export default AuditSection;