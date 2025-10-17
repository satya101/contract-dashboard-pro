// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";                 // dashboard
import LandingPage from "./pages/LandingPage.jsx";
import "./index.css";

// --- Optional theming (Material UI) ---
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";

// A trustworthy blue palette with rounded corners
const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#2563eb" },   // trust blue
    secondary: { main: "#06b6d4" }, // cyan accent
    background: { default: "#f9fafb", paper: "#ffffff" }
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
      "Segoe UI Emoji"
    ].join(",")
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600 }
      }
    },
    MuiCard: { styleOverrides: { root: { borderRadius: 14 } } }
  }
});

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<App />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);