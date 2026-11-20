"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, Volume2, VolumeX, Download } from "lucide-react";
import { sounds } from "@/src/utils/soundEffects";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [sound, setSound] = useState(true);
  const links = [{href:"#events",label:"Events"},{href:"#schedule",label:"Schedule"},{href:"#venue",label:"Venue"}];
  const toggleSound = () => { sounds.enabled = !sound; setSound(!sound); if (!sound) sounds.playClick(); };
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050806]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between gap-3 px-4 sm:px-8">
        <Link href="/" className="shrink-0 font-doom text-lg font-bold tracking-[.16em] text-white sm:text-xl">DATAVERSE<span className="ml-1 text-emerald-400">2K26</span></Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-[#8E9B97] md:flex">
          {links.map(link=><a key={link.href} href={link.href} className="whitespace-nowrap transition hover:text-emerald-300">{link.label}</a>)}
          <a href="/DATAVERSE-RULEBOOK.pdf" download className="inline-flex items-center gap-2 whitespace-nowrap transition hover:text-emerald-300"><Download size={14}/>Rulebook</a>
        </nav>
        <div className="hidden shrink-0 items-center gap-3 md:flex">
          <button type="button" onClick={toggleSound} aria-label={sound?"Mute sound":"Enable sound"} className="rounded-lg border border-white/15 p-2 text-slate-400 transition hover:border-emerald-400/50 hover:text-emerald-300">{sound?<Volume2 size={17}/>:<VolumeX size={17}/>}</button>
          <Link href="/register" onClick={()=>sounds.playClick()} className="rounded-lg bg-[#00ff66] px-5 py-2.5 text-xs font-bold tracking-wider text-[#050806] transition hover:bg-emerald-300">REGISTER NOW</Link>
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <button type="button" onClick={toggleSound} aria-label={sound?"Mute sound":"Enable sound"} className="p-2 text-slate-300">{sound?<Volume2 size={18}/>:<VolumeX size={18}/>}</button>
          <button type="button" onClick={()=>setOpen(v=>!v)} aria-label={open?"Close menu":"Open menu"} aria-expanded={open} className="p-2 text-slate-200">{open?<X size={22}/>:<Menu size={22}/>}</button>
        </div>
      </div>
      {open && <div className="border-t border-white/10 bg-[#050806] px-5 py-5 md:hidden">
        <nav className="flex flex-col gap-4">{links.map(link=><a key={link.href} href={link.href} onClick={()=>setOpen(false)} className="text-sm font-semibold uppercase tracking-wider text-slate-200 hover:text-emerald-300">{link.label}</a>)}
          <a href="/DATAVERSE-RULEBOOK.pdf" download onClick={()=>setOpen(false)} className="inline-flex items-center gap-2 text-sm text-emerald-300"><Download size={15}/>Download Rulebook</a>
          <Link href="/register" onClick={()=>setOpen(false)} className="mt-1 rounded-lg bg-[#00ff66] px-4 py-3 text-center text-sm font-bold text-black">REGISTER NOW</Link>
        </nav>
      </div>}
    </header>
  );
}
