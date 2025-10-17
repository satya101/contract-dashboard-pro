import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function exportSummaryAsPDF({ container, docTitle = "S32 Insights" }) {
  if (!container) return;

  // Expand all collapsibles temporarily
  const toggles = Array.from(container.querySelectorAll("[data-collapsible]"));
  const original = toggles.map((el) => el.className);
  toggles.forEach((el) => {
    el.className = el.className
      .replace(/max-h-\[.*?\]/g, "max-h-[99999px]")
      .replace(/opacity-0/g, "opacity-100");
    el.style.overflow = "visible";
  });

  // Allow layout to settle
  await new Promise((r) => setTimeout(r, 150));

  const canvas = await html2canvas(container, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
  const imgData = canvas.toDataURL("image/png");

  // Calculate multi-page
  const pdf = new jsPDF("p", "pt", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pageWidth - 40;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let y = 20;
  let remaining = imgHeight;

  let position = 20;
  let heightLeft = imgHeight;

  // Add title
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text(docTitle, 20, 20);
  position = 40;

  while (heightLeft > 0) {
    pdf.addImage(imgData, "PNG", 20, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - position;
    if (heightLeft > 0) {
      pdf.addPage();
      position = 20;
    }
  }

  pdf.save(`${docTitle.replace(/\s+/g, "_")}.pdf`);

  // Restore
  toggles.forEach((el, i) => (el.className = original[i]));
}