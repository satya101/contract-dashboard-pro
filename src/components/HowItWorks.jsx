// src/components/HowItWorks.jsx
import React from "react";
import { Grid, Card, CardContent, Typography, Box, Link } from "@mui/material";

/** --- Small animations for the other two cards --- */
const kf = {
  "@keyframes float": {
    "0%": { transform: "translateY(0)" },
    "50%": { transform: "translateY(-6px)" },
    "100%": { transform: "translateY(0)" },
  },
  "@keyframes slide": {
    "0%": { transform: "translateX(0)" },
    "100%": { transform: "translateX(90px)" },
  },
};

/** Canva embed as a React component (responsive 16:9) */
function CanvaEmbed() {
  return (
    <Box sx={{ mt: 2 }}>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: 0,
          pt: "56.25%", // 16:9
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: "0 2px 8px 0 rgba(63,69,81,0.16)",
          willChange: "transform",
        }}
      >
        <iframe
          loading="lazy"
          title="Canva Upload Animation"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            border: "none",
            padding: 0,
            margin: 0,
          }}
          src="https://www.canva.com/design/DAG2IuF1hRg/vSVK1w0ME2EWGRKP7HCJrw/watch?embed"
          allow="fullscreen"
          allowFullScreen
        />
      </Box>
      <Box sx={{ mt: 1 }}>
        <Link
          href="https://www.canva.com/design/DAG2IuF1hRg/vSVK1w0ME2EWGRKP7HCJrw/watch?utm_content=DAG2IuF1hRg&utm_campaign=designshare&utm_medium=embeds&utm_source=link"
          target="_blank"
          rel="noopener"
          underline="hover"
          color="text.secondary"
          variant="caption"
        >
          Design by Rachel Berry
        </Link>
      </Box>
    </Box>
  );
}

function VisualCustomAI() {
  return (
    <Box sx={{ height: 120 }}>
      <Box component="svg" viewBox="0 0 200 90" sx={{ width: "100%", height: "100%" }}>
        <defs>
          <linearGradient id="g" x1="0" x2="1">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        {[30, 100, 170].map((cx, i) => (
          <circle key={i} cx={cx} cy={45} r="10" fill="url(#g)">
            <animate
              attributeName="r"
              values="9;11;9"
              dur="2.2s"
              begin={`${i * 0.15}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
        <line
          x1="40"
          y1="45"
          x2="160"
          y2="45"
          stroke="url(#g)"
          strokeWidth="2"
          strokeDasharray="6 8"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="200"
            to="0"
            dur="3s"
            repeatCount="indefinite"
          />
        </line>
      </Box>
      <Typography align="center" variant="caption" sx={{ mt: 0.5, opacity: 0.7 }}>
        Custom AI Trained Model
      </Typography>
    </Box>
  );
}

function VisualResults() {
  return (
    <Box sx={{ height: 120, position: "relative", ...kf }}>
      <Box
        sx={{
          width: 160,
          height: 90,
          mx: "auto",
          mt: 1.5,
          border: "2px solid",
          borderColor: "primary.main",
          borderRadius: 1,
          position: "relative",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          left: "calc(50% - 70px)",
          top: 58,
          width: 14,
          height: 14,
          borderRadius: "50%",
          bgcolor: "success.main",
          animation: "slide 1.8s linear infinite alternate",
        }}
      />
      <Typography align="center" variant="caption" sx={{ mt: 1, opacity: 0.7 }}>
        Readable summary • Export PDF • Share
      </Typography>
    </Box>
  );
}

const items = [
  {
    title: "Upload Document",
    desc: "Drop a PDF/DOCX securely with instant verification.",
    Visual: CanvaEmbed, // <- Canva animation here
  },
  {
    title: "Custom AI Trained Model",
    desc: "OCR + clause extraction + legal reasoning tuned for Section 32.",
    Visual: VisualCustomAI,
  },
  {
    title: "View Results",
    desc: "Readable summary, advanced details, export PDF or share via email.",
    Visual: VisualResults,
  },
];

export default function HowItWorks({ forceOneRow = false }) {
  return (
    <Grid container spacing={3} alignItems="stretch">
      {items.map(({ title, desc, Visual }, i) => (
        <Grid key={i} item xs={12} md={forceOneRow ? 4 : 12} lg={4}>
          <Card
            variant="outlined"
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              transition: "transform .2s ease, box-shadow .2s ease",
              "&:hover": { transform: "translateY(-4px)", boxShadow: 4 },
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                {title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {desc}
              </Typography>
              <Visual />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}