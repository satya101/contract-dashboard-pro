const KEY_HISTORY = "s32.history";
const KEY_LAST = "s32.last";

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

export function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(KEY_HISTORY) || "[]");
  } catch {
    return [];
  }
}

export function saveToHistory({ name, summary }) {
  const item = { id: uid(), name, uploadedAt: Date.now(), summary };
  const cur = loadHistory();
  const next = [item, ...cur].slice(0, 50);
  localStorage.setItem(KEY_HISTORY, JSON.stringify(next));
  return next;
}

export function removeDoc(id) {
  const cur = loadHistory();
  const next = cur.filter((x) => x.id !== id);
  localStorage.setItem(KEY_HISTORY, JSON.stringify(next));
  return next;
}

export function clearHistory() {
  localStorage.setItem(KEY_HISTORY, JSON.stringify([]));
  return [];
}

export function saveLastSummary(obj) {
  localStorage.setItem(KEY_LAST, JSON.stringify(obj));
}

export function loadLastSummary() {
  try {
    return JSON.parse(localStorage.getItem(KEY_LAST) || "null");
  } catch {
    return null;
  }
}