// src/utils/pdfExport.js
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function addFooter(pdf, pageNumber) {
  const w = pdf.internal.pageSize.getWidth();
  const h = pdf.internal.pageSize.getHeight();
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.text(String(pageNumber), w - 20, h - 12, { align: "right" });
}

async function renderElementToPages({ pdf, el, title }) {
  // Expand any collapsibles inside this element
  const collapsibles = Array.from(el.querySelectorAll("[data-collapsible]"));
  const originalClasses = collapsibles.map((n) => n.className);
  collapsibles.forEach((n) => {
    n.className = n.className
      .replace(/max-h-\[.*?\]/g, "max-h-[99999px]")
      .replace(/opacity-0/g, "opacity-100");
    n.style.overflow = "visible";
  });

  // Render to canvas
  const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
  const fullW = canvas.width;
  const fullH = canvas.height;

  // Page metrics
  const marginX = 20;
  const marginY = 20;
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const imgW = pageW - marginX * 2;
  const pxPerPt = fullW / imgW;

  // Section header height (points)
  const headerH = 18;
  const firstTop = marginY + headerH + 6; // title + gap

  // First page available height (pts) and convert to px slice
  const firstAvailPt = pageH - firstTop - marginY;
  const sliceFirstPx = Math.floor(firstAvailPt * pxPerPt);

  // Subsequent pages top margin (no title)
  const nextTop = marginY;
  const nextAvailPt = pageH - nextTop - marginY;
  const sliceNextPx = Math.floor(nextAvailPt * pxPerPt);

  // Offscreen canvas for slicing
  const sliceCanvas = document.createElement("canvas");
  const ctx = sliceCanvas.getContext("2d");

  let renderedPx = 0;
  let firstPage = true;

  while (renderedPx < fullH) {
    const sliceHeightPx = firstPage
      ? Math.min(sliceFirstPx, fullH - renderedPx)
      : Math.min(sliceNextPx, fullH - renderedPx);

    sliceCanvas.width = fullW;
    sliceCanvas.height = sliceHeightPx;
    ctx.drawImage(
      canvas,
      0, renderedPx, fullW, sliceHeightPx,
      0, 0, fullW, sliceHeightPx
    );

    if (!firstPage) pdf.addPage();

    // Header (only on the first page of the section)
    if (firstPage) {
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.text(title || "Section", marginX, marginY + 12);
    }

    const imgData = sliceCanvas.toDataURL("image/png");
    const drawTop = firstPage ? firstTop : nextTop;
    const sliceHeightPt = sliceHeightPx / pxPerPt;

    pdf.addImage(imgData, "PNG", marginX, drawTop, imgW, sliceHeightPt);
    addFooter(pdf, pdf.getNumberOfPages());

    renderedPx += sliceHeightPx;
    firstPage = false;
  }

  // restore collapsibles
  collapsibles.forEach((n, i) => {
    n.className = originalClasses[i];
    n.style.overflow = "";
  });
}

export async function exportSummaryAsPDF({ container, docTitle = "S32 Insights" }) {
  if (!container) return;

  // Temporarily remove overflow/height limits from the container
  const original = { maxHeight: container.style.maxHeight, overflow: container.style.overflow };
  container.style.maxHeight = "none";
  container.style.overflow = "visible";

  // Build PDF
  const pdf = new jsPDF("p", "pt", "a4");
  const w = pdf.internal.pageSize.getWidth();
  const marginX = 20;

  // Cover
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);
  pdf.text(docTitle, marginX, 60);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text(`Generated: ${new Date().toLocaleString()}`, marginX, 80);
  addFooter(pdf, 1);

  // Find section cards
  const cards = Array.from(container.querySelectorAll("[data-section-card]"));
  for (let i = 0; i < cards.length; i++) {
    const el = cards[i];
    const title = el.getAttribute("data-section-title") || `Section ${i + 1}`;
    await renderElementToPages({ pdf, el, title });
  }

  // Raw JSON panel if expanded (optional): skip by default.

  // Save
  pdf.save(`${docTitle.replace(/\s+/g, "_")}.pdf`);

  // Restore container styles
  container.style.maxHeight = original.maxHeight;
  container.style.overflow = original.overflow;
}