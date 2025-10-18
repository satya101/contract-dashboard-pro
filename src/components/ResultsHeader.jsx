import React from "react";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import ShareIcon from "@mui/icons-material/Share";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

export default function ResultsHeader({ fileName, processedAt, processingSeconds, pages, onExportPDF, onShareEmail }) {
  const dateStr = processedAt ? new Date(processedAt).toLocaleString() : new Date().toLocaleString();
  const pagesStr = pages ? `${pages} pages` : "—";
  const onShare = () => {
    const to = prompt("Send report to (email):");
    if (to) onShareEmail?.({ to });
  };

  return (
    <Box sx={{
      p: 3, borderRadius: 3, background: "linear-gradient(180deg,#f8fbff 0%,#fffbe6 100%)",
      border: 1, borderColor: "divider", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, flexWrap: "wrap"
    }}>
      <div>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: .5 }}>
          <Chip label="Analysis Complete" color="success" variant="outlined" />
        </Stack>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: .3 }}>
          {fileName || "Section 32 Contract"}
        </Typography>
        <Stack direction="row" spacing={3} sx={{ color: "text.secondary" }}>
          <span><AccessTimeIcon sx={{ fontSize: 18, mr: .5, verticalAlign: "text-bottom" }} /> Analyzed: {dateStr}</span>
          <span><AccessTimeIcon sx={{ fontSize: 18, mr: .5, verticalAlign: "text-bottom" }} /> Processing Time: {processingSeconds ? `${processingSeconds}s` : "—"}</span>
          <span><InsertDriveFileIcon sx={{ fontSize: 18, mr: .5, verticalAlign: "text-bottom" }} /> Document: {pagesStr}</span>
        </Stack>
      </div>
      <Stack direction="row" spacing={2}>
        <Button variant="contained" onClick={onExportPDF} startIcon={<DownloadIcon />}>Download Report</Button>
        <Button variant="contained" color="inherit" onClick={onShare} startIcon={<ShareIcon />}>Share Report</Button>
      </Stack>
    </Box>
  );
}