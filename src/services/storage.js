// src/services/storage.js
const KEY_HISTORY = "auditHistory";
const KEY_LAST = "lastSummary";

export function loadHistory() {
  try { return JSON.parse(localStorage.getItem(KEY_HISTORY) || "[]"); }
  catch { return []; }
}

export function saveToHistory(item) {
  const hist = loadHistory();
  const record = { ...item, ts: item.ts || Date.now() };
  hist.unshift(record);
  localStorage.setItem(KEY_HISTORY, JSON.stringify(hist.slice(0, 200)));
  return hist;
}

export function clearHistory() {
  localStorage.setItem(KEY_HISTORY, JSON.stringify([]));
  return [];
}

export function saveLastSummary(obj) {
  localStorage.setItem(KEY_LAST, JSON.stringify({ ...obj, ts: Date.now() }));
}

export function loadLastSummary() {
  try { return JSON.parse(localStorage.getItem(KEY_LAST) || "null"); }
  catch { return null; }
}