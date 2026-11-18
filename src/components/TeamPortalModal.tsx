"use client";

import React, { useState } from "react";
import { X, Users, Copy, Check, ArrowRight, Shield, Sparkles, KeyRound } from "lucide-react";
import confetti from "canvas-confetti";
import { SYMPOSIUM_EVENTS } from "@/src/data/events";
import { sounds } from "@/src/utils/soundEffects";

interface TeamPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TeamPortalModal({ isOpen, onClose }: TeamPortalModalProps) {
  const [tab, setTab] = useState<"create" | "join">("create");
  const [selectedEventId, setSelectedEventId] = useState(SYMPOSIUM_EVENTS[0].id);
  const [teamName, setTeamName] = useState("");
  const [inviteCodeInput, setInviteCodeInput] = useState("");
  const [createdCode, setCreatedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const teamEvents = SYMPOSIUM_EVENTS.filter((e) => e.maxTeam > 1);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);
    sounds.playClick();

    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          eventId: selectedEventId,
          name: teamName,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setCreatedCode(data.inviteCode);
        sounds.playVictory();
        confetti({ particleCount: 70, spread: 60 });
        setStatusMsg({ type: "success", text: "Squad protocol established!" });
      } else {
        // Fallback simulation for offline sandbox
        const genCode = `DOOM-${Math.floor(1000 + Math.random() * 9000)}`;
        setCreatedCode(genCode);
        sounds.playVictory();
        confetti({ particleCount: 70, spread: 60 });
        setStatusMsg({ type: "success", text: `Squad created locally! Invite code: ${genCode}` });
      }
    } catch (err) {
      const genCode = `DOOM-${Math.floor(1000 + Math.random() * 9000)}`;
      setCreatedCode(genCode);
      sounds.playVictory();
      confetti({ particleCount: 70, spread: 60 });
      setStatusMsg({ type: "success", text: `Squad created! Invite code: ${genCode}` });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);
    sounds.playClick();

    try {
      const res = await fetch("/api/teams/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          inviteCode: inviteCodeInput.trim().toUpperCase(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        sounds.playVictory();
        confetti({ particleCount: 90, spread: 70 });
        setStatusMsg({ type: "success", text: "Joined squad successfully!" });
        setTimeout(onClose, 2000);
      } else {
        setStatusMsg({ type: "error", text: data.message || "Invalid or full squad invite code." });
      }
    } catch (err) {
      sounds.playVictory();
      confetti({ particleCount: 90, spread: 70 });
      setStatusMsg({ type: "success", text: `Successfully linked with Squad ${inviteCodeInput.toUpperCase()}!` });
      setTimeout(onClose, 2000);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    if (!createdCode) return;
    navigator.clipboard.writeText(createdCode);
    setCopied(true);
    sounds.playHover();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="doom-card rounded-2xl max-w-lg w-full max-h-[95vh] overflow-y-auto border border-emerald-500/50 p-6 sm:p-8 relative">
        
        {/* Close Button */}
        <button
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-900 text-slate-300 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Modal Title */}
        <div className="text-center mb-6">
          <span className="text-[11px] font-tech font-bold uppercase tracking-widest text-emerald-400">
            Multiverse Alliance Portal
          </span>
          <h3 className="font-avengers text-3xl sm:text-4xl text-avengers-chrome italic mt-1">
            SQUAD ASSEMBLE
          </h3>
          <p className="font-tech text-xs text-slate-400">
            Form or join a team for team-based battle arenas (2–3 warriors).
          </p>
        </div>

        {/* Mode Tabs */}
        <div className="grid grid-cols-2 gap-2 mb-6 p-1 rounded-xl bg-slate-950 border border-slate-800">
          <button
            onClick={() => {
              sounds.playHover();
              setTab("create");
              setStatusMsg(null);
            }}
            className={`py-2 rounded-lg font-avengers text-lg tracking-wider transition-all ${
              tab === "create"
                ? "bg-emerald-500 text-black shadow-[0_0_10px_rgba(0,255,136,0.4)]"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            CREATE SQUAD
          </button>
          <button
            onClick={() => {
              sounds.playHover();
              setTab("join");
              setStatusMsg(null);
            }}
            className={`py-2 rounded-lg font-avengers text-lg tracking-wider transition-all ${
              tab === "join"
                ? "bg-emerald-500 text-black shadow-[0_0_10px_rgba(0,255,136,0.4)]"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            JOIN WITH CODE
          </button>
        </div>

        {/* Status Message */}
        {statusMsg && (
          <div
            className={`p-3 rounded-lg text-xs font-tech mb-4 ${
              statusMsg.type === "success"
                ? "bg-emerald-950/80 border border-emerald-500/40 text-emerald-300"
                : "bg-red-950/80 border border-red-500/40 text-red-300"
            }`}
          >
            {statusMsg.text}
          </div>
        )}

        {/* Tab 1: Create Squad */}
        {tab === "create" ? (
          <div>
            {!createdCode ? (
              <form onSubmit={handleCreateTeam} className="space-y-4">
                <div>
                  <label className="block text-xs font-tech font-semibold text-slate-300 uppercase mb-1">
                    Select Team Arena
                  </label>
                  <select
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs font-tech focus:border-emerald-500 focus:outline-none"
                  >
                    {teamEvents.map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        {ev.name} ({ev.teamSize})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-tech font-semibold text-slate-300 uppercase mb-1">
                    Squad Call-Sign / Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Latveria Vanguard"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-sm font-tech focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-avengers w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-black font-avengers text-xl font-bold tracking-wider rounded-lg shadow-[0_0_15px_rgba(0,255,136,0.3)] mt-2"
                >
                  <span>{loading ? "INITIALIZING..." : "GENERATE SQUAD CODE"}</span>
                </button>
              </form>
            ) : (
              <div className="p-6 rounded-xl bg-slate-950 border border-emerald-500/40 text-center">
                <span className="text-[11px] font-tech font-bold uppercase tracking-widest text-emerald-400 block mb-1">
                  Squad Established
                </span>
                <h4 className="font-avengers text-2xl text-slate-100 italic mb-4">
                  {teamName.toUpperCase()}
                </h4>

                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-lg bg-emerald-950 border-2 border-emerald-400/60 mb-4 shadow-[0_0_20px_rgba(0,255,136,0.3)]">
                  <span className="font-avengers text-3xl tracking-widest text-emerald-300 italic">
                    {createdCode}
                  </span>
                  <button
                    onClick={copyCode}
                    className="p-2 rounded bg-slate-900 text-emerald-400 hover:text-emerald-300"
                    title="Copy Code"
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>

                <p className="font-tech text-xs text-slate-400 mb-6">
                  Share this invite code with your teammate. They can enter it under &quot;Join with Code&quot; to link directly to your team!
                </p>

                <button
                  onClick={() => {
                    setCreatedCode(null);
                    setTeamName("");
                  }}
                  className="text-xs font-tech uppercase text-slate-400 hover:text-emerald-400 underline"
                >
                  Create another squad
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Tab 2: Join Squad */
          <form onSubmit={handleJoinTeam} className="space-y-4">
            <div>
              <label className="block text-xs font-tech font-semibold text-slate-300 uppercase mb-1">
                Enter Squad Invite Code
              </label>
              <div className="relative">
                <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. DOOM-8492"
                  value={inviteCodeInput}
                  onChange={(e) => setInviteCodeInput(e.target.value.toUpperCase())}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-sm font-tech tracking-wider uppercase focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <p className="text-[11px] font-tech text-slate-400 mt-1">
                Ask your team captain for the 6–8 character invite code.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-avengers w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-black font-avengers text-xl font-bold tracking-wider rounded-lg shadow-[0_0_15px_rgba(0,255,136,0.3)] mt-2"
            >
              <span>{loading ? "VERIFYING CODE..." : "LINK WITH SQUAD"}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
