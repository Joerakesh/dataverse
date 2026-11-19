"use client";

import React, { useState } from "react";
import DoomsdayPreloader from "@/src/components/DoomsdayPreloader";
import Navbar from "@/src/components/Navbar";
import Hero from "@/src/components/Hero";
import StatsBar from "@/src/components/StatsBar";
import CosmicTesseract from "@/src/components/CosmicTesseract";
import LoreSection from "@/src/components/LoreSection";
import EventsGrid from "@/src/components/EventsGrid";
import Timeline from "@/src/components/Timeline";
import CampusMap from "@/src/components/CampusMap";
import ClassifiedTerminal from "@/src/components/ClassifiedTerminal";
import GeneralRules from "@/src/components/GeneralRules";
import Footer from "@/src/components/Footer";

export default function Home() {
  const [loadingComplete, setLoadingComplete] = useState(false);

  return (
    <>
      {!loadingComplete && <DoomsdayPreloader onComplete={() => setLoadingComplete(true)}/>}
      <main className="min-h-screen bg-[#04070a] text-slate-100 flex flex-col relative selection:bg-emerald-500 selection:text-black">
        <Navbar/>
        <Hero/>
        <StatsBar/>
        <div id="tesseract"><CosmicTesseract/></div>
        <LoreSection/>
        <EventsGrid/>
        <Timeline/>
        <CampusMap/>
        <ClassifiedTerminal/>
        <GeneralRules/>
        <Footer/>
      </main>
    </>
  );
}
