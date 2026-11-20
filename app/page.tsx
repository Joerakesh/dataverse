"use client";

import React, { useCallback, useState } from "react";
import DoomsdayPreloader from "@/src/components/DoomsdayPreloader";
import FogCanvas from "@/src/components/FogCanvas";
import Navbar from "@/src/components/Navbar";
import Hero from "@/src/components/Hero";
import EventsGrid from "@/src/components/EventsGrid";
import Timeline from "@/src/components/Timeline";
import Footer from "@/src/components/Footer";

export default function Home() {
  const [loadingComplete, setLoadingComplete] = useState(false);
  const completeLoading = useCallback(() => setLoadingComplete(true), []);
  return <>
    <FogCanvas/>
    {!loadingComplete && <DoomsdayPreloader onComplete={completeLoading}/>}
    <main className="relative z-10 min-h-screen bg-[#050806] text-slate-100 selection:bg-emerald-500 selection:text-black">
      <Navbar/>
      <div id="top"><Hero/></div>
      <EventsGrid/>
      <Timeline/>
      <Footer/>
    </main>
  </>;
}
