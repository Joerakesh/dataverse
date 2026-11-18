"use client";

import React, { useRef, useEffect, useState } from "react";
import { Zap, Sparkles, Shield, Compass, RotateCw } from "lucide-react";
import { sounds } from "@/src/utils/soundEffects";

interface HeroCoreTheme {
  id: string;
  name: string;
  hero: string;
  artifactName: string;
  primaryColor: string;
  glowColor: string;
  accentColor: string;
  desc: string;
}

const HERO_THEMES: HeroCoreTheme[] = [
  {
    id: "doom",
    name: "LATVERIAN EMERALD CORE",
    hero: "Dr. Doom",
    artifactName: "Sovereign Time-Platform Sigil",
    primaryColor: "#00ff88",
    glowColor: "rgba(0, 255, 136, 0.8)",
    accentColor: "#059669",
    desc: "Sovereign Latverian medallion with rotating quantum spikes and timeline distortion field.",
  },
  {
    id: "ironman",
    name: "STARK ARC REACTOR",
    hero: "Iron Man",
    artifactName: "Mark L Nanotech Arc Reactor",
    primaryColor: "#00f0ff",
    glowColor: "rgba(0, 240, 255, 0.85)",
    accentColor: "#eab308",
    desc: "Palladium-nanotech triangular fusion core with spinning targeting HUD telemetry.",
  },
  {
    id: "strange",
    name: "ELDRITCH TAO MANDALA",
    hero: "Doctor Strange",
    artifactName: "Eye of Agamotto & Mystic Mandala",
    primaryColor: "#f59e0b",
    glowColor: "rgba(245, 158, 11, 0.85)",
    accentColor: "#ef4444",
    desc: "Concentric Sanskrit magic circles, nested Eldritch squares, and dimensional flame sparks.",
  },
  {
    id: "cap",
    name: "VIBRANIUM RESONATOR",
    hero: "Captain America",
    artifactName: "Vibranium Star Shield Array",
    primaryColor: "#3b82f6",
    glowColor: "rgba(59, 130, 246, 0.85)",
    accentColor: "#ffffff",
    desc: "Kinetic-absorption concentric shield rings with rotating 3D silver star nucleus.",
  },
  {
    id: "hulk",
    name: "GAMMA MUTAGEN MATRIX",
    hero: "The Hulk",
    artifactName: "Gamma Trefoil & Seismic Core",
    primaryColor: "#22c55e",
    glowColor: "rgba(34, 197, 94, 0.9)",
    accentColor: "#15803d",
    desc: "Tri-lobed nuclear biohazard trefoil radiating continuous seismic gamma bursts.",
  },
  {
    id: "spidey",
    name: "SPIDER-SENSE SYNAPSE",
    hero: "Spider-Man",
    artifactName: "Quantum Web-Shooter Matrix",
    primaryColor: "#ef4444",
    glowColor: "rgba(239, 68, 68, 0.85)",
    accentColor: "#3b82f6",
    desc: "8-axis arachnid web geometry with pulsing danger-detection neural flares.",
  },
  {
    id: "rocket",
    name: "HADRON SCAVENGER CORE",
    hero: "Rocket Raccoon",
    artifactName: "Hadron Enforcer Targeting HUD",
    primaryColor: "#f97316",
    glowColor: "rgba(249, 115, 22, 0.85)",
    accentColor: "#fbbf24",
    desc: "Orbital lock-on brackets, laser telemetry dials, and tactical crosshair optics.",
  },
];

export default function CosmicTesseract() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeTheme, setActiveTheme] = useState<HeroCoreTheme>(HERO_THEMES[0]);
  const [pulseCount, setPulseCount] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    // 16 4D Vertices of a Tesseract
    const vertices: number[][] = [];
    for (let i = 0; i < 16; i++) {
      vertices.push([
        i & 1 ? 1 : -1,
        i & 2 ? 1 : -1,
        i & 4 ? 1 : -1,
        i & 8 ? 1 : -1,
      ]);
    }

    // 32 Edges connecting vertices that differ by only 1 bit
    const edges: [number, number][] = [];
    for (let i = 0; i < 16; i++) {
      for (let j = i + 1; j < 16; j++) {
        let diff = 0;
        for (let k = 0; k < 4; k++) {
          if (vertices[i][k] !== vertices[j][k]) diff++;
        }
        if (diff === 1) edges.push([i, j]);
      }
    }

    // Angles
    let angleXY = 0;
    let angleZW = 0;
    let angleXW = 0;
    let angleYZ = 0;
    let artifactAngle = 0; // Rotates the hero artifact inside

    let mouseX = 0;
    let mouseY = 0;
    let isHovering = false;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left - width / 2) / (width / 2);
      mouseY = (e.clientY - rect.top - height / 2) / (height / 2);
      isHovering = true;
    };

    const onMouseLeave = () => {
      isHovering = false;
    };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    // 4D Rotation matrix application
    const rotate4D = (v: number[]) => {
      let [x, y, z, w] = v;

      // XW plane
      let cos = Math.cos(angleXW);
      let sin = Math.sin(angleXW);
      let x1 = x * cos - w * sin;
      let w1 = x * sin + w * cos;
      x = x1;
      w = w1;

      // ZW plane
      cos = Math.cos(angleZW);
      sin = Math.sin(angleZW);
      let z1 = z * cos - w * sin;
      let w2 = z * sin + w * cos;
      z = z1;
      w = w2;

      // YZ plane
      cos = Math.cos(angleYZ);
      sin = Math.sin(angleYZ);
      let y1 = y * cos - z * sin;
      let z2 = y * sin + z * cos;
      y = y1;
      z = z2;

      // XY plane
      cos = Math.cos(angleXY);
      sin = Math.sin(angleXY);
      let x2 = x * cos - y * sin;
      let y2 = x * sin + y * cos;
      x = x2;
      y = y2;

      return [x, y, z, w];
    };

    // ========================================================
    // HERO ROTATING ARTIFACT RENDERERS
    // ========================================================
    const drawHeroArtifact = (cx: number, cy: number, rot: number) => {
      ctx.save();
      ctx.translate(cx, cy);

      const r = Math.min(width, height) * 0.12;

      switch (activeTheme.id) {
        case "doom": {
          // Dr. Doom Latverian Time-Platform Crest
          ctx.rotate(rot);
          ctx.strokeStyle = "#00ff88";
          ctx.lineWidth = 2;
          ctx.shadowBlur = 18;
          ctx.shadowColor = "#00ff88";

          // Outer spiked medallion
          ctx.beginPath();
          for (let i = 0; i < 8; i++) {
            const a = (i * Math.PI) / 4;
            const ro = r * 1.05;
            const ri = r * 0.75;
            ctx.lineTo(Math.cos(a) * ro, Math.sin(a) * ro);
            ctx.lineTo(Math.cos(a + Math.PI / 8) * ri, Math.sin(a + Math.PI / 8) * ri);
          }
          ctx.closePath();
          ctx.stroke();

          // Inner counter-rotating ring
          ctx.rotate(-rot * 2);
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.5, 0, Math.PI * 2);
          ctx.stroke();

          // Latverian Sovereign Mask emblem center
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(0, 0, 6, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case "ironman": {
          // Iron Man Mark L Arc Reactor & Target HUD
          ctx.rotate(rot);
          ctx.strokeStyle = "#00f0ff";
          ctx.lineWidth = 2.2;
          ctx.shadowBlur = 20;
          ctx.shadowColor = "#00f0ff";

          // Rotating outer telemetry bracket
          ctx.beginPath();
          ctx.arc(0, 0, r * 1.05, 0, Math.PI * 1.5);
          ctx.stroke();

          // Inverted Triangular Arc Core
          ctx.beginPath();
          const tr = r * 0.65;
          ctx.moveTo(0, -tr);
          ctx.lineTo(tr * 0.866, tr * 0.5);
          ctx.lineTo(-tr * 0.866, tr * 0.5);
          ctx.closePath();
          ctx.fillStyle = "rgba(0, 240, 255, 0.25)";
          ctx.fill();
          ctx.stroke();

          // Inner gold repulsor dot
          ctx.fillStyle = "#eab308";
          ctx.beginPath();
          ctx.arc(0, 0, 7, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case "strange": {
          // Doctor Strange Eldritch Tao Mandala
          ctx.rotate(rot);
          ctx.strokeStyle = "#f59e0b";
          ctx.lineWidth = 1.8;
          ctx.shadowBlur = 22;
          ctx.shadowColor = "#f59e0b";

          // Outer mystic circle with sparks
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.stroke();

          // Two nested squares rotated 45 degrees
          const sq = r * 0.6;
          ctx.strokeRect(-sq / 2, -sq / 2, sq, sq);

          ctx.rotate(Math.PI / 4);
          ctx.strokeRect(-sq / 2, -sq / 2, sq, sq);

          // Counter-rotating inner ring
          ctx.rotate(-rot * 2.5);
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(245, 158, 11, 0.4)";
          ctx.fill();
          ctx.stroke();
          break;
        }

        case "cap": {
          // Captain America Vibranium Shield
          ctx.rotate(rot);
          ctx.lineWidth = 2.5;

          // Outer red ring
          ctx.strokeStyle = "#ef4444";
          ctx.shadowBlur = 15;
          ctx.shadowColor = "#3b82f6";
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.stroke();

          // Middle white/silver ring
          ctx.strokeStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.75, 0, Math.PI * 2);
          ctx.stroke();

          // Inner blue disc
          ctx.fillStyle = "#3b82f6";
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.5, 0, Math.PI * 2);
          ctx.fill();

          // Central silver star
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            const a = (i * Math.PI * 2) / 5 - Math.PI / 2;
            const rStar = r * 0.42;
            const rInner = r * 0.18;
            ctx.lineTo(Math.cos(a) * rStar, Math.sin(a) * rStar);
            ctx.lineTo(Math.cos(a + Math.PI / 5) * rInner, Math.sin(a + Math.PI / 5) * rInner);
          }
          ctx.closePath();
          ctx.fill();
          break;
        }

        case "hulk": {
          // The Hulk Gamma Radiation Trefoil Nucleus
          ctx.rotate(rot);
          ctx.strokeStyle = "#22c55e";
          ctx.fillStyle = "rgba(34, 197, 94, 0.35)";
          ctx.lineWidth = 2;
          ctx.shadowBlur = 20;
          ctx.shadowColor = "#22c55e";

          // Outer hazard perimeter
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.stroke();

          // 3-Lobed Radiation Blades
          for (let i = 0; i < 3; i++) {
            const a = (i * 2 * Math.PI) / 3;
            ctx.beginPath();
            ctx.arc(0, 0, r * 0.8, a - 0.4, a + 0.4);
            ctx.lineTo(Math.cos(a) * r * 0.3, Math.sin(a) * r * 0.3);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          }

          // Central dense core
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.22, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case "spidey": {
          // Spider-Man Spider-Sense Web-Shooter Array
          ctx.rotate(rot);
          ctx.strokeStyle = "#ef4444";
          ctx.lineWidth = 1.8;
          ctx.shadowBlur = 18;
          ctx.shadowColor = "#ef4444";

          // Radial 8 Web Spines
          for (let i = 0; i < 8; i++) {
            const a = (i * Math.PI) / 4;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
            ctx.stroke();
          }

          // Concentric web polygons
          [r * 0.4, r * 0.7, r].forEach((polyR) => {
            ctx.beginPath();
            for (let i = 0; i < 8; i++) {
              const a = (i * Math.PI) / 4;
              ctx.lineTo(Math.cos(a) * polyR, Math.sin(a) * polyR);
            }
            ctx.closePath();
            ctx.stroke();
          });

          // Central red & blue arachnid node
          ctx.fillStyle = "#3b82f6";
          ctx.beginPath();
          ctx.arc(0, 0, 7, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case "rocket": {
          // Rocket Raccoon Hadron Enforcer HUD Reticle
          ctx.rotate(rot);
          ctx.strokeStyle = "#f97316";
          ctx.lineWidth = 2;
          ctx.shadowBlur = 18;
          ctx.shadowColor = "#f97316";

          // Concentric target reticle
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.9, 0, Math.PI * 2);
          ctx.stroke();

          // 4 Crosshair lines
          const ch = r * 1.1;
          ctx.beginPath();
          ctx.moveTo(-ch, 0);
          ctx.lineTo(-r * 0.35, 0);
          ctx.moveTo(r * 0.35, 0);
          ctx.lineTo(ch, 0);
          ctx.moveTo(0, -ch);
          ctx.lineTo(0, -r * 0.35);
          ctx.moveTo(0, r * 0.35);
          ctx.lineTo(0, ch);
          ctx.stroke();

          // Counter-rotating angle tick marks
          ctx.rotate(-rot * 2);
          ctx.strokeRect(-r * 0.35, -r * 0.35, r * 0.7, r * 0.7);

          // Center lock-on amber pip
          ctx.fillStyle = "#fbbf24";
          ctx.beginPath();
          ctx.arc(0, 0, 5, 0, Math.PI * 2);
          ctx.fill();
          break;
        }
      }

      ctx.restore();
    };

    // Main render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Rotation updates
      const speed = isHovering ? 0.015 : 0.008;
      angleXW += speed + mouseY * 0.01;
      angleZW += speed * 0.9 + mouseX * 0.01;
      angleYZ += speed * 0.7;
      angleXY += speed * 0.5;
      artifactAngle += speed * 1.8; // Rotating artifact speed

      const scale = Math.min(width, height) * 0.28;
      const distance4D = 2.5;
      const distance3D = 3.5;

      // Project 4D vertices to 2D screen coordinates
      const projected2D: [number, number, number][] = vertices.map((vertex) => {
        const [x, y, z, w] = rotate4D(vertex);

        const wFactor = 1 / (distance4D - w);
        const x3 = x * wFactor;
        const y3 = y * wFactor;
        const z3 = z * wFactor;

        const zFactor = 1 / (distance3D - z3);
        const screenX = width / 2 + x3 * zFactor * scale * 2.8;
        const screenY = height / 2 + y3 * zFactor * scale * 2.8;

        return [screenX, screenY, z3];
      });

      // Background cosmic halo
      const radial = ctx.createRadialGradient(
        width / 2,
        height / 2,
        10,
        width / 2,
        height / 2,
        scale * 2
      );
      radial.addColorStop(0, activeTheme.glowColor.replace("0.8", "0.25"));
      radial.addColorStop(1, "transparent");
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, width, height);

      // 1. Draw Rotating Hero Artifact at Center of Hypercube
      drawHeroArtifact(width / 2, height / 2, artifactAngle);

      // 2. Draw Tesseract Edges
      edges.forEach(([i, j]) => {
        const [x1, y1, z1] = projected2D[i];
        const [x2, y2, z2] = projected2D[j];

        const avgZ = (z1 + z2) / 2;
        const alpha = Math.max(0.18, Math.min(0.9, (avgZ + 1.2) / 2));

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = activeTheme.primaryColor;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = 1.6 + alpha * 1.5;
        ctx.shadowBlur = 12 * alpha;
        ctx.shadowColor = activeTheme.primaryColor;
        ctx.stroke();
      });

      // 3. Draw Vertices Nodes
      projected2D.forEach(([x, y, z]) => {
        const alpha = Math.max(0.3, Math.min(1, (z + 1.2) / 2));
        ctx.beginPath();
        ctx.arc(x, y, 3 + alpha * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = activeTheme.accentColor;
        ctx.shadowBlur = 15;
        ctx.shadowColor = activeTheme.primaryColor;
        ctx.globalAlpha = alpha;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.globalAlpha = 1;
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeTheme]);

  const handlePulse = () => {
    sounds.playDoomsdaySurge();
    setPulseCount((prev) => prev + 1);
  };

  return (
    <section className="py-24 relative bg-[#040609] overflow-hidden border-t border-emerald-500/25">
      {/* Background radial atmosphere */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[160px] pointer-events-none transition-colors duration-700 opacity-20"
        style={{ backgroundColor: activeTheme.primaryColor }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 text-xs font-tech font-bold uppercase tracking-widest mb-3">
            <Sparkles size={14} />
            <span>Interactive 4D Hyper-Quantum Reactor</span>
          </div>
          <h2 className="font-avengers text-5xl sm:text-7xl text-avengers-chrome italic tracking-wider">
            THE MULTIVERSE TESSERACT
          </h2>
          <p className="font-tech text-base sm:text-lg text-slate-400 mt-2">
            Rotate the 4D hypercube with your cursor. Switch between superheroes to witness their signature rotating artifact materialize in the quantum core.
          </p>
        </div>

        {/* Hero Energy Selector Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          {HERO_THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => {
                sounds.playHover();
                setActiveTheme(theme);
              }}
              className={`px-4 py-2 rounded-xl font-tech text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 border ${
                activeTheme.id === theme.id
                  ? "bg-slate-900 shadow-[0_0_20px_rgba(0,255,136,0.4)] scale-105"
                  : "bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
              style={{
                borderColor: activeTheme.id === theme.id ? theme.primaryColor : undefined,
                color: activeTheme.id === theme.id ? theme.primaryColor : undefined,
              }}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: theme.primaryColor }}
              />
              <span>{theme.hero}</span>
            </button>
          ))}
        </div>

        {/* Interactive 3D Canvas Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* 3D Tesseract Viewport */}
          <div className="lg:col-span-8 relative aspect-square sm:aspect-[4/3] w-full rounded-2xl overflow-hidden doom-card border-2 border-emerald-500/40 flex items-center justify-center group">
            
            {/* Canvas */}
            <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

            {/* Overlay HUD Markers */}
            <div className="absolute top-5 left-5 pointer-events-none">
              <span className="text-[10px] font-tech font-bold uppercase tracking-widest text-slate-400 block">
                ROTATING ARTIFACT DETECTED
              </span>
              <span className="font-avengers text-2xl italic tracking-wide text-slate-100 block">
                {activeTheme.artifactName}
              </span>
              <span className="text-xs font-tech font-bold text-emerald-400">
                GUARDIAN: {activeTheme.hero.toUpperCase()}
              </span>
            </div>

            <div className="absolute bottom-5 left-5 pointer-events-none flex items-center gap-2 text-xs font-tech text-slate-400">
              <Compass size={14} className="animate-spin [animation-duration:8s]" />
              <span>DRAG TO ACCELERATE 4D ROTATION</span>
            </div>

            <button
              onClick={handlePulse}
              className="absolute bottom-5 right-5 px-4 py-2 rounded-lg bg-slate-900/90 border border-emerald-500/40 text-emerald-300 font-tech font-bold text-xs uppercase tracking-wider hover:bg-emerald-950/60 shadow-[0_0_15px_rgba(0,255,136,0.3)] flex items-center gap-1.5"
            >
              <RotateCw size={14} />
              <span>DISCHARGE PULSE</span>
            </button>
          </div>

          {/* Core Telemetry & Hero Intel */}
          <div className="lg:col-span-4 space-y-4">
            
            <div className="doom-card rounded-2xl p-6 border border-emerald-500/30">
              <span className="text-[11px] font-tech font-bold uppercase tracking-widest text-slate-400 block mb-1">
                Active Quantum Core
              </span>
              <h3 className="font-avengers text-3xl text-slate-100 italic tracking-wider mb-1">
                {activeTheme.hero.toUpperCase()}
              </h3>
              <span className="text-xs font-tech font-bold block mb-3" style={{ color: activeTheme.primaryColor }}>
                {activeTheme.artifactName}
              </span>
              <p className="font-tech text-xs text-slate-300 leading-relaxed mb-4">
                {activeTheme.desc}
              </p>

              <div className="space-y-3 pt-3 border-t border-slate-800 text-xs font-tech">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">ENERGY HARMONIC:</span>
                  <span className="font-bold uppercase" style={{ color: activeTheme.primaryColor }}>
                    SYNCHRONIZED (100%)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">ARTIFACT ROTATION:</span>
                  <span className="text-slate-200">REAL-TIME 3D PERSPECTIVE</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">QUANTUM FREQUENCY:</span>
                  <span className="text-slate-200">924.8 THz</span>
                </div>
              </div>
            </div>

            {/* Instruction Tip */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-tech text-slate-400 leading-relaxed">
              <span className="text-emerald-400 font-bold block mb-1 uppercase">CITADEL DIRECTIVE:</span>
              Each superhero brings a signature relic into the Latverian reactor core. Select buttons above to shift the rotating artifact.
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
