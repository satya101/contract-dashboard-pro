import React from "react";
import { LinearProgress, Box, Chip, Stack, Typography } from "@mui/material";

export default function ProcessingPanel({ stages = [], stageIdx = 0, progressPct = 0, etaSeconds = 30 }) {
  return (
    <div className="bg-white border rounded-2xl p-6 shadow-sm">
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
        Secure AI Analysis
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        We’re processing your document. You can navigate away; your results will still appear here.
      </Typography>

      <LinearProgress variant="determinate" value={progressPct} sx={{ height: 10, borderRadius: 2, mb: 2 }} />
      <div className="text-sm text-gray-600 mb-4">Estimated time remaining: ~{etaSeconds}s</div>

      <Stack direction="row" spacing={2} flexWrap="wrap">
        {stages.map((s, i) => (
          <Chip
            key={s}
            label={`${i + 1}. ${s}`}
            color={i < stageIdx ? "success" : i === stageIdx ? "primary" : "default"}
            variant={i <= stageIdx ? "filled" : "outlined"}
            sx={{ mb: 1 }}
          />
        ))}
      </Stack>
    </div>
  );
}