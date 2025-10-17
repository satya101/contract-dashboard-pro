import React, { useState, forwardRef } from "react";

const ORDER = ["title","mortgages","planning_zoning","rates_outgoings","insurance","building_permits","notices","special_conditions"];

const SectionCard = ({ k, data }) => {
  const [open, setOpen] = useState(true);
  const title = k.replace(/_/g, " ").toUpperCase();
  const pages = Array.isArray(data?.page_refs) ? data.page_refs : [];
  const hasSupport = data?.supporting_doc_present;

  return (
    <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-3">
          <span className="text-xl">{hasSupport ? "✅" : "⚠️"}</span>
          <div>
            <div className="font-bold">{title}</div>
            <div className="text-xs text-gray-500">
              {hasSupport ? "Supporting doc found" : "Supporting doc missing"} {pages.length ? `• Pages: ${pages.join(", ")}` : ""}
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
          <pre className="whitespace-pre-wrap text-sm">
            {/* render tidy label/value pairs */}
            {Object.entries(data || {})
              .filter(([key]) => !["supporting_doc_present","page_refs"].includes(key))
              .map(([key, val]) => (
                `${key.replace(/_/g, " ").replace(/\b\w/g, m => m.toUpperCase())}: ${Array.isArray(val) ? val.join(", ") : (val ?? "")}\n`
              ))
              .join("")}
          </pre>
          {!hasSupport && (
            <div className="mt-3 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded p-2">
              Follow-up: Ask vendor to provide a complete supporting document for this section.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const RawDetails = ({ summary }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white border rounded-lg">
      <button className="w-full text-left p-4 font-semibold" onClick={() => setOpen(!open)}>
        {open ? "Hide Advanced details (raw JSON)" : "Show Advanced details (raw JSON)"}
      </button>
      <div
        data-collapsible
        className={`transition-all duration-300 ${open ? "max-h-[9999px] opacity-100" : "max-h-0 opacity-0"} overflow-hidden px-4 pb-4`}
      >
        <pre className="text-xs bg-gray-50 border rounded p-3 whitespace-pre-wrap">{JSON.stringify(summary, null, 2)}</pre>
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

      {Array.isArray(summary?.missing_or_unclear) && summary.missing_or_unclear.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
          <div className="font-semibold mb-1">Missing or Unclear</div>
          <ul className="list-disc pl-5 text-sm text-yellow-800">
            {summary.missing_or_unclear.map((m,i) => <li key={i}>{m}</li>)}
          </ul>
        </div>
      )}

      {/* Overview cards */}
      {ORDER.filter(k => summary?.[k]).map((k) => (
        <SectionCard key={k} k={k} data={summary[k]} />
      ))}

      {/* Collapsible raw JSON */}
      <RawDetails summary={summary} />
    </div>
  );
});

export default AuditSection;