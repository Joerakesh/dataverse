import React from "react";
import { ShieldCheck, AlertTriangle, FileText, PhoneCall, Award } from "lucide-react";

export default function GeneralRules() {
  const generalGuidelines = [
    {
      title: "Eligibility & Representation",
      desc: "Registration is open to students from eligible departments and institutions. Only one team per department/college may participate in each event.",
    },
    {
      title: "Event Participation Cap",
      desc: "Participants may take part in a maximum of two events, provided there are no scheduling conflicts across venues.",
    },
    {
      title: "Mandatory Identification",
      desc: "All participants must carry their valid College ID Card and Bonafide Certificate issued by their respective institution.",
    },
    {
      title: "Check-in & Participation Cards",
      desc: "All registered participants must report to the registration desk upon arrival to collect their official participation cards before entering event halls.",
    },
    {
      title: "Punctuality & Forfeiture",
      desc: "Participants must report to their respective event venues at least 10–15 minutes early. Late arrivals may result in immediate disqualification.",
    },
    {
      title: "Discipline & Attire",
      desc: "Participants must maintain proper decorum and adhere to the formal/prescribed college dress code. Inappropriate attire or misconduct leads to expulsion.",
    },
    {
      title: "Hardware & Offline Tooling",
      desc: "For technical arenas (Data Nova, Pitch Storm, Classified Event), participants must bring their own laptops with pre-installed offline libraries & chargers.",
    },
    {
      title: "Valedictory & Prize Distribution",
      desc: "The announcement of results and prize distribution with trophies and certificates will take place during the Grand Valedictory Function.",
    },
  ];

  return (
    <section id="rules" className="py-24 relative bg-[#070b10] border-t border-emerald-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 text-xs font-tech font-bold uppercase tracking-widest mb-3">
            <ShieldCheck size={14} />
            <span>Official Codex</span>
          </div>
          <h2 className="font-avengers text-5xl sm:text-7xl text-avengers-chrome italic tracking-wider">
            SYMPOSIUM PROTOCOLS
          </h2>
          <p className="font-tech text-base sm:text-lg text-slate-400 mt-2">
            The Latverian code of honor is absolute. Familiarize your team with the general symposium directives.
          </p>
        </div>

        {/* Rule Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {generalGuidelines.map((rule, idx) => (
            <div
              key={idx}
              className="doom-card rounded-xl p-6 border border-emerald-500/20 hover:border-emerald-400/50 flex flex-col justify-between"
            >
              <div>
                <span className="font-avengers text-2xl text-emerald-400 italic">
                  0{idx + 1}.
                </span>
                <h4 className="font-avengers text-xl text-slate-100 tracking-wide mt-2 mb-2">
                  {rule.title}
                </h4>
                <p className="font-tech text-xs text-slate-300 leading-relaxed">
                  {rule.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Overall In-Charge Coordinator Callout */}
        <div className="doom-card rounded-2xl p-8 border border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 via-slate-950 to-emerald-950/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_30px_rgba(0,255,136,0.15)]">
          <div className="flex items-center gap-5">
            <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-400 flex-shrink-0">
              <PhoneCall size={28} />
            </div>
            <div>
              <span className="font-tech text-xs font-bold uppercase tracking-widest text-emerald-400">
                Loyola SAGE Executive Leadership
              </span>
              <h3 className="font-avengers text-2xl sm:text-3xl text-slate-100 tracking-wide mt-0.5">
                FLORINA (SECRETARY) & GODWIN SAM (JOINT SEC.)
              </h3>
              <p className="font-tech text-xs text-slate-400">
                Department of Data Science • Centenary Building Help Desk
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="tel:9043183343"
              className="btn-avengers px-6 py-3 bg-slate-900 border border-emerald-400/50 text-emerald-300 font-avengers text-lg font-bold tracking-wider rounded-lg shadow-[0_0_10px_rgba(0,255,136,0.2)] whitespace-nowrap"
            >
              <span>CALL FLORINA: 9043183343</span>
            </a>
            <a
              href="tel:7305462733"
              className="btn-avengers px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-black font-avengers text-lg font-bold tracking-wider rounded-lg shadow-[0_0_15px_rgba(0,255,136,0.4)] whitespace-nowrap"
            >
              <span>CALL GODWIN: 7305462733</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
