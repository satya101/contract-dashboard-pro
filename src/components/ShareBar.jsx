import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { shareEmail } from '../services/API';

export default function ShareBar({ targetRef, doc }) {
  const handlePDF = async () => {
    if (!targetRef?.current) return;
    const el = targetRef.current;

    const prevMax = el.style.maxHeight;
    const prevOverflow = el.style.overflow;
    el.style.maxHeight = 'none';
    el.style.overflow = 'visible';

    const canvas = await html2canvas(el, { scale: 2, backgroundColor: '#ffffff' });

    el.style.maxHeight = prevMax;
    el.style.overflow = prevOverflow;

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'pt', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth - 40;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 20;

    pdf.addImage(imgData, 'PNG', 20, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      pdf.addPage();
      position = heightLeft * -1 + 20;
      pdf.addImage(imgData, 'PNG', 20, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
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
      <button onClick={handlePDF} className="px-3 py-2 rounded bg-gray-800 text-white text-sm hover:bg:black">Export PDF</button>
      <button onClick={handleEmail} className="px-3 py-2 rounded bg-blue-600 text-white text-sm hover:bg-blue-700">Email Summary</button>
    </div>
  );
}
