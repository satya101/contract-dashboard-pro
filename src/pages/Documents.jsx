// src/pages/Documents.jsx
import React, { useMemo } from "react";
import {
  Typography, Card, CardContent, IconButton, Stack, TextField, Tooltip
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ShareIcon from "@mui/icons-material/Share";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { loadHistory, saveLastSummary, saveToHistory, clearHistory } from "../services/storage.js";
import { exportSummaryAsPDF } from "../utils/pdfExport.js";
import { shareEmail } from "../services/API.js";
import { useNavigate } from "react-router-dom";

export default function Documents() {
  const navigate = useNavigate();
  const [query, setQuery] = React.useState("");
  const [docs, setDocs] = React.useState(loadHistory());

  const filtered = useMemo(() => {
    if (!query.trim()) return docs;
    return docs.filter(d => (d.name || "").toLowerCase().includes(query.toLowerCase()));
  }, [docs, query]);

  const open = (d) => {
    saveLastSummary({ summary: d.summary, fileName: d.name });
    navigate("/results");
  };

  const download = async (d) => {
    const tmp = document.createElement("div");
    tmp.style.position = "absolute"; tmp.style.left = "-9999px";
    document.body.appendChild(tmp);
    tmp.innerText = JSON.stringify(d.summary, null, 2);
    await exportSummaryAsPDF({ container: tmp, docTitle: d.name || "Summary" });
    document.body.removeChild(tmp);
  };

  const share = async (d) => {
    const to = prompt("Send report to (email):");
    if (!to) return;
    const subject = `S32 Insights Summary – ${d.name}`;
    const body = JSON.stringify(d.summary, null, 2);
    const resp = await shareEmail({ to, subject, body }).catch(()=>null);
    if (!resp?.sent) window.location.href = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const removeAll = () => {
    if (!confirm("Clear all audit history?")) return;
    setDocs(clearHistory());
  };

  return (
    <div>
      <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>
        Document Management Center
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Secure, organized, and intelligent document storage with comprehensive version control and collaboration tools.
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField size="small" placeholder="Search by document name" value={query} onChange={(e)=>setQuery(e.target.value)} />
        <Tooltip title="Clear all history">
          <IconButton onClick={removeAll}><DeleteOutlineIcon /></IconButton>
        </Tooltip>
      </Stack>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((d, idx) => (
          <Card key={idx} variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{d.name || "Untitled"}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {d.ts ? new Date(d.ts).toLocaleString() : "—"}
                  </Typography>
                </div>
                <Stack direction="row" spacing={1}>
                  <Tooltip title="View">
                    <IconButton onClick={()=>open(d)}><VisibilityIcon /></IconButton>
                  </Tooltip>
                  <Tooltip title="Download PDF">
                    <IconButton onClick={()=>download(d)}><DownloadIcon /></IconButton>
                  </Tooltip>
                  <Tooltip title="Share">
                    <IconButton onClick={()=>share(d)}><ShareIcon /></IconButton>
                  </Tooltip>
                </Stack>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <Card variant="outlined"><CardContent>No documents found.</CardContent></Card>
        )}
      </div>
    </div>
  );
}