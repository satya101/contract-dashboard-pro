// src/utils/pdfExport.js
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Export a scrollable summary area to a multi-page PDF.
 * Expects `container` to be a DOM node that contains your summary.
 */
export async function exportSummaryAsPDF({ container, docTitle = "S32 Insights" }) {
  if (!container) return;

  // Expand any collapsible sections before capture (we use data-collapsible marker)
  const collapsibles = Array.from(container.querySelectorAll("[data-collapsible]"));
  const originalClasses = collapsibles.map((el) => el.className);
  collapsibles.forEach((el) => {
    el.className = el.className
      .replace(/max-h-\[.*?\]/g, "max-h-[99999px]")
      .replace(/opacity-0/g, "opacity-100");
    el.style.overflow = "visible";
  });

  await new Promise((r) => setTimeout(r, 150)); // allow layout to settle

  const canvas = await html2canvas(container, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    // You can tweak width/height if your container is responsive
  });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "pt", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const marginX = 20;
  const marginY = 20;

  const imgWidth = pageWidth - marginX * 2;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  // Title page header
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text(docTitle, marginX, marginY);
  let positionY = marginY + 20;

  // If image exceeds remaining height, add pages as needed
  let remaining = imgHeight;
  let currentY = positionY;

  while (remaining > 0) {
    const renderHeight = Math.min(remaining, pageHeight - currentY - marginY);
    pdf.addImage(
      imgData,
      "PNG",
      marginX,
      currentY,
      imgWidth,
      imgHeight
    );
    remaining -= (pageHeight - currentY - marginY);
    if (remaining > 0) {
      pdf.addPage();
      // after first page, no title text
      currentY = marginY;
    } else {
      break;
    }
  }

  pdf.save(`${docTitle.replace(/\s+/g, "_")}.pdf`);

  // restore collapsibles
  collapsibles.forEach((el, i) => {
    el.className = originalClasses[i];
    el.style.overflow = "";
  });
}