const API_BASE = import.meta.env.VITE_API_BASE || "https://contract-backend-production-abf2.up.railway.app";

export async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE}/upload`, { method: "POST", body: formData });
  if (!res.ok) throw new Error("Upload failed");
  return await res.json();
}

export async function parseContract(fileRef) {
  if (fileRef) {
    const res = await fetch(`${API_BASE}/parse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file: fileRef }),
    });
    if (!res.ok) throw new Error("Parse failed");
    return await res.json();
  } else {
    const res = await fetch(`${API_BASE}/parse`);
    if (!res.ok) throw new Error("Parse failed");
    return await res.json();
  }
}

// Optional backend email share (if you implement an endpoint)
export async function shareEmail({ to, subject, body }) {
  const emailEndpoint = import.meta.env.VITE_EMAIL_ENDPOINT;
  if (!emailEndpoint) {
    throw new Error("VITE_EMAIL_ENDPOINT not set; using mailto fallback.");
  }
  const res = await fetch(emailEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to, subject, body }),
  });
  if (!res.ok) throw new Error("Email send failed");
  return res.json();
}
