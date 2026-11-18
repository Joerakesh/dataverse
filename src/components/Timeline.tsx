import React from "react";
import { Clock, Flag, Zap, Award, Coffee, Sparkles } from "lucide-react";

export default function Timeline() {
  const steps = [
    {
      time: "08:30 AM - 09:30 AM",
      phase: "PHASE 01",
      title: "CITADEL REPORTING & PASS COLLECTION",
      desc: "Report to the registration desk with valid College ID and Bonafide Certificates to receive participant credentials.",
      icon: <Flag className="text-emerald-400" size={20} />,
    },
    {
      time: "09:30 AM - 10:15 AM",
      phase: "PHASE 02",
      title: "IN AUGURATION & DR. DOOM DECREE",
      desc: "Opening ceremony in the main auditorium. Unveiling of the sovereign symposium rules and dignitaries address.",
      icon: <Sparkles className="text-amber-400" size={20} />,
    },
    {
      time: "10:30 AM - 01:00 PM",
      phase: "PHASE 03",
      title: "ARENA ROUND 1: PRELIMINARY TRIALS",
      desc: "Elimination rounds for VisQuest, Quiz, Dark Quest, Treasure Hunt, and Data Nova technical presentations.",
      icon: <Zap className="text-emerald-400" size={20} />,
    },
    {
      time: "01:00 PM - 02:00 PM",
      phase: "PHASE 04",
      title: "REFUELING & RECHARGE INTERLUDE",
      desc: "Lunch break and networking across collegiate delegations.",
      icon: <Coffee className="text-cyan-400" size={20} />,
    },
    {
      time: "02:00 PM - 03:45 PM",
      phase: "PHASE 05",
      title: "THE FINALS & CLASSIFIED SURPRISE ORDEAL",
      desc: "Shark Tank pitches, VisQuest final narrative, and Doom's Unknown Variable classified surprise showdown.",
      icon: <Zap className="text-red-400" size={20} />,
    },
    {
      time: "04:00 PM - 05:00 PM",
      phase: "PHASE 06",
      title: "VALEDICTORY & CORONATION",
      desc: "Grand prize distribution, awarding of cash bounties, trophies, certificates, and overall institution championship.",
      icon: <Award className="text-amber-400" size={20} />,
    },
  ];

  return (
    <section id="schedule" className="py-24 relative bg-[#05080c] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 text-xs font-tech font-bold uppercase tracking-widest mb-3">
            <Clock size={14} />
            <span>Master Schedule</span>
          </div>
          <h2 className="font-avengers text-5xl sm:text-7xl text-avengers-chrome italic tracking-wider">
            SYMPOSIUM TIMELINE
          </h2>
          <p className="font-tech text-base sm:text-lg text-slate-400 mt-2">
            Precision timing is the hallmark of Latveria. Follow the phases of victory.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="doom-card rounded-xl p-6 border border-emerald-500/25 relative flex flex-col justify-between group hover:border-emerald-400 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-tech font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                    {step.phase}
                  </span>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    {step.icon}
                  </div>
                </div>

                <span className="font-tech text-xs text-slate-400 block mb-1">
                  {step.time}
                </span>

                <h4 className="font-avengers text-2xl text-slate-100 tracking-wide mb-2 group-hover:text-emerald-400 transition-colors">
                  {step.title}
                </h4>

                <p className="font-tech text-xs text-slate-300 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-tech text-emerald-400/80">
                <span>STAGE 0{idx + 1}</span>
                <span>MANDATORY ATTENDANCE</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
