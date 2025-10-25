// src/utils/normalize.js
// Make the frontend resilient to backend response shape changes.

const get = (obj, keys, fallback = undefined) => {
    for (const k of keys) {
      const parts = k.split(".");
      let cur = obj;
      let ok = true;
      for (const p of parts) {
        if (cur && Object.prototype.hasOwnProperty.call(cur, p)) {
          cur = cur[p];
        } else {
          ok = false;
          break;
        }
      }
      if (ok) return cur;
    }
    return fallback;
  };
  
  // Try to coerce raw payload into our expected "summary" object
  export function normalizeSummary(raw) {
    if (!raw) return null;
  
    // common wrappers
    const candidate =
      raw.summary ??
      raw.data?.summary ??
      raw.result?.summary ??
      raw.analysis?.summary ??
      raw.data ??
      raw.result ??
      raw.analysis ??
      raw; // sometimes the summary is top-level
  
    // If backend returns plain text, store it in "rawText"
    if (typeof candidate === "string") {
      return {
        rawText: candidate,
        property: {},
        financial: {},
        dates: {},
        disclosures: {},
      };
    }
  
    const s = candidate || {};
  
    // PROPERTY
    const property = {
      address: get(s, ["property.address", "property_address", "Address"]),
      lot_plan:
        get(s, ["property.lot_plan", "property.lotPlan", "lot_plan", "lot", "title.lot"]) ??
        [get(s, ["title.lot"]), get(s, ["title.plan"])].filter(Boolean).join(" / ") ||
        undefined,
      land_size: get(s, ["property.land_size", "land_size", "land.size"]),
      zoning: get(s, ["property.zoning", "zoning", "planning.zoning"]),
    };
  
    // FINANCIAL
    const financial = {
      price: get(s, ["financial.price", "purchase_price", "price", "consideration"]),
      deposit: get(s, ["financial.deposit", "deposit"]),
      balance: get(s, ["financial.balance", "balance_due"]),
      stamp_duty: get(s, ["financial.stamp_duty", "stampDuty", "stamp_duty"]),
    };
  
    // DATES
    const dates = {
      settlement: get(s, ["dates.settlement", "settlement_date", "key_dates.settlement"]),
      finance_due: get(s, ["dates.finance_due", "finance_due_date", "key_dates.finance"]),
      cooling_off: get(s, ["dates.cooling_off", "cooling_off_period", "key_dates.cooling_off"]),
      possession: get(s, ["dates.possession", "possession_date"]),
    };
  
    // DISCLOSURES (Section 32)
    const sourceDisc =
      s.disclosures ||
      s.section32 ||
      s.section_32 ||
      s.checklist ||
      {};
  
    const coerceStatus = (v) => {
      if (v === true || v === false) return v;
      if (typeof v === "string") {
        const t = v.toLowerCase();
        if (["yes", "present", "provided", "included", "attached"].includes(t)) return true;
        if (["no", "missing", "not provided", "absent"].includes(t)) return false;
      }
      if (v && typeof v === "object" && "present" in v) return !!v.present;
      return undefined; // unknown
    };
  
    const disclosures = {
      title: sourceDisc.title ?? sourceDisc["title_certificate"],
      mortgages: sourceDisc.mortgages ?? sourceDisc.mortgage,
      planning_zoning: sourceDisc.planning_zoning ?? sourceDisc["planning/zoning"] ?? sourceDisc.planning ?? sourceDisc.zoning,
      rates: sourceDisc.rates ?? sourceDisc.council_rates,
      insurance: sourceDisc.insurance ?? sourceDisc.building_insurance,
      outgoings: sourceDisc.outgoings ?? sourceDisc.owners_corp_fees ?? sourceDisc["owners_corporation"],
      notices: sourceDisc.notices ?? sourceDisc.statements_notices ?? sourceDisc["notices_or_orders"],
    };
  
    // Normalize each disclosure into {present:boolean|undefined, detail?:string}
    const normDisc = {};
    for (const key of Object.keys(disclosures)) {
      const val = disclosures[key];
      if (val == null) {
        normDisc[key] = { present: undefined, detail: undefined };
        continue;
      }
      if (typeof val === "object" && ("present" in val || "detail" in val)) {
        normDisc[key] = {
          present: coerceStatus(val.present),
          detail: val.detail ?? val.notes ?? val.text,
        };
      } else if (typeof val === "string") {
        normDisc[key] = {
          present: coerceStatus(val),
          detail: val,
        };
      } else if (typeof val === "boolean") {
        normDisc[key] = { present: val, detail: undefined };
      } else {
        normDisc[key] = { present: undefined, detail: JSON.stringify(val) };
      }
    }
  
    return { property, financial, dates, disclosures: normDisc, raw: raw };
  }