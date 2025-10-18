// src/components/SummaryKeyCards.jsx
import React from "react";

/** -------- small helpers -------- */
const toText = (v) => {
  if (v == null) return "";
  if (typeof v === "string" || typeof v === "number") return String(v);
  if (Array.isArray(v)) return v.map(toText).filter(Boolean).join(", ");
  // object: pick first primitive leaf
  for (const k of Object.keys(v)) {
    const s = toText(v[k]);
    if (s) return s;
  }
  return "";
};

const flatten = (obj, prefix = "", out = []) => {
  if (!obj || typeof obj !== "object") return out;
  for (const [k, v] of Object.entries(obj)) {
    const p = prefix ? `${prefix}.${k}` : k;
    out.push([p, v]);
    if (v && typeof v === "object") flatten(v, p, out);
  }
  return out;
};

const findByRegex = (summary, regexes) => {
  const flat = flatten(summary);
  const rxs = Array.isArray(regexes) ? regexes : [regexes];
  for (const [path, val] of flat) {
    const key = path.toLowerCase();
    if (rxs.some((rx) => rx.test(key))) {
      const txt = toText(val);
      if (txt) return txt;
    }
  }
  return "";
};

const or = (...vals) => vals.find((v) => v && String(v).trim()) || "Not provided";

/** -------- component -------- */
const Row = ({ label, value }) => (
  <div className="flex justify-between py-1.5">
    <span className="text-gray-600">{label}</span>
    <span className="font-semibold text-gray-900">{value ?? "Not provided"}</span>
  </div>
);

export default function SummaryKeyCards({ summary = {} }) {
  // Property
  const address  = or(
    findByRegex(summary, [/address\b/i, /property.*address/i, /title\.address/i]),
  );
  const lotPlan  = or(
    findByRegex(summary, [/lot.*plan/i, /\bplan\b/i, /\blot\b/i])
  );
  const landSize = or(
    findByRegex(summary, [/land[_\s]?size/i, /area(?!.*rate)/i, /land[_\s]?area/i])
  );
  const zoning   = or(
    findByRegex(summary, [/zoning/i, /\bzone\b/i, /planning.*zoning/i])
  );

  // Financial
  const price   = or(findByRegex(summary, [/purchase[_\s]?price/i, /\bprice\b/i]));
  const deposit = or(findByRegex(summary, [/\bdeposit\b/i]));
  const balance = or(findByRegex(summary, [/\bbalance\b/i, /amount.*due/i]));
  const duty    = or(findByRegex(summary, [/stamp[_\s]?duty/i, /\bduty\b/i]));

  // Dates
  const settlement = or(findByRegex(summary, [/settlement.*date/i, /\bsettlement\b/i]));
  const financeDue = or(findByRegex(summary, [/finance.*(due|approval)/i]));
  const cooling    = or(findByRegex(summary, [/cooling[_\s]?off/i]));
  const possession = or(findByRegex(summary, [/possession/i]));

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
        <h3 className="text-xl font-bold">Contract Summary</h3>
      </div>
      <p className="text-gray-500 mb-3">Key terms and conditions at a glance</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-50 rounded-xl p-4">
          <div className="font-semibold mb-2">Property Details</div>
          <Row label="Address:"  value={address} />
          <Row label="Lot/Plan:" value={lotPlan} />
          <Row label="Land Size:" value={landSize} />
          <Row label="Zoning:"    value={zoning} />
        </div>

        <div className="bg-slate-50 rounded-xl p-4">
          <div className="font-semibold mb-2">Financial Terms</div>
          <Row label="Purchase Price:" value={price} />
          <Row label="Deposit:"        value={deposit} />
          <Row label="Balance:"        value={balance} />
          <Row label="Stamp Duty:"     value={duty} />
        </div>

        <div className="bg-slate-50 rounded-xl p-4">
          <div className="font-semibold mb-2">Key Dates</div>
          <Row label="Settlement:"  value={settlement} />
          <Row label="Finance Due:" value={financeDue} />
          <Row label="Cooling Off:" value={cooling} />
          <Row label="Possession:"  value={possession} />
        </div>
      </div>
    </div>
  );
}