// src/services/API.js
import axios from "axios";

const API_BASE =
  import.meta.env.VITE_BACKEND_URL?.replace(/\/+$/, "") ||
  "https://contract-backend-production-abf2.up.railway.app";

export async function uploadFile(file, { ocr = "auto", onProgress } = {}) {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("ocr", ocr);

  const res = await axios.post(`${API_BASE}/upload`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (evt) => {
      if (onProgress && evt.total) {
        const pct = Math.round((evt.loaded / evt.total) * 100);
        onProgress({ stage: "upload", pct });
      }
    },
    timeout: 120000,
  });

  return res.data;
}

export async function shareEmail({ to, subject, html }) {
  const res = await axios.post(`${API_BASE}/share-email`, {
    to_email: to,
    subject,
    html,
  });
  return res.data;
}