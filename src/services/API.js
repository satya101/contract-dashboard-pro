// src/services/API.js
const BASE = import.meta.env.VITE_API_BASE || "https://contract-backend-production-abf2.up.railway.app";

export async function uploadFile(file) {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${BASE}/upload`, { method: "POST", body: form });
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(msg || "Upload failed");
  }
  return res.json();
}

export async function shareEmail({ to, subject, html, text }) {
  const payload = { to, subject, html, text };
  const res = await fetch(`${BASE}/share-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) return null;
  return res.json();
}