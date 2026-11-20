import React from "react";
import { Cpu, TicketCheck, Users } from "lucide-react";

export default function StatsBar() {
  const stats = [
    { icon: <Cpu className="h-4 w-4 text-emerald-400" />, value: "08", label: "EVENTS TO EXPLORE" },
    { icon: <TicketCheck className="h-4 w-4 text-emerald-400" />, value: "FREE", label: "REGISTRATION" },
    { icon: <Users className="h-4 w-4 text-emerald-400" />, value: "ALL", label: "ELIGIBLE STUDENTS" },
  ];

  return (
    <section aria-label="Event highlights" className="relative z-20 mx-auto -mt-px w-full max-w-7xl px-5 sm:px-8 lg:px-10">
      <div className="grid grid-cols-1 divide-y divide-emerald-400/10 overflow-hidden border-x border-b border-emerald-400/15 bg-[#06100b]/90 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center justify-center gap-3 px-4 py-4 sm:py-5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-400/15 bg-emerald-400/[.06]">{stat.icon}</span>
            <span className="flex items-baseline gap-2">
              <strong className="font-avengers text-xl tracking-wide text-white">{stat.value}</strong>
              <span className="font-tech text-[9px] font-bold uppercase tracking-[.15em] text-slate-400 sm:text-[10px]">{stat.label}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
