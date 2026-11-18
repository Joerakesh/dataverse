"use client";

import React, { useState } from "react";
import { MapPin, Navigation, Coffee, ShieldCheck, Bus, Info } from "lucide-react";
import { sounds } from "@/src/utils/soundEffects";

interface VenueSpot {
  name: string;
  floor: string;
  arena: string;
  hero: string;
  desc: string;
}

export default function CampusMap() {
  const [selectedSpot, setSelectedSpot] = useState<number>(0);

  const spots: VenueSpot[] = [
    {
      name: "Citadel Computing Lab 1",
      floor: "2nd Floor, Main Block",
      arena: "Unknown Variable (Flagship)",
      hero: "Dr. Doom",
      desc: "High-spec workstation lab with dedicated offline AI development environments.",
    },
    {
      name: "Auditorium Alpha",
      floor: "Ground Floor, Admin Wing",
      arena: "Data Nova (Project Presentation)",
      hero: "Captain America",
      desc: "Equipped with dual projectors, audio podiums, and jury consultation chambers.",
    },
    {
      name: "Stark Innovation Hall",
      floor: "1st Floor, Technology Block",
      arena: "Pitch Storm (Shark Tank)",
      hero: "Iron Man",
      desc: "Executive boardroom layout with projection screens and prototype demonstration tables.",
    },
    {
      name: "Visual Analytics Sanctum",
      floor: "3rd Floor, Data Block",
      arena: "VisQuest (Data Visualisation)",
      hero: "Doctor Strange",
      desc: "Multi-monitor analytics terminals configured for visual scrutiny and dataset evaluation.",
    },
    {
      name: "Titan Hall (Room 204)",
      floor: "2nd Floor, Science Wing",
      arena: "Dataverse Quiz",
      hero: "The Hulk",
      desc: "Spacious tier-seated lecture hall with buzzer consoles and live scoreboard.",
    },
    {
      name: "Web Sanctum (Room 102)",
      floor: "1st Floor, Main Block",
      arena: "Dark Quest (Blindfold)",
      hero: "Spider-Man",
      desc: "Acoustically isolated room with projection screen for visual clue transmission.",
    },
    {
      name: "Citadel Courtyard & Quad",
      floor: "Central Campus Grounds",
      arena: "Brand New Hunt (Treasure Hunt)",
      hero: "Rocket Raccoon",
      desc: "Outdoor grounds, corridors, and campus landscape for checkpoint traversal.",
    },
  ];

  return (
    <section id="map" className="py-24 relative bg-[#070b10] border-t border-emerald-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 text-xs font-tech font-bold uppercase tracking-widest mb-3">
            <Navigation size={14} />
            <span>Tactical Coordinates</span>
          </div>
          <h2 className="font-avengers text-5xl sm:text-7xl text-avengers-chrome italic tracking-wider">
            CITADEL SECTOR MAP
          </h2>
          <p className="font-tech text-base sm:text-lg text-slate-400 mt-2">
            Navigate the battle grounds. Review arena locations, amenity stations, and registration check-ins.
          </p>
        </div>

        {/* Interactive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Venue List */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-tech font-bold uppercase tracking-widest text-slate-400 block mb-2">
              Select Sector to Inspect:
            </span>
            {spots.map((spot, idx) => (
              <button
                key={idx}
                onClick={() => {
                  sounds.playClick();
                  setSelectedSpot(idx);
                }}
                className={`w-full text-left p-4 rounded-xl transition-all border ${
                  selectedSpot === idx
                    ? "bg-slate-900 border-emerald-400 shadow-[0_0_20px_rgba(0,255,136,0.25)] translate-x-1"
                    : "bg-slate-950/80 border-slate-800 hover:border-slate-700 opacity-75 hover:opacity-100"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-avengers text-xl text-slate-100 tracking-wide">
                    {spot.name}
                  </span>
                  <span className="text-[10px] font-tech font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                    {spot.hero}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-tech text-slate-400">
                  <MapPin size={12} className="text-red-400 flex-shrink-0" />
                  <span>{spot.floor}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Tactical Blueprint Display */}
          <div className="lg:col-span-7">
            <div className="doom-card rounded-2xl p-8 border-2 border-emerald-500/40 relative overflow-hidden">
              
              {/* Radar Grid Graphic */}
              <div className="flex items-center justify-between border-b border-emerald-500/30 pb-4 mb-6">
                <div>
                  <span className="text-[10px] font-tech font-bold uppercase tracking-widest text-emerald-400 block">
                    SECTOR BLUEPRINT
                  </span>
                  <h3 className="font-avengers text-3xl sm:text-4xl text-avengers-chrome italic">
                    {spots[selectedSpot].name.toUpperCase()}
                  </h3>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/40 text-emerald-400">
                  <Navigation size={24} className="animate-pulse" />
                </div>
              </div>

              {/* Coordinates Details */}
              <div className="space-y-4 mb-8 text-xs font-tech">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-400 block text-[11px] uppercase mb-1">Assigned Battle Arena</span>
                  <span className="text-emerald-300 font-bold text-base">{spots[selectedSpot].arena}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400 block text-[11px] uppercase mb-1">Floor Level</span>
                    <span className="text-slate-200 font-semibold">{spots[selectedSpot].floor}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400 block text-[11px] uppercase mb-1">Titan Guardian</span>
                    <span className="text-slate-200 font-semibold">{spots[selectedSpot].hero}</span>
                  </div>
                </div>

                <p className="text-slate-300 leading-relaxed p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                  {spots[selectedSpot].desc}
                </p>
              </div>

              {/* Amenities Bar */}
              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-tech text-slate-400">
                <div className="flex items-center gap-2">
                  <Coffee size={15} className="text-amber-400" />
                  <span>Canteen & Cafeteria: Ground Floor</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bus size={15} className="text-emerald-400" />
                  <span>College Transit Desk: Gate 1</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={15} className="text-cyan-400" />
                  <span>Help Desk: Main Lobby</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
