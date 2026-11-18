"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Shield, Menu, X, Sparkles, Volume2, VolumeX, Download, Users, Ticket, Award } from "lucide-react";
import { sounds } from "@/src/utils/soundEffects";

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenPass: () => void;
  onOpenTeam: () => void;
}

export default function Navbar({ onOpenAuth, onOpenPass, onOpenTeam }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const toggleSound = () => {
    sounds.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) sounds.playClick();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#04070a]/95 backdrop-blur-md border-b border-emerald-500/25">
      {/* Top Institutional Notification Bar */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-950 to-emerald-950 border-b border-emerald-500/20 py-1 px-4 text-center text-[10px] sm:text-xs font-tech font-bold uppercase tracking-widest text-emerald-300 flex items-center justify-center gap-2 sm:gap-4 overflow-x-auto whitespace-nowrap">
        <span>LOYOLA COLLEGE (AUTONOMOUS), CHENNAI</span>
        <span className="text-emerald-500">•</span>
        <span>DEPARTMENT OF DATA SCIENCE</span>
        <span className="text-emerald-500">•</span>
        <span className="text-amber-400">IN ASSOCIATION WITH SAGE</span>
        <span className="text-emerald-500">•</span>
        <span className="text-emerald-400">04.12.2026 @ CENTENARY BUILDING</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand / Logo with Loyola + SAGE Crests + 3D Logo */}
        <Link
          href="/"
          onClick={() => sounds.playHover()}
          className="flex items-center gap-3 sm:gap-4 group"
        >
          {/* Loyola Crest & SAGE Logo */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-emerald-400/50 p-0.5 bg-black/60 shadow-[0_0_10px_rgba(0,255,136,0.3)]">
              <img
                src="/images/loyola-crest.png"
                alt="Loyola"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="w-9 h-9 rounded-full overflow-hidden border border-emerald-400/50 p-0.5 bg-black/60 shadow-[0_0_10px_rgba(0,255,136,0.3)]">
              <img
                src="/images/sage-logo.png"
                alt="SAGE"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* DATAVERSE 2K26 Logo */}
          <div className="flex items-center gap-1">
            <img
              src="/images/logo.png"
              alt="DATAVERSE"
              className="h-9 sm:h-11 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(0,255,136,0.4)] group-hover:scale-105 transition-transform"
            />
            <span className="font-avengers text-xl sm:text-2xl text-emerald-400 italic -mt-1">
              2K26
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-slate-300">
          <a
            href="#tesseract"
            onClick={() => sounds.playHover()}
            className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-emerald-400 font-bold"
          >
            <Sparkles size={12} />
            <span>3D Tesseract</span>
          </a>
          <a
            href="#events"
            onClick={() => sounds.playHover()}
            className="hover:text-emerald-400 transition-colors"
          >
            Arenas
          </a>
          <a
            href="#lore"
            onClick={() => sounds.playHover()}
            className="hover:text-emerald-400 transition-colors"
          >
            The Lore
          </a>
          <a
            href="#map"
            onClick={() => sounds.playHover()}
            className="hover:text-emerald-400 transition-colors"
          >
            Centenary Map
          </a>
          <a
            href="#rules"
            onClick={() => sounds.playHover()}
            className="hover:text-emerald-400 transition-colors"
          >
            Rules
          </a>
          <a
            href="#schedule"
            onClick={() => sounds.playHover()}
            className="hover:text-emerald-400 transition-colors"
          >
            Timeline
          </a>
          <a
            href="/DATAVERSE-RULEBOOK.pdf"
            download="DATAVERSE-RULEBOOK.pdf"
            onClick={() => sounds.playClick()}
            className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors font-bold"
          >
            <Download size={13} />
            <span>Rulebook PDF</span>
          </a>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 transition-colors"
            title={soundEnabled ? "Mute SFX" : "Unmute SFX"}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {/* Squad Button */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenTeam();
            }}
            className="px-3.5 py-2 rounded-lg bg-slate-900 border border-emerald-500/40 text-emerald-300 font-tech font-bold text-xs uppercase tracking-wider hover:bg-emerald-950/40 flex items-center gap-1.5"
          >
            <Users size={14} />
            <span>Squad Portal</span>
          </button>

          {/* Citadel Pass Button */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenPass();
            }}
            className="px-3.5 py-2 rounded-lg bg-slate-900 border border-emerald-500/40 text-emerald-300 font-tech font-bold text-xs uppercase tracking-wider hover:bg-emerald-950/40 flex items-center gap-1.5"
          >
            <Ticket size={14} />
            <span>Citadel Pass</span>
          </button>

          {/* Register CTA */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenAuth();
            }}
            className="btn-avengers px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-black font-avengers text-base font-bold tracking-wider rounded shadow-[0_0_15px_rgba(0,255,136,0.4)]"
          >
            <span>REGISTER</span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleSound}
            className="p-2 text-slate-400 hover:text-emerald-400"
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-emerald-400"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#070b10] border-b border-emerald-500/30 px-6 py-6 flex flex-col gap-4 text-slate-200">
          <a
            href="#tesseract"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-emerald-400 font-tech text-base uppercase flex items-center gap-2 text-emerald-400 font-bold"
          >
            <Sparkles size={16} />
            <span>3D Tesseract Core</span>
          </a>
          <a
            href="#events"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-emerald-400 font-tech text-base uppercase"
          >
            Battle Arenas (7 Events)
          </a>
          <a
            href="#lore"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-emerald-400 font-tech text-base uppercase"
          >
            The Lore
          </a>
          <a
            href="#map"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-emerald-400 font-tech text-base uppercase"
          >
            Centenary Building Map
          </a>
          <a
            href="#rules"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-emerald-400 font-tech text-base uppercase"
          >
            General Rules
          </a>
          <a
            href="#schedule"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-emerald-400 font-tech text-base uppercase"
          >
            Timeline
          </a>
          <a
            href="/DATAVERSE-RULEBOOK.pdf"
            download="DATAVERSE-RULEBOOK.pdf"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 text-emerald-400 font-tech text-base uppercase font-bold"
          >
            <Download size={16} />
            <span>Download Rulebook PDF</span>
          </a>

          <div className="pt-2 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTeam();
              }}
              className="py-2.5 rounded-lg bg-slate-900 border border-emerald-500/40 text-emerald-300 font-tech font-bold text-xs uppercase"
            >
              Squad Portal
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPass();
              }}
              className="py-2.5 rounded-lg bg-slate-900 border border-emerald-500/40 text-emerald-300 font-tech font-bold text-xs uppercase"
            >
              Citadel Pass
            </button>
          </div>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenAuth();
            }}
            className="btn-avengers w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-black font-avengers text-xl font-bold tracking-wider rounded shadow-[0_0_15px_rgba(0,255,136,0.3)] text-center mt-2"
          >
            <span>JOIN CITADEL / REGISTER</span>
          </button>
        </div>
      )}
    </header>
  );
}
