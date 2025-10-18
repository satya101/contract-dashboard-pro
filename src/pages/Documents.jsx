// src/pages/Documents.jsx
import React, { useMemo } from "react";
import {
  Typography, Card, CardContent, IconButton, Stack, TextField, Tooltip,
  FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ShareIcon from "@mui/icons-material/Share";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { loadHistory, saveLastSummary, clearHistory } from "../services/storage.js";
import { exportSummaryAsPDF } from "../utils/pdfExport.js";
import { useNavigate } from "react-router-dom";

const withinDays = (ts, days) => {
  if (!days) return true;
  const d = Number(ts || 0);
  if (!d) return false;
  const cutoff = Date.now() - days * 86400000;
  return d >= cutoff;
};

export default function Documents() {
  const navigate = useNavigate();
  const [query, setQuery] = React.useState("");
  const [range, setRange] = React.useState("any"); // any|7|30|90
  const [docs, setDocs] = React.useState(loadHistory());

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const days = range === "any" ? 0 : Number(range);
    return docs.filter((d) => {
      const nameOK = !q || (d.name || "").toLowerCase().includes(q);
      const dateOK = withinDays(d.ts, days);
      return nameOK && dateOK;
    });
  }, [docs, query, range]);

  const open = (d) => {
    saveLastSummary({ summary: d.summary, fileName: d.name });
    navigate("/results");
  };

  const download = async (d) => {
    // make a temporary container for PDF export (re-uses util that snapshots DOM)
    const tmp = document.createElement("div");
    tmp.style.position = "absolute"; tmp.style.left = "-9999px";
    tmp.innerHTML = `<pre style="font-family:Inter,system-ui,Segoe UI,Roboto,Arial,sans-serif;padding:16px;">${JSON.stringify(d.summary, null, 2)}</pre>`;
    document.body.appendChild(tmp);
    await exportSummaryAsPDF({ container: tmp, docTitle: d.name || "Summary" });
    document.body.removeChild(tmp);
  };

  const share = (d) => {
    const to = prompt("Send report to (email):");
    if (!to) return;
    const subject = `S32 Insights Summary — ${d.name}`;
    const text = JSON.stringify(d.summary, null, 2);
    window.location.href = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
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

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
        <TextField size="small" placeholder="Search by document name" value={query} onChange={(e)=>setQuery(e.target.value)} />
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Date filter</InputLabel>
          <Select label="Date filter" value={range} onChange={(e)=>setRange(e.target.value)}>
            <MenuItem value="any">Any time</MenuItem>
            <MenuItem value="7">Last 7 days</MenuItem>
            <MenuItem value="30">Last 30 days</MenuItem>
            <MenuItem value="90">Last 90 days</MenuItem>
          </Select>
        </FormControl>
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
                  <Tooltip title="View"><IconButton onClick={()=>open(d)}><VisibilityIcon /></IconButton></Tooltip>
                  <Tooltip title="Download PDF"><IconButton onClick={()=>download(d)}><DownloadIcon /></IconButton></Tooltip>
                  <Tooltip title="Share"><IconButton onClick={()=>share(d)}><ShareIcon /></IconButton></Tooltip>
                </Stack>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <Card variant="outlined"><CardContent>No documents match your filters.</CardContent></Card>
        )}
      </div>
    </div>
  );
}