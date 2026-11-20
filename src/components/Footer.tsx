import { ArrowUp } from "lucide-react";
import { sounds } from "@/src/utils/soundEffects";

export default function Footer(){
 const top=()=>{sounds.playClick();window.scrollTo({top:0,behavior:"smooth"});};
 return <footer className="relative z-10 border-t border-white/10 bg-[#050806] py-8 sm:py-10">
  <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 text-center sm:flex-row sm:px-8 sm:text-left">
   <span className="font-doom text-lg font-bold tracking-[.18em] text-white">DATAVERSE<span className="ml-1 text-emerald-400">2K26</span></span>
   <span className="text-xs text-slate-500">04 December 2026 · Technical Symposium · Loyola College, Chennai</span>
   <button type="button" onClick={top} className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3.5 py-2 text-xs font-semibold text-slate-300 transition hover:border-emerald-400/50 hover:text-emerald-300"><span>BACK TO TOP</span><ArrowUp size={14}/></button>
  </div>
 </footer>;
}
