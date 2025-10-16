import React from 'react';
import { loadHistory, removeDoc, clearHistory } from '../services/storage';

export default function AuditList({ onSelect }) {
  const [docs, setDocs] = React.useState(loadHistory());

  const handleOpen = (doc) => onSelect?.(doc);
  const handleRemove = (id) => setDocs(removeDoc(id));
  const handleClear = () => setDocs(clearHistory());

  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Audit History</h3>
        <button onClick={handleClear} className="text-xs text-red-600 hover:underline">Clear all</button>
      </div>
      {docs.length === 0 && <p className="text-sm text-gray-500">No previous uploads yet.</p>}
      <ul className="space-y-2">
        {docs.map((d) => (
          <li key={d.id} className="flex items-center justify-between border rounded p-2">
            <div>
              <div className="font-medium">{d.name}</div>
              <div className="text-xs text-gray-500">{new Date(d.uploadedAt).toLocaleString()}</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => handleOpen(d)} className="text-blue-600 text-sm hover:underline">Open</button>
              <button onClick={() => handleRemove(d.id)} className="text-red-600 text-sm hover:underline">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
