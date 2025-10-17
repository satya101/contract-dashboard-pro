import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function exportSummaryAsPDF({ container, docTitle = "S32 Insights" }) {
  if (!container) return;

  // 1) Temporarily expand scroll/overflow for full capture
  const originalStyle = {
    maxHeight: container.style.maxHeight,
    overflow: container.style.overflow,
  };
  container.style.maxHeight = "none";
  container.style.overflow = "visible";

  // 2) Expand any collapsibles
  const collapsibles = Array.from(container.querySelectorAll("[data-collapsible]"));
  const originalClasses = collapsibles.map((el) => el.className);
  collapsibles.forEach((el) => {
    el.className = el.className
      .replace(/max-h-\[.*?\]/g, "max-h-[99999px]")
      .replace(/opacity-0/g, "opacity-100");
    el.style.overflow = "visible";
  });

  await new Promise((r) => setTimeout(r, 150));

  // 3) Render to canvas
  const canvas = await html2canvas(container, { scale: 2, backgroundColor: "#ffffff", useCORS: true });
  const fullWidth = canvas.width;
  const fullHeight = canvas.height;

  // 4) Slice long canvas into A4 pages
  const pdf = new jsPDF("p", "pt", "a4");
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const imgW = pageW - margin * 2;
  const imgH = (imgW / fullWidth) * fullHeight; // total image height if scaled to page width
  const pxPerPt = fullWidth / imgW; // canvas px per PDF point (width-based)

  // Title
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text(docTitle, margin, margin);
  let yPos = margin + 20;

  // Create an offscreen canvas to slice
  const sliceCanvas = document.createElement("canvas");
  const sliceCtx = sliceCanvas.getContext("2d");
  const sliceHeightPx = Math.floor((pageH - yPos - margin) * pxPerPt); // how many canvas px fit on first page

  let rendered = 0;
  let first = true;

  while (rendered < fullHeight) {
    const curSliceHeight = Math.min(sliceHeightPx, fullHeight - rendered);
    sliceCanvas.width = fullWidth;
    sliceCanvas.height = curSliceHeight;
    sliceCtx.drawImage(canvas, 0, rendered, fullWidth, curSliceHeight, 0, 0, fullWidth, curSliceHeight);

    const imgData = sliceCanvas.toDataURL("image/png");
    const sliceHeightPt = curSliceHeight / pxPerPt;

    pdf.addImage(imgData, "PNG", margin, yPos, imgW, sliceHeightPt);

    rendered += curSliceHeight;

    if (rendered < fullHeight) {
      pdf.addPage();
      // subsequent pages start at margin without title
      yPos = margin;
    } else {
      break;
    }
  }

  pdf.save(`${docTitle.replace(/\s+/g, "_")}.pdf`);

  // 5) Restore styles
  collapsibles.forEach((el, i) => {
    el.className = originalClasses[i];
    el.style.overflow = "";
  });
  container.style.maxHeight = originalStyle.maxHeight;
  container.style.overflow = originalStyle.overflow;
}