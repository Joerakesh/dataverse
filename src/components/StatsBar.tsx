import React from "react";
import { Trophy, Users, Shield, Cpu } from "lucide-react";

export default function StatsBar() {
  const stats = [
    { icon: <Cpu className="w-8 h-8 text-emerald-400"/>, value: "8", label: "EVENTS", desc: "Technical & non-technical" },
    { icon: <Trophy className="w-8 h-8 text-amber-400"/>, value: "FREE", label: "REGISTRATION", desc: "Open to eligible students" },
    { icon: <Users className="w-8 h-8 text-cyan-400"/>, value: "04.12", label: "DECEMBER 2026", desc: "DATAVERSE 2K26" },
    { icon: <Shield className="w-8 h-8 text-emerald-400"/>, value: "09 AM", label: "ONWARDS", desc: "Centenary Building, Loyola" },
  ];

  return (
    <section className="relative z-20 -mt-5 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="doom-card relative flex flex-col items-center overflow-hidden rounded-xl border border-emerald-400/15 bg-[#07100c]/90 p-4 text-center sm:p-6">
            <div className="mb-3 p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/20">{stat.icon}</div>
            <span className="font-avengers text-3xl sm:text-4xl text-avengers-chrome italic">{stat.value}</span>
            <span className="font-tech text-xs sm:text-sm text-emerald-400 font-bold uppercase tracking-wider mt-1">{stat.label}</span>
            <span className="font-tech text-[11px] text-slate-400 mt-1">{stat.desc}</span>
            <div className="absolute top-0 right-0 w-8 h-8 bg-emerald-500/10 rounded-bl-full"/>
          </div>
        ))}
      </div>
    </section>
  );
}
