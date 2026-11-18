"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Zap, Terminal, Sparkles } from "lucide-react";
import { sounds } from "@/src/utils/soundEffects";

interface DoomsdayPreloaderProps {
  onComplete: () => void;
}

export default function DoomsdayPreloader({ onComplete }: DoomsdayPreloaderProps) {
  const [statusIndex, setStatusIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const statuses = [
    "SYNCHRONIZING LOYOLA CITADEL MAINFRAME...",
    "SAGE NEURAL MESH INITIALIZING...",
    "DOOMSDAY ARC REACTOR GENERATING CRITICAL PLASMA...",
    "QUANTUM PARTICLES REACHING SUPER-CONDUCTIVITY...",
    "DR. DOOM DECREES: DATAVERSE 2K26 ASSEMBLE.",
  ];

  // Procedural Lightning & Smoke Canvas Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Smoke particles
    const smokeParticles: {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      alpha: number;
      maxAlpha: number;
      growth: number;
    }[] = [];

    for (let i = 0; i < 50; i++) {
      smokeParticles.push({
        x: width / 2 + (Math.random() - 0.5) * 160,
        y: height / 2 + (Math.random() - 0.5) * 160,
        radius: 35 + Math.random() * 55,
        vx: (Math.random() - 0.5) * 0.9,
        vy: -0.6 - Math.random() * 0.8,
        alpha: 0,
        maxAlpha: 0.18 + Math.random() * 0.15,
        growth: 0.35 + Math.random() * 0.4,
      });
    }

    // Helper: Draw electric lightning bolts branching outward
    const drawLightning = (x1: number, y1: number, x2: number, y2: number, branches: number) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);

      let curX = x1;
      let curY = y1;
      const steps = 7;
      const dx = (x2 - x1) / steps;
      const dy = (y2 - y1) / steps;

      for (let s = 1; s < steps; s++) {
        curX += dx + (Math.random() - 0.5) * 20;
        curY += dy + (Math.random() - 0.5) * 20;
        ctx.lineTo(curX, curY);

        if (branches > 0 && Math.random() < 0.35) {
          const bx = curX + (Math.random() - 0.5) * 35;
          const by = curY + (Math.random() - 0.5) * 35;
          ctx.moveTo(curX, curY);
          ctx.lineTo(bx, by);
          ctx.moveTo(curX, curY);
        }
      }

      ctx.lineTo(x2, y2);
      ctx.strokeStyle = Math.random() > 0.3 ? "#00ff88" : "#ffffff";
      ctx.lineWidth = 1 + Math.random() * 1.8;
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#00ff88";
      ctx.stroke();
    };

    let tick = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      tick++;

      // 1. Render Billowing Smokey Clouds
      smokeParticles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.radius += p.growth;

        if (p.alpha < p.maxAlpha) {
          p.alpha += 0.006;
        } else {
          p.alpha -= 0.0035;
        }

        if (p.alpha <= 0 || p.radius > 240) {
          p.x = width / 2 + (Math.random() - 0.5) * 140;
          p.y = height / 2 + 60 + (Math.random() - 0.5) * 40;
          p.radius = 30 + Math.random() * 45;
          p.alpha = 0;
          p.vy = -0.5 - Math.random() * 0.8;
        }

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        gradient.addColorStop(0, `rgba(0, 255, 136, ${p.alpha * 1.2})`);
        gradient.addColorStop(0.4, `rgba(4, 120, 87, ${p.alpha * 0.7})`);
        gradient.addColorStop(1, "transparent");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Render Electrical Lightning Arcs Around Reactor
      if (tick % 4 === 0) {
        const reactorRadius = Math.min(width, height) * 0.18;
        const angle = Math.random() * Math.PI * 2;
        const startX = width / 2 + Math.cos(angle) * (reactorRadius * 0.4);
        const startY = height / 2 + Math.sin(angle) * (reactorRadius * 0.4);
        const endAngle = angle + (Math.random() - 0.5) * 1.5;
        const endX = width / 2 + Math.cos(endAngle) * (reactorRadius * 1.15);
        const endY = height / 2 + Math.sin(endAngle) * (reactorRadius * 1.15);

        drawLightning(startX, startY, endX, endY, 1);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Sequence status messages and complete automatically
  useEffect(() => {
    sounds.playDoomsdaySurge();

    const statusInterval = setInterval(() => {
      setStatusIndex((prev) => {
        if (prev < statuses.length - 1) return prev + 1;
        return prev;
      });
    }, 850);

    const completionTimer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onComplete, 800);
    }, 4200);

    return () => {
      clearInterval(statusInterval);
      clearTimeout(completionTimer);
    };
  }, [onComplete, statuses.length]);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#020508] flex flex-col items-center justify-center p-6 select-none transition-all duration-700 ${
        isExiting ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      {/* Real-time Smokey Canvas & Lightning Arcs */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
      />

      {/* Background Doomsday Plasma Glow */}
      <div className="absolute w-[680px] h-[680px] rounded-full bg-emerald-500/15 blur-[160px] pointer-events-none animate-pulse" />

      {/* Main Preloader Content */}
      <div className="relative z-10 flex flex-col items-center max-w-xl w-full text-center">
        
        {/* Top Institutional Crests: Loyola & SAGE */}
        <div className="flex items-center justify-center gap-6 sm:gap-10 mb-4 animate-in fade-in duration-500">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-emerald-400/50 p-1 bg-black/70 shadow-[0_0_20px_rgba(0,255,136,0.35)]">
              <img
                src="/images/loyola-crest.png"
                alt="Loyola College"
                className="w-full h-full object-contain filter contrast-125"
              />
            </div>
            <div className="text-left">
              <span className="font-avengers text-sm sm:text-base text-slate-100 tracking-wider block leading-tight">
                LOYOLA COLLEGE
              </span>
              <span className="text-[9px] font-tech uppercase text-emerald-400 tracking-widest block font-bold">
                Autonomous • Chennai
              </span>
            </div>
          </div>

          <div className="w-px h-8 bg-emerald-500/40" />

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-emerald-400/50 p-1 bg-black/70 shadow-[0_0_20px_rgba(0,255,136,0.35)]">
              <img
                src="/images/sage-logo.png"
                alt="SAGE"
                className="w-full h-full object-contain filter contrast-125"
              />
            </div>
            <div className="text-left">
              <span className="font-avengers text-sm sm:text-base text-emerald-300 tracking-wider block leading-tight">
                SAGE
              </span>
              <span className="text-[9px] font-tech uppercase text-slate-400 tracking-widest block font-bold">
                Dept. of Data Science
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================
            DOOMSDAY ARC REACTOR (Pure CSS/SVG Kinetic FX)
           ======================================================== */}
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 my-4 flex items-center justify-center group cursor-pointer"
             onClick={() => {
               sounds.playClick();
               setIsExiting(true);
               setTimeout(onComplete, 300);
             }}>
          
          {/* Radial Emerald Plasma Burst Behind Reactor */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/20 via-green-400/30 to-emerald-500/20 blur-xl animate-pulse" />

          {/* Outer Rotating Steel Ring with Energy Notches */}
          <div className="absolute inset-0 rounded-full border-4 border-slate-700 bg-gradient-to-br from-slate-900 via-black to-[#02130b] shadow-[0_0_60px_rgba(0,255,136,0.5),inset_0_0_40px_rgba(0,255,136,0.3)] flex items-center justify-center">
            
            {/* 10 Electromagnetic Copper Coils (ArchitJ6 Arc Reactor Architecture) */}
            <div className="absolute inset-2 rounded-full border border-emerald-500/40 animate-reactor-reverse">
              {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((angle, idx) => (
                <div
                  key={idx}
                  className="absolute w-4 h-7 bg-gradient-to-b from-amber-600 via-yellow-600 to-amber-900 border-2 border-emerald-400 rounded-sm shadow-[0_0_12px_rgba(0,255,136,0.9)] -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${50 + 44 * Math.cos((angle * Math.PI) / 180)}%`,
                    top: `${50 + 44 * Math.sin((angle * Math.PI) / 180)}%`,
                    transform: `translate(-50%, -50%) rotate(${angle + 90}deg)`,
                  }}
                />
              ))}
            </div>

            {/* Rotating Gear / Concentric Segmented Ring */}
            <div className="absolute w-56 h-56 sm:w-64 sm:h-64 rounded-full border-2 border-dashed border-emerald-400/90 animate-reactor-spin shadow-[0_0_25px_rgba(0,255,136,0.7)]" />

            {/* Counter-Rotating High-Voltage Segment Ring */}
            <div className="absolute w-44 h-44 sm:w-48 sm:h-48 rounded-full border-4 border-t-emerald-300 border-r-emerald-500 border-b-transparent border-l-emerald-400 animate-reactor-reverse shadow-[inset_0_0_30px_rgba(0,255,136,0.7)]" />

            {/* Center Pulsing Doomsday Core with Latverian Sigil */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-r from-emerald-400 via-green-200 to-emerald-500 border-4 border-white animate-reactor-pulse flex items-center justify-center shadow-[0_0_70px_rgba(0,255,136,1),inset_0_0_35px_rgba(255,255,255,0.9)]">
              
              {/* Inner Glowing Core */}
              <div className="w-16 h-16 rounded-full border-2 border-emerald-950 bg-black/60 flex items-center justify-center shadow-[inset_0_0_20px_#00ff88]">
                <Zap size={26} className="text-white filter drop-shadow-[0_0_12px_#00ff88] animate-bounce" />
              </div>
            </div>

          </div>

        </div>

        {/* 3D DATAVERSE 2K26 Logo */}
        <div className="relative mt-2 mb-3 w-full max-w-sm flex flex-col items-center">
          <img
            src="/images/logo.png"
            alt="DATAVERSE"
            className="w-full h-auto max-h-16 object-contain filter drop-shadow-[0_0_25px_rgba(0,255,136,0.7)] animate-pulse"
          />
          <span className="font-avengers text-2xl tracking-[0.25em] text-emerald-400 italic -mt-1">
            2K26
          </span>
        </div>

        {/* Cinematic Status Readout (No Loading Bar!) */}
        <div className="flex items-center justify-center gap-2 mb-4 text-xs font-tech text-emerald-400 font-bold tracking-widest uppercase">
          <Terminal size={15} className="animate-pulse text-emerald-300 flex-shrink-0" />
          <span className="truncate max-w-[320px] sm:max-w-md">
            {statuses[statusIndex]}
          </span>
        </div>

        {/* Skip button for quick access */}
        <button
          onClick={() => {
            sounds.playClick();
            setIsExiting(true);
            setTimeout(onComplete, 300);
          }}
          className="text-[11px] font-tech uppercase tracking-[0.25em] text-slate-500 hover:text-emerald-400 transition-colors border-b border-transparent hover:border-emerald-400 py-0.5"
        >
          [ ENTER CITADEL ]
        </button>

      </div>

      {/* Cybernetic Corner Borders */}
      <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-emerald-500/40" />
      <div className="absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-emerald-500/40" />
      <div className="absolute bottom-6 left-6 w-12 h-12 border-b-2 border-l-2 border-emerald-500/40" />
      <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-emerald-500/40" />
    </div>
  );
}
