"use client";

import React, { useState } from "react";
import Image from "next/image";
import { SYMPOSIUM_EVENTS, SymposiumEvent } from "@/src/data/events";
import {
  Users,
  MapPin,
  Clock,
  ChevronRight,
  ShieldAlert,
  Phone,
  CheckCircle2,
  X,
  Sparkles,
  Zap,
  Target,
  Compass,
  Cpu,
} from "lucide-react";
import { sounds } from "@/src/utils/soundEffects";

interface EventsGridProps {
  onSelectEventForRegistration: (event: SymposiumEvent) => void;
}

export default function EventsGrid({ onSelectEventForRegistration }: EventsGridProps) {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [selectedEvent, setSelectedEvent] = useState<SymposiumEvent | null>(null);

  const filteredEvents = SYMPOSIUM_EVENTS.filter((e: SymposiumEvent) => {
    if (activeTab === "All") return true;
    if (activeTab === "Flagship") return e.category === "Flagship";
    if (activeTab === "Technical") return e.category === "Technical";
    if (activeTab === "Non-Technical") return e.category === "Non-Technical";
    return true;
  });

  const getHeroThemeFlair = (alias: string) => {
    switch (alias) {
      case "Doctor Doom":
        return {
          border: "hover:border-emerald-400 hover:shadow-[0_0_30px_rgba(0,255,136,0.35)]",
          badgeColor: "border-emerald-400 text-emerald-300 bg-emerald-950/80",
          icon: <Zap size={13} className="text-emerald-400" />,
          label: "LATVERIAN SOVEREIGN PROTOCOL",
        };
      case "Iron Man":
        return {
          border: "hover:border-amber-400 hover:shadow-[0_0_30px_rgba(245,158,11,0.35)]",
          badgeColor: "border-amber-400 text-amber-300 bg-amber-950/80",
          icon: <Cpu size={13} className="text-cyan-400" />,
          label: "STARK ARC REACTOR VENTURE",
        };
      case "Doctor Strange":
        return {
          border: "hover:border-orange-400 hover:shadow-[0_0_30px_rgba(249,115,22,0.35)]",
          badgeColor: "border-orange-400 text-orange-300 bg-orange-950/80",
          icon: <Sparkles size={13} className="text-amber-400" />,
          label: "ELDRITCH VISUAL ANALYTICS",
        };
      case "Captain America":
        return {
          border: "hover:border-blue-400 hover:shadow-[0_0_30px_rgba(59,130,246,0.35)]",
          badgeColor: "border-blue-400 text-blue-300 bg-blue-950/80",
          icon: <ShieldAlert size={13} className="text-blue-400" />,
          label: "VIBRANIUM TECHNICAL DEFENSE",
        };
      case "The Hulk":
        return {
          border: "hover:border-green-400 hover:shadow-[0_0_30px_rgba(34,197,94,0.35)]",
          badgeColor: "border-green-400 text-green-300 bg-green-950/80",
          icon: <Zap size={13} className="text-green-400" />,
          label: "GAMMA BRAIN TITAN CLASH",
        };
      case "Spider-Man":
        return {
          border: "hover:border-red-400 hover:shadow-[0_0_30px_rgba(239,68,68,0.35)]",
          badgeColor: "border-red-400 text-red-300 bg-red-950/80",
          icon: <Compass size={13} className="text-red-400" />,
          label: "SPIDER-SENSE INTUITION",
        };
      case "Rocket":
        return {
          border: "hover:border-amber-500 hover:shadow-[0_0_30px_rgba(217,119,6,0.35)]",
          badgeColor: "border-amber-500 text-amber-300 bg-amber-950/80",
          icon: <Target size={13} className="text-amber-400" />,
          label: "TACTICAL SCAVENGER PURSUIT",
        };
      default:
        return {
          border: "hover:border-emerald-400",
          badgeColor: "border-emerald-400 text-emerald-300 bg-emerald-950/80",
          icon: <Sparkles size={13} />,
          label: "MULTIVERSE ARENA",
        };
    }
  };

  return (
    <section id="events" className="py-24 relative bg-[#05080c] overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 text-xs font-tech font-bold uppercase tracking-widest mb-3">
            <Sparkles size={14} />
            <span>The 7 Arenas of Latveria</span>
          </div>
          <h2 className="font-avengers text-5xl sm:text-7xl text-avengers-chrome italic tracking-wider">
            CHOOSE YOUR TRIAL
          </h2>
          <p className="font-tech text-base sm:text-lg text-slate-400 mt-2">
            Each arena is guarded by an iconic superhero guardian. Examine the rules, summon your squad, and initiate protocol registration.
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-8">
            {["All", "Flagship", "Technical", "Non-Technical"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  sounds.playHover();
                  setActiveTab(tab);
                }}
                className={`font-avengers text-lg sm:text-xl tracking-wider px-6 py-2 rounded-lg transition-all ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-emerald-500 to-green-600 text-black shadow-[0_0_15px_rgba(0,255,136,0.4)]"
                    : "bg-slate-900/90 text-slate-300 border border-emerald-500/20 hover:border-emerald-500/50 hover:text-emerald-300"
                }`}
              >
                {tab.toUpperCase()} {tab === "All" && `(${SYMPOSIUM_EVENTS.length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => {
            const flair = getHeroThemeFlair(event.character.alias);

            return (
              <div
                key={event.id}
                className={`doom-card rounded-2xl overflow-hidden flex flex-col group relative border border-emerald-500/25 ${flair.border} transition-all duration-300`}
              >
                {/* Image banner with character */}
                <div className="relative h-64 w-full overflow-hidden bg-slate-950">
                  <img
                    src={event.character.image}
                    alt={event.character.alias}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-90 contrast-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#05080c] via-slate-950/40 to-transparent" />

                  {/* Character alias badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded bg-black/80 backdrop-blur-md border border-emerald-500/40 text-emerald-400 text-xs font-tech font-bold uppercase tracking-wider">
                      {event.character.alias}
                    </span>
                  </div>

                  {/* Category badge */}
                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-3 py-1 rounded text-xs font-tech font-bold uppercase tracking-wider ${
                        event.category === "Flagship"
                          ? "bg-emerald-500 text-black shadow-[0_0_10px_rgba(0,255,136,0.6)]"
                          : "bg-slate-900/90 text-slate-200 border border-slate-700"
                      }`}
                    >
                      {event.category}
                    </span>
                  </div>

                  {/* Superhero Flair Pill */}
                  <div className="absolute top-16 left-4 right-4">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-tech font-bold tracking-wider uppercase backdrop-blur-md ${flair.badgeColor}`}>
                      {flair.icon}
                      <span>{flair.label}</span>
                    </div>
                  </div>

                  {/* Event Name overlay on image */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="font-avengers text-3xl sm:text-4xl text-slate-100 italic tracking-wide group-hover:text-emerald-400 transition-colors">
                      {event.name}
                    </h3>
                    <p className="font-tech text-xs text-emerald-300/90 font-semibold line-clamp-1">
                      {event.tagline}
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="font-tech text-sm text-slate-300 line-clamp-3 leading-relaxed mb-6">
                      {event.description}
                    </p>

                    {/* Metadata Chips */}
                    <div className="flex flex-wrap gap-3 mb-6 text-xs font-tech text-slate-300">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900/80 border border-emerald-500/20">
                        <Users size={14} className="text-emerald-400" />
                        <span>{event.teamSize}</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900/80 border border-emerald-500/20">
                        <MapPin size={14} className="text-red-400" />
                        <span className="truncate max-w-[130px]">{event.venue}</span>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800">
                    <button
                      onClick={() => {
                        sounds.playClick();
                        setSelectedEvent(event);
                      }}
                      className="py-2.5 px-3 rounded-lg bg-slate-900 border border-emerald-500/30 text-emerald-300 font-tech font-bold text-xs uppercase tracking-wider hover:bg-emerald-950/40 hover:border-emerald-400 transition-all text-center flex items-center justify-center gap-1"
                    >
                      <span>RULES & ROUNDS</span>
                      <ChevronRight size={14} />
                    </button>

                    <button
                      onClick={() => {
                        sounds.playClick();
                        onSelectEventForRegistration(event);
                      }}
                      className="py-2.5 px-3 rounded-lg bg-gradient-to-r from-emerald-500 to-green-600 text-black font-tech font-bold text-xs uppercase tracking-wider hover:from-emerald-400 hover:to-green-500 shadow-[0_0_10px_rgba(0,255,136,0.3)] transition-all text-center"
                    >
                      REGISTER
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Detailed Event Inspection Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="doom-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-emerald-500/40 p-6 sm:p-8 relative">
            
            {/* Close button */}
            <button
              onClick={() => {
                sounds.playClick();
                setSelectedEvent(null);
              }}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-900 text-slate-300 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Header info */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-xl overflow-hidden border border-emerald-400/50 flex-shrink-0">
                <img
                  src={selectedEvent.character.image}
                  alt={selectedEvent.character.alias}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-xs font-tech font-bold uppercase">
                  {selectedEvent.character.alias} • {selectedEvent.category}
                </span>
                <h3 className="font-avengers text-3xl sm:text-4xl text-avengers-chrome italic mt-1">
                  {selectedEvent.name}
                </h3>
                <p className="font-tech text-xs sm:text-sm text-emerald-300">
                  {selectedEvent.tagline}
                </p>
              </div>
            </div>

            {/* Venue & Team size specs */}
            <div className="grid grid-cols-2 gap-3 mb-6 p-4 rounded-xl bg-slate-950 border border-emerald-500/20 text-xs font-tech">
              <div>
                <span className="text-slate-400 block uppercase">Team Configuration:</span>
                <span className="text-emerald-300 font-bold text-sm">{selectedEvent.teamSize}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase">Combat Venue:</span>
                <span className="text-slate-200 font-bold text-sm">{selectedEvent.venue}</span>
              </div>
            </div>

            {/* Rounds Breakdown */}
            <div className="mb-6">
              <h4 className="font-avengers text-xl text-emerald-400 tracking-wider mb-3">
                ROUND PROTOCOLS & TIMELINES
              </h4>
              <div className="space-y-3">
                {selectedEvent.rounds.map((round, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-tech font-bold text-slate-100 text-sm">
                        {round.name}
                      </span>
                      {round.duration && (
                        <span className="text-[11px] font-tech px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                          {round.duration}
                        </span>
                      )}
                    </div>
                    <p className="font-tech text-xs text-slate-400 leading-relaxed">
                      {round.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Rules */}
            <div className="mb-6">
              <h4 className="font-avengers text-xl text-emerald-400 tracking-wider mb-3">
                RULES & DIRECTIVES
              </h4>
              <ul className="space-y-2">
                {selectedEvent.rules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs font-tech text-slate-300">
                    <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Student Coordinators */}
            <div className="mb-8 p-4 rounded-xl bg-slate-950/80 border border-emerald-500/20">
              <span className="font-tech text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Student Coordinators
              </span>
              <div className="flex flex-wrap gap-4">
                {selectedEvent.coordinators.map((c, idx) => (
                  <a
                    key={idx}
                    href={`tel:${c.phone}`}
                    onClick={() => sounds.playClick()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-emerald-500/30 hover:border-emerald-400 text-xs font-tech text-emerald-300 transition-colors"
                  >
                    <Phone size={12} className="text-emerald-400" />
                    <span>{c.name}: {c.phone}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  sounds.playClick();
                  setSelectedEvent(null);
                  onSelectEventForRegistration(selectedEvent);
                }}
                className="btn-avengers flex-1 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-black font-avengers text-xl font-bold tracking-wider rounded-lg shadow-[0_0_15px_rgba(0,255,136,0.4)] text-center"
              >
                <span>REGISTER FOR THIS ARENA</span>
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  setSelectedEvent(null);
                }}
                className="px-6 py-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 font-tech font-bold text-sm uppercase hover:bg-slate-800"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
