import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import InsightsIcon from "@mui/icons-material/Insights";
import UploadIcon from "@mui/icons-material/Upload";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import ShareIcon from "@mui/icons-material/Share";

const kf = {
  "@keyframes float": {
    "0%": { transform: "translateY(0px)" },
    "50%": { transform: "translateY(-4px)" },
    "100%": { transform: "translateY(0px)" }
  },
  "@keyframes pulse": {
    "0%": { opacity: 0.7 },
    "50%": { opacity: 1 },
    "100%": { opacity: 0.7 }
  }
};

function VisualUpload() {
  return (
    <Box sx={{ height: 100, position: "relative" }}>
      <Box
        sx={{
          width: 56, height: 40, bgcolor: "primary.main", borderRadius: 1,
          mx: "auto", mt: 2, animation: "float 3s ease-in-out infinite", ...kf
        }}
      />
      <Typography align="center" variant="caption" sx={{ opacity: 0.7, mt: 1, display: "block" }}>
        DOCX / PDF
      </Typography>
    </Box>
  );
}

function VisualAI() {
  return (
    <Box sx={{ height: 100, position: "relative" }}>
      <Box
        component="svg"
        viewBox="0 0 120 60"
        sx={{ width: "100%", height: "100%" }}
      >
        <defs>
          <linearGradient id="g" x1="0" x2="1">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        <circle cx="20" cy="30" r="6" fill="url(#g)">
          <animate attributeName="r" values="6;8;6" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="60" cy="30" r="6" fill="url(#g)">
          <animate attributeName="r" values="6;8;6" dur="2s" begin="0.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="100" cy="30" r="6" fill="url(#g)">
          <animate attributeName="r" values="6;8;6" dur="2s" begin="0.4s" repeatCount="indefinite" />
        </circle>
        <line x1="20" y1="30" x2="60" y2="30" stroke="url(#g)" strokeWidth="2">
          <animate attributeName="stroke-dashoffset" from="50" to="0" dur="2s" repeatCount="indefinite" />
        </line>
        <line x1="60" y1="30" x2="100" y2="30" stroke="url(#g)" strokeWidth="2">
          <animate attributeName="stroke-dashoffset" from="50" to="0" dur="2s" begin="0.2s" repeatCount="indefinite" />
        </line>
      </Box>
    </Box>
  );
}

function VisualReview() {
  return (
    <Box sx={{ height: 100, position: "relative" }}>
      <Box sx={{ width: 60, height: 36, border: "2px solid", borderColor: "primary.main", mx: "auto", mt: 2, borderRadius: 1 }} />
      <Box sx={{ width: 18, height: 18, bgcolor: "success.main", borderRadius: "50%", position: "absolute", right: "calc(50% - 40px)", top: 6, animation: "pulse 1.8s ease-in-out infinite", ...kf }} />
    </Box>
  );
}

function VisualShare() {
  return (
    <Box sx={{ height: 100, position: "relative" }}>
      <Box sx={{ width: 60, height: 6, bgcolor: "primary.main", mx: "auto", mt: 5, transform: "skewX(-10deg)", animation: "float 2.6s ease-in-out infinite", ...kf }} />
      <Typography align="center" variant="caption" sx={{ mt: 1, opacity: 0.7 }}>PDF • Email</Typography>
    </Box>
  );
}

const items = [
  { icon: <UploadIcon color="primary" />, title: "Upload", desc: "Drop a PDF or DOCX securely.", Visual: VisualUpload },
  { icon: <InsightsIcon color="primary" />, title: "AI Parse", desc: "Key clauses + evidence references.", Visual: VisualAI },
  { icon: <FactCheckIcon color="primary" />, title: "Review", desc: "Customer-friendly summary + advanced details.", Visual: VisualReview },
  { icon: <ShareIcon color="primary" />, title: "Export & Share", desc: "Multi-page PDF export or email share.", Visual: VisualShare },
];

export default function HowItWorks() {
  return (
    <Grid container spacing={3}>
      {items.map(({ icon, title, desc, Visual }, idx) => (
        <Grid item xs={12} sm={6} md={3} key={idx}>
          <Card variant="outlined" sx={{
            height: "100%",
            display: "flex", flexDirection: "column",
            transition: "transform .2s ease, box-shadow .2s ease",
            "&:hover": { transform: "translateY(-4px)", boxShadow: 4 }
          }}>
            <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
              <Box sx={{ mb: 1 }}>{icon}</Box>
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