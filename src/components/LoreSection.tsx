import React from "react";
import { Cpu, Terminal, Sparkles } from "lucide-react";

export default function LoreSection() {
  return (
    <section id="lore" className="relative overflow-hidden border-y border-emerald-500/15 bg-[#070b10] py-20 sm:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-emerald-600/[.08] blur-[120px]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:items-center lg:px-10">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 font-tech text-xs font-bold uppercase tracking-[.22em] text-emerald-400">
            <Sparkles size={15} /> The DATAVERSE experience
          </div>
          <h2 className="font-avengers text-4xl italic leading-tight tracking-wide text-white sm:text-5xl">
            THINK BIGGER.<br /><span className="text-emerald-300">BUILD WHAT&apos;S NEXT.</span>
          </h2>
        </div>
        <div className="space-y-6">
          <p className="max-w-3xl font-tech text-base leading-8 text-slate-300 sm:text-lg">
            DATAVERSE brings data science, technology and creative problem-solving together. Step into hands-on challenges, share original ideas and test your skills alongside students from across colleges.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-emerald-500/20 bg-slate-950/55 p-5">
              <Cpu className="mb-3 text-emerald-400" size={21} />
              <h3 className="mb-2 font-avengers text-xl tracking-wide text-slate-100">TECH & INNOVATION</h3>
              <p className="font-tech text-xs leading-6 text-slate-400">Build AI agents, present projects, explore data and solve technical challenges.</p>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-slate-950/55 p-5">
              <Terminal className="mb-3 text-emerald-400" size={21} />
              <h3 className="mb-2 font-avengers text-xl tracking-wide text-slate-100">CREATIVE COMPETITION</h3>
              <p className="font-tech text-xs leading-6 text-slate-400">Take on quizzes, visual puzzles, connections and team-based challenges.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
