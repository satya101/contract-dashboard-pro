import jsPDF from "jspdf";
import "jspdf-autotable";

export function exportSummaryPdf(summary, filename = "Contract.pdf") {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const title = "Contract Summary – Key terms and conditions at a glance";
  doc.setFont("helvetica", "bold"); doc.setFontSize(16);
  doc.text(title, 40, 50);

  const groups = [
    ["Property Details", [
      ["Address", summary?.property?.address || "—"],
      ["Lot/Plan", summary?.property?.lot_plan || "—"],
      ["Land Size", summary?.property?.land_size || "—"],
      ["Zoning", summary?.property?.zoning || "—"],
    ]],
    ["Financial Terms", [
      ["Purchase Price", summary?.financial?.price || "—"],
      ["Deposit", summary?.financial?.deposit || "—"],
      ["Balance", summary?.financial?.balance || "—"],
      ["Stamp Duty", summary?.financial?.stamp_duty || "—"],
    ]],
    ["Key Dates", [
      ["Settlement", summary?.dates?.settlement || "—"],
      ["Finance Due", summary?.dates?.finance_due || "—"],
      ["Cooling Off", summary?.dates?.cooling_off || "—"],
      ["Possession", summary?.dates?.possession || "—"],
    ]],
  ];

  let y = 80;
  groups.forEach(([heading, rows]) => {
    doc.setFont("helvetica", "bold"); doc.setFontSize(12);
    doc.text(heading, 40, y); y += 6;
    doc.autoTable({
      startY: y + 8,
      margin: { left: 40, right: 40 },
      body: rows,
      styles: { fontSize: 10, cellPadding: 6 },
      theme: "grid",
      didDrawPage: ({ cursor }) => (y = cursor.y + 14),
    });
  });

  doc.save((filename?.replace(/\.[^.]+$/, "") || "Contract") + "_summary.pdf");
}