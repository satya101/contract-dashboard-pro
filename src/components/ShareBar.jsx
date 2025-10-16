import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { shareEmail } from '../services/API';

export default function ShareBar({ targetRef, doc }) {
  const handlePDF = async () => {
    if (!targetRef?.current) return;
    const el = targetRef.current;

    // Expand collapsibles
    const collapses = Array.from(el.querySelectorAll('[data-collapsible]'));
    const prevCollapse = collapses.map(p => ({ maxHeight: p.style.maxHeight, opacity: p.style.opacity, overflow: p.style.overflow }));
    collapses.forEach(p => { p.style.maxHeight = 'none'; p.style.opacity = '1'; p.style.overflow = 'visible'; });

    // Expand inner panels
    const panels = Array.from(el.querySelectorAll('[data-panel]'));
    const prevPanel = panels.map(p => ({ maxHeight: p.style.maxHeight, opacity: p.style.opacity, overflow: p.style.overflow }));
    panels.forEach(p => { p.style.maxHeight = 'none'; p.style.opacity = '1'; p.style.overflow = 'visible'; });

    // Remove container limits
    const prevMax = el.style.maxHeight;
    const prevOverflow = el.style.overflow;
    el.style.maxHeight = 'none';
    el.style.overflow = 'visible';

    const scale = 2;
    const canvas = await html2canvas(el, { scale, backgroundColor: '#ffffff', useCORS: true, scrollY: -window.scrollY });

    // Restore styles
    el.style.maxHeight = prevMax;
    el.style.overflow = prevOverflow;
    collapses.forEach((p, i) => { p.style.maxHeight = prevCollapse[i].maxHeight; p.style.opacity = prevCollapse[i].opacity; p.style.overflow = prevCollapse[i].overflow; });
    panels.forEach((p, i) => { p.style.maxHeight = prevPanel[i].maxHeight; p.style.opacity = prevPanel[i].opacity; p.style.overflow = prevPanel[i].overflow; });

    // Slice into PDF pages
    const pdf = new jsPDF('p', 'pt', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const margin = 20;
    const imgWidth = pageWidth - margin * 2;
    const ratio = canvas.width / imgWidth;
    const pageHeightPx = pageHeight * ratio;

    for (let y = 0, pageIndex = 0; y < canvas.height; y += pageHeightPx, pageIndex++) {
      const sliceHeight = Math.min(pageHeightPx, canvas.height - y);
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = sliceHeight;
      const ctx = pageCanvas.getContext('2d');
      ctx.drawImage(canvas, 0, y, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);
      const imgData = pageCanvas.toDataURL('image/png');

      if (pageIndex > 0) pdf.addPage();
      const imgHeight = sliceHeight / ratio;
      pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
    }

    pdf.save(`${(doc?.name || 'contract')}.pdf`);
  };

  const handleEmail = async () => {
    const to = prompt('Recipient email address?');
    if (!to) return;
    const subject = `Contract Summary: ${doc?.name || 'Document'}`;
    const body = typeof doc?.summary === 'string' ? doc.summary : JSON.stringify(doc?.summary, null, 2);

    try {
      await shareEmail({ to, subject, body });
      alert('Email sent via backend');
    } catch {
      const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
    }
  };

  return (
    <div className="flex items-center gap-3 mb-4">
      <button onClick={handlePDF} className="px-3 py-2 rounded bg-gray-800 text-white text-sm hover:bg-black">Export PDF</button>
      <button onClick={handleEmail} className="px-3 py-2 rounded bg-blue-600 text-white text-sm hover:bg-blue-700">Email Summary</button>
    </div>
  );
}
