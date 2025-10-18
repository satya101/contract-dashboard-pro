// src/utils/pdfExport.js
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Export a scrollable DOM container to multipage A4 PDF
export async function exportSummaryAsPDF({ container, docTitle = "S32_Insights_Report" }) {
  // ensure all details are visible
  const prev = container.style.maxHeight;
  container.style.maxHeight = "unset";

  const canvas = await html2canvas(container, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    windowWidth: Math.max(container.scrollWidth, document.documentElement.clientWidth),
  });

  // restore
  container.style.maxHeight = prev;

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const margin = 10; // mm
  const imgWidth = pageWidth - margin * 2;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = margin;

  pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
  heightLeft -= pageHeight - margin * 2;

  while (heightLeft > 0) {
    pdf.addPage();
    position = margin - (imgHeight - heightLeft);
    pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - margin * 2;
  }

  const safe = (docTitle || "S32_Insights_Report").replace(/[^\w\-]+/g, "_");
  pdf.save(`${safe}.pdf`);
}