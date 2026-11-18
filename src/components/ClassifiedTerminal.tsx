"use client";

import React, { useState, useRef, useEffect } from "react";
import { Terminal, Shield, Zap, Sparkles } from "lucide-react";
import { sounds } from "@/src/utils/soundEffects";

interface CommandLog {
  command?: string;
  output: string;
  isError?: boolean;
}

export default function ClassifiedTerminal() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<CommandLog[]>([
    {
      output: "LATVERIA QUANTUM OS v4.0.2 [SECURITY LEVEL: SOVEREIGN]\nType 'help' for available directives or 'events' to list arenas.",
    },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    sounds.playClick();
    let reply = "";
    let isErr = false;

    switch (cmd) {
      case "help":
        reply = "AVAILABLE DIRECTIVES:\n- 'events' : Enumerate all 7 Multiverse Arenas\n- 'doom'   : Hear the Sovereign Decree\n- 'unlock' : Decrypt secret hint for Unknown Variable\n- 'rules'  : General symposium directives\n- 'clear'  : Purge terminal display buffer";
        break;
      case "events":
        reply = "1. Unknown Variable (Dr. Doom - Flagship)\n2. Data Nova (Cap - Project Defense)\n3. Pitch Storm (Iron Man - Shark Tank)\n4. VisQuest (Doctor Strange - Visual Analytics)\n5. Dataverse Quiz (Hulk - CS & Math)\n6. Dark Quest (Spidey - Blindfold)\n7. Brand New Hunt (Rocket - Treasure Hunt)";
        break;
      case "doom":
        reply = "VICTOR VON DOOM: 'You stand in the citadel of genuine intellect. Mediocrity will find no shelter in Dataverse.'";
        break;
      case "unlock":
        sounds.playVictory();
        reply = "CLASSIFIED HINT UNLOCKED:\n[PROTOCOL UNKNOWN VARIABLE]\n'The secret lies in Agentic AI coordination. Study low-code/no-code workflows, LangChain-style prompts, and rapid Python data wrangling. Be ready to engineer autonomous reasoning systems on the fly.'";
        break;
      case "rules":
        reply = "DIRECTIVES: College ID + Bonafide Certificate mandatory. 1 team per dept per college. Max 2 events per contender. Phones confiscated during competitive trials.";
        break;
      case "clear":
        setHistory([]);
        setInput("");
        return;
      default:
        isErr = true;
        reply = `Command not recognized: '${cmd}'. Type 'help' for permitted operations.`;
        break;
    }

    setHistory((prev) => [...prev, { command: input, output: reply, isError: isErr }]);
    setInput("");
  };

  return (
    <section className="py-20 relative bg-[#04070a] border-t border-emerald-500/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Terminal Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 text-xs font-tech font-bold uppercase tracking-widest mb-3">
            <Terminal size={14} />
            <span>Interactive Mainframe</span>
          </div>
          <h2 className="font-avengers text-4xl sm:text-5xl text-avengers-chrome italic tracking-wider">
            DOOM&apos;S CLASSIFIED TERMINAL
          </h2>
          <p className="font-tech text-xs sm:text-sm text-slate-400 mt-1">
            Execute terminal directives to inspect protocols or unlock confidential hints.
          </p>
        </div>

        {/* Terminal Window */}
        <div className="doom-card rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-[0_0_50px_rgba(0,0,0,0.9)] font-mono text-xs">
          
          {/* Top Bar */}
          <div className="px-4 py-3 bg-slate-950 border-b border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 text-emerald-400 font-tech font-bold tracking-wider text-xs">
                LATVERIA_CITADEL_ROOT_CLI
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-tech">PORT: 8080 • SECURE</span>
          </div>

          {/* Terminal Screen */}
          <div className="p-6 bg-black/90 min-h-[260px] max-h-[380px] overflow-y-auto space-y-4 text-emerald-400 leading-relaxed scrollbar-thin">
            {history.map((h, idx) => (
              <div key={idx} className="space-y-1">
                {h.command && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="text-emerald-500 font-bold">root@latveria:~#</span>
                    <span>{h.command}</span>
                  </div>
                )}
                <div
                  className={`whitespace-pre-line pl-2 border-l border-emerald-500/30 ${
                    h.isError ? "text-red-400" : "text-emerald-300"
                  }`}
                >
                  {h.output}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Prompt Input Form */}
          <form
            onSubmit={handleCommand}
            className="p-3 bg-slate-950/95 border-t border-emerald-500/30 flex items-center gap-2"
          >
            <span className="text-emerald-400 font-bold pl-2">root@latveria:~#</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="type 'help' or 'unlock'..."
              className="flex-1 bg-transparent text-emerald-300 outline-none font-mono text-xs placeholder-slate-600"
              autoFocus
            />
            <button
              type="submit"
              className="px-3 py-1 rounded bg-emerald-500 text-black font-tech font-bold text-xs uppercase hover:bg-emerald-400"
            >
              EXECUTE
            </button>
          </form>

        </div>

      </div>
    </section>
  );
}
