import React from "react";
import { Link } from "react-router-dom";
import HowItWorks from "../sections/HowItWorks.jsx";

export default function LandingPage() {
  return (
    <div className="space-y-16">
      {/* HERO */}
      <section className="relative rounded-2xl bg-gradient-to-b from-indigo-50 to-white p-8 md:p-12">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm mb-4">
            <span className="h-2 w-2 bg-blue-600 rounded-full" />
            Secure AI Analysis
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            See What Others Miss in Your <span className="text-indigo-600">Property Contract</span>
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Your AI legal advisor transforms complex Section 32 contracts into clear, actionable insights. 
            Get confidence in every contract with professional-grade analysis in minutes, not days.
          </p>

          {/* claims */}
          <ul className="mt-6 flex flex-wrap gap-4 text-sm text-slate-600">
            <li className="inline-flex items-center gap-2 bg-white border rounded-full px-3 py-1">
              <span className="h-2 w-2 bg-emerald-500 rounded-full" /> 99.7% Accuracy Rate
            </li>
            <li className="inline-flex items-center gap-2 bg-white border rounded-full px-3 py-1">
              <span className="h-2 w-2 bg-emerald-500 rounded-full" /> Bank-Grade Security
            </li>
            <li className="inline-flex items-center gap-2 bg-white border rounded-full px-3 py-1">
              <span className="h-2 w-2 bg-emerald-500 rounded-full" /> Results in 5 Minutes
            </li>
          </ul>

          <div className="mt-8 flex gap-3">
            <Link
              to="/analysis"
              className="inline-flex items-center justify-center rounded-lg bg-indigo-600 text-white px-5 py-3 font-medium hover:bg-indigo-700"
            >
              Review Your Contract Now
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-lg border px-5 py-3 font-medium text-slate-700 hover:bg-slate-50"
            >
              See how it works
            </a>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <HowItWorks />
    </div>
  );
}