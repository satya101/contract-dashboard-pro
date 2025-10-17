import React from "react";
import { removeDoc } from "../services/storage.js";

export default function AuditList({ docs = [], onSelect }) {
  const [list, setList] = React.useState(docs);

  React.useEffect(() => setList(docs), [docs]);

  const handleOpen = (doc) => onSelect?.(doc);
  const handleRemove = (id) => setList(removeDoc(id));

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Audit History</h3>
      </div>
      {list.length === 0 && <p className="text-sm text-gray-500">No previous uploads yet.</p>}
      <ul className="space-y-2">
        {list.map((d) => (
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