"use client";

import React, { useState } from "react";
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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#04070a]/80 backdrop-blur-xl border-b border-emerald-500/20 shadow-[0_8px_32px_rgba(0,0,0,.22)]">
      <div className="bg-gradient-to-r from-emerald-950 via-slate-950 to-emerald-950 border-b border-emerald-500/20 py-1 px-4 text-center text-[10px] sm:text-xs font-tech font-bold uppercase tracking-widest text-emerald-300 flex items-center justify-center gap-2 sm:gap-4 overflow-x-auto whitespace-nowrap">
        <span>LOYOLA COLLEGE (AUTONOMOUS), CHENNAI</span>
        <span className="text-emerald-500">•</span>
        <span>DEPARTMENT OF DATA SCIENCE</span>
        <span className="text-emerald-500">•</span>
        <span className="text-amber-400">IN ASSOCIATION WITH SAGE</span>
        <span className="text-emerald-500">•</span>
        <span className="text-emerald-400">04.12.2026 @ CENTENARY BUILDING</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" onClick={() => sounds.playHover()} className="flex items-center gap-3 sm:gap-4 group">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-emerald-400/50 p-0.5 bg-black/60 shadow-[0_0_10px_rgba(0,255,136,0.3)]">
              <img src="/images/loyola-crest.png" alt="Loyola" className="w-full h-full object-contain"/>
            </div>
            <div className="w-9 h-9 rounded-full overflow-hidden border border-emerald-400/50 p-0.5 bg-black/60 shadow-[0_0_10px_rgba(0,255,136,0.3)]">
              <img src="/images/sage-logo.png" alt="SAGE" className="w-full h-full object-contain"/>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <img src="/images/logo.png" alt="DATAVERSE" className="h-9 sm:h-11 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(0,255,136,0.4)] group-hover:scale-105 transition-transform"/>
            <span className="font-avengers text-xl sm:text-2xl text-emerald-400 italic -mt-1">2K26</span>
          </div>
        </Link>

        <nav className="hidden xl:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-slate-300">
          {navLinks.map((link, index) => (
            <a key={link.href} href={link.href} onClick={() => sounds.playHover()} className={index === 0 ? "hover:text-emerald-400 transition-colors flex items-center gap-1 text-emerald-400 font-bold" : "hover:text-emerald-400 transition-colors"}>
              {index === 0 && <Sparkles size={12}/>}
              <span>{link.label}</span>
            </a>
          ))}
          <a href="/DATAVERSE-RULEBOOK.pdf" download="DATAVERSE-RULEBOOK.pdf" onClick={() => sounds.playClick()} className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors font-bold">
            <Download size={13}/><span>Rulebook PDF</span>
          </a>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button onClick={toggleSound} className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 transition-colors" title={soundEnabled ? "Mute SFX" : "Unmute SFX"}>
            {soundEnabled ? <Volume2 size={16}/> : <VolumeX size={16}/>}
          </button>
          <Link href="/register" onClick={() => sounds.playClick()} className="btn-avengers px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-black font-avengers text-base font-bold tracking-wider rounded shadow-[0_0_15px_rgba(0,255,136,0.4)]">
            <span>REGISTER</span>
          </Link>
        </div>

        <div className="flex md:hidden items-center gap-2">
          <button onClick={toggleSound} className="p-2 text-slate-400 hover:text-emerald-400">
            {soundEnabled ? <Volume2 size={18}/> : <VolumeX size={18}/>}
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-300 hover:text-emerald-400" aria-label="Toggle navigation menu">
            {mobileMenuOpen ? <X size={24}/> : <Menu size={24}/>}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-[#070b10] border-b border-emerald-500/30 px-6 py-6 flex flex-col gap-4 text-slate-200">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="hover:text-emerald-400 font-tech text-base uppercase">{link.label}</a>
          ))}
          <a href="/DATAVERSE-RULEBOOK.pdf" download="DATAVERSE-RULEBOOK.pdf" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-emerald-400 font-tech text-base uppercase font-bold">
            <Download size={16}/><span>Download Rulebook PDF</span>
          </a>
          <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="btn-avengers w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-black font-avengers text-xl font-bold tracking-wider rounded text-center mt-2">
            <span>REGISTER NOW</span>
          </Link>
        </div>
      )}
    </header>
  );
}
