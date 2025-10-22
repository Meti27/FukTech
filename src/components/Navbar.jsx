// src/components/Navbar.jsx
import { useEffect, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SITE } from "../config/site";
import logo from "../assets/images/logo.png";

const link = ({ isActive }) =>
  `px-3 py-2 rounded-md text-sm font-medium ${
    isActive ? "text-blue-700" : "text-gray-700 hover:text-blue-700"
  }`;

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // ESC to close + lock body scroll when drawer open
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.classList.toggle("overflow-hidden", open);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.classList.remove("overflow-hidden");
    };
  }, [open]);

  return (
    <>
      <header className="border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        {/* On mobile: 3-column grid to center the logo; on md+: flex as before */}
        <div className="mx-auto max-w-6xl px-4 h-16 md:h-20 lg:h-24 grid grid-cols-[1fr_auto_1fr] items-center gap-3 md:flex md:items-center md:justify-between">
          {/* Left (empty spacer on mobile so logo can be centered) */}
          <div className="md:hidden" aria-hidden="true" />

          {/* Logo — centered on mobile, larger on big screens */}
          <Link
            to="/"
            className="flex items-center gap-2 justify-self-center md:justify-self-start"
          >
            <img
              src={logo}
              alt={SITE.brandName}
              className="h-12 sm:h-14 md:h-30 lg:h-50 w-auto"
            />
            <span className="sr-only">{SITE.brandName}</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-2" key={i18n.language}>
            <NavLink to="/" className={link}>{t("nav.home")}</NavLink>
            <NavLink to="/products" className={link}>{t("nav.products")}</NavLink>
            <NavLink to="/contact" className={link}>{t("nav.contact")}</NavLink>

            <select
              aria-label={t("nav.language")}
              className="ml-2 border rounded-md px-2 py-1 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={i18n.resolvedLanguage || i18n.language || "en"}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="mk">Македонски</option>
              <option value="sq">Shqip</option>
            </select>
          </nav>

          {/* Mobile: hamburger (right cell on mobile, hidden on desktop) */}
          <button
            type="button"
            className="justify-self-end md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
            aria-controls="mobile-drawer"
            aria-expanded={open}
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Drawer moved OUTSIDE header to avoid stacking issues */}
      <div
        className={`fixed inset-0 z-[1000] md:hidden ${open ? "" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />

        {/* Panel */}
        <aside
          id="mobile-drawer"
          role="dialog"
          aria-modal="true"
          className={`absolute right-0 top-0 h-full w-72 max-w-[80%] bg-white shadow-xl
                      transition-transform duration-300 ease-out
                      ${open ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <div className="flex items-center gap-2">
              <img src={logo} alt="" className="h-10 w-auto" />
            </div>
            <button
              type="button"
              className="rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          <nav className="px-4 py-4 flex flex-col gap-1" key={i18n.language}>
            <NavLink to="/" className={({ isActive }) =>
              `block rounded-md px-3 py-2 text-base ${isActive ? "bg-blue-50 text-blue-700" : "text-gray-800 hover:bg-gray-50"}`
            }>
              {t("nav.home")}
            </NavLink>
            <NavLink to="/products" className={({ isActive }) =>
              `block rounded-md px-3 py-2 text-base ${isActive ? "bg-blue-50 text-blue-700" : "text-gray-800 hover:bg-gray-50"}`
            }>
              {t("nav.products")}
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) =>
              `block rounded-md px-3 py-2 text-base ${isActive ? "bg-blue-50 text-blue-700" : "text-gray-800 hover:bg-gray-50"}`
            }>
              {t("nav.contact")}
            </NavLink>

            <div className="mt-4 border-t pt-4">
              <label className="block text-sm text-gray-600 mb-2">
                {t("nav.language")}
              </label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={i18n.resolvedLanguage || i18n.language || "en"}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
              >
                <option value="en">English</option>
                <option value="mk">Македонски</option>
                <option value="sq">Shqip</option>
              </select>
            </div>
          </nav>
        </aside>
      </div>
    </>
  );
}
