import React from "react";
import { CalendarDays, Clock, Flag, Trophy } from "lucide-react";

const phases = [
  {
    label: "REPORTING",
    time: "09:00 AM onwards",
    title: "Arrival & Registration Desk",
    description: "Report to the registration desk at Centenary Building and collect your participation card before attending your event.",
    icon: <Flag className="text-emerald-400" size={20}/>,
  },
  {
    label: "EVENT SESSIONS",
    time: "Event-wise schedule",
    title: "Competitions & Rounds",
    description: "Attend the rounds for your registered event. Report to the respective venue on time; event-specific schedules will be communicated by the organisers.",
    icon: <Clock className="text-cyan-400" size={20}/>,
  },
  {
    label: "CLOSING",
    time: "As announced",
    title: "Valedictory & Prize Distribution",
    description: "The announcement of results and prize distribution will take place during the Valedictory Function.",
    icon: <Trophy className="text-amber-400" size={20}/>,
  },
];

export default function Timeline() {
  return (
    <section id="schedule" className="py-24 relative bg-[#05080c] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 text-xs font-tech font-bold uppercase tracking-widest mb-3">
            <CalendarDays size={14}/><span>Event day</span>
          </div>
          <h2 className="font-avengers text-5xl sm:text-7xl text-avengers-chrome italic tracking-wider">DATAVERSE TIMELINE</h2>
          <p className="font-tech text-base sm:text-lg text-slate-400 mt-2">The published information for 4 December 2026. Detailed event slots will be announced by the organising team.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {phases.map((phase, index) => (
            <article key={phase.label} className="doom-card rounded-xl p-6 border border-emerald-500/25 relative group hover:border-emerald-400 transition-all">
              <div className="flex items-center justify-between mb-5">
                <span className="text-[11px] font-tech font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40">PHASE 0{index + 1}</span>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">{phase.icon}</div>
              </div>
              <span className="font-tech text-xs text-emerald-300 block mb-1">{phase.time}</span>
              <h3 className="font-avengers text-2xl text-slate-100 tracking-wide mb-2 group-hover:text-emerald-400 transition-colors">{phase.title}</h3>
              <p className="font-tech text-xs text-slate-300 leading-relaxed">{phase.description}</p>
              <div className="mt-5 pt-3 border-t border-slate-800/80 text-[10px] font-tech text-slate-500 uppercase tracking-wider">{phase.label}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
