"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight, Calendar, Clock, Download, MapPin, Phone, Sparkles } from "lucide-react";
import Link from "next/link";
import { sounds } from "@/src/utils/soundEffects";

export default function Hero() {
  const [timeLeft, setTimeLeft] = useState({ days: "00", hours: "00", minutes: "00", seconds: "00" });

  useEffect(() => {
    const target = new Date("2026-12-04T09:00:00").getTime();
    const update = () => {
      const difference = Math.max(0, target - Date.now());
      const values = [
        Math.floor(difference / 86400000),
        Math.floor((difference % 86400000) / 3600000),
        Math.floor((difference % 3600000) / 60000),
        Math.floor((difference % 60000) / 1000),
      ];
      setTimeLeft({
        days: String(values[0]).padStart(2, "0"),
        hours: String(values[1]).padStart(2, "0"),
        minutes: String(values[2]).padStart(2, "0"),
        seconds: String(values[3]).padStart(2, "0"),
      });
    };
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const countdown = [
    { label: "DAYS", value: timeLeft.days },
    { label: "HOURS", value: timeLeft.hours },
    { label: "MINUTES", value: timeLeft.minutes },
    { label: "SECONDS", value: timeLeft.seconds },
  ];

  return (
    <section className="relative isolate min-h-[calc(100svh-6rem)] overflow-hidden border-b border-emerald-400/15 bg-[#030907]">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_72%_45%,rgba(0,255,136,0.17),transparent_42%),radial-gradient(ellipse_at_8%_15%,rgba(16,185,129,0.13),transparent_35%)]" />
      <div aria-hidden="true" className="absolute inset-0 opacity-[0.13] bg-[linear-gradient(rgba(52,211,153,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(52,211,153,.18)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      <div className="relative z-10 mx-auto grid min-h-[calc(100svh-6rem)] max-w-7xl grid-cols-1 items-center gap-10 px-4 pb-16 pt-24 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:gap-6 lg:px-8 lg:py-16">
        <div className="relative z-20 max-w-2xl">
          <div className="mb-7 inline-flex flex-wrap items-center gap-2 rounded-full border border-emerald-400/30 bg-black/45 px-4 py-2 text-[10px] font-tech font-bold uppercase tracking-[0.18em] text-emerald-200 shadow-[0_0_28px_rgba(0,255,136,.08)] sm:text-xs">
            <img src="/images/loyola-crest.png" alt="Loyola College" className="h-6 w-6 object-contain" />
            <span>Loyola College · Chennai</span><span className="text-emerald-500">/</span>
            <img src="/images/sage-logo.png" alt="SAGE" className="h-5 w-5 object-contain" />
            <span>Department of Data Science</span>
          </div>

          <div className="mb-3 flex items-center gap-3 text-[10px] font-tech font-bold uppercase tracking-[0.32em] text-emerald-400 sm:text-xs">
            <span className="h-px w-8 bg-emerald-400" />
            INTER-COLLEGIATE TECHNICAL FEST · 2K26
          </div>
          <div className="relative mb-2 max-w-[560px]">
            <img src="/images/logo.png" alt="DATAVERSE" className="w-full max-h-36 object-contain object-left drop-shadow-[0_0_32px_rgba(0,255,136,.35)] sm:max-h-44" />
          </div>
          <h1 className="font-avengers text-3xl italic tracking-[0.22em] text-emerald-300 drop-shadow-[0_0_18px_rgba(0,255,136,.4)] sm:text-5xl">ENTER THE MULTIVERSE</h1>
          <p className="mt-5 max-w-xl font-tech text-base leading-relaxed text-slate-300 sm:text-lg">
            Eight arenas. One campus. A universe of ideas. Build, decode, compete and bring your best work to DATAVERSE 2K26.
          </p>

          <div className="mt-7 flex flex-wrap gap-2 text-[10px] font-tech font-bold uppercase tracking-wider sm:text-xs">
            <span className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/25 bg-black/40 px-3 py-2 text-slate-200"><Calendar size={14} className="text-emerald-400"/>04 December 2026</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/25 bg-black/40 px-3 py-2 text-slate-200"><Clock size={14} className="text-amber-300"/>09:00 AM onwards</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/25 bg-black/40 px-3 py-2 text-slate-200"><MapPin size={14} className="text-rose-400"/>Centenary Building</span>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/register" onClick={() => sounds.playClick()} className="group inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-emerald-400 to-green-500 px-7 py-3.5 font-avengers text-lg font-bold tracking-widest text-black shadow-[0_0_30px_rgba(0,255,136,.28)] transition-transform hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(0,255,136,.45)]">
              REGISTER NOW <ArrowRight size={18} className="transition-transform group-hover:translate-x-1"/>
            </Link>
            <a href="#events" onClick={() => sounds.playHover()} className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-6 py-3.5 font-tech text-xs font-bold uppercase tracking-widest text-slate-200 transition-colors hover:border-emerald-400/50 hover:text-emerald-300">
              Explore events <Sparkles size={15}/>
            </a>
            <a href="/DATAVERSE-RULEBOOK.pdf" download="DATAVERSE-RULEBOOK.pdf" className="inline-flex items-center gap-2 px-2 py-3 font-tech text-xs font-semibold text-slate-400 transition-colors hover:text-emerald-300"><Download size={15}/> Rulebook</a>
          </div>

          <div className="mt-10 max-w-xl border-t border-emerald-400/15 pt-6">
            <p className="mb-3 font-tech text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-400">Countdown to activation</p>
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {countdown.map((item) => <div key={item.label} className="rounded-lg border border-emerald-400/20 bg-black/45 px-3 py-3 text-center shadow-[inset_0_0_22px_rgba(16,185,129,.05)]">
                <span className="block font-avengers text-2xl text-white tabular-nums sm:text-3xl">{item.value}</span>
                <span className="mt-1 block text-[9px] font-tech font-bold tracking-[0.2em] text-emerald-400">{item.label}</span>
              </div>)}
            </div>
          </div>

          <div className="mt-6 grid max-w-xl grid-cols-2 gap-3 text-xs font-tech text-slate-300">
            <div className="rounded-lg border border-white/10 bg-black/30 p-3">
              <span className="block text-[9px] font-bold uppercase tracking-widest text-emerald-400">Association Secretary</span>
              <span className="mt-1 block font-avengers text-lg text-white">FLORINA</span>
              <a href="tel:9043183343" className="mt-1 inline-flex items-center gap-1 text-slate-400 hover:text-emerald-300"><Phone size={11}/>9043183343</a>
            </div>
            <div className="rounded-lg border border-white/10 bg-black/30 p-3">
              <span className="block text-[9px] font-bold uppercase tracking-widest text-emerald-400">Joint Secretary</span>
              <span className="mt-1 block font-avengers text-lg text-white">GODWIN SAM</span>
              <a href="tel:7305462733" className="mt-1 inline-flex items-center gap-1 text-slate-400 hover:text-emerald-300"><Phone size={11}/>7305462733</a>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[520px] lg:ml-auto">
          <div aria-hidden="true" className="absolute -inset-8 rounded-[45%] bg-emerald-400/10 blur-3xl" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-emerald-300/30 bg-[#06110b] shadow-[0_24px_100px_rgba(0,0,0,.6),0_0_55px_rgba(0,255,136,.13)]">
            <img src="/images/characters/doom.jpg" alt="Doctor Doom, guardian of the DATAVERSE multiverse" className="h-full w-full object-cover object-top transition-transform duration-700 hover:scale-[1.035]"/>
            <div className="absolute inset-0 bg-gradient-to-t from-[#030907] via-[#030907]/5 to-[#030907]/20"/>
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
              <div className="flex items-center gap-2 text-[9px] font-tech font-bold uppercase tracking-[0.26em] text-emerald-300"><span className="h-px w-7 bg-emerald-400"/>THE DOOMSDAY PROTOCOL</div>
              <p className="mt-2 font-avengers text-2xl italic tracking-wider text-white sm:text-3xl">THE MULTIVERSE AWAITS</p>
              <p className="mt-1 font-tech text-xs text-slate-300">04.12.2026 · Centenary Building, Loyola</p>
            </div>
          </div>
          <div className="absolute -bottom-4 -left-3 rounded-xl border border-emerald-300/30 bg-[#06110b]/90 px-4 py-3 shadow-xl backdrop-blur-md sm:-left-8">
            <span className="block font-avengers text-2xl text-emerald-300">08</span>
            <span className="text-[9px] font-tech font-bold uppercase tracking-widest text-slate-400">Event arenas</span>
          </div>
          <div className="absolute -right-2 top-8 rounded-xl border border-white/15 bg-black/70 px-3 py-2 font-tech text-[9px] font-bold uppercase tracking-widest text-emerald-200 backdrop-blur-md sm:-right-5">
            SYSTEM ONLINE <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#00ff88]"/>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#04070a] to-transparent"/>
    </section>
  );
}
