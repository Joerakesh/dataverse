"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Download, Share2, Sparkles, Shield, QrCode, CheckCircle2, Copy } from "lucide-react";
import confetti from "canvas-confetti";
import { sounds } from "@/src/utils/soundEffects";

interface CitadelPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultName?: string;
  defaultCollege?: string;
}

export default function CitadelPassModal({
  isOpen,
  onClose,
  defaultName = "Tony Stark",
  defaultCollege = "Avengers Academy of Technology",
}: CitadelPassModalProps) {
  const [name, setName] = useState(defaultName);
  const [college, setCollege] = useState(defaultCollege);
  const [selectedHero, setSelectedHero] = useState({
    name: "Doctor Doom",
    image: "/images/characters/doom.jpg",
    title: "Sovereign Sovereign",
  });
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const heroes = [
    { name: "Doctor Doom", image: "/images/characters/doom.jpg", title: "Sovereign Master" },
    { name: "Iron Man", image: "/images/characters/iron-man.jpg", title: "Tech Architect" },
    { name: "Captain America", image: "/images/characters/captain-america.jpg", title: "Sentinel Lead" },
    { name: "Doctor Strange", image: "/images/characters/doctor-strange.jpg", title: "Dimension Analyst" },
    { name: "The Hulk", image: "/images/characters/hulk.jpg", title: "Titan Intellect" },
    { name: "Spider-Man", image: "/images/characters/spider-man.jpg", title: "Web Operative" },
    { name: "Rocket", image: "/images/characters/rocket-raccoon.jpg", title: "Tactical Scavenger" },
  ];

  const handlePrint = () => {
    sounds.playClick();
    window.print();
  };

  const handleShare = () => {
    sounds.playVictory();
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#00ff88", "#10b981", "#eab308"],
    });
    navigator.clipboard.writeText(
      `Assemble! I just received my official CITADEL PASS for DATAVERSE Tech Symposium. Enlist now at ${window.location.origin}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="doom-card rounded-2xl max-w-xl w-full max-h-[95vh] overflow-y-auto border border-emerald-500/50 p-6 sm:p-8 relative">
        
        {/* Close Button */}
        <button
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-900 text-slate-300 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Modal Title */}
        <div className="text-center mb-6">
          <span className="text-[11px] font-tech font-bold uppercase tracking-widest text-emerald-400">
            Holographic Credential Generator
          </span>
          <h3 className="font-avengers text-3xl sm:text-4xl text-avengers-chrome italic mt-1">
            CLAIM YOUR CITADEL PASS
          </h3>
          <p className="font-tech text-xs text-slate-400">
            Customize your symposium access badge and share across the Multiverse.
          </p>
        </div>

        {/* Customization Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-[11px] font-tech uppercase text-slate-400 font-semibold mb-1">
              Attendee Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs font-tech focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-tech uppercase text-slate-400 font-semibold mb-1">
              College / Institution
            </label>
            <input
              type="text"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs font-tech focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Hero Avatar Selector */}
        <div className="mb-6">
          <label className="block text-[11px] font-tech uppercase text-slate-400 font-semibold mb-2">
            Select Your Titan Allegiance
          </label>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {heroes.map((hero, idx) => (
              <button
                key={idx}
                onClick={() => {
                  sounds.playHover();
                  setSelectedHero(hero);
                }}
                className={`relative flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedHero.name === hero.name
                    ? "border-emerald-400 scale-105 shadow-[0_0_15px_rgba(0,255,136,0.6)]"
                    : "border-slate-800 opacity-60 hover:opacity-100"
                }`}
              >
                <img src={hero.image} alt={hero.name} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* The Holographic Pass Card */}
        <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-400/60 p-6 bg-gradient-to-br from-[#0c1b14] via-[#05090d] to-[#041009] shadow-[0_0_40px_rgba(0,255,136,0.3)] mb-6 select-none">
          
          {/* Hologram sheen line */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Bar: Logo & Clearance */}
          <div className="flex items-center justify-between border-b border-emerald-500/30 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <img src="/images/logo.png" alt="Dataverse" className="h-8 object-contain" />
            </div>
            <div className="text-right">
              <span className="text-[10px] font-tech font-bold uppercase tracking-widest text-emerald-400 block">
                CITADEL PASS
              </span>
              <span className="font-avengers text-xs text-slate-300 tracking-wider">
                ID: #DV-{Math.abs(name.split("").reduce((a, b) => a + b.charCodeAt(0), 1000)).toString(16).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Body: Avatar + Details */}
          <div className="flex items-center gap-4 mb-5">
            <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-emerald-400/60 flex-shrink-0 shadow-[0_0_15px_rgba(0,255,136,0.4)]">
              <img src={selectedHero.image} alt={selectedHero.name} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-tech font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                {selectedHero.title}
              </span>
              <h4 className="font-avengers text-2xl sm:text-3xl text-slate-100 italic tracking-wider truncate mt-1">
                {name || "OPERATIVE"}
              </h4>
              <p className="font-tech text-xs text-slate-300 truncate">
                {college || "AFFILIATED INSTITUTION"}
              </p>
            </div>
          </div>

          {/* Bottom Bar: Barcode, Venue & Stamp */}
          <div className="pt-3 border-t border-emerald-500/20 flex items-center justify-between text-[10px] font-tech text-slate-400">
            <div>
              <span className="text-emerald-400 font-bold block">ALL-ARENA CLEARANCE</span>
              <span>7 BATTLE PROTOCOLS VALID</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-300 font-tech font-bold">
              <QrCode size={18} />
              <span>VERIFIED</span>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleShare}
            className="btn-avengers py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-black font-avengers text-lg font-bold tracking-wider rounded-lg shadow-[0_0_15px_rgba(0,255,136,0.4)] flex items-center justify-center gap-2"
          >
            <span>{copied ? "COPIED TO CLIPBOARD!" : "SHARE PASS"}</span>
          </button>

          <button
            onClick={handlePrint}
            className="py-3 rounded-lg bg-slate-900 border border-emerald-500/40 text-emerald-300 font-tech font-bold text-xs uppercase tracking-wider hover:bg-emerald-950/40 flex items-center justify-center gap-2"
          >
            <Download size={14} />
            <span>PRINT / SAVE BADGE</span>
          </button>
        </div>

      </div>
    </div>
  );
}
