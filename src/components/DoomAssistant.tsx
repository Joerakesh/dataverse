"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, Sparkles, Terminal, ChevronUp } from "lucide-react";
import { SYMPOSIUM_EVENTS } from "@/src/data/events";
import { sounds } from "@/src/utils/soundEffects";

interface Message {
  sender: "doom" | "user";
  text: string;
}

export default function DoomAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "doom",
      text: "Greetings, operative. I am the Latverian Citadel AI. Inquire regarding arenas, rules, coordinators, or timings.",
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim()) return;

    sounds.playClick();
    const userMsg: Message = { sender: "user", text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput("");

    setTimeout(() => {
      sounds.playHover();
      const reply = generateDoomResponse(textToSend.toLowerCase());
      setMessages((prev) => [...prev, { sender: "doom", text: reply }]);
    }, 450);
  };

  const generateDoomResponse = (q: string): string => {
    if (q.includes("coordinator") || q.includes("contact") || q.includes("incharge") || q.includes("phone")) {
      return "General Fest Convener is Godwin Sam J (7305462733). For the Classified Event, contact Silverster Jones (8838484856). For Shark Tank, reach Joe Jerome (7904523973).";
    }
    if (q.includes("shark tank") || q.includes("pitch")) {
      return "Pitch Storm (Shark Tank) is 6 mins presentation + 2 mins Q&A. Teams of 2–3. Working prototypes, mobile apps, or software demos add substantial weight!";
    }
    if (q.includes("data nova") || q.includes("presentation") || q.includes("project")) {
      return "Data Nova is a 5-minute technical project defense (1 min setup, 3 mins presentation, 1 min Q&A). Max 2 members. Note: ALL datasets & models must run OFFLINE!";
    }
    if (q.includes("surprise") || q.includes("unknown variable")) {
      return "The Classified Surprise Event is governed directly by Dr. Doom. Problems span AI, Agent Workflows, and Prompt Engineering. Criteria are revealed strictly at kickoff.";
    }
    if (q.includes("rule") || q.includes("id card") || q.includes("bonafide")) {
      return "All participants must carry their original College ID Card and Bonafide Certificate. Only 1 team per department/college per event is permitted. Max 2 events per person.";
    }
    if (q.includes("treasure hunt") || q.includes("brand new hunt")) {
      return "Brand New Hunt features 3 rounds: Prelims (25m logic/puzzles), Visual Word Hunt (15m), and a Surprise Final (15m). Absolutely no phones or calculators allowed!";
    }
    if (q.includes("quiz")) {
      return "Dataverse Quiz spans Elimination, Data Bingo, and Grand Finals covering CS, Data Science, Statistics, and Mathematics. There is NO negative marking!";
    }
    if (q.includes("blindfold") || q.includes("dark quest")) {
      return "Dark Quest tests Spider-Sense intuition. One member is blindfolded while the other gives verbal clues to identify projected images without naming or spelling them.";
    }
    if (q.includes("timing") || q.includes("schedule")) {
      return "Reporting starts at 08:30 AM. Inauguration is at 09:30 AM, Round 1 begins at 10:30 AM, and the Grand Valedictory is at 04:00 PM.";
    }
    return "Your query has been logged into the Latverian mainframe. You may examine our 7 Arenas or reach Head Coordinator Godwin Sam J at 7305462733.";
  };

  const sampleChips = [
    "Who is the overall coordinator?",
    "Tell me about Shark Tank",
    "Is internet provided?",
    "Classified Surprise Event?",
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {!isOpen ? (
        <button
          onClick={() => {
            sounds.playDoomsdaySurge();
            setIsOpen(true);
          }}
          className="group relative flex items-center gap-3 px-5 py-3 rounded-full bg-slate-950/95 border-2 border-emerald-400 text-emerald-400 shadow-[0_0_25px_rgba(0,255,136,0.4)] hover:shadow-[0_0_35px_rgba(0,255,136,0.7)] transition-all hover:scale-105"
        >
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-emerald-400">
            <img src="/images/characters/doom.jpg" alt="Doom AI" className="w-full h-full object-cover" />
          </div>
          <span className="font-avengers text-lg italic tracking-wider text-slate-100 group-hover:text-emerald-400">
            DOOM COMMS AI
          </span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping absolute top-2 right-2" />
        </button>
      ) : (
        <div className="doom-card rounded-2xl w-[360px] sm:w-[400px] h-[520px] border-2 border-emerald-500/60 shadow-[0_0_40px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="p-4 bg-slate-950/90 border-b border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg overflow-hidden border border-emerald-400/50 flex-shrink-0">
                <img src="/images/characters/doom.jpg" alt="Doom AI" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-avengers text-xl text-slate-100 italic leading-none">
                  LATVERIA CITADEL AI
                </h4>
                <span className="text-[10px] font-tech text-emerald-400 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ONLINE • SYMPOSIUM INTEL
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                setIsOpen(false);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-900"
            >
              <X size={18} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 font-tech text-xs scrollbar-thin">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-xl leading-relaxed ${
                    m.sender === "user"
                      ? "bg-gradient-to-r from-emerald-600 to-green-600 text-black font-semibold rounded-tr-none shadow-[0_0_10px_rgba(0,255,136,0.3)]"
                      : "bg-slate-900/95 border border-emerald-500/25 text-slate-200 rounded-tl-none"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-3 py-2 bg-slate-950/70 border-t border-slate-900 flex gap-1.5 overflow-x-auto scrollbar-none">
            {sampleChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip)}
                className="flex-shrink-0 text-[10px] font-tech px-2.5 py-1 rounded-full bg-slate-900 border border-emerald-500/30 text-emerald-300 hover:border-emerald-400 whitespace-nowrap"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-slate-950 border-t border-emerald-500/20 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask Citadel AI anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs font-tech focus:border-emerald-500 focus:outline-none placeholder-slate-500"
            />
            <button
              onClick={() => handleSend()}
              className="p-2 rounded-lg bg-emerald-500 text-black hover:bg-emerald-400 transition-colors"
            >
              <Send size={15} />
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
