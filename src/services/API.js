const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "");

async function toJsonSafe(res) {
  try { return await res.json(); } catch { return null; }
}

export async function uploadFile(file) {
  if (!API_BASE) throw new Error("VITE_API_BASE not set");
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch(`${API_BASE}/upload`, { method: "POST", body: fd });
  if (!res.ok) {
    const j = await toJsonSafe(res);
    throw new Error(j?.detail || `Upload failed (${res.status})`);
  }
  return res.json();
}

export async function askAssistant({ question, context }) {
  const res = await fetch(`${API_BASE}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, context }),
  });
  if (!res.ok) throw new Error("Ask failed");
  return res.json();
}

export async function shareEmail({ to, subject, body }) {
  const res = await fetch(`${API_BASE}/share-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to, subject, body }),
  });
  if (!res.ok) throw new Error("Email failed");
  return res.json();
}

export async function submitFeedback({ rating, message, email, docName }) {
  const res = await fetch(`${API_BASE}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rating, message, email, docName }),
  });
  const j = await toJsonSafe(res);
  if (!res.ok) throw new Error(j?.detail || "Feedback failed");
  return j || { ok: true };
}