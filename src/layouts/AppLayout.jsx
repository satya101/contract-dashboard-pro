import React from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-3 py-2 rounded-md text-sm font-medium transition ${
        isActive ? "bg-indigo-600 text-white" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
      }`
    }
  >
    {children}
  </NavLink>
);

export default function AppLayout() {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2">
            <span className="inline-block h-8 w-8 rounded-lg bg-indigo-600" />
            <span className="font-semibold">ContractLens AI</span>
          </NavLink>
          <nav className="flex items-center gap-1">
            <NavItem to="/">Home</NavItem>
            <NavItem to="/analysis">AI Analysis</NavItem>
            <NavItem to="/results">Results</NavItem>
            <NavItem to="/documents">Documents</NavItem>
            <NavItem to="/pricing">Pricing</NavItem>
          </nav>
        </div>
      </header>

      {/* Page content */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        <Outlet />
      </main>

      {/* Optional: footer */}
      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} ContractLens AI
      </footer>
    </div>
  );
}