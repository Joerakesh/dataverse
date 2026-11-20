"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, CalendarDays, MapPin, RotateCcw } from "lucide-react";

export default function Hero() {
  const [timeLeft, setTimeLeft] = useState({ days: "00", hours: "00", minutes: "00", seconds: "00" });

  useEffect(() => {
    const target = new Date("2026-12-04T09:00:00+05:30").getTime();
    const update = () => {
      const ms = Math.max(0, target - Date.now());
      setTimeLeft({
        days: String(Math.floor(ms / 86400000)).padStart(2, "0"),
        hours: String(Math.floor(ms % 86400000 / 3600000)).padStart(2, "0"),
        minutes: String(Math.floor(ms % 3600000 / 60000)).padStart(2, "0"),
        seconds: String(Math.floor(ms % 60000 / 1000)).padStart(2, "0"),
      });
    };
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const replayIntro = () => window.dispatchEvent(new Event("dataverse:replay-intro"));

  return (
    <section className="relative isolate flex min-h-[calc(100svh-4.5rem)] items-center overflow-hidden border-b border-white/10 bg-[#050806]">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_48%,rgba(0,255,102,.16),transparent_44%),radial-gradient(ellipse_at_15%_80%,rgba(16,185,129,.12),transparent_40%)]" />
      <div aria-hidden="true" className="absolute inset-0 bg-grid-pattern opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent_90%)]" />
      <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-5 pb-16 pt-14 sm:px-8 sm:pt-16 lg:grid-cols-12 lg:gap-8 lg:py-16">
        <div className="min-w-0 lg:col-span-7">
          <div className="mb-7 flex flex-wrap items-center gap-3 text-[10px] font-tech font-bold uppercase tracking-[.2em] text-emerald-200 sm:text-xs">
            <img src="/images/loyola-crest.png" alt="Loyola College" className="h-8 w-8 object-contain" />
            <span>LOYOLA COLLEGE · CHENNAI</span><span className="text-emerald-500">/</span>
            <img src="/images/sage-logo.png" alt="SAGE" className="h-7 w-7 object-contain" />
            <span>DEPARTMENT OF DATA SCIENCE</span>
          </div>
          <p className="font-tech text-[10px] font-bold uppercase tracking-[.28em] text-emerald-400 sm:text-xs">INTER-COLLEGIATE TECHNICAL SYMPOSIUM · 2K26</p>
          <h1 className="metallic-title mt-3 font-doom text-5xl font-black leading-[.98] tracking-[.06em] sm:text-6xl md:text-7xl lg:text-[5.5rem]">DATAVERSE</h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-[#A8B5B0] sm:text-base md:text-lg">
            Eight arenas. One campus. A universe of ideas. Build, decode, compete and bring your best work to DATAVERSE 2K26.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3 text-[10px] font-tech font-bold uppercase tracking-wider text-slate-200 sm:text-xs">
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-black/35 px-3 py-2"><CalendarDays size={14} className="text-emerald-400"/>04 December 2026</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-black/35 px-3 py-2"><MapPin size={14} className="text-emerald-400"/>Centenary Building</span>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#events" className="inline-flex items-center gap-2 rounded-xl bg-[#00ff66] px-6 py-3.5 text-sm font-bold tracking-wide text-[#050806] shadow-[0_0_28px_rgba(0,255,102,.25)] transition hover:-translate-y-0.5 hover:bg-emerald-300">
              EXPLORE 8 EVENTS <ArrowUpRight size={17}/>
            </a>
            <button type="button" onClick={replayIntro} className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[.04] px-5 py-3.5 text-sm text-slate-200 transition hover:border-emerald-400/60 hover:text-emerald-300">
              <RotateCcw size={16}/> REPLAY ENTRY
            </button>
          </div>
          <div className="mt-10 max-w-md border-t border-white/15 pt-6">
            <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[.24em] text-emerald-400">COUNTDOWN TO ACTIVATION</p>
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {Object.entries(timeLeft).map(([label, value]) => <div key={label} className="rounded-lg border border-white/10 bg-black/35 px-2 py-3 text-center">
                <span className="block font-mono text-2xl font-semibold tabular-nums text-white sm:text-3xl">{value}</span>
                <span className="mt-1 block text-[9px] font-bold uppercase tracking-[.18em] text-emerald-400">{label}</span>
              </div>)}
            </div>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-[360px] lg:col-span-5 lg:ml-auto">
          <div aria-hidden="true" className="absolute -inset-8 rounded-[45%] bg-emerald-400/10 blur-3xl"/>
          <div className="relative aspect-[2/3] max-h-[min(72svh,650px)] overflow-hidden rounded-2xl border border-emerald-400/30 bg-black shadow-[0_0_65px_rgba(0,255,102,.18)]">
            <img src="/images/characters/doom.jpg" alt="Doctor Doom" className="h-full w-full object-cover object-top"/>
            <div className="absolute inset-0 bg-gradient-to-t from-[#050806] via-transparent to-[#050806]/30"/>
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
              <p className="font-mono text-[9px] tracking-[.22em] text-emerald-300">DOOMSDAY PROTOCOL</p>
              <p className="mt-2 font-doom text-xl font-bold tracking-wider text-white sm:text-2xl">THE MULTIVERSE AWAITS</p>
              <p className="mt-2 text-xs text-slate-300">04.12.2026 · Centenary Building, Loyola</p>
            </div>
          </div>
          <div className="absolute -bottom-4 -left-2 rounded-lg border border-emerald-400/30 bg-[#07100c]/95 px-4 py-3 shadow-xl backdrop-blur sm:-left-6">
            <span className="block font-mono text-2xl font-bold text-emerald-300">08</span><span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Event Arenas</span>
          </div>
          <div className="absolute right-0 top-5 rounded-lg border border-white/15 bg-black/75 px-3 py-2 text-[9px] font-bold tracking-widest text-emerald-200 backdrop-blur sm:-right-5">SYSTEM ONLINE <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400"/></div>
        </div>
      </div>
    </section>
  );
}
