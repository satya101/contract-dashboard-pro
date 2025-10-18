// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import SiteShell from "./layouts/SiteShell.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import App from "./App.jsx";               // AI Analysis (upload screen)
import Results from "./pages/Results.jsx"; // final parsed view
import Documents from "./pages/Documents.jsx";
import Pricing from "./pages/Pricing.jsx";

import "./index.css";

import {
  ThemeProvider,
  CssBaseline,
  createTheme,
  StyledEngineProvider,
} from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#2563eb" },
    secondary: { main: "#06b6d4" },
    background: { default: "#f9fafb", paper: "#ffffff" },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: "none", fontWeight: 600 } } },
    MuiCard:   { styleOverrides: { root: { borderRadius: 14 } } },
    MuiChip:   { styleOverrides: { root: { fontWeight: 600 } } },
  },
});

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          {/* Shared navbar lives in SiteShell so nav is present on all pages */}
          <Routes>
            <Route element={<SiteShell />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<App />} />
              <Route path="/results" element={<Results />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/pricing" element={<Pricing />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </StyledEngineProvider>
  </React.StrictMode>
);