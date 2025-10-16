import React, { useState, forwardRef } from 'react';

function pickIconAndTone(text='') {
  const t = (text || '').toLowerCase();
  if (t.includes('risk') || t.includes('warning') || t.includes('breach') || t.includes('mortgagee')) {
    return { icon: '⚠️', badge: 'Risk' };
  }
  if (t.includes('compliant') || t.includes('ok') || t.includes('clear') || t.includes('satisfied')) {
    return { icon: '✅', badge: 'Compliant' };
  }
  return { icon: 'ℹ️', badge: 'Info' };
}

function BoldHeadings({ text }) {
  const html = String(text || '').replace(/(Title Info|Insurance|Notices|Mortgages|Planning\/Zoning|Rates|Outgoings)/gi, '<strong>$1</strong>');
  return <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: html }} />;
}

const AuditSection = forwardRef(function AuditSection({ summary, onReset, title = 'Review Summary' }, ref) {
  let items = [];
  if (Array.isArray(summary)) {
    items = summary.map((s) => (typeof s === 'string' ? { title: s.split('\n')[0], detail: s } : s));
  } else if (typeof summary === 'string') {
    items = [{ title: summary.split('\n')[0], detail: summary }];
  } else if (summary && typeof summary === 'object') {
    items = Object.entries(summary).map(([k, v]) => ({
      title: k,
      detail: typeof v === 'string' ? v : JSON.stringify(v, null, 2),
    }));
  }

  return (
    <div ref={ref} id="summary-root" className="max-h-[75vh] overflow-auto pr-1">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <button onClick={onReset} className="text-sm px-3 py-1 rounded border hover:bg-gray-50">Upload another</button>
      </div>

      <div className="space-y-4">
        {items.map((item, idx) => (
          <SummaryCard key={idx} item={item} />
        ))}
      </div>
    </div>
  );
});

function SummaryCard({ item }) {
  const [open, setOpen] = useState(false);
  const { icon, badge } = pickIconAndTone(item.detail);

  return (
    <div className="bg-white border rounded-lg shadow-sm overflow-hidden transition hover:shadow-md">
      <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-3">
          <span className="text-xl" title={badge}>{icon}</span>
          <div>
            <div className="font-bold">{item.title || 'Clause'}</div>
            <div className="text-xs text-gray-500">{badge}</div>
          </div>
        </div>
        <span className="text-blue-600">{open ? 'Hide' : 'Show'} details</span>
      </div>
      <div className={`grid transition-all duration-300 ${open ? 'max-h-[9999px] opacity-100' : 'max-h-0 opacity-0'} px-4 overflow-hidden`}>
        <div className="prose prose-sm max-w-none py-4 text-gray-700">
          <BoldHeadings text={item.detail} />
        </div>
      </div>
    </div>
  );
}

export default AuditSection;
