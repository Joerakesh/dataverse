import React from "react";
import { Shield, ArrowUp, Heart, Sparkles, Download } from "lucide-react";
import { sounds } from "@/src/utils/soundEffects";

export default function Footer() {
  const scrollToTop = () => {
    sounds.playClick();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="contact" className="bg-[#030508] border-t border-emerald-500/25 pt-16 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Info with Logo */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2">
                <img src="/images/loyola-crest.png" alt="Loyola" className="h-10 w-auto object-contain" />
                <img src="/images/sage-logo.png" alt="SAGE" className="h-10 w-auto object-contain" />
              </div>
              <div className="flex items-center gap-1">
                <img
                  src="/images/logo.png"
                  alt="DATAVERSE"
                  className="h-10 w-auto object-contain filter drop-shadow-[0_0_10px_rgba(0,255,136,0.4)]"
                />
                <span className="font-avengers text-2xl text-emerald-400 italic">2K26</span>
              </div>
            </div>
            <p className="font-tech text-xs uppercase font-bold text-emerald-400 tracking-wider mb-2">
              Loyola College (Autonomous), Chennai • Dept of Data Science & SAGE
            </p>
            <p className="font-tech text-sm text-slate-400 max-w-md leading-relaxed mb-4">
              The premier National Level Technical Symposium uniting machine learning, agentic workflows, startup pitching, and algorithmic mastery under the sovereign decree of Dr. Doom.
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-tech text-emerald-400">
              <Sparkles size={14} />
              <span>&ldquo;Victor Von Doom bows to no one.&rdquo;</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-avengers text-xl text-slate-200 tracking-wider mb-4">
              CITADEL NAVIGATION
            </h4>
            <ul className="space-y-2 text-xs font-tech uppercase text-slate-400">
              <li>
                <a href="#events" className="hover:text-emerald-400 transition-colors">
                  Battle Arenas (7 Events)
                </a>
              </li>
              <li>
                <a href="#lore" className="hover:text-emerald-400 transition-colors">
                  The Lore & Protocol
                </a>
              </li>
              <li>
                <a href="#map" className="hover:text-emerald-400 transition-colors">
                  Sector Map
                </a>
              </li>
              <li>
                <a href="#rules" className="hover:text-emerald-400 transition-colors">
                  General Rulebook
                </a>
              </li>
              <li>
                <a href="#schedule" className="hover:text-emerald-400 transition-colors">
                  Symposium Timeline
                </a>
              </li>
              <li>
                <a
                  href="/DATAVERSE-RULEBOOK.pdf"
                  download="DATAVERSE-RULEBOOK.pdf"
                  className="text-emerald-400 hover:text-emerald-300 transition-colors font-bold"
                >
                  Download Rulebook PDF
                </a>
              </li>
            </ul>
          </div>

          {/* Important Contacts */}
          <div>
            <h4 className="font-avengers text-xl text-slate-200 tracking-wider mb-4">
              EMERGENCY COMMS
            </h4>
            <div className="space-y-2 text-xs font-tech text-slate-300">
              <div>
                <span className="text-slate-400 block text-[11px] uppercase">Head Convener:</span>
                <a href="tel:7305462733" className="text-emerald-400 font-bold hover:underline">
                  Godwin Sam J: 7305462733
                </a>
              </div>
              <div className="pt-2">
                <span className="text-slate-400 block text-[11px] uppercase">Classified Flagship Event:</span>
                <span className="text-slate-200">Silverster Jones: 8838484856</span>
              </div>
              <div className="pt-1">
                <span className="text-slate-400 block text-[11px] uppercase">Citadel Venue:</span>
                <span className="text-slate-200">Main Registration Desk, Ground Floor</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-tech text-slate-400">
          <p>© 2026 DATAVERSE Tech Symposium. All rights reserved by the Sovereign Council.</p>
          
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900 border border-emerald-500/30 text-emerald-300 hover:border-emerald-400 transition-colors"
          >
            <span>RETURN TO SUMMIT</span>
            <ArrowUp size={14} />
          </button>
        </div>

      </div>
    </footer>
  );
}
