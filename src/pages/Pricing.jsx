import React from "react";
import { Container, Box, Typography, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function Pricing() {
  return (
    <Box sx={{ minHeight: "70vh", display: "grid", placeItems: "center", bgcolor: "grey.50" }}>
      <Container maxWidth="sm" sx={{ textAlign: "center" }}>
        <Typography variant="h2" sx={{ fontWeight: 900, mb: 1 }}>Pricing</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          COMING SOON — transparent plans for buyers, agents, and firms.
        </Typography>
        <Button component={RouterLink} to="/dashboard" variant="contained">Start an Analysis</Button>
      </Container>
    </Box>
  );
}