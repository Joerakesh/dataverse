"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import type { SymposiumEvent } from "@/src/data/events";
import { heroThemeForAlias } from "@/src/three/heroModels";

// three.js is only needed once a transition runs, so it is code-split and
// can be warmed up with `preloadEventTransition()`.
const loadHeroCharacter3D = () =>
  import("@/src/components/HeroCharacter3D").then((m) => m.HeroCharacter3D);
const HeroCharacter3D = dynamic(loadHeroCharacter3D, { ssr: false });

export function preloadEventTransition() {
  void loadHeroCharacter3D();
}

interface EventTransitionProps {
  event: SymposiumEvent;
  onComplete: () => void;
  /** Screen position of the click that launched the transition (used by Doctor Strange's mandala). */
  origin?: { x: number; y: number };
}

export default function EventTransition({ event, onComplete, origin }: EventTransitionProps) {
  const prefersReducedMotion = useReducedMotion();
  const [webglFailed, setWebglFailed] = useState(false);
  const onCompleteRef = useRef(onComplete);
  const theme = heroThemeForAlias(event.character.alias);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const timer = window.setTimeout(() => onCompleteRef.current(), prefersReducedMotion ? 180 : 1200);
    return () => window.clearTimeout(timer);
  }, [event.id, prefersReducedMotion]);

  const handleWebglError = useCallback(() => setWebglFailed(true), []);
  const show3D = !prefersReducedMotion && !webglFailed;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.14 }}
      role="dialog"
      aria-modal="true"
      aria-label={`Entering ${event.name}`}
      className={`fixed inset-0 z-[70] flex items-center justify-center overflow-hidden bg-[#020508]/92 pointer-events-auto ${
        theme === "hulk" && !prefersReducedMotion ? "animate-hulk-shake" : ""
      }`}
    >
      {/* Live 3D character model */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
        {show3D ? (
          <HeroCharacter3D
            theme={theme}
            mode="transition"
            onError={handleWebglError}
            className="w-[340px] h-[340px] sm:w-[460px] sm:h-[460px]"
          />
        ) : (
          <div className="relative aspect-[4/5] w-[min(60vw,16rem)] overflow-hidden rounded-2xl border border-emerald-300/45 shadow-[0_0_60px_rgba(0,255,136,.25)]">
            <img src={event.character.image} alt={event.character.alias} className="h-full w-full object-cover object-top" />
          </div>
        )}
      </div>

      {/* Full-screen VFX overlay per hero */}
      {!prefersReducedMotion && (
        <>
          {theme === "thor" && <ThorLightningOverlay />}
          {theme === "captain" && <CaptainCrackOverlay />}
          {theme === "hulk" && <HulkGammaOverlay />}
          {theme === "strange" && <StrangeMandalaOverlay origin={origin} />}
          {theme === "groot" && <GrootVinesOverlay />}
          {theme === "antman-spidey" && <SpiderWebsOverlay />}
          {theme === "doom" && <DoomSurgeOverlay />}
          {theme === "iron-man" && <IronManRepulsorOverlay />}
          {theme === "rocket" && <RocketBlastOverlay />}
        </>
      )}

      {/* Event banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16, duration: 0.28 }}
        className="absolute bottom-10 left-1/2 z-30 w-[90vw] -translate-x-1/2 text-center pointer-events-none"
      >
        <p className="font-avengers text-2xl sm:text-4xl tracking-[0.22em] text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.95)]">
          {event.name.toUpperCase()}
        </p>
        <p className="mt-1 font-tech text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300/90">
          {event.character.alias} · {event.tagline}
        </p>
      </motion.div>
    </motion.div>
  );
}

function ThorLightningOverlay() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-t from-sky-500/25 via-blue-400/15 to-white/25 animate-lightning-flash" />
      <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="absolute inset-0 w-full h-full z-10">
        <motion.path
          d="M500 1000 L470 820 L535 690 L460 520 L545 360 L480 180 L510 0"
          stroke="#E0F2FE"
          strokeWidth="10"
          fill="none"
          initial={{ pathLength: 0, opacity: 1 }}
          animate={{ pathLength: 1, opacity: [1, 1, 0] }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ filter: 'drop-shadow(0 0 18px #38BDF8)' }}
        />
        <motion.path
          d="M470 820 L310 660 L370 540 L190 390"
          stroke="#7DD3FC"
          strokeWidth="5"
          fill="none"
          initial={{ pathLength: 0, opacity: 0.9 }}
          animate={{ pathLength: 1, opacity: [0.9, 0.8, 0] }}
          transition={{ duration: 0.7, delay: 0.1 }}
        />
      </svg>
    </>
  );
}

function CaptainCrackOverlay() {
  return (
    <motion.svg
      viewBox="0 0 1000 1000"
      preserveAspectRatio="none"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: [0, 1, 1, 0], scale: [0.92, 1, 1.06, 1.25] }}
      transition={{ duration: 1.1, times: [0, 0.28, 0.72, 1] }}
      className="absolute inset-0 w-full h-full z-10"
    >
      <g stroke="#CBD5E1" strokeWidth="2.6" fill="none" strokeOpacity="0.88">
        <path d="M500 500 L180 120 M500 500 L860 150 M500 500 L940 520 M500 500 L810 890 M500 500 L210 880 M500 500 L70 460" />
        <polygon points="410,410 590,390 620,560 470,620 370,540" stroke="#93C5FD" strokeWidth="2" />
        <polygon points="310,300 680,270 740,650 430,740 250,610" stroke="#E2E8F0" strokeWidth="1.4" strokeOpacity="0.55" />
      </g>
    </motion.svg>
  );
}

function HulkGammaOverlay() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.65, 0.25, 0] }}
        transition={{ duration: 1.05 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,102,0.5)_0%,rgba(22,163,74,0.18)_45%,transparent_80%)]"
      />
      <motion.svg
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1.05, opacity: [0, 1, 0.85, 0] }}
        transition={{ duration: 1.1, delay: 0.12 }}
        className="absolute inset-0 w-full h-full z-10"
      >
        <g stroke="#00FF66" strokeWidth="5" fill="none" strokeLinecap="round">
          <path d="M500 500 L260 220 L140 160" />
          <path d="M500 500 L770 210 L890 120" />
          <path d="M500 500 L840 620 L950 720" />
          <path d="M500 500 L220 740 L90 860" />
        </g>
        <g fill="#22C55E" fillOpacity="0.55">
          <circle cx="340" cy="310" r="18" />
          <circle cx="670" cy="340" r="24" />
          <circle cx="640" cy="690" r="16" />
          <circle cx="310" cy="660" r="22" />
        </g>
      </motion.svg>
    </>
  );
}

function StrangeMandalaOverlay({ origin }: { origin?: { x: number; y: number } }) {
  return (
    <motion.div
      style={{ left: origin ? origin.x : '50%', top: origin ? origin.y : '50%', transform: 'translate(-50%, -50%)' }}
      initial={{ scale: 0.1, opacity: 0 }}
      animate={{ scale: [0.1, 1.3, 2.6], opacity: [0, 1, 0] }}
      transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
      className="absolute w-[440px] h-[440px] z-10"
    >
      <svg
        viewBox="0 0 300 300"
        className="w-full h-full animate-spin-mandala"
        style={{ filter: 'drop-shadow(0 0 22px rgba(245,158,11,0.9))' }}
      >
        <circle cx="150" cy="150" r="136" stroke="#F59E0B" strokeWidth="3" fill="none" strokeDasharray="10 6" />
        <polygon points="150,24 259,213 41,213" stroke="#FB923C" strokeWidth="2.2" fill="none" />
        <polygon points="150,276 259,87 41,87" stroke="#F59E0B" strokeWidth="2.2" fill="none" />
      </svg>
    </motion.div>
  );
}

function GrootVinesOverlay() {
  return (
    <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="absolute inset-0 w-full h-full z-10">
      {[
        'M0 180 C220 210, 340 340, 500 500',
        'M0 840 C240 760, 360 620, 500 500',
        'M1000 160 C780 230, 650 350, 500 500',
        'M1000 860 C760 760, 620 630, 500 500',
      ].map((d, idx) => (
        <g key={idx}>
          <motion.path
            d={d}
            stroke="#5C4033"
            strokeWidth="14"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 1 }}
            animate={{ pathLength: [0, 1, 0.2], opacity: [1, 1, 0] }}
            transition={{ duration: 1.15, times: [0, 0.58, 1] }}
          />
          <motion.path
            d={d}
            stroke="#00FF66"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0.9 }}
            animate={{ pathLength: [0, 1, 0.1], opacity: [0.9, 1, 0] }}
            transition={{ duration: 1.15, times: [0, 0.6, 1] }}
          />
        </g>
      ))}
    </svg>
  );
}

/* Prominent Full-Screen Spider Webs + Quantum Pym Ring */
function SpiderWebsOverlay() {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      {/* Quantum Pym Ring */}
      <motion.div
        initial={{ scale: 2.2, opacity: 0.9 }}
        animate={{ scale: [2.2, 0.05, 2.8], opacity: [0.9, 1, 0] }}
        transition={{ duration: 0.65, times: [0, 0.45, 1] }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border-4 border-[#EF4444] shadow-[0_0_55px_rgba(239,68,68,0.8)]"
      />

      {/* Full-Screen 4-Corner Spider Webs SVG */}
      <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
        {[
          // Radial web lines from all 4 corners
          'M0 0 L480 460',
          'M0 0 L520 220',
          'M0 0 L240 520',
          'M1000 0 L520 460',
          'M1000 0 L480 220',
          'M1000 0 L760 520',
          'M0 1000 L480 540',
          'M0 1000 L520 780',
          'M0 1000 L240 480',
          'M1000 1000 L520 540',
          'M1000 1000 L480 780',
          'M1000 1000 L760 480',
          // Concentric curved spider-web arcs
          'M0 240 Q180 180 240 0',
          'M0 400 Q280 280 400 0',
          'M1000 240 Q820 180 760 0',
          'M1000 400 Q720 280 600 0',
          'M0 760 Q180 820 240 1000',
          'M1000 760 Q820 820 760 1000',
        ].map((d, idx) => (
          <motion.path
            key={idx}
            d={d}
            stroke={idx % 3 === 0 ? '#00FF66' : '#F8FAFC'}
            strokeWidth={idx < 12 ? 3 : 2}
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1], opacity: [0, 0.95, 0.8] }}
            transition={{ duration: 0.62, delay: 0.32, ease: 'easeOut' }}
            style={{ filter: 'drop-shadow(0 0 8px rgba(0,255,102,0.75))' }}
          />
        ))}
      </svg>
    </div>
  );
}

function DoomSurgeOverlay() {
  return (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,102,0.42)_0%,rgba(16,185,129,0.1)_50%,transparent_80%)] animate-lightning-flash" />
      <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="absolute inset-0 w-full h-full z-10">
        <motion.path
          d="M0 500 L220 460 L340 530 L500 500 L660 470 L780 540 L1000 500"
          stroke="#00FF66"
          strokeWidth="6"
          fill="none"
          initial={{ pathLength: 0, opacity: 1 }}
          animate={{ pathLength: 1, opacity: [1, 1, 0] }}
          transition={{ duration: 0.85 }}
          style={{ filter: 'drop-shadow(0 0 18px #00FF66)' }}
        />
      </svg>
    </>
  );
}

function IronManRepulsorOverlay() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.7, 0.2, 0] }}
        transition={{ duration: 1.05 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,232,255,0.45)_0%,rgba(185,28,28,0.16)_48%,transparent_80%)]"
      />
      <motion.div
        initial={{ scale: 0.1, opacity: 0 }}
        animate={{ scale: [0.1, 1.6, 3], opacity: [0, 0.95, 0] }}
        transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border-4 border-[#7DF9FF] shadow-[0_0_60px_rgba(56,232,255,0.85)]"
      />
      <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="absolute inset-0 w-full h-full z-10">
        <motion.path
          d="M500 0 L500 500"
          stroke="#7DF9FF"
          strokeWidth="9"
          fill="none"
          initial={{ pathLength: 0, opacity: 1 }}
          animate={{ pathLength: 1, opacity: [1, 1, 0] }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ filter: 'drop-shadow(0 0 18px #38E8FF)' }}
        />
      </svg>
    </>
  );
}

function RocketBlastOverlay() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.6, 0.2, 0] }}
        transition={{ duration: 1.0 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.5)_0%,rgba(234,88,12,0.15)_46%,transparent_80%)]"
      />
      <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="absolute inset-0 w-full h-full z-10">
        {['M0 500 L500 500', 'M0 380 L500 480', 'M0 620 L500 520'].map((d, idx) => (
          <motion.path
            key={idx}
            d={d}
            stroke={idx === 0 ? '#FDBA74' : '#FB923C'}
            strokeWidth={idx === 0 ? 9 : 4}
            fill="none"
            initial={{ pathLength: 0, opacity: 1 }}
            animate={{ pathLength: 1, opacity: [1, 1, 0] }}
            transition={{ duration: 0.55, delay: idx * 0.05, ease: 'easeOut' }}
            style={{ filter: 'drop-shadow(0 0 16px #F97316)' }}
          />
        ))}
      </svg>
    </>
  );
}
