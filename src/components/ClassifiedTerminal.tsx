"use client";

import React, { useState, useRef, useEffect } from "react";
import { Terminal } from "lucide-react";
import { sounds } from "@/src/utils/soundEffects";

interface CommandLog {
  command?: string;
  output: string;
  isError?: boolean;
}

const EVENT_LINES = [
  "1. AgentOps - AI Agent Hackathon (2-3 participants)",
  "2. Data Nova - Project Presentation (maximum 2)",
  "3. Intelliquest - Quiz (maximum 2)",
  "4. VisQuest - Data Visualisation (exactly 2)",
  "5. Pitch Storm - Shark Tank (2-3 participants)",
  "6. Dark Quest - Blindfold Clues (exactly 2; maximum 2 teams per college)",
  "7. Brand New Hunt - Treasure Hunt (exactly 2)",
  "8. Infinity Decode - Connections (exactly 2)",
];

export default function ClassifiedTerminal() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<CommandLog[]>([
    {
      output: "DATAVERSE EVENT CONSOLE v2.0 [PUBLIC INFORMATION]\nType 'help' for commands or 'events' to list all eight events.",
    },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = (event: React.FormEvent) => {
    event.preventDefault();
    const command = input.trim().toLowerCase();
    if (!command) return;

    sounds.playClick();
    let output = "";
    let isError = false;

    switch (command) {
      case "help":
        output = "AVAILABLE COMMANDS:\n- 'events' : List the eight official DATAVERSE events\n- 'date'   : Show event date, time and venue\n- 'rules'  : Show general participation requirements\n- 'doom'   : Hear the Sovereign Decree\n- 'clear'  : Clear the terminal";
        break;
      case "events":
        output = EVENT_LINES.join("\n");
        break;
      case "date":
        output = "DATAVERSE 2K26\nDate: 4 December 2026\nTime: 09:00 AM onwards\nVenue: Centenary Building, Loyola College, Chennai\nRegistration: Free";
        break;
      case "doom":
        output = "VICTOR VON DOOM: 'You stand in the citadel of genuine intellect. Mediocrity will find no shelter in DATAVERSE.'";
        break;
      case "rules":
        output = "GENERAL RULES:\n- Eligible disciplines: Computer Science, Computer Applications, Data Science, IT, Mathematics, Statistics and related disciplines.\n- One team per department/college per event; Dark Quest allows up to two teams per college.\n- Each participant may enter up to two events, subject to schedule conflicts.\n- Bring a valid College ID Card and Bonafide Certificate.\n- Follow event coordinators' instructions and report on time.\nRead the official rulebook for complete details.";
        break;
      case "clear":
        setHistory([]);
        setInput("");
        return;
      default:
        isError = true;
        output = "Command not recognized: '" + command + "'. Type 'help' for available commands.";
        break;
    }

    setHistory((previous) => [...previous, { command: input, output, isError }]);
    setInput("");
  };

  return (
    <section className="py-20 relative bg-[#04070a] border-t border-emerald-500/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 text-xs font-tech font-bold uppercase tracking-widest mb-3">
            <Terminal size={14}/>
            <span>Interactive Mainframe</span>
          </div>
          <h2 className="font-avengers text-4xl sm:text-5xl text-avengers-chrome italic tracking-wider">DATAVERSE EVENT CONSOLE</h2>
          <p className="font-tech text-xs sm:text-sm text-slate-400 mt-1">Explore the official event list, venue and participation rules.</p>
        </div>

        <div className="doom-card rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-[0_0_50px_rgba(0,0,0,0.9)] font-mono text-xs">
          <div className="px-4 py-3 bg-slate-950 border-b border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80"/>
              <span className="w-3 h-3 rounded-full bg-yellow-500/80"/>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80"/>
              <span className="ml-2 text-emerald-400 font-tech font-bold tracking-wider text-xs">DATAVERSE_PUBLIC_CONSOLE</span>
            </div>
            <span className="text-[10px] text-slate-500 font-tech">READ ONLY</span>
          </div>

          <div className="p-6 bg-black/90 min-h-[260px] max-h-[380px] overflow-y-auto space-y-4 text-emerald-400 leading-relaxed scrollbar-thin">
            {history.map((item, index) => (
              <div key={index} className="space-y-1">
                {item.command && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="text-emerald-500 font-bold">guest@dataverse:~$</span>
                    <span>{item.command}</span>
                  </div>
                )}
                <div className={"whitespace-pre-line pl-2 border-l border-emerald-500/30 " + (item.isError ? "text-red-400" : "text-emerald-300")}>
                  {item.output}
                </div>
              </div>
            ))}
            <div ref={bottomRef}/>
          </div>

          <form onSubmit={handleCommand} className="p-3 bg-slate-950/95 border-t border-emerald-500/30 flex items-center gap-2">
            <span className="text-emerald-400 font-bold pl-2">guest@dataverse:~$</span>
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="type 'help' or 'events'..."
              className="flex-1 bg-transparent text-emerald-300 outline-none font-mono text-xs placeholder-slate-600"
              autoComplete="off"
            />
            <button type="submit" className="px-3 py-1 rounded bg-emerald-500 text-black font-tech font-bold text-xs uppercase hover:bg-emerald-400">EXECUTE</button>
          </form>
        </div>
      </div>
    </section>
  );
}
