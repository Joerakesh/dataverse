import React from "react";
import { Trophy, Users, Shield, Cpu } from "lucide-react";

export default function StatsBar() {
  const stats = [
    {
      icon: <Cpu className="w-8 h-8 text-emerald-400" />,
      value: "7",
      label: "BATTLE ARENAS",
      desc: "Flagship, Technical & Strategy",
    },
    {
      icon: <Trophy className="w-8 h-8 text-amber-400" />,
      value: "₹CASH",
      label: "BOUNTIES & AWARDS",
      desc: "Plus Latverian Sovereign Trophies",
    },
    {
      icon: <Users className="w-8 h-8 text-cyan-400" />,
      value: "500+",
      label: "ASSEMBLED WARRIORS",
      desc: "Top Colleges & Universities",
    },
    {
      icon: <Shield className="w-8 h-8 text-emerald-400" />,
      value: "100%",
      label: "CERTIFIED MERIT",
      desc: "Authorized Bonafide Accreditations",
    },
  ];

  return (
    <section className="relative z-20 -mt-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <div
            key={idx}
            className="doom-card rounded-xl p-6 flex flex-col items-center text-center border border-emerald-500/25 relative overflow-hidden"
          >
            <div className="mb-3 p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/20">
              {s.icon}
            </div>
            <span className="font-avengers text-3xl sm:text-4xl text-avengers-chrome italic">
              {s.value}
            </span>
            <span className="font-tech text-xs sm:text-sm text-emerald-400 font-bold uppercase tracking-wider mt-1">
              {s.label}
            </span>
            <span className="font-tech text-[11px] text-slate-400 mt-1">
              {s.desc}
            </span>
            <div className="absolute top-0 right-0 w-8 h-8 bg-emerald-500/10 rounded-bl-full" />
          </div>
        ))}
      </div>
    </section>
  );
}
