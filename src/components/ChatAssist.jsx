import React, { useState, useEffect } from 'react';
import { askAssistant } from '../services/API';

export default function ChatAssist({ summary, docKey }) {
  const [q, setQ] = useState('');
  const [log, setLog] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const limit = 3;

  useEffect(() => {
    setQ(''); setLog([]); setCount(0);
  }, [docKey]);

  const ask = async () => {
    if (!q.trim() || count >= limit) return;
    setLoading(true);
    try {
      const context = typeof summary === 'string' ? summary : JSON.stringify(summary);
      const res = await askAssistant({ question: q.trim(), context });
      setLog((prev) => [...prev, { q: q.trim(), a: res.answer || JSON.stringify(res) }]);
      setCount((n) => n + 1);
      setQ('');
    } catch (e) {
      setLog((prev) => [...prev, { q: q.trim(), a: 'Failed to get an answer.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 bg-white border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">Ask about this summary (up to 3 questions)</h3>
        <span className="text-xs text-gray-500">{count}/{limit}</span>
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2 text-sm"
          placeholder="Type your question…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          disabled={count >= limit || loading}
        />
        <button onClick={ask} disabled={count >= limit || loading || !q.trim()} className="px-3 py-2 bg-blue-600 text-white rounded text-sm disabled:opacity-50">
          {loading ? 'Asking…' : 'Ask'}
        </button>
      </div>
      <div className="mt-3 space-y-3">
        {log.map((row, i) => (
          <div key={i} className="text-sm">
            <div className="font-medium">Q: {row.q}</div>
            <div className="text-gray-700 whitespace-pre-wrap">A: {row.a}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
