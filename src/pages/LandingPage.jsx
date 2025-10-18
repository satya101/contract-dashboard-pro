import React from "react";
import {
  AppBar, Toolbar, Container, Box, Typography, Button,
  Grid, Card, CardContent, Stack, Chip, Avatar
} from "@mui/material";
import GavelIcon from "@mui/icons-material/Gavel";
import SecurityIcon from "@mui/icons-material/Security";
import TimelineIcon from "@mui/icons-material/Timeline";
import InsightsIcon from "@mui/icons-material/Insights";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AnimatedLegalBackground from "../components/AnimatedLegalBackground.jsx";
import HowItWorks from "../components/HowItWorks.jsx";
import { Link as RouterLink } from "react-router-dom";

function Feature({ icon, title, desc }) {
  return (
    <Card variant="outlined" sx={{ height: "100%", borderRadius: 3 }}>
      <CardContent>
        <Box sx={{ mb: 1 }}>{icon}</Box>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {desc}
        </Typography>
      </CardContent>
    </Card>
  );
}

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
            <Button color="inherit">Results</Button>
            <Button color="inherit">Professional</Button>
            <Button color="inherit">Documents</Button>
            <Button color="inherit">Pricing</Button>
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
              Your AI legal advisor transforms complex Section 32 contracts into clear, actionable insights.
              Get confidence in minutes, not days.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
              <Button component={RouterLink} to="/dashboard" size="large" variant="contained" endIcon={<ArrowForwardIcon />}>
                Upload Contract Now
              </Button>
              <Button size="large" variant="outlined">Watch Demo</Button>
            </Stack>
            <Stack direction="row" spacing={3} sx={{ pt: 1 }} justifyContent="center">
              <Typography variant="body2" color="text.secondary">🟢 99.7% Accuracy Rate</Typography>
              <Typography variant="body2" color="text.secondary">🟢 Bank-Grade Security</Typography>
              <Typography variant="body2" color="text.secondary">🟢 Results in 5 Minutes</Typography>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* STEPS UPLOAD (hero-like module) */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Typography variant="h4" sx={{ fontWeight: 800, textAlign: "center", mb: 4 }}>
          Upload Your Section 32 Contract
        </Typography>
        {/* You already have the UploadZone on the /dashboard page; keep the flow there. */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Feature icon={<GavelIcon color="primary" fontSize="large" />} title="Upload Document"
              desc="Drop a PDF/DOCX securely with instant verification." />
          </Grid>
          <Grid item xs={12} md={4}>
            <Feature icon={<InsightsIcon color="primary" fontSize="large" />} title="AI Processing"
              desc="OCR, clause extraction, and legal reasoning with evidence tags." />
          </Grid>
          <Grid item xs={12} md={4}>
            <Feature icon={<TimelineIcon color="primary" fontSize="large" />} title="View Results"
              desc="Readable summary, advanced details, export PDF or share via email." />
          </Grid>
        </Grid>
      </Container>

      {/* HOW IT WORKS (interactive) */}
      <Box id="how" sx={{ py: { xs: 6, md: 8 }, bgcolor: "white", borderTop: 1, borderBottom: 1, borderColor: "divider" }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 3, textAlign: "center" }}>How it works</Typography>
          <HowItWorks />
        </Container>
      </Box>

      {/* TESTIMONIAL */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ bgcolor: "primary.main" }}>A</Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                “Finally a Section 32 summary my clients actually understand.”
              </Typography>
              <Typography variant="body2" color="text.secondary">– Alex, Property Lawyer</Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>

      {/* CTA STRIP */}
      <Box sx={{ py: 8, bgcolor: "primary.main", color: "primary.contrastText" }}>
        <Container maxWidth="lg">
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                Ready to review your contract?
              </Typography>
              <Typography>Upload a PDF or DOCX and get a clear, customer-friendly summary in minutes.</Typography>
            </Grid>
            <Grid item xs={12} md="auto">
              <Button
                component={RouterLink}
                to="/dashboard"
                size="large"
                variant="contained"
                color="secondary"
                sx={{ color: "primary.main", bgcolor: "common.white", "&:hover": { bgcolor: "grey.100" } }}
                endIcon={<ArrowForwardIcon />}
              >
                Review Your Contract Now
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* FOOTER */}
      <Container maxWidth="lg" sx={{ py: 4, color: "text.secondary" }}>
        <Typography variant="body2">© {new Date().getFullYear()} ContractLens AI. All rights reserved.</Typography>
      </Container>
    </Box>
  );
}