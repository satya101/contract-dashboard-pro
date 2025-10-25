// src/utils/pdfExport.js
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Export a customer-friendly contract summary to PDF.
 * Expects a 'summary' object shaped like:
 * {
 *   property: { address, lot_plan, land_size, zoning },
 *   financial: { price, deposit, balance, stamp_duty },
 *   dates: { settlement, finance_due, cooling_off, possession }
 * }
 */
export function exportSummaryPdf(summary = {}, filename = "Contract.pdf") {
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Contract Summary — Key terms and conditions at a glance", 40, 50);

  const groups = [
    [
      "Property Details",
      [
        ["Address", summary?.property?.address || "—"],
        ["Lot/Plan", summary?.property?.lot_plan || "—"],
        ["Land Size", summary?.property?.land_size || "—"],
        ["Zoning", summary?.property?.zoning || "—"],
      ],
    ],
    [
      "Financial Terms",
      [
        ["Purchase Price", summary?.financial?.price || "—"],
        ["Deposit", summary?.financial?.deposit || "—"],
        ["Balance", summary?.financial?.balance || "—"],
        ["Stamp Duty", summary?.financial?.stamp_duty || "—"],
      ],
    ],
    [
      "Key Dates",
      [
        ["Settlement", summary?.dates?.settlement || "—"],
        ["Finance Due", summary?.dates?.finance_due || "—"],
        ["Cooling Off", summary?.dates?.cooling_off || "—"],
        ["Possession", summary?.dates?.possession || "—"],
      ],
    ],
  ];

  let y = 80;

  groups.forEach(([heading, body]) => {
    // Section heading
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(String(heading), 40, y);
    y += 8;

    // Table
    autoTable(doc, {
      startY: y,
      margin: { left: 40, right: 40 },
      head: [["Field", "Value"]],
      body,
      styles: { fontSize: 10, cellPadding: 6 },
      headStyles: { fillColor: [245, 247, 250], textColor: [60, 66, 80] },
      theme: "grid",
      didDrawPage: (data) => {
        y = data.cursor.y + 16;
      },
    });
  });

  // File name
  const safeName =
    (filename?.replace(/\.[^.]+$/, "") || "Contract") + "_summary.pdf";
  doc.save(safeName);
}