"use client";

import React, { useCallback, useState } from "react";
import Image from "next/image";
import { SYMPOSIUM_EVENTS, SymposiumEvent } from "@/src/data/events";
import { CheckCircle2, ChevronRight, Phone, Sparkles, Users, X } from "lucide-react";
import { sounds } from "@/src/utils/soundEffects";
import EventTransition from "@/src/components/EventTransition";

export default function EventsGrid() {
  const [activeTab, setActiveTab] = useState("All");
  const [selectedEvent, setSelectedEvent] = useState<SymposiumEvent | null>(null);
  const [transitionEvent, setTransitionEvent] = useState<SymposiumEvent | null>(null);

  const completeTransition = useCallback(() => {
    if (transitionEvent) setSelectedEvent(transitionEvent);
    setTransitionEvent(null);
  }, [transitionEvent]);

  const filteredEvents = SYMPOSIUM_EVENTS.filter((event) => {
    if (activeTab === "All") return true;
    if (activeTab === "Technical") return event.category === "Technical" || event.category === "Flagship";
    if (activeTab === "Non-Technical") return event.category === "Non-Technical";
    return true;
  });

  return (
    <section id="events" className="relative overflow-hidden border-y border-emerald-400/10 bg-[#04070a]/85 py-20 sm:py-28">
      <div className="pointer-events-none absolute -left-40 top-1/4 h-[520px] w-[520px] rounded-full bg-emerald-400/[0.08] blur-[150px]"/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mx-auto mb-14 max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 text-xs font-tech font-bold uppercase tracking-widest mb-3">
            <Sparkles size={14}/><span>8 official events</span>
          </div>
          <h2 className="font-avengers text-5xl italic tracking-[0.08em] text-avengers-chrome sm:text-7xl">CHOOSE YOUR TRIAL</h2>
          <p className="font-tech text-base sm:text-lg text-slate-400 mt-2">Explore the DATAVERSE 2K26 events and read the rules before registering through the chatbot.</p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-8">
            {["All", "Technical", "Non-Technical"].map((tab) => (
              <button key={tab} onClick={() => { sounds.playHover(); setActiveTab(tab); }} className={"font-avengers text-lg sm:text-xl tracking-wider px-6 py-2 rounded-lg transition-all " + (activeTab === tab ? "bg-gradient-to-r from-emerald-500 to-green-600 text-black shadow-[0_0_15px_rgba(0,255,136,0.4)]" : "bg-slate-900/90 text-slate-300 border border-emerald-500/20 hover:border-emerald-500/50 hover:text-emerald-300")}>
                {tab.toUpperCase()} {tab === "All" ? "(" + SYMPOSIUM_EVENTS.length + ")" : ""}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {filteredEvents.map((event) => (
            <article key={event.slug} className="group relative flex transform-gpu flex-col overflow-hidden rounded-2xl border border-emerald-400/15 bg-[#07100c]/90 shadow-[0_18px_50px_rgba(0,0,0,.28)] [transform-style:preserve-3d] transition-[border-color,transform,box-shadow] duration-300 hover:[transform:perspective(1200px)_rotateX(1deg)_rotateY(-1deg)_translateY(-5px)] hover:border-emerald-300/50 hover:shadow-[0_22px_60px_rgba(0,255,136,.12)] motion-reduce:transform-none">
              <div className="relative h-60 w-full overflow-hidden bg-[radial-gradient(ellipse_at_50%_38%,rgba(16,185,129,.10),#050b09_72%)] sm:h-64">
                <Image src={event.character.image} alt={event.character.alias} fill className="object-contain object-center p-2 brightness-[.94] contrast-[1.04] transition-transform duration-700 ease-out group-hover:scale-[1.035] motion-reduce:transform-none"/>
                <div className="absolute inset-0 bg-gradient-to-t from-[#05080c] via-[#05080c]/35 to-transparent"/>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded bg-black/80 backdrop-blur-md border border-emerald-500/40 text-emerald-400 text-xs font-tech font-bold uppercase tracking-wider">{event.character.alias}</span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 rounded text-xs font-tech font-bold uppercase tracking-wider bg-slate-900/90 text-slate-200 border border-slate-700">{event.category}</span>
                </div>
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="font-avengers text-3xl sm:text-4xl text-slate-100 italic tracking-wide group-hover:text-emerald-400 transition-colors">{event.name}</h3>
                  <p className="font-tech text-xs text-emerald-300/90 font-semibold line-clamp-1">{event.tagline}</p>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <p className="font-tech text-sm text-slate-300 line-clamp-3 leading-relaxed mb-6">{event.description}</p>
                  <div className="flex flex-wrap gap-3 mb-6 text-xs font-tech text-slate-300">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900/80 border border-emerald-500/20">
                      <Users size={14} className="text-emerald-400"/><span>{event.teamSize}</span>
                    </div>
                    <div className="px-3 py-1.5 rounded bg-slate-900/80 border border-emerald-500/20"><span>{event.venue}</span></div>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-800">
                  <button onClick={() => { sounds.playClick(); setTransitionEvent(event); }} className="w-full py-2.5 px-3 rounded-lg bg-slate-900 border border-emerald-500/30 text-emerald-300 font-tech font-bold text-xs uppercase tracking-wider hover:bg-emerald-950/40 hover:border-emerald-400 transition-all text-center flex items-center justify-center gap-1">
                    <span>RULES & ROUNDS</span><ChevronRight size={14}/>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {transitionEvent && <EventTransition event={transitionEvent} onComplete={completeTransition} />}

      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="doom-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-emerald-500/40 p-6 sm:p-8 relative">
            <button onClick={() => { sounds.playClick(); setSelectedEvent(null); }} className="absolute top-5 right-5 p-2 rounded-full bg-slate-900 text-slate-300 hover:text-emerald-400 hover:bg-slate-800 transition-colors" aria-label="Close event rules"><X size={20}/></button>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-emerald-400/50 flex-shrink-0">
                <Image src={selectedEvent.character.image} alt={selectedEvent.character.alias} fill className="object-cover"/>
              </div>
              <div className="min-w-0">
                <span className="px-2.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-xs font-tech font-bold uppercase">{selectedEvent.character.alias} • {selectedEvent.category}</span>
                <h3 className="font-avengers text-3xl sm:text-4xl text-avengers-chrome italic mt-1">{selectedEvent.name}</h3>
                <p className="font-tech text-xs sm:text-sm text-emerald-300">{selectedEvent.tagline}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-6 p-4 rounded-xl bg-slate-950 border border-emerald-500/20 text-xs font-tech">
              <div><span className="text-slate-400 block uppercase">Team size</span><span className="text-emerald-300 font-bold text-sm">{selectedEvent.teamSize}</span></div>
              <div><span className="text-slate-400 block uppercase">Venue</span><span className="text-slate-200 font-bold text-sm">{selectedEvent.venue}</span></div>
            </div>
            <div className="mb-6">
              <h4 className="font-avengers text-xl text-emerald-400 tracking-wider mb-3">ROUND DETAILS</h4>
              <div className="space-y-3">
                {selectedEvent.rounds.map((round, index) => (
                  <div key={index} className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    <div className="flex items-center justify-between gap-2"><span className="font-tech font-bold text-slate-100 text-sm">{round.name}</span>{round.duration && <span className="text-[11px] font-tech px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">{round.duration}</span>}</div>
                    <p className="font-tech text-xs text-slate-400 leading-relaxed mt-1">{round.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <h4 className="font-avengers text-xl text-emerald-400 tracking-wider mb-3">RULES & DIRECTIVES</h4>
              <ul className="space-y-2">
                {selectedEvent.rules.map((rule, index) => <li key={index} className="flex items-start gap-2 text-xs font-tech text-slate-300"><CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0 mt-0.5"/><span>{rule}</span></li>)}
              </ul>
            </div>
            <div className="mb-6 p-4 rounded-xl bg-slate-950/80 border border-emerald-500/20">
              <span className="font-tech text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">Student coordinators</span>
              <div className="flex flex-wrap gap-3">
                {selectedEvent.coordinators.map((coordinator) => <a key={coordinator.phone} href={"tel:" + coordinator.phone} onClick={() => sounds.playClick()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-emerald-500/30 hover:border-emerald-400 text-xs font-tech text-emerald-300 transition-colors"><Phone size={12}/><span>{coordinator.name}: {coordinator.phone}</span></a>)}
              </div>
            </div>
            <button onClick={() => { sounds.playClick(); setSelectedEvent(null); }} className="w-full py-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 font-tech font-bold text-sm uppercase hover:bg-slate-800">Close</button>
          </div>
        </div>
      )}
    </section>
  );
}
