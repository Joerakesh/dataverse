import React from "react";
import Image from "next/image";
import { Terminal, ShieldAlert, Cpu, Sparkles } from "lucide-react";

export default function LoreSection() {
  return (
    <section id="lore" className="py-24 relative overflow-hidden bg-[#070b10] border-y border-emerald-500/20">
      {/* Background glow */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Dr. Doom Visual & Latverian Seal */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-[0_0_40px_rgba(0,255,136,0.25)] group">
              <img
                src="/images/characters/doom.jpg"
                alt="Victor Von Doom"
                className="w-full h-[460px] object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95 contrast-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05080c] via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6">
                <span className="px-3 py-1 rounded bg-emerald-950/80 border border-emerald-500/40 text-[11px] font-tech font-bold uppercase tracking-widest text-emerald-300">
                  Sovereign Ruler of Latveria
                </span>
                <h3 className="font-avengers text-3xl sm:text-4xl text-avengers-chrome italic mt-2">
                  VICTOR VON DOOM
                </h3>
                <p className="font-tech text-xs text-slate-300 mt-1">
                  Master of Sorcery & High-Order Quantum Engineering
                </p>
              </div>
            </div>

            {/* Accent tag */}
            <div className="absolute -top-4 -right-4 p-4 rounded-xl bg-slate-900 border border-emerald-400/40 shadow-lg hidden sm:block">
              <ShieldAlert className="w-8 h-8 text-emerald-400 animate-pulse" />
            </div>
          </div>

          {/* Right: The Lore Narrative */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 text-emerald-400 font-tech uppercase tracking-[0.25em] text-sm font-bold">
              <Sparkles size={16} />
              <span>THE LATVERIAN PROTOCOL</span>
            </div>

            <h2 className="font-avengers text-4xl sm:text-6xl text-avengers-chrome italic tracking-wider leading-none">
              WHERE AVENGERS VALOR MEETS DOOM&apos;S SUPREME INTELLECT
            </h2>

            <p className="font-tech text-lg text-slate-300 leading-relaxed">
              In the age of explosive AI agents, deep analytics, and unprecedented computing shifts, standard collegiate symposiums are no longer sufficient. Dr. Doom has hijacked the signal to inaugurate <strong className="text-emerald-400">DATAVERSE</strong> — a battleground engineered to separate mere coders from architects of the new digital cosmos.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <div className="doom-card rounded-lg p-5 border border-emerald-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <Cpu className="text-emerald-400" size={20} />
                  <h4 className="font-avengers text-xl text-slate-100 tracking-wide">
                    SCIENCE & SORCERY
                  </h4>
                </div>
                <p className="font-tech text-xs text-slate-400 leading-relaxed">
                  Every arena tests both pure computational depth and high-pressure tactical intuition — from Shark Tank pitches to classified agent workflows.
                </p>
              </div>

              <div className="doom-card rounded-lg p-5 border border-emerald-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <Terminal className="text-emerald-400" size={20} />
                  <h4 className="font-avengers text-xl text-slate-100 tracking-wide">
                    THE CHOSEN CITADEL
                  </h4>
                </div>
                <p className="font-tech text-xs text-slate-400 leading-relaxed">
                  Only one department team per institution may enter each arena. Bring your bonafide clearance and prove your institution’s superiority.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <blockquote className="border-l-2 border-emerald-500 pl-4 py-1 italic font-doom text-slate-300 text-sm">
                &ldquo;Do not disappoint Doom. Register before the deadlines close, or be consigned to the annals of mediocrity.&rdquo;
              </blockquote>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
