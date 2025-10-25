import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AppLayout from "./layouts/AppLayout.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import Analysis from "./pages/Analysis.jsx";
import Results from "./pages/Results.jsx";
import Documents from "./pages/Documents.jsx";
import Pricing from "./pages/Pricing.jsx";

import "./index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/results" element={<Results />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);