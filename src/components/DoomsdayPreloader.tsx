"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Terminal, Zap } from "lucide-react";
import { sounds } from "@/src/utils/soundEffects";

interface DoomsdayPreloaderProps {
  onComplete: () => void;
}

const statuses = [
  "SYNCHRONIZING LOYOLA CITADEL MAINFRAME...",
  "SAGE NEURAL MESH INITIALIZING...",
  "DOOMSDAY ARC REACTOR GENERATING PLASMA...",
  "QUANTUM PARTICLES REACHING SUPER-CONDUCTIVITY...",
  "DATAVERSE 2K26 — THE MULTIVERSE IS ONLINE.",
];

export default function DoomsdayPreloader({ onComplete }: DoomsdayPreloaderProps) {
  const [statusIndex, setStatusIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const exitTimerRef = useRef<number | null>(null);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const finish = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setIsExiting(true);
    exitTimerRef.current = window.setTimeout(() => onCompleteRef.current(), 380);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    sounds.playDoomsdaySurge();

    const statusTimer = window.setInterval(() => {
      setStatusIndex((current) => Math.min(current + 1, statuses.length - 1));
    }, 560);
    const completionTimer = window.setTimeout(finish, 2700);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Enter") {
        event.preventDefault();
        finish();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearInterval(statusTimer);
      window.clearTimeout(completionTimer);
      if (exitTimerRef.current) window.clearTimeout(exitTimerRef.current);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [finish]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="DATAVERSE is loading"
      className={`fixed inset-0 z-[100] flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#020508] px-4 py-8 transition-all duration-[380ms] ease-out sm:px-6 ${isExiting ? "pointer-events-none scale-[1.025] opacity-0" : "scale-100 opacity-100"}`}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(0,255,136,.16),transparent_48%),linear-gradient(180deg,#020508_0%,#04100b_55%,#020508_100%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-40" />
      <div aria-hidden="true" className="doom-intro-beam pointer-events-none absolute left-1/2 top-0 h-[58svh] w-24 -translate-x-1/2 bg-gradient-to-b from-emerald-300/30 via-emerald-500/10 to-transparent blur-2xl" />

      <div className="relative z-10 flex w-full max-w-xl flex-col items-center text-center">
        <div className="mb-5 flex items-center justify-center gap-4 sm:mb-7 sm:gap-8">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-emerald-400/50 bg-black/60 p-1 shadow-[0_0_18px_rgba(0,255,136,.2)] sm:h-12 sm:w-12">
              <img src="/images/loyola-crest.png" alt="Loyola College" className="h-full w-full object-contain" />
            </span>
            <span className="text-left">
              <span className="block font-avengers text-xs tracking-wider text-white sm:text-sm">LOYOLA COLLEGE</span>
              <span className="block text-[8px] font-tech font-bold uppercase tracking-[.16em] text-emerald-400 sm:text-[9px]">Autonomous · Chennai</span>
            </span>
          </div>
          <span aria-hidden="true" className="h-8 w-px bg-emerald-400/30" />
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-emerald-400/50 bg-black/60 p-1 shadow-[0_0_18px_rgba(0,255,136,.2)] sm:h-12 sm:w-12">
              <img src="/images/sage-logo.png" alt="SAGE" className="h-full w-full object-contain" />
            </span>
            <span className="text-left">
              <span className="block font-avengers text-xs tracking-wider text-emerald-300 sm:text-sm">SAGE</span>
              <span className="block text-[8px] font-tech font-bold uppercase tracking-[.16em] text-slate-400 sm:text-[9px]">Department of Data Science</span>
            </span>
          </div>
        </div>

        <div className="relative my-2 flex aspect-square w-[min(72vw,18rem)] items-center justify-center sm:w-[20rem]">
          <div aria-hidden="true" className="absolute inset-0 rounded-full bg-emerald-400/15 blur-3xl" />
          <div aria-hidden="true" className="doom-intro-ring absolute inset-0 rounded-full border border-emerald-300/80 shadow-[0_0_32px_rgba(0,255,136,.35)]" />
          <div aria-hidden="true" className="doom-intro-ring-reverse absolute inset-[7%] rounded-full border border-dashed border-emerald-400/55" />
          <div aria-hidden="true" className="absolute inset-[15%] rounded-full border border-emerald-300/20" />
          <div className="doom-intro-portrait relative h-[78%] w-[62%] overflow-hidden rounded-2xl border border-emerald-300/50 bg-[#06110b] shadow-[0_0_55px_rgba(0,255,136,.3)]">
            <img src="/images/characters/doom.jpg" alt="Doctor Doom" className="h-full w-full object-cover object-top" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020508] via-transparent to-[#020508]/20" />
          </div>
          <div aria-hidden="true" className="doom-intro-shockwave absolute inset-[8%] rounded-full border-2 border-emerald-300/80" />
          <div aria-hidden="true" className="doom-intro-shockwave doom-intro-shockwave-delay absolute inset-[8%] rounded-full border border-white/70" />
          <span className="absolute bottom-[8%] right-[7%] flex h-9 w-9 items-center justify-center rounded-full border border-emerald-200/60 bg-black/80 text-emerald-200 shadow-[0_0_22px_rgba(0,255,136,.5)] sm:h-11 sm:w-11">
            <Zap size={20} className="animate-pulse" />
          </span>
        </div>

        <div className="mt-3 w-full">
          <img src="/images/logo.png" alt="DATAVERSE" className="mx-auto h-auto max-h-14 w-full max-w-[250px] object-contain drop-shadow-[0_0_22px_rgba(0,255,136,.5)] sm:max-h-16 sm:max-w-[300px]" />
          <p className="mt-1 font-avengers text-lg tracking-[.38em] text-emerald-300 sm:text-xl">2K26</p>
        </div>

        <div className="mt-5 flex min-h-6 max-w-full items-center justify-center gap-2 px-2 text-[9px] font-tech font-bold uppercase tracking-[.12em] text-emerald-300 sm:text-[11px] sm:tracking-[.2em]">
          <Terminal size={14} className="shrink-0 animate-pulse" />
          <span className="max-w-[min(78vw,26rem)] truncate">{statuses[statusIndex]}</span>
        </div>

        <button
          type="button"
          onClick={finish}
          className="mt-4 rounded-full border border-emerald-400/30 px-5 py-2 text-[10px] font-tech font-bold uppercase tracking-[.24em] text-slate-400 transition-colors hover:border-emerald-300 hover:text-emerald-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
        >
          Enter Citadel
        </button>
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute left-4 top-4 h-8 w-8 border-l border-t border-emerald-400/40 sm:left-7 sm:top-7 sm:h-12 sm:w-12" />
      <div aria-hidden="true" className="pointer-events-none absolute right-4 top-4 h-8 w-8 border-r border-t border-emerald-400/40 sm:right-7 sm:top-7 sm:h-12 sm:w-12" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-4 left-4 h-8 w-8 border-b border-l border-emerald-400/40 sm:bottom-7 sm:left-7 sm:h-12 sm:w-12" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-4 right-4 h-8 w-8 border-b border-r border-emerald-400/40 sm:bottom-7 sm:right-7 sm:h-12 sm:w-12" />
    </div>
  );
}
