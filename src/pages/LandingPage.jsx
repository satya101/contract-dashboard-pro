// src/pages/LandingPage.jsx
import React from "react";
import {
  AppBar, Toolbar, Container, Box, Typography, Button,
  Grid, Card, CardContent, Stack, Chip
} from "@mui/material";
import GavelIcon from "@mui/icons-material/Gavel";
import SecurityIcon from "@mui/icons-material/Security";
import TimelineIcon from "@mui/icons-material/Timeline";
import InsightsIcon from "@mui/icons-material/Insights";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AnimatedLegalBackground from "../components/AnimatedLegalBackground.jsx";
import { Link as RouterLink } from "react-router-dom";

export default function LandingPage() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
      {/* NAV */}
      <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Toolbar sx={{ maxWidth: 1280, mx: "auto", width: "100%" }}>
          <Typography variant="h6" sx={{ fontWeight: 800, flexGrow: 1 }}>
            S32 Insights
          </Typography>
          <Button
            component={RouterLink}
            to="/dashboard"
            variant="outlined"
            size="small"
          >
            Open Dashboard
          </Button>
        </Toolbar>
      </AppBar>

      {/* HERO */}
      <Box sx={{ position: "relative", overflow: "hidden", py: { xs: 10, md: 14 } }}>
        <AnimatedLegalBackground opacity={0.16} />
        <Container maxWidth="lg" sx={{ position: "relative" }}>
          <Stack spacing={3} alignItems="flex-start" sx={{ maxWidth: 760 }}>
            <Chip label="AI-Powered Contract Reviews" color="primary" variant="outlined" />
            <Typography variant="h2" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
              Trustworthy legal insight, <Box component="span" sx={{ color: "primary.main" }}>delivered instantly</Box>.
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Upload a contract and get a clear, Section&nbsp;32-aware summary with
              supporting documents, risks, and next steps—backed by audit logs and export/share tools.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button
                component={RouterLink}
                to="/dashboard"
                size="large"
                variant="contained"
                endIcon={<ArrowForwardIcon />}
              >
                Review Your Contract Now
              </Button>
              <Button
                href="#features"
                size="large"
                variant="text"
              >
                See How It Works
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* FEATURES */}
      <Container id="features" maxWidth="lg" sx={{ py: { xs: 8, md: 10 } }}>
        <Grid container spacing={3}>
          <Feature
            icon={<GavelIcon color="primary" fontSize="large" />}
            title="Section 32 Intelligence"
            desc="Automated checks for title, mortgages, permits, insurance, notices, and more—with page references."
          />
          <Feature
            icon={<SecurityIcon color="primary" fontSize="large" />}
            title="Reliable & Transparent"
            desc="Clear evidence tags show whether a supporting document was detected for each section."
          />
          <Feature
            icon={<TimelineIcon color="primary" fontSize="large" />}
            title="Audit & History"
            desc="Every upload is logged locally for quick recall. Export PDFs or share securely via email."
          />
          <Feature
            icon={<InsightsIcon color="primary" fontSize="large" />}
            title="Ask 3 Smart Questions"
            desc="Get concise answers about your contract with contextual AI—right from the summary."
          />
        </Grid>
      </Container>

      {/* CTA STRIP */}
      <Box sx={{ py: 8, bgcolor: "primary.main", color: "primary.contrastText" }}>
        <Container maxWidth="lg">
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                Ready to review your contract?
              </Typography>
              <Typography>
                Upload a PDF or DOCX and get a clear, customer-friendly summary in minutes.
              </Typography>
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
        <Typography variant="body2">© {new Date().getFullYear()} S32 Insights. All rights reserved.</Typography>
      </Container>
    </Box>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <Grid item xs={12} md={6} lg={3}>
      <Card variant="outlined" sx={{ height: "100%" }}>
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
    </Grid>
  );
}