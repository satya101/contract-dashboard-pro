import React, { useState } from "react";

export default function ChatAssist({ ask }) {
  const [q, setQ] = useState("");
  const [items, setItems] = useState([]);

  const onAsk = async () => {
    if (!q.trim()) return;
    const res = await ask(q);
    setItems((prev) => [...prev, { q, a: res?.answer || "No answer" }]);
    setQ("");
    setTimeout(() => {
      document.getElementById("chat-bottom")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="font-semibold mb-3">Ask (max 3)</div>
      <div className="flex items-center gap-2 mb-3">
        <input
          className="flex-1 border rounded px-3 py-2"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ask about insurance, permits, zoning…"
        />
        <button onClick={onAsk} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Ask
        </button>
      </div>
      <div className="space-y-3 max-h-64 overflow-auto pr-1">
        {items.map((it, i) => (
          <div key={i} className="border rounded p-2">
            <div className="text-sm"><span className="font-semibold">Q:</span> {it.q}</div>
            <div className="text-sm mt-1 whitespace-pre-wrap"><span className="font-semibold">A:</span> {it.a}</div>
          </div>
        ))}
        <div id="chat-bottom" />
      </div>
    </div>
  );
}