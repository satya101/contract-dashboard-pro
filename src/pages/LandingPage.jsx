// src/pages/LandingPage.jsx
import React from "react";
import { Box, Typography, Stack, Chip } from "@mui/material";
import AnimatedLegalBackground from "../components/AnimatedLegalBackground.jsx";
import HowItWorks from "../components/HowItWorks.jsx";

export default function LandingPage() {
  return (
    <Box sx={{ width: "100%" }}>
      {/* HERO (no local nav; SiteShell provides it) */}
      <Box sx={{
        position: "relative", overflow: "hidden",
        py: { xs: 8, md: 12 },
        background: "linear-gradient(180deg, #f8fbff 0%, #ffffff 60%)",
        borderRadius: 3,
      }}>
        <AnimatedLegalBackground opacity={0.12} />
        <Stack spacing={2.5} alignItems="center" textAlign="center">
          <Chip label="Trusted by 50,000+ Property Buyers" color="primary" variant="outlined" />
          <Typography variant="h2" sx={{ fontWeight: 900, lineHeight: 1.05, maxWidth: 1000 }}>
            See What Others Miss in Your <Box component="span" sx={{
              background: "linear-gradient(90deg,#4f46e5,#06b6d4,#f59e0b)",
              WebkitBackgroundClip: "text", color: "transparent"
            }}>Property Contract</Box>
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 900 }}>
            Section 32-aware AI turns complex contracts into clear, actionable insights.
          </Typography>
        </Stack>
      </Box>

      {/* HOW IT WORKS – exactly one row on desktop */}
      <Box id="how" sx={{ mt: 5 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 3, textAlign: "center" }}>
          How it works
        </Typography>
        <HowItWorks forceOneRow />
      </Box>
    </Box>
  );
}