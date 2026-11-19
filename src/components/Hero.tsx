"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, Calendar, MapPin, Download, Clock, Phone } from "lucide-react";
import Link from "next/link";
import { sounds } from "@/src/utils/soundEffects";

export default function Hero() {
  // Countdown to 04.12.2026 09:00 AM
  const [timeLeft, setTimeLeft] = useState({
    days: "14",
    hours: "08",
    minutes: "45",
    seconds: "30",
  });

  useEffect(() => {
    // Target: 04 December 2026 09:00 AM
    const targetDate = new Date("2026-12-04T09:00:00");

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({
          days: days < 10 ? `0${days}` : `${days}`,
          hours: hours < 10 ? `0${hours}` : `${hours}`,
          minutes: minutes < 10 ? `0${minutes}` : `${minutes}`,
          seconds: seconds < 10 ? `0${seconds}` : `${seconds}`,
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[96vh] flex items-center justify-center pt-32 pb-16 overflow-hidden bg-grid-pattern">
      {/* Dr. Doom Doomsday Plasma Aurora */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[580px] bg-emerald-500/18 rounded-full blur-[150px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 right-10 w-[350px] h-[350px] bg-green-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Hero Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col items-center text-center">
        
        {/* Loyola College & SAGE Crest Banner */}
        <div className="inline-flex items-center gap-3 sm:gap-4 px-5 py-2 rounded-full bg-slate-950/90 border border-emerald-400/50 text-slate-200 text-xs sm:text-sm font-tech font-bold uppercase tracking-wider mb-6 shadow-[0_0_25px_rgba(0,255,136,0.3)]">
          <img src="/images/loyola-crest.png" alt="Loyola" className="w-6 h-6 object-contain" />
          <span>LOYOLA COLLEGE (AUTONOMOUS)</span>
          <span className="text-emerald-400">•</span>
          <span className="text-emerald-300">DEPT OF DATA SCIENCE</span>
          <span className="text-emerald-400">•</span>
          <div className="flex items-center gap-1.5 text-amber-400">
            <img src="/images/sage-logo.png" alt="SAGE" className="w-5 h-5 object-contain" />
            <span>SAGE</span>
          </div>
        </div>

        {/* OFFICIAL 3D METALLIC DATAVERSE LOGO */}
        <div className="relative mb-4 max-w-2xl sm:max-w-3xl w-full flex items-center justify-center group">
          <img
            src="/images/logo.png"
            alt="DATAVERSE"
            className="w-full h-auto max-h-[160px] sm:max-h-[210px] md:max-h-[240px] object-contain filter drop-shadow-[0_10px_40px_rgba(0,255,136,0.6)] group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute -inset-4 blur-3xl bg-emerald-500/25 -z-10" />
        </div>

        {/* 2K26 Sub-badge */}
        <div className="font-avengers text-3xl sm:text-5xl text-emerald-400 italic tracking-[0.25em] -mt-3 mb-2 filter drop-shadow-[0_0_10px_rgba(0,255,136,0.8)]">
          2K26
        </div>

        {/* Tagline */}
        <p className="font-doom text-base sm:text-xl md:text-2xl text-slate-100 tracking-wider max-w-3xl mb-3 font-semibold">
          INTER-COLLEGIATE TECHNICAL FEST
        </p>

        <p className="font-tech text-sm sm:text-base text-emerald-300/90 max-w-2xl mb-8 tracking-wide">
          The Department of Data Science, in association with SAGE (Society of Artificial Intelligence and Generative Engineering), welcomes you to a day of innovation, creativity and competition.
        </p>

        {/* Key Event Badges (Straight from Poster) */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 mb-10 text-xs sm:text-sm font-tech font-bold text-slate-300">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900/90 border border-emerald-500/40">
            <Calendar size={16} className="text-emerald-400" />
            <span>04.12.2026</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900/90 border border-emerald-500/40">
            <Clock size={16} className="text-amber-400" />
            <span>09:00 AM ONWARDS</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900/90 border border-emerald-500/40">
            <MapPin size={16} className="text-red-400" />
            <span>CENTENARY BUILDING, LOYOLA</span>
          </div>
          <a
            href="/DATAVERSE-RULEBOOK.pdf"
            download="DATAVERSE-RULEBOOK.pdf"
            onClick={() => sounds.playClick()}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-950/90 border border-emerald-400/50 text-emerald-300 hover:bg-emerald-900 transition-colors"
          >
            <Download size={15} />
            <span>Official Rulebook (PDF)</span>
          </a>
        </div>

        {/* Countdown Clock */}
        <div className="grid grid-cols-4 gap-3 sm:gap-6 mb-10 max-w-xl w-full">
          {[
            { label: "DAYS", value: timeLeft.days },
            { label: "HOURS", value: timeLeft.hours },
            { label: "MINUTES", value: timeLeft.minutes },
            { label: "SECONDS", value: timeLeft.seconds },
          ].map((item, idx) => (
            <div
              key={idx}
              className="doom-card rounded-lg p-3 sm:p-5 flex flex-col items-center justify-center relative overflow-hidden border border-emerald-500/35"
            >
              <span className="font-avengers text-3xl sm:text-5xl text-avengers-chrome italic">
                {item.value}
              </span>
              <span className="font-tech text-[10px] sm:text-xs tracking-[0.2em] text-emerald-400 font-bold uppercase mt-1">
                {item.label}
              </span>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-600" />
            </div>
          ))}
        </div>

        {/* Participant Registration CTA */}
        <div className="flex items-center justify-center mb-10">
          <Link
            href="/register"
            onClick={() => sounds.playClick()}
            className="btn-avengers px-9 py-4 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 text-black font-avengers text-2xl font-bold tracking-widest rounded-lg shadow-[0_0_30px_rgba(0,255,136,0.5)] hover:shadow-[0_0_40px_rgba(0,255,136,0.8)] transition-all"
          >
            <span className="flex items-center gap-2">
              REGISTER NOW <ArrowRight size={20} />
            </span>
          </Link>
        </div>

        {/* Secretarial Leadership Strip (From Poster) */}
        <div className="pt-6 border-t border-emerald-500/20 max-w-xl w-full grid grid-cols-2 gap-4 text-xs font-tech text-slate-300">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
              Association Secretary
            </span>
            <span className="font-avengers text-lg text-slate-100 tracking-wide block mt-0.5">
              FLORINA
            </span>
            <a href="tel:9043183343" className="text-slate-400 hover:text-emerald-400 flex items-center gap-1 mt-0.5">
              <Phone size={11} className="text-emerald-400" />
              <span>9043183343</span>
            </a>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
              Joint Secretary
            </span>
            <span className="font-avengers text-lg text-slate-100 tracking-wide block mt-0.5">
              GODWIN SAM
            </span>
            <a href="tel:7305462733" className="text-slate-400 hover:text-emerald-400 flex items-center gap-1 mt-0.5">
              <Phone size={11} className="text-emerald-400" />
              <span>7305462733</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
