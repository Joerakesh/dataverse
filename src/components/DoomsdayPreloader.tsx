"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { sounds } from "@/src/utils/soundEffects";

interface Props { onComplete: () => void }

const STATUS = [
  "SYNCHRONIZING THE MULTIVERSE...",
  "STABILIZING THE EMERALD ENERGY FIELD...",
  "OPENING THE DOOMSDAY PROTOCOL...",
  "SUMMONING THE GUARDIAN...",
  "DATAVERSE 2K26 · SYSTEM ONLINE",
];

export default function DoomsdayPreloader({ onComplete }: Props) {
  const [status, setStatus] = useState(0);
  const [exiting, setExiting] = useState(false);
  const reduced = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const finished = useRef(false);
  const timers = useRef<number[]>([]);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    setExiting(true);
    timers.current.push(window.setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
      onComplete();
    }, reduced ? 0 : 420));
  }, [onComplete, reduced]);

  useEffect(() => {
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);
    return () => {
      document.body.style.overflow = oldOverflow;
      timers.current.forEach(window.clearTimeout);
    };
  }, []);

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let raf = 0;
    let width = 0, height = 0, dpr = 1, last = 0;
    const particles = Array.from({ length: window.innerWidth < 640 ? 14 : 26 }, () => ({
      x: Math.random(), y: Math.random(), r: 24 + Math.random() * 74,
      vx: (Math.random() - .5) * .0008, vy: -.0003 - Math.random() * .0007,
      a: .05 + Math.random() * .12,
    }));
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth; height = window.innerHeight;
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      canvas.style.width = width + "px"; canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const draw = (time: number) => {
      if (time - last < 32) { raf = requestAnimationFrame(draw); return; }
      last = time; ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.y < -.15) { p.y = 1.1; p.x = Math.random(); }
        if (p.x < -.1 || p.x > 1.1) p.vx *= -1;
        const x = p.x * width, y = p.y * height, radius = p.r * (width < 640 ? .75 : 1);
        const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
        g.addColorStop(0, "rgba(0,255,136," + p.a + ")");
        g.addColorStop(.55, "rgba(4,120,87," + (p.a * .45) + ")");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    resize(); window.addEventListener("resize", resize, { passive: true });
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [reduced]);

  useEffect(() => {
    sounds.playDoomsdaySurge();
    if (reduced) { timers.current.push(window.setTimeout(finish, 700)); return; }
    const interval = window.setInterval(() => setStatus(v => Math.min(v + 1, STATUS.length - 1)), 560);
    timers.current.push(window.setTimeout(finish, 3100));
    return () => window.clearInterval(interval);
  }, [finish, reduced]);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="dataverse-entry"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.025, transition: { duration: .42, ease: [.16, 1, .3, 1] } }}
          className="fixed inset-0 z-[200] flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#050806] px-4 py-[max(1rem,env(safe-area-inset-top))] text-white"
          role="status" aria-label="Loading Dataverse"
        >
          <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_52%,rgba(0,255,102,.16),transparent_43%),linear-gradient(180deg,rgba(0,0,0,.2),#050806)]" />
          <div className="pointer-events-none absolute left-1/2 top-0 h-[55vh] w-24 -translate-x-1/2 bg-gradient-to-b from-emerald-300/40 via-emerald-500/10 to-transparent blur-2xl" />
          <div className="pointer-events-none absolute inset-4 rounded-xl border border-emerald-400/20 sm:inset-7" />
          <div className="pointer-events-none absolute left-5 top-5 h-9 w-9 border-l-2 border-t-2 border-emerald-400/60 sm:left-8 sm:top-8 sm:h-12 sm:w-12" />
          <div className="pointer-events-none absolute right-5 top-5 h-9 w-9 border-r-2 border-t-2 border-emerald-400/60 sm:right-8 sm:top-8 sm:h-12 sm:w-12" />
          <div className="pointer-events-none absolute bottom-5 left-5 h-9 w-9 border-b-2 border-l-2 border-emerald-400/60 sm:bottom-8 sm:left-8 sm:h-12 sm:w-12" />
          <div className="pointer-events-none absolute bottom-5 right-5 h-9 w-9 border-b-2 border-r-2 border-emerald-400/60 sm:bottom-8 sm:right-8 sm:h-12 sm:w-12" />

          <div className="relative z-10 flex w-full max-w-xl flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: -18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: .5 }}
              className="mb-2 flex items-center justify-center gap-3 sm:gap-7"
            >
              <div className="flex items-center gap-2">
                <img src="/images/loyola-crest.png" alt="Loyola College" className="h-9 w-9 rounded-full border border-emerald-400/40 bg-black/60 p-1 object-contain sm:h-12 sm:w-12" />
                <div className="text-left"><span className="block text-[10px] font-bold tracking-wider sm:text-xs">LOYOLA COLLEGE</span><span className="block text-[8px] uppercase tracking-widest text-emerald-400 sm:text-[9px]">Autonomous · Chennai</span></div>
              </div>
              <span className="h-7 w-px bg-emerald-500/40" />
              <div className="flex items-center gap-2">
                <img src="/images/sage-logo.png" alt="SAGE" className="h-9 w-9 rounded-full border border-emerald-400/40 bg-black/60 p-1 object-contain sm:h-12 sm:w-12" />
                <div className="text-left"><span className="block text-xs font-bold tracking-wider text-emerald-200">SAGE</span><span className="block text-[8px] uppercase tracking-widest text-slate-400 sm:text-[9px]">Data Science</span></div>
              </div>
            </motion.div>

            <div className="relative my-3 flex aspect-square w-[min(66vw,18rem)] items-center justify-center sm:my-5 sm:w-80">
              <motion.div
                initial={{ scale: .15, opacity: 0 }}
                animate={{ scale: [0.15, 2.35, 3.1], opacity: [0, .8, 0] }}
                transition={{ duration: 1.25, delay: .62, ease: [.16, 1, .3, 1] }}
                className="absolute h-28 w-28 rounded-full border-2 border-emerald-300 shadow-[0_0_55px_rgba(0,255,102,.75)]"
              />
              <motion.div
                initial={{ scale: .1, opacity: 0 }}
                animate={{ scale: [0.1, 3.7], opacity: [0, .5, 0] }}
                transition={{ duration: 1.45, delay: .72, ease: [.16, 1, .3, 1] }}
                className="absolute h-28 w-28 rounded-full border border-emerald-500/80"
              />
              <motion.div
                initial={{ y: "-58vh", scale: .52, opacity: .25 }}
                animate={{ y: ["-58vh", "1.5vh", "0vh"], scale: [.52, 1.08, 1], opacity: [.25, 1, 1] }}
                transition={{ duration: .95, times: [0, .78, 1], ease: [.22, 1, .36, 1] }}
                className="relative z-10 h-[min(52vw,15rem)] w-[min(38vw,11rem)] overflow-hidden rounded-xl border border-emerald-300/50 shadow-[0_0_55px_rgba(0,255,102,.35)] sm:h-64 sm:w-44"
              >
                <img src="/images/characters/doom.jpg" alt="Doctor Doom" className="h-full w-full object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050806] via-transparent to-black/10" />
              </motion.div>
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: [0, 1.2, 1.7], opacity: [0, .9, 0] }}
                transition={{ duration: .8, delay: .72, ease: "easeOut" }}
                className="absolute bottom-[13%] h-px w-[min(78vw,25rem)] bg-gradient-to-r from-transparent via-emerald-200 to-transparent shadow-[0_0_16px_#00ff66]"
              />
            </div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .9, duration: .55 }} className="relative z-20 flex w-full flex-col items-center">
              <img src="/images/logo.png" alt="DATAVERSE" className="h-auto max-h-14 w-[min(78vw,20rem)] object-contain drop-shadow-[0_0_25px_rgba(0,255,102,.65)] sm:max-h-16" />
              <p className="mt-1 font-avengers text-xl italic tracking-[.28em] text-emerald-400 sm:text-2xl">2K26</p>
              <p className="mt-3 min-h-5 max-w-full px-2 font-tech text-[9px] font-bold uppercase tracking-[.12em] text-emerald-300 sm:text-xs sm:tracking-[.2em]">{STATUS[status]}</p>
              <button type="button" onClick={() => { sounds.playClick(); finish(); }} className="mt-5 rounded-full border border-emerald-400/35 bg-black/40 px-5 py-2 text-[9px] font-bold tracking-[.25em] text-slate-400 transition-colors hover:border-emerald-300 hover:text-emerald-200 sm:text-[10px]">[ ENTER THE MULTIVERSE ]</button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
