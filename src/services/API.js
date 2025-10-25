// src/services/api.js
const BACKEND =
  import.meta.env.VITE_BACKEND_URL ||
  "https://contract-backend-production-abf2.up.railway.app";

/**
 * Upload a file to the FastAPI backend.
 * Options:
 *  - ocr: boolean (default true)
 *  - onProgress: (pct:number) => void  (optional UI callback)
 */
export async function uploadFile(file, { ocr = true, onProgress } = {}) {
  const form = new FormData();
  form.append("file", file);
  if (ocr) form.append("ocr", "true");

  // optional: gentle fake progress while waiting on network
  let pct = 10;
  const tick = setInterval(() => {
    pct = Math.min(90, pct + 7);
    onProgress && onProgress(pct);
  }, 350);

  try {
    const res = await fetch(`${BACKEND}/upload`, {
      method: "POST",
      body: form,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `Upload failed with ${res.status}`);
    }

    const data = await res.json(); // expect { summary: {...}, ... }
    onProgress && onProgress(100);
    return data;
  } finally {
    clearInterval(tick);
  }
}

/**
 * Send a customer-friendly email with the summary in the body.
 * Backend route: POST /share-email  { email, filename, summary }
 */
export async function shareReport(email, summary, filename = "Contract.pdf") {
  const res = await fetch(`${BACKEND}/share-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, filename, summary }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Share failed with ${res.status}`);
  }
  return res.json();
}