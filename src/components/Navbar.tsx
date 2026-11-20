"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Sparkles, Volume2, VolumeX, Download } from "lucide-react";
import { sounds } from "@/src/utils/soundEffects";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const toggleSound = () => {
    sounds.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) sounds.playClick();
  };

  const navLinks = [
    { href: "#tesseract", label: "3D Tesseract" },
    { href: "#events", label: "Events" },
    { href: "#lore", label: "The Lore" },
    { href: "#map", label: "Centenary Map" },
    { href: "#rules", label: "Rules" },
    { href: "#schedule", label: "Timeline" },
  ];

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [mobileMenuOpen]);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-emerald-500/20 bg-[#04070a]/85 shadow-[0_8px_32px_rgba(0,0,0,.22)] backdrop-blur-xl">
      <div className="flex items-center justify-center gap-2 overflow-x-auto whitespace-nowrap border-b border-emerald-500/20 bg-gradient-to-r from-emerald-950 via-slate-950 to-emerald-950 px-4 py-1 text-center text-[9px] font-tech font-bold uppercase tracking-[.12em] text-emerald-300 sm:gap-4 sm:text-[10px] sm:tracking-widest">
        <span>LOYOLA COLLEGE (AUTONOMOUS), CHENNAI</span>
        <span className="text-emerald-500">•</span>
        <span>DEPARTMENT OF DATA SCIENCE</span>
        <span className="hidden text-emerald-500 sm:inline">•</span>
        <span className="hidden text-amber-400 sm:inline">IN ASSOCIATION WITH SAGE</span>
        <span className="text-emerald-500">•</span>
        <span className="text-emerald-400">04.12.2026 @ CENTENARY BUILDING</span>
      </div>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" onClick={() => sounds.playHover()} className="group flex min-w-0 items-center gap-2 sm:gap-4">
          <div className="flex shrink-0 items-center gap-1.5">
            <div className="h-8 w-8 overflow-hidden rounded-full border border-emerald-400/50 bg-black/60 p-0.5 shadow-[0_0_10px_rgba(0,255,136,.3)] sm:h-9 sm:w-9">
              <img src="/images/loyola-crest.png" alt="Loyola" className="h-full w-full object-contain" />
            </div>
            <div className="h-8 w-8 overflow-hidden rounded-full border border-emerald-400/50 bg-black/60 p-0.5 shadow-[0_0_10px_rgba(0,255,136,.3)] sm:h-9 sm:w-9">
              <img src="/images/sage-logo.png" alt="SAGE" className="h-full w-full object-contain" />
            </div>
          </div>
          <div className="flex min-w-0 items-center gap-1">
            <img src="/images/logo.png" alt="DATAVERSE" className="h-8 w-auto max-w-[clamp(5rem,18vw,9rem)] object-contain drop-shadow-[0_0_12px_rgba(0,255,136,.4)] transition-transform group-hover:scale-105 sm:h-10" />
            <span className="shrink-0 font-avengers text-lg italic text-emerald-400 sm:text-2xl">2K26</span>
          </div>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-4 text-[11px] font-semibold uppercase tracking-wide text-slate-300 xl:flex 2xl:gap-6 2xl:text-xs">
          {navLinks.map((link, index) => (
            <a key={link.href} href={link.href} onClick={() => sounds.playHover()} className={index === 0 ? "flex items-center gap-1 whitespace-nowrap font-bold text-emerald-400 transition-colors hover:text-emerald-300" : "whitespace-nowrap transition-colors hover:text-emerald-400"}>
              {index === 0 && <Sparkles size={12} />}
              <span>{link.label}</span>
            </a>
          ))}
          <a href="/DATAVERSE-RULEBOOK.pdf" download="DATAVERSE-RULEBOOK.pdf" onClick={() => sounds.playClick()} className="flex items-center gap-1 whitespace-nowrap font-bold text-emerald-400 transition-colors hover:text-emerald-300">
            <Download size={13} /><span>Rulebook PDF</span>
          </a>
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <button type="button" onClick={toggleSound} className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-slate-400 transition-colors hover:border-emerald-500/50 hover:text-emerald-400" title={soundEnabled ? "Mute SFX" : "Unmute SFX"} aria-label={soundEnabled ? "Mute sound effects" : "Enable sound effects"}>
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
          <Link href="/register" onClick={() => sounds.playClick()} className="btn-avengers rounded bg-gradient-to-r from-emerald-500 to-green-600 px-5 py-2.5 font-avengers text-base font-bold tracking-wider text-black shadow-[0_0_15px_rgba(0,255,136,.4)]">
            <span>REGISTER</span>
          </Link>
        </div>

        <div className="flex shrink-0 items-center gap-1 xl:hidden">
          <button type="button" onClick={toggleSound} className="rounded-lg p-2 text-slate-400 transition-colors hover:text-emerald-400" aria-label={soundEnabled ? "Mute sound effects" : "Enable sound effects"}>
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <button type="button" onClick={() => setMobileMenuOpen((open) => !open)} className="rounded-lg p-2 text-slate-300 transition-colors hover:text-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400" aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={mobileMenuOpen} aria-controls="mobile-navigation">
            {mobileMenuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div id="mobile-navigation" className="border-t border-emerald-500/20 bg-[#070b10]/[.98] px-5 py-5 shadow-2xl backdrop-blur-xl xl:hidden">
          <nav aria-label="Mobile navigation" className="mx-auto flex max-w-7xl flex-col gap-1">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-3 font-tech text-sm font-semibold uppercase tracking-wider text-slate-200 transition-colors hover:bg-emerald-500/10 hover:text-emerald-300">
                {link.label}
              </a>
            ))}
            <a href="/DATAVERSE-RULEBOOK.pdf" download="DATAVERSE-RULEBOOK.pdf" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-3 font-tech text-sm font-bold uppercase tracking-wider text-emerald-400 hover:bg-emerald-500/10">
              <Download size={16} />Download Rulebook PDF
            </a>
            <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="btn-avengers mt-3 rounded bg-gradient-to-r from-emerald-500 to-green-600 px-4 py-3 text-center font-avengers text-xl font-bold tracking-wider text-black">
              <span>REGISTER NOW</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
