// src/pages/LandingPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import AnimatedLegalBackground from "../components/AnimatedLegalBackground.jsx";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Top nav is outside hero; stays consistent across pages */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-extrabold text-xl tracking-tight">S32 Insights Portal</Link>
          <nav className="flex items-center gap-4">
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/documents" className="hover:underline">Documents</Link>
            <Link to="/pricing" className="hover:underline">Pricing</Link>
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:shadow"
            >
              Review Your Contract
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO SECTION — this is the container that must be relative */}
      <section className="relative flex items-center min-h-[70vh]">
        {/* Animated background sits behind thanks to absolute + negative z-index */}
        <AnimatedLegalBackground />

        {/* Foreground content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Legal-grade AI for Section 32 Reviews
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl">
            Upload a PDF/DOCX and get a clean, client-friendly summary—complete with disclosures, key dates, and supporting documents.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <Link
              to="/dashboard"
              className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:shadow"
            >
              Review Your Contract Now
            </Link>
            <a
              href="#how-it-works"
              className="px-6 py-3 rounded-lg border font-semibold hover:bg-slate-50"
            >
              See how it works
            </a>
          </div>
        </div>
      </section>

      {/* Rest of page */}
      <section id="how-it-works" className="py-14">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">How it works</h2>
          {/* …your 3 inline cards component here… */}
        </div>
      </section>
    </main>
  );
}