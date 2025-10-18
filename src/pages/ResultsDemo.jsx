import React from "react";
import { Container, Box } from "@mui/material";
import ResultsHeader from "../components/ResultsHeader.jsx";
import SummaryKeyCards from "../components/SummaryKeyCards.jsx";

const demoSummary = {
  property: { address: "123 Collins Street", lot_plan: "Lot 15 PS 123456", land_size: "650 sqm", zoning: "Residential 1" },
  financial_terms: { purchase_price: "$1,250,000", deposit: "$125,000 (10%)", balance: "$1,125,000", stamp_duty: "~$66,070" },
  key_dates: { settlement: "Dec 15, 2025", finance_due: "Nov 1, 2025", cooling_off: "3 business days", possession: "At settlement" }
};

export default function ResultsDemo() {
  return (
    <Box sx={{ py: 6, bgcolor: "grey.50", minHeight: "100vh" }}>
      <Container maxWidth="lg">
        <ResultsHeader
          fileName="Section 32 Contract — 123 Collins Street, Melbourne VIC 3000"
          processedAt={Date.now()}
          processingSeconds={4.2}
          pages={47}
          onExportPDF={()=>{}}
          onShareEmail={()=>{}}
        />
        <Box sx={{ mt: 2 }}>
          <SummaryKeyCards summary={demoSummary} />
        </Box>
      </Container>
    </Box>
  );
}