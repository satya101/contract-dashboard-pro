// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App.jsx";                     // AI Analysis dashboard
import LandingPage from "./pages/LandingPage.jsx";
import ResultsDemo from "./pages/ResultsDemo.jsx";
import Pricing from "./pages/Pricing.jsx";

import "./index.css";

// MUI theme
import {
  ThemeProvider,
  CssBaseline,
  createTheme,
  StyledEngineProvider,
} from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#2563eb" },     // indigo-600
    secondary: { main: "#06b6d4" },   // cyan-500
    background: { default: "#f9fafb", paper: "#ffffff" },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "Helvetica",
      "Arial",
      "Apple Color Emoji",
      "Segoe UI Emoji",
      "Segoe UI Symbol",
    ].join(","),
  },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: "none", fontWeight: 600 } } },
    MuiCard:   { styleOverrides: { root: { borderRadius: 14 } } },
    MuiChip:   { styleOverrides: { root: { fontWeight: 600 } } },
  },
});

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Ensures MUI styles load before Tailwind so they can be overridden cleanly */}
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<App />} />
            <Route path="/results" element={<ResultsDemo />} />
            <Route path="/pricing" element={<Pricing />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </StyledEngineProvider>
  </React.StrictMode>
);