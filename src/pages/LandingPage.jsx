import React from "react";
import {
  AppBar, Toolbar, Container, Box, Typography, Button,
  Stack, Chip
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AnimatedLegalBackground from "../components/AnimatedLegalBackground.jsx";
import HowItWorks from "../components/HowItWorks.jsx";
import { Link as RouterLink } from "react-router-dom";

export default function LandingPage() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
      {/* NAV */}
      <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Toolbar sx={{ maxWidth: 1280, mx: "auto", width: "100%" }}>
          <Typography variant="h6" sx={{ fontWeight: 800, flexGrow: 1 }}>
            ContractLens AI
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button component={RouterLink} to="/" color="inherit">Home</Button>
            <Button component={RouterLink} to="/dashboard" color="inherit">AI Analysis</Button>
            <Button component={RouterLink} to="/results" color="inherit">Results</Button>
            <Button component={RouterLink} to="/pricing" color="inherit">Pricing</Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* HERO */}
      <Box sx={{
        position: "relative", overflow: "hidden",
        py: { xs: 10, md: 14 },
        background: "linear-gradient(180deg, #f8fbff 0%, #ffffff 60%)",
        borderBottom: 1, borderColor: "divider"
      }}>
        <AnimatedLegalBackground opacity={0.12} />
        <Container maxWidth="lg" sx={{ position: "relative" }}>
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
              Confidence in minutes, not days.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
              <Button component={RouterLink} to="/dashboard" size="large" variant="contained" endIcon={<ArrowForwardIcon />}>
                Upload Contract Now
              </Button>
              <Button size="large" variant="outlined" href="#how">See How It Works</Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* HOW IT WORKS – 3 CARDS IN ONE ROW */}
      <Box id="how" sx={{ py: { xs: 6, md: 8 }, bgcolor: "white", borderTop: 1, borderBottom: 1, borderColor: "divider" }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 3, textAlign: "center" }}>How it works</Typography>
          <HowItWorks /> {/* exactly 3 animated cards */}
        </Container>
      </Box>

      {/* FOOTER */}
      <Container maxWidth="lg" sx={{ py: 4, color: "text.secondary" }}>
        <Typography variant="body2">© {new Date().getFullYear()} ContractLens AI. All rights reserved.</Typography>
      </Container>
    </Box>
  );
}