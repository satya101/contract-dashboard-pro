import React from "react";

const Card = ({ title, subtitle, footer, children }) => (
  <div className="rounded-2xl border bg-white p-6 shadow-sm">
    <h3 className="text-xl font-semibold">{title}</h3>
    <p className="mt-2 text-slate-600">{subtitle}</p>
    <div className="mt-6">{children}</div>
    {footer && <div className="mt-4 text-sm text-slate-500">{footer}</div>}
  </div>
);

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="space-y-8">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center">How it works</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Upload */}
        <Card
          title="Upload Document"
          subtitle="Drop a PDF/DOCX securely with instant verification."
          footer="DOCX / PDF • Instant verification"
        >
          {/* Canva animation embed */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: 0,
              paddingTop: "56.25%",
              boxShadow: "0 2px 8px 0 rgba(63,69,81,0.16)",
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <iframe
              loading="lazy"
              title="Upload animation"
              style={{ position: "absolute", width: "100%", height: "100%", top: 0, left: 0, border: "none" }}
              src="https://www.canva.com/design/DAG2IuF1hRg/vSVK1w0ME2EWGRKP7HCJrw/watch?embed"
              allow="fullscreen"
              allowFullScreen
            />
          </div>
        </Card>

        {/* 2. Custom AI */}
        <Card
          title="Custom AI Trained Model"
          subtitle="OCR + clause extraction + legal reasoning tuned for Section 32."
          footer="Custom AI • Compliance aware"
        >
          <div className="h-40 w-full grid place-items-center">
            <div className="h-20 w-20 rounded-full border-4 border-indigo-200 animate-pulse" />
          </div>
        </Card>

        {/* 3. View results */}
        <Card
          title="View Results"
          subtitle="Readable summary, advanced details, export PDF or share via email."
          footer="Readable summary • Export • Share"
        >
          <div className="h-40 w-full grid place-items-center">
            <div className="h-24 w-40 rounded-xl bg-emerald-50 border border-emerald-200" />
          </div>
        </Card>
      </div>
    </section>
  );
}