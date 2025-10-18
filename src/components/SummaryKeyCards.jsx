import React from "react";

const Row = ({ label, value }) => (
  <div className="flex justify-between py-1.5">
    <span className="text-gray-600">{label}</span>
    <span className="font-semibold">{value ?? "—"}</span>
  </div>
);

const get = (o, paths) => {
  for (const p of paths) {
    const v = p.split(".").reduce((a, k) => (a ? a[k] : undefined), o);
    if (v != null && v !== "") return v;
  }
  return null;
};

export default function SummaryKeyCards({ summary }) {
  const address   = get(summary, ["property.address", "title.address", "property_details.address"]);
  const lotPlan   = get(summary, ["property.lot_plan", "title.lot_plan", "property_details.lot_plan"]);
  const landSize  = get(summary, ["property.land_size", "property_details.land_size"]);
  const zoning    = get(summary, ["property.zoning", "planning_zoning.zoning"]);

  const price     = get(summary, ["financial_terms.purchase_price", "financial.purchase_price", "price"]);
  const deposit   = get(summary, ["financial_terms.deposit", "financial.deposit"]);
  const balance   = get(summary, ["financial_terms.balance", "financial.balance"]);
  const duty      = get(summary, ["financial_terms.stamp_duty", "financial.stamp_duty"]);

  const settlement= get(summary, ["key_dates.settlement", "dates.settlement"]);
  const finance   = get(summary, ["key_dates.finance_due", "dates.finance_approval"]);
  const cooling   = get(summary, ["key_dates.cooling_off", "dates.cooling_off"]);
  const possession= get(summary, ["key_dates.possession", "dates.possession"]);

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
          <Row label="Address:" value={address} />
          <Row label="Lot/Plan:" value={lotPlan} />
          <Row label="Land Size:" value={landSize} />
          <Row label="Zoning:" value={zoning} />
        </div>

        <div className="bg-slate-50 rounded-xl p-4">
          <div className="font-semibold mb-2">Financial Terms</div>
          <Row label="Purchase Price:" value={price} />
          <Row label="Deposit:" value={deposit} />
          <Row label="Balance:" value={balance} />
          <Row label="Stamp Duty:" value={duty} />
        </div>

        <div className="bg-slate-50 rounded-xl p-4">
          <div className="font-semibold mb-2">Key Dates</div>
          <Row label="Settlement:" value={settlement} />
          <Row label="Finance Due:" value={finance} />
          <Row label="Cooling Off:" value={cooling} />
          <Row label="Possession:" value={possession} />
        </div>
      </div>
    </div>
  );
}