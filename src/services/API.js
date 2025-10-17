const API_BASE = import.meta.env.VITE_API_BASE || "https://contract-backend-production-abf2.up.railway.app";
export async function uploadFile(file) {
  if (!API_BASE) throw new Error("VITE_API_BASE not set");
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: fd,
  });
  if (!res.ok) {
    let detail = "";
    try {
      const j = await res.json();
      detail = j?.detail || JSON.stringify(j);
    } catch {}
    throw new Error(detail || `Upload failed (${res.status})`);
  }
  return res.json();
}

export async function askAssistant({ question, context }) {
  if (!API_BASE) throw new Error("VITE_API_BASE not set");
  const res = await fetch(`${API_BASE}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, context }),
  });
  if (!res.ok) throw new Error("Ask failed");
  return res.json();
}

export async function shareEmail({ to, subject, body }) {
  if (!API_BASE) throw new Error("VITE_API_BASE not set");
  const res = await fetch(`${API_BASE}/share-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to, subject, body }),
  });
  if (!res.ok) throw new Error("Email failed");
  return res.json();
}