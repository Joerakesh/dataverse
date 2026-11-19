import React from "react";
import { MapPin, Navigation, ClipboardList, Info } from "lucide-react";

const eventNames = [
  "AgentOps – AI Agent Hackathon",
  "Data Nova – Project Presentation",
  "Intelliquest – Quiz",
  "VisQuest – Data Visualisation",
  "Pitch Storm – Shark Tank",
  "Dark Quest – Blindfold Clues",
  "Brand New Hunt – Treasure Hunt",
  "Infinity Decode – Connections",
];

export default function CampusMap() {
  return (
    <section id="map" className="py-24 relative bg-[#070b10] border-t border-emerald-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 text-xs font-tech font-bold uppercase tracking-widest mb-3">
            <Navigation size={14}/><span>Event location</span>
          </div>
          <h2 className="font-avengers text-5xl sm:text-7xl text-avengers-chrome italic tracking-wider">CENTENARY BUILDING</h2>
          <p className="font-tech text-base sm:text-lg text-slate-400 mt-2">The event venue shown on the DATAVERSE 2K26 invitation. Individual room allocations will be shared by the organisers.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
          <div className="lg:col-span-2 doom-card rounded-2xl p-7 border border-emerald-500/40 flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 grid place-items-center mb-5"><MapPin size={28}/></div>
              <span className="font-tech text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">Official venue</span>
              <h3 className="font-avengers text-3xl sm:text-4xl text-avengers-chrome italic mt-2">LOYOLA COLLEGE</h3>
              <p className="font-tech text-sm text-slate-300 mt-2">Centenary Building, Chennai – 600034</p>
              <div className="mt-5 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-tech text-slate-400 leading-relaxed">
                <Info size={14} className="inline text-emerald-400 mr-2"/>
                Please follow the event signage and coordinator instructions for the exact room or floor.
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs font-tech text-emerald-300"><ClipboardList size={15}/> Report to the registration desk first.</div>
          </div>

          <div className="lg:col-span-3 doom-card rounded-2xl p-7 border border-emerald-500/25">
            <div className="flex items-center justify-between gap-3 mb-5">
              <div>
                <span className="font-tech text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">Event list</span>
                <h3 className="font-avengers text-2xl sm:text-3xl text-slate-100 mt-1">EIGHT EVENT ARENAS</h3>
              </div>
              <span className="text-xs font-tech text-slate-500">04.12.2026</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              {eventNames.map((name, index) => (
                <div key={name} className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="font-avengers text-lg text-emerald-400 italic">0{index + 1}</span>
                  <span className="font-tech text-xs text-slate-200 leading-relaxed">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
