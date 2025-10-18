import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";

const kf = {
  "@keyframes float": { "0%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-6px)" }, "100%": { transform: "translateY(0)" } },
  "@keyframes pulse": { "0%": { opacity: .7 }, "50%": { opacity: 1 }, "100%": { opacity: .7 } },
};

function VisualUpload() {
  return (
    <Box sx={{ height: 110 }}>
      <Box sx={{
        width: 140, height: 80, mx: "auto", mt: 2,
        border: "2px dashed", borderColor: "primary.main",
        borderRadius: 2, backgroundColor: "primary.main", opacity: .08,
        animation: "float 3s ease-in-out infinite", ...kf
      }} />
      <Typography align="center" variant="caption" sx={{ mt: 1, opacity: .7 }}>DOCX / PDF • Instant verification</Typography>
    </Box>
  );
}

function VisualCustomAI() {
  return (
    <Box sx={{ height: 110 }}>
      <Box component="svg" viewBox="0 0 160 90" sx={{ width: "100%", height: "100%" }}>
        <defs>
          <linearGradient id="g" x1="0" x2="1">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        {[[30,45],[80,20],[130,45],[80,70]].map(([cx,cy],i)=>(
          <circle key={i} cx={cx} cy={cy} r="8" fill="url(#g)">
            <animate attributeName="r" values="8;10;8" dur="2.2s" begin={`${i*0.15}s`} repeatCount="indefinite" />
          </circle>
        ))}
        {[[30,45,80,20],[80,20,130,45],[130,45,80,70],[80,70,30,45]].map((l,i)=>(
          <line key={i} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} stroke="url(#g)" strokeWidth="2" strokeDasharray="4 6">
            <animate attributeName="stroke-dashoffset" from="200" to="0" dur="3s" repeatCount="indefinite" />
          </line>
        ))}
      </Box>
      <Typography align="center" variant="caption" sx={{ mt: .5, opacity: .7 }}>Custom AI Trained Model</Typography>
    </Box>
  );
}

function VisualResults() {
  return (
    <Box sx={{ height: 110, position: "relative" }}>
      <Box sx={{ width: 140, height: 84, mx: "auto", mt: 1.5, border: "2px solid", borderColor: "primary.main", borderRadius: 1 }} />
      <Box sx={{ position:"absolute", left:"calc(50% + 24px)", top: 18, width: 20, height: 20, borderRadius:"50%",
        bgcolor:"success.main", animation:"pulse 1.8s ease-in-out infinite", ...kf }} />
      <Typography align="center" variant="caption" sx={{ mt: 1, opacity: .7 }}>Readable summary • Export PDF • Share</Typography>
    </Box>
  );
}

const items = [
  { title: "Upload Document", desc: "Drop a PDF/DOCX securely with instant verification.", Visual: VisualUpload },
  { title: "Custom AI Trained Model", desc: "OCR + clause extraction + legal reasoning tuned for Section 32.", Visual: VisualCustomAI },
  { title: "View Results", desc: "Readable summary, advanced details, export PDF or share via email.", Visual: VisualResults },
];

export default function HowItWorks() {
  return (
    <Grid container spacing={3} alignItems="stretch">
      {items.map(({ title, desc, Visual }, i) => (
        <Grid key={i} item xs={12} md={4}>
          <Card variant="outlined" sx={{
            height: "100%", display: "flex", flexDirection: "column",
            transition: "transform .2s ease, box-shadow .2s ease",
            "&:hover": { transform: "translateY(-4px)", boxShadow: 4 }
          }}>
            <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: .5 }}>{title}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{desc}</Typography>
              <Visual />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}