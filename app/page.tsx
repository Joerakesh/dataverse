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
import DoomAssistant from "@/src/components/DoomAssistant";
import AuthModal from "@/src/components/AuthModal";
import CitadelPassModal from "@/src/components/CitadelPassModal";
import TeamPortalModal from "@/src/components/TeamPortalModal";
import { SymposiumEvent } from "@/src/data/events";

export default function Home() {
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [passModalOpen, setPassModalOpen] = useState(false);
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [selectedEventForAuth, setSelectedEventForAuth] = useState<SymposiumEvent | null>(null);

  const handleOpenAuth = (event?: SymposiumEvent) => {
    if (event) {
      setSelectedEventForAuth(event);
    } else {
      setSelectedEventForAuth(null);
    }
    setAuthModalOpen(true);
  };

  return (
    <>
      {/* Doomsday Preloader */}
      {!loadingComplete && (
        <DoomsdayPreloader onComplete={() => setLoadingComplete(true)} />
      )}

      <main className="min-h-screen bg-[#04070a] text-slate-100 flex flex-col relative selection:bg-emerald-500 selection:text-black">
        {/* Navigation Bar */}
        <Navbar
          onOpenAuth={() => handleOpenAuth()}
          onOpenPass={() => setPassModalOpen(true)}
          onOpenTeam={() => setTeamModalOpen(true)}
        />

        {/* Hero Section with Official 3D Logo */}
        <Hero
          onOpenAuth={() => handleOpenAuth()}
          onOpenPass={() => setPassModalOpen(true)}
          onOpenTeam={() => setTeamModalOpen(true)}
        />

        {/* Statistics & Trophies */}
        <StatsBar />

        {/* Interactive 3D Cosmic Tesseract / Energy Core */}
        <div id="tesseract">
          <CosmicTesseract />
        </div>

        {/* The Convergence Lore */}
        <LoreSection />

        {/* 7 Battle Arenas (Hero Themed Cards & Modals) */}
        <EventsGrid onSelectEventForRegistration={(event: SymposiumEvent) => handleOpenAuth(event)} />

        {/* Symposium Master Timeline */}
        <Timeline />

        {/* Interactive Tactical Sector Map */}
        <CampusMap />

        {/* Doom's Interactive Decryption Terminal */}
        <ClassifiedTerminal />

        {/* General Rulebook Directives & Head Coordinator */}
        <GeneralRules />

        {/* Footer */}
        <Footer />

        {/* Floating Doom AI Comms Widget */}
        <DoomAssistant />

        {/* Modals */}
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          preSelectedEvent={selectedEventForAuth}
        />

        <CitadelPassModal
          isOpen={passModalOpen}
          onClose={() => setPassModalOpen(false)}
        />

        <TeamPortalModal
          isOpen={teamModalOpen}
          onClose={() => setTeamModalOpen(false)}
        />
      </main>
    </>
  );
}
