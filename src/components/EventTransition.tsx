"use client";

import React, { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Zap } from "lucide-react";
import type { SymposiumEvent } from "@/src/data/events";

interface EventTransitionProps {
  event: SymposiumEvent;
  onComplete: () => void;
}

export default function EventTransition({ event, onComplete }: EventTransitionProps) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const timer = window.setTimeout(onComplete, prefersReducedMotion ? 180 : 1180);
    return () => window.clearTimeout(timer);
  }, [onComplete, prefersReducedMotion]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`Entering ${event.title}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[70] flex items-center justify-center overflow-hidden bg-[#020508]/[.98] px-5 py-10"
    >
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(0,255,136,.2),transparent_48%),linear-gradient(180deg,#020508,#06120b_55%,#020508)]" />
      <div aria-hidden="true" className="absolute inset-0 bg-grid-pattern opacity-35" />
      <motion.div
        aria-hidden="true"
        initial={{ scale: 0.15, opacity: 0 }}
        animate={{ scale: prefersReducedMotion ? 1 : [0.15, 1.35, 2.4], opacity: prefersReducedMotion ? 0.2 : [0, 0.8, 0] }}
        transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
        className="absolute h-[min(72vw,34rem)] w-[min(72vw,34rem)] rounded-full border-2 border-emerald-300/80 shadow-[0_0_70px_rgba(0,255,136,.5),inset_0_0_55px_rgba(0,255,136,.12)]"
      />
      <motion.div
        aria-hidden="true"
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: prefersReducedMotion ? 1 : [0.3, 1.8, 2.9], opacity: prefersReducedMotion ? 0.1 : [0, 0.45, 0] }}
        transition={{ duration: 1.1, delay: 0.08, ease: "easeOut" }}
        className="absolute h-[min(58vw,28rem)] w-[min(58vw,28rem)] rounded-full border border-white/60"
      />

      <motion.div
        initial={prefersReducedMotion ? false : { y: 90, scale: 0.72, rotateY: -18, opacity: 0 }}
        animate={{ y: 0, scale: 1, rotateY: 0, opacity: 1 }}
        transition={{ duration: prefersReducedMotion ? 0.01 : 0.72, delay: prefersReducedMotion ? 0 : 0.12, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex w-full max-w-md flex-col items-center text-center [perspective:1200px]"
      >
        <div className="relative aspect-[4/5] w-[min(64vw,18rem)] overflow-hidden rounded-2xl border border-emerald-300/45 bg-[#06110b] shadow-[0_0_75px_rgba(0,255,136,.22)] sm:w-72">
          <img src={event.character.image} alt={event.character.alias} className="h-full w-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020508] via-transparent to-[#020508]/20" />
          <div className="absolute inset-x-0 bottom-0 p-4 text-left">
            <span className="text-[9px] font-tech font-bold uppercase tracking-[.24em] text-emerald-300">{event.number} · {event.category}</span>
            <p className="mt-1 font-avengers text-2xl tracking-wider text-white">{event.title}</p>
            <p className="mt-0.5 text-[10px] font-tech text-slate-300">{event.character.alias}</p>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-2 text-[10px] font-tech font-bold uppercase tracking-[.24em] text-emerald-300 sm:text-xs">
          <Zap size={14} className="animate-pulse" />
          <span>Activating arena protocol</span>
        </div>
        <p className="mt-2 font-avengers text-2xl tracking-[.16em] text-white sm:text-3xl">ENTER THE MULTIVERSE</p>
      </motion.div>
    </motion.div>
  );
}
