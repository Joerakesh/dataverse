import React from "react";
import { ShieldCheck, PhoneCall } from "lucide-react";

export default function GeneralRules() {
  const generalGuidelines = [
    { title: "Eligibility", desc: "Free registration is open to students from Computer Science, Computer Applications, Data Science, Information Technology, Mathematics, Statistics and related disciplines." },
    { title: "Team Representation", desc: "Only one team per department/college may participate in each event. Dark Quest permits up to two teams per college." },
    { title: "Event Participation", desc: "Each participant may take part in a maximum of two events, provided there are no scheduling conflicts." },
    { title: "Required Documents", desc: "Every participant must carry a valid College ID Card and a Bonafide Certificate issued by their institution." },
    { title: "Online Registration", desc: "Complete online registration before the deadline. On-spot registration, if available, depends on event availability." },
    { title: "Reporting", desc: "Collect participation cards from the registration desk before attending events and report to each venue on time." },
    { title: "Conduct & Safety", desc: "Maintain discipline, follow the institution's dress code and instructions from organisers. Misconduct or malpractice may lead to disqualification." },
    { title: "Food & Belongings", desc: "Participants must arrange their own food and refreshments and take responsibility for their personal belongings." },
  ];

  return (
    <section id="rules" className="py-24 relative bg-[#070b10] border-t border-emerald-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 text-xs font-tech font-bold uppercase tracking-widest mb-3">
            <ShieldCheck size={14}/><span>Official rulebook</span>
          </div>
          <h2 className="font-avengers text-5xl sm:text-7xl text-avengers-chrome italic tracking-wider">GENERAL RULES</h2>
          <p className="font-tech text-base sm:text-lg text-slate-400 mt-2">Please review the participation requirements before registering for DATAVERSE 2K26.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {generalGuidelines.map((rule, index) => (
            <article key={rule.title} className="doom-card rounded-xl p-6 border border-emerald-500/20 hover:border-emerald-400/50 flex flex-col justify-between">
              <div>
                <span className="font-avengers text-2xl text-emerald-400 italic">0{index + 1}.</span>
                <h3 className="font-avengers text-xl text-slate-100 tracking-wide mt-2 mb-2">{rule.title}</h3>
                <p className="font-tech text-xs text-slate-300 leading-relaxed">{rule.desc}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="doom-card rounded-2xl p-8 border border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 via-slate-950 to-emerald-950/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_30px_rgba(0,255,136,0.15)]">
          <div className="flex items-center gap-5">
            <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-400 flex-shrink-0"><PhoneCall size={28}/></div>
            <div>
              <span className="font-tech text-xs font-bold uppercase tracking-widest text-emerald-400">Loyola SAGE contacts</span>
              <h3 className="font-avengers text-2xl sm:text-3xl text-slate-100 tracking-wide mt-0.5">FLORINA & GODWIN SAM</h3>
              <p className="font-tech text-xs text-slate-400">Association Secretary · Joint Secretary · Centenary Building</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a href="tel:9043183343" className="btn-avengers px-6 py-3 bg-slate-900 border border-emerald-400/50 text-emerald-300 font-avengers text-lg font-bold tracking-wider rounded-lg whitespace-nowrap">CALL FLORINA: 9043183343</a>
            <a href="tel:7305462733" className="btn-avengers px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-black font-avengers text-lg font-bold tracking-wider rounded-lg whitespace-nowrap">CALL GODWIN: 7305462733</a>
          </div>
        </div>
      </div>
    </section>
  );
}
