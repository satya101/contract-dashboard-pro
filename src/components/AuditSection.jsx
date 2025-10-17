import React, { useState, forwardRef } from 'react';

function pickIconAndTone(text='') {
  const t = (text || '').toLowerCase();
  if (t.includes('special condition') || t.includes('caveat')) return { icon: '🚩', badge: 'Special' };
  if (t.includes('risk') || t.includes('warning') || t.includes('breach') || t.includes('mortgagee')) return { icon: '⚠️', badge: 'Risk' };
  if (t.includes('compliant') || t.includes('ok') || t.includes('clear') || t.includes('satisfied')) return { icon: '✅', badge: 'Compliant' };
  return { icon: 'ℹ️', badge: 'Info' };
}

function BoldHeadings({ text }) {
  const s = String(text || '');
  const withBold = s
    .replace(/(Title Info|Insurance|Notices|Mortgages|Planning\/Zoning|Rates|Outgoings)/gi, '<strong>$1</strong>')
    .replace(/(Special Conditions?|Caveats?)/gi, '<mark><strong>$1</strong></mark>');
  return <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: withBold }} />;
}

const ORDER = [
  "title","mortgages","planning_zoning","rates_outgoings","insurance","building_permits","notices","special_conditions"
];

const AuditSection = forwardRef(function AuditSection({ summary, onReset, title = 'Review Summary' }, ref) {
  const items = buildItems(summary);

  return (
    <div ref={ref} id="summary-root" className="max-h-[75vh] overflow-auto pr-1">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <button onClick={onReset} className="text-sm px-3 py-1 rounded border hover:bg-gray-50">Upload another</button>
      </div>

      {Array.isArray(summary?.missing_or_unclear) && summary.missing_or_unclear.length > 0 && (
        <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded p-3">
          <div className="font-semibold mb-1">Missing or Unclear</div>
          <ul className="list-disc pl-5 text-sm text-yellow-800">
            {summary.missing_or_unclear.map((m,i) => <li key={i}>{m}</li>)}
          </ul>
        </div>
      )}

      <div className="space-y-4">
        {items.map((item, idx) => (
          <SummaryCard key={idx} item={item} />
        ))}
      </div>
    </div>
  );
});

function buildItems(summary) {
  if (!summary) return [];
  if (Array.isArray(summary)) {
    return summary.map((s) => (typeof s === 'string' ? { title: s.split('\n')[0], detail: s } : s));
  }
  if (typeof summary === 'string') {
    return [{ title: summary.split('\n')[0], detail: summary }];
  }
  if (typeof summary === 'object') {
    const items = [];
    for (const key of ORDER) {
      if (summary[key]) {
        const v = summary[key];
        items.push({
          title: prettyTitle(key),
          raw: v,
          detail: typeof v === 'string' ? v : JSON.stringify(v, null, 2),
        });
      }
    }
    return items;
  }
  return [];
}

function prettyTitle(k) {
  return k.replace(/_/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
}

function SummaryCard({ item }) {
  const [open, setOpen] = useState(true);
  const { icon, badge } = pickIconAndTone(item.detail);

  const pageRefs = Array.isArray(item.raw?.page_refs) ? item.raw.page_refs : [];
  const hasSupport = typeof item.raw?.supporting_doc_present === 'boolean' ? item.raw.supporting_doc_present : null;

  return (
    <div className="bg-white border rounded-lg shadow-sm overflow-hidden transition hover:shadow-md">
      <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-3">
          <span className="text-xl" title={badge}>{icon}</span>
          <div>
            <div className="font-bold">{item.title || 'Clause'}</div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span>{badge}</span>
              {hasSupport !== null && (
                <span className={`px-2 py-0.5 rounded border ${hasSupport ? 'bg-green-50 border-green-200 text-green-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                  {hasSupport ? 'Supporting doc found' : 'Supporting doc missing'}
                </span>
              )}
              {pageRefs.length > 0 && (
                <span className="text-gray-500">Pages: {pageRefs.join(', ')}</span>
              )}
            </div>
          </div>
        </div>
        <span className="text-blue-600">{open ? 'Hide' : 'Show'} details</span>
      </div>
      <div
        data-collapsible
        className={`grid transition-all duration-300 ${open ? 'max-h-[9999px] opacity-100' : 'max-h-0 opacity-0'} px-4 overflow-hidden`}
      >
        <div className="prose prose-sm max-w-none py-4 text-gray-700" data-panel>
          <BoldHeadings text={item.detail} />
          {hasSupport === false && (
            <div className="mt-3 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded p-2">
              Follow-up: Ask vendor to provide a complete supporting document for this section.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuditSection;