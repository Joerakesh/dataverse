"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, CalendarDays, Clock3, MapPin, Download } from "lucide-react";
import Link from "next/link";
import { sounds } from "@/src/utils/soundEffects";

export default function Hero() {
  const [timeLeft, setTimeLeft] = useState({ days: "00", hours: "00", minutes: "00", seconds: "00" });

  useEffect(() => {
    const target = new Date("2026-12-04T09:00:00+05:30").getTime();
    const update = () => {
      const difference = Math.max(0, target - Date.now());
      setTimeLeft({
        days: String(Math.floor(difference / 86400000)).padStart(2, "0"),
        hours: String(Math.floor((difference % 86400000) / 3600000)).padStart(2, "0"),
        minutes: String(Math.floor((difference % 3600000) / 60000)).padStart(2, "0"),
        seconds: String(Math.floor((difference % 60000) / 1000)).padStart(2, "0"),
      });
    };
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const countdown = [
    { label: "DAYS", value: timeLeft.days },
    { label: "HRS", value: timeLeft.hours },
    { label: "MIN", value: timeLeft.minutes },
    { label: "SEC", value: timeLeft.seconds },
  ];

  return (
    <section className="relative isolate overflow-hidden border-b border-emerald-400/10 bg-[#030907]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_76%_42%,rgba(0,255,136,.14),transparent_38%),radial-gradient(ellipse_at_12%_18%,rgba(16,185,129,.09),transparent_34%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(52,211,153,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(52,211,153,.12)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[.12] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]" />

      <div className="relative mx-auto grid min-h-[min(780px,calc(100svh-5rem))] max-w-7xl grid-cols-1 items-center gap-8 px-5 pb-12 pt-28 sm:px-8 sm:pb-16 lg:grid-cols-[1.04fr_.96fr] lg:gap-4 lg:px-10 lg:py-14">
        <div className="relative z-10 mx-auto w-full max-w-2xl lg:mx-0">
          <div className="mb-7 flex flex-wrap items-center gap-3">
            <Image src="/images/loyola-crest.png" alt="Loyola College crest" width={34} height={34} className="h-8 w-8 object-contain" />
            <span className="font-tech text-[10px] font-bold uppercase tracking-[.18em] text-slate-300 sm:text-xs">Loyola College, Chennai</span>
            <span aria-hidden="true" className="h-4 w-px bg-emerald-400/40" />
            <Image src="/images/sage-logo.png" alt="SAGE" width={30} height={30} className="h-7 w-7 object-contain" />
            <span className="font-tech text-[10px] font-bold uppercase tracking-[.16em] text-slate-400 sm:text-xs">Department of Data Science</span>
          </div>

          <p className="mb-4 flex items-center gap-3 font-tech text-[10px] font-bold uppercase tracking-[.28em] text-emerald-400 sm:text-xs">
            <span className="h-px w-8 bg-emerald-400" />
            INTER-COLLEGIATE TECHNICAL FEST · 2K26
          </p>

          <Image
            src="/images/logo.png"
            alt="DATAVERSE"
            width={720}
            height={190}
            priority
            className="mb-3 h-auto max-h-28 w-full max-w-[520px] object-contain object-left drop-shadow-[0_0_26px_rgba(0,255,136,.22)] sm:max-h-36"
          />

          <h1 className="max-w-xl font-avengers text-3xl italic leading-tight tracking-[.08em] text-white drop-shadow-[0_0_22px_rgba(0,255,136,.18)] sm:text-5xl lg:text-[3.35rem]">
            ENTER THE <span className="text-emerald-300">MULTIVERSE.</span>
          </h1>
          <p className="mt-5 max-w-lg font-tech text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
            Think beyond limits. Build bold ideas, solve challenges and compete with the brightest minds at DATAVERSE 2K26.
          </p>

          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-[10px] font-tech font-semibold uppercase tracking-[.12em] text-slate-300 sm:text-xs">
            <span className="inline-flex items-center gap-2"><CalendarDays size={15} className="text-emerald-400" />04 December 2026</span>
            <span className="inline-flex items-center gap-2"><Clock3 size={15} className="text-emerald-400" />09:00 AM onwards</span>
            <span className="inline-flex items-center gap-2"><MapPin size={15} className="text-emerald-400" />Centenary Building</span>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/register" onClick={() => sounds.playClick()} className="group inline-flex min-h-12 items-center gap-3 rounded-lg bg-emerald-400 px-6 py-3 font-avengers text-base font-bold tracking-widest text-[#031009] shadow-[0_8px_30px_rgba(0,255,136,.16)] transition-all hover:-translate-y-0.5 hover:bg-emerald-300 hover:shadow-[0_12px_36px_rgba(0,255,136,.26)]">
              REGISTER NOW <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <a href="#events" onClick={() => sounds.playHover()} className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-white/15 bg-white/[.035] px-5 py-3 font-tech text-[11px] font-bold uppercase tracking-[.14em] text-slate-200 transition-colors hover:border-emerald-400/50 hover:text-emerald-300">
              Explore events
            </a>
            <a href="/DATAVERSE-RULEBOOK.pdf" download="DATAVERSE-RULEBOOK.pdf" className="inline-flex min-h-12 items-center gap-2 px-2 py-3 font-tech text-[11px] font-semibold uppercase tracking-wider text-slate-400 transition-colors hover:text-emerald-300">
              <Download size={15} /> Rulebook
            </a>
          </div>

          <div className="mt-9 max-w-md border-t border-emerald-400/15 pt-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-tech text-[9px] font-bold uppercase tracking-[.2em] text-slate-400">Countdown to event day</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_9px_#00ff88]" />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {countdown.map((item) => (
                <div key={item.label} className="rounded-lg border border-white/[.08] bg-black/35 px-2 py-2.5 text-center">
                  <span className="block font-avengers text-2xl tabular-nums text-white sm:text-3xl">{item.value}</span>
                  <span className="mt-0.5 block font-tech text-[8px] font-bold tracking-[.18em] text-emerald-400">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[510px] lg:ml-auto lg:mr-0">
          <div aria-hidden="true" className="absolute inset-[12%] rounded-full bg-emerald-400/10 blur-[85px]" />
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[430px] overflow-hidden rounded-[24px] border border-emerald-300/20 bg-[radial-gradient(ellipse_at_50%_40%,rgba(16,185,129,.12),rgba(3,9,7,.15)_58%,#030907_78%)] shadow-[0_28px_90px_rgba(0,0,0,.55)] sm:max-w-[470px]">
            <div aria-hidden="true" className="absolute inset-4 rounded-[18px] border border-white/[.06]" />
            <Image
              src="/images/characters/doom.jpg"
              alt="Doctor Doom"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 42vw"
              className="object-contain object-center p-3 sm:p-5"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#030907]/90 via-transparent to-[#030907]/10" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
              <span className="font-tech text-[9px] font-bold uppercase tracking-[.28em] text-emerald-300">THE DOOMSDAY PROTOCOL</span>
              <p className="mt-2 font-avengers text-2xl italic tracking-wider text-white sm:text-3xl">THE MULTIVERSE AWAITS</p>
              <p className="mt-1 font-tech text-[10px] uppercase tracking-[.12em] text-slate-400">Loyola College · Chennai</p>
            </div>
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute -right-2 top-[16%] h-20 w-20 rounded-full border border-emerald-300/15 sm:-right-7 sm:h-28 sm:w-28" />
          <div aria-hidden="true" className="pointer-events-none absolute -left-2 bottom-[20%] h-12 w-12 rounded-full border border-emerald-300/20 sm:-left-6 sm:h-16 sm:w-16" />
        </div>
      </div>
    </section>
  );
}
