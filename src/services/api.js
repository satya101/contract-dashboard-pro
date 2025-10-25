const BACKEND = import.meta.env.VITE_BACKEND_URL || "https://contract-backend-production-abf2.up.railway.app";

export async function uploadFile(file, { ocr = true, onProgress } = {}) {
  const form = new FormData();
  form.append("file", file);
  if (ocr) form.append("ocr", "true");

  // UI progress helper
  let pct = 10;
  const tick = setInterval(() => {
    pct = Math.min(90, pct + 7);
    onProgress && onProgress(pct);
  }, 350);

  try {
    const res = await fetch(`${BACKEND}/upload`, { method: "POST", body: form });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json(); // <- should contain the summary or data we can normalize
    onProgress && onProgress(100);
    return data;
  } finally {
    clearInterval(tick);
  }
}

export async function shareReport(email, summary, filename = "Contract.pdf") {
  const res = await fetch(`${BACKEND}/share-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, filename, summary }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}