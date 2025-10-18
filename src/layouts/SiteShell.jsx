// src/layouts/SiteShell.jsx
import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { AppBar, Toolbar, Typography, Stack, Container } from "@mui/material";

const linkStyle = ({ isActive }) => ({
  color: isActive ? "#111827" : "#374151",
  textDecoration: "none",
  fontWeight: 600,
  padding: "6px 10px",
  borderRadius: 8,
  background: isActive ? "rgba(37,99,235,0.08)" : "transparent",
});

export default function SiteShell() {
  return (
    <>
      <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Toolbar sx={{ maxWidth: 1280, mx: "auto", width: "100%" }}>
          <Typography variant="h6" sx={{ fontWeight: 800, flexGrow: 1 }}>
            ContractLens AI
          </Typography>
          <Stack direction="row" spacing={1}>
            <NavLink to="/" style={linkStyle}>Home</NavLink>
            <NavLink to="/dashboard" style={linkStyle}>AI Analysis</NavLink>
            <NavLink to="/results" style={linkStyle}>Results</NavLink>
            <NavLink to="/documents" style={linkStyle}>Documents</NavLink>
            <NavLink to="/pricing" style={linkStyle}>Pricing</NavLink>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Each page renders below */}
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <Outlet />
      </Container>
    </>
  );
}