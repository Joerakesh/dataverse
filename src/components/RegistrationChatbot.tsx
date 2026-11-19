"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Bot, Check, Loader2, Pencil, Phone, Send, ShieldCheck, Sparkles, Users, X } from "lucide-react";

type CollegeSuggestion = { name: string; city: string; district: string; category: string };
type ParticipantProfile = { name: string; mobile: string; college: string; city: string; department: string };
type ChatMessage = { id: string; role: "assistant" | "user"; text: string };
type EventCard = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  teamSize: string;
  minTeam: number;
  maxTeam: number;
  rules: string[];
  image: string;
  registrationOpen: boolean;
};
type TeamMember = { name: string; mobile: string };

const QUESTIONS = [
  "Which college are you from?",
  "Which city is your college located in?",
  "Which department are you studying in?",
  "What is your full name?",
  "Please enter your 10-digit mobile number.",
];

const STORAGE_KEY = "dataverse-registration-draft-v1";
const COMMON_DEPARTMENTS = [
  "Computer Science", "Computer Applications", "Data Science", "Information Technology",
  "Mathematics", "Statistics", "Artificial Intelligence and Data Science",
  "Computer Science and Engineering", "Information Systems", "Software Engineering",
];

function normalizeTeamMobile(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits;
}

function makeMessage(role: ChatMessage["role"], text: string): ChatMessage {
  return { id: crypto.randomUUID(), role, text };
}

async function readJson(response: Response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Something went wrong. Please try again.");
  }
  return data;
}

export default function RegistrationChatbot() {
  const [mode, setMode] = useState<"welcome" | "chat" | "events" | "login-mobile" | "login-otp" | "lookup-mobile" | "lookup-otp" | "lookup-done">("welcome");
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<ParticipantProfile>({
    college: "", city: "", department: "", name: "", mobile: "",
  });
  const [profile, setProfile] = useState<ParticipantProfile | null>(null);
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [profileEditDraft, setProfileEditDraft] = useState<ParticipantProfile | null>(null);
  const [profileEditorBusy, setProfileEditorBusy] = useState(false);
  const [profileFieldsLocked, setProfileFieldsLocked] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome-message", role: "assistant", text: "Welcome to DATAVERSE 2K26! I’m your registration assistant. Let’s get you ready for the fest." },
  ]);
  const [answer, setAnswer] = useState("");
  const [intentText, setIntentText] = useState("");
  const [suggestions, setSuggestions] = useState<CollegeSuggestion[]>([]);
  const [selectedCollege, setSelectedCollege] = useState<CollegeSuggestion | null>(null);
  const [events, setEvents] = useState<EventCard[]>([]);
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [registeredEventSlugs, setRegisteredEventSlugs] = useState<string[]>([]);
  const [status, setStatus] = useState({ idLookupEnabled: false });
  const [selectedEvent, setSelectedEvent] = useState<EventCard | null>(null);
  const [showRulesFor, setShowRulesFor] = useState<EventCard | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [includeContact, setIncludeContact] = useState(true);
  const [lookupMobile, setLookupMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [revealedPersonId, setRevealedPersonId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const addMessage = useCallback((role: ChatMessage["role"], text: string) => {
    setMessages((current) => [...current, makeMessage(role, text)]);
  }, []);

  const appendAssistant = useCallback((text: string) => addMessage("assistant", text), [addMessage]);

  useEffect(() => {
    let active = true;
    const restore = async () => {
      let stored: { draft?: ParticipantProfile; step?: number; messages?: ChatMessage[] } | null = null;
      try {
        const raw = window.sessionStorage.getItem(STORAGE_KEY);
        if (raw) stored = JSON.parse(raw);
      } catch {
        window.sessionStorage.removeItem(STORAGE_KEY);
      }
      if (stored?.draft && active) {
        setDraft({ ...draft, ...stored.draft });
        setStep(Math.min(Math.max(stored.step ?? 0, 0), QUESTIONS.length - 1));
        if (stored.messages?.length) setMessages(stored.messages);
        if ((stored.step ?? 0) > 0) setMode("chat");
      }
      setHydrated(true);

      try {
        const [statusResponse, profileResponse] = await Promise.all([
          fetch("/api/registration/status", { cache: "no-store" }),
          fetch("/api/registration/profile", { cache: "no-store", credentials: "include" }),
        ]);
        const statusData = await readJson(statusResponse);
        if (!active) return;
        setRegistrationOpen(Boolean(statusData.registrationOpen));
        setStatus({ idLookupEnabled: Boolean(statusData.idLookupEnabled) });

        if (profileResponse.ok) {
          const profileData = await readJson(profileResponse);
          if (!active) return;
          const restoredProfile = profileData.participant as ParticipantProfile;
          setProfileFieldsLocked(Boolean(profileData.hasEventRegistrations));
          setProfile(restoredProfile);
          setDraft(restoredProfile);
          setMode("events");
          setMessages([
            makeMessage("assistant", "Welcome back, " + restoredProfile.name + "! Here is the participant profile currently registered with us. Would you like to review or edit any details?"),
          ]);
          window.sessionStorage.removeItem(STORAGE_KEY);
          const eventsResponse = await fetch("/api/registration/events", { cache: "no-store" });
          const eventsData = await readJson(eventsResponse);
          if (active) {
            setEvents(eventsData.events);
            setRegistrationOpen(Boolean(eventsData.registrationOpen));
            const myEventsResponse = await fetch("/api/registration/my-events", { cache: "no-store", credentials: "include" });
            if (myEventsResponse.ok) {
              const myEventsData = await readJson(myEventsResponse);
              setRegisteredEventSlugs(myEventsData.registeredEventSlugs ?? []);
            }
          }
        } else if (active) {
          setMessages((current) => {
            if (current.length > 1) return current;
            return [current[0], makeMessage("assistant", "Choose Start Registration to enter your details. I’ll ask one question at a time.")];
          });
        }
      } catch {
        if (active) setError("I couldn't connect to the registration service. Please refresh and try again.");
      }
    };
    void restore();
    return () => { active = false; };
    // Only run once when the page is opened.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated || profile) return;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ draft, step, messages }));
    } catch {
      // Registration continues even when browser session storage is unavailable.
    }
  }, [draft, step, messages, hydrated, profile]);

  useEffect(() => {
    const viewport = chatScrollRef.current;
    if (!viewport) return;
    viewport.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" });
  }, [messages, mode, events, suggestions]);

  useEffect(() => {
    if (mode !== "chat" || step !== 0 || answer.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    let cancelled = false;
    const timeout = window.setTimeout(async () => {
      try {
        const response = await fetch("/api/registration/colleges?q=" + encodeURIComponent(answer.trim()));
        const data = await response.json();
        if (!cancelled && data.success) setSuggestions(data.colleges ?? []);
      } catch {
        if (!cancelled) setSuggestions([]);
      }
    }, 220);
    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [answer, mode, step]);

  const startRegistration = async () => {
    setError("");
    setMode("chat");
    setStep(0);
    setAnswer("");
    setDraft({ college: "", city: "", department: "", name: "", mobile: "" });
    setSelectedCollege(null);
    setMessages((current) => [
      ...current,
      makeMessage("user", "Start registration"),
      makeMessage("assistant", QUESTIONS[0]),
    ]);
  };

  const startLogin = (message = "Login") => {
    setError("");
    setLookupMobile("");
    setOtp("");
    setMode("login-mobile");
    addMessage("user", message);
    appendAssistant("Welcome back! Enter the mobile number you used when registering for DATAVERSE. I’ll send a one-time verification code to that number.");
  };

  const startIdLookup = () => {
    setError("");
    setLookupMobile("");
    setOtp("");
    setMode("lookup-mobile");
    addMessage("user", "I already registered and need my unique ID.");
    appendAssistant("I can help with that. Enter the mobile number you used during registration. I’ll send a verification code before showing the ID.");
  };

  const loadEvents = async (participant: ParticipantProfile, hasExistingEventRegistrations = false, welcomeMessage?: string) => {
    setProfileFieldsLocked(hasExistingEventRegistrations);
    setProfile(participant);
    setDraft(participant);
    window.sessionStorage.removeItem(STORAGE_KEY);
    const [response, myEventsResponse] = await Promise.all([
      fetch("/api/registration/events", { cache: "no-store" }),
      fetch("/api/registration/my-events", { cache: "no-store", credentials: "include" }),
    ]);
    const data = await readJson(response);
    setEvents(data.events ?? []);
    setRegistrationOpen(Boolean(data.registrationOpen));
    if (myEventsResponse.ok) {
      const myEventsData = await readJson(myEventsResponse);
      setRegisteredEventSlugs(myEventsData.registeredEventSlugs ?? []);
    }
    setMode("events");
    appendAssistant(welcomeMessage ?? ("Thanks, " + participant.name + "! Your participant profile is saved. Please review the details shown below. You can edit them before choosing an event."));
  };

  const openProfileEditor = () => {
    if (!profile) return;
    setError("");
    setProfileEditDraft({ ...profile });
    setShowProfileEditor(true);
  };

  const saveProfile = async (event: FormEvent) => {
    event.preventDefault();
    if (!profileEditDraft || profileEditorBusy) return;
    setError("");

    setProfileEditorBusy(true);
    try {
      const response = await fetch("/api/registration/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: profileEditDraft.name,
          mobile: profileEditDraft.mobile,
          college: profileEditDraft.college,
          city: profileEditDraft.city,
          department: profileEditDraft.department,
        }),
      });
      const data = await readJson(response);
      const updatedProfile = data.participant as ParticipantProfile;
      setProfile(updatedProfile);
      setDraft(updatedProfile);
      setProfileEditDraft(updatedProfile);
      setShowProfileEditor(false);
      appendAssistant("Your participant profile has been updated successfully. You can continue with event registration.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update your profile.");
    } finally {
      setProfileEditorBusy(false);
    }
  };

  const submitAnswer = async (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setError("");
    const value = answer.trim();
    if (!value) {
      setError("Please enter an answer to continue.");
      return;
    }

    if (step === 4) {
      const digits = value.replace(/\D/g, "");
      const normalized = digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits.length === 11 && digits.startsWith("0") ? digits.slice(1) : digits;
      if (!/^\d{10}$/.test(normalized)) {
        setError("Please enter a valid 10-digit Indian mobile number.");
        return;
      }
      const finalDraft = { ...draft, mobile: normalized };
      setDraft(finalDraft);
      addMessage("user", value);
      setAnswer("");
      setBusy(true);
      try {
        const response = await fetch("/api/registration/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(finalDraft),
        });
        const data = await readJson(response);
        await loadEvents(data.participant, Boolean(data.hasEventRegistrations));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to save your details.");
        appendAssistant("I couldn't save those details yet. Please check the information and try again.");
      } finally {
        setBusy(false);
      }
      return;
    }

    addMessage("user", value);
    const updated = { ...draft };
    if (step === 0) {
      updated.college = value;
      if (selectedCollege && selectedCollege.name.toLowerCase() === value.toLowerCase()) {
        updated.city = selectedCollege.city;
      }
      setSelectedCollege(null);
    } else if (step === 1) updated.city = value;
    else if (step === 2) updated.department = value;
    else if (step === 3) updated.name = value;

    setDraft(updated);
    const nextStep = step + 1;
    setStep(nextStep);
    setAnswer(nextStep === 1 && updated.city ? updated.city : "");
    appendAssistant(QUESTIONS[nextStep]);
  };

  const chooseCollege = (college: CollegeSuggestion) => {
    setSelectedCollege(college);
    setAnswer(college.name);
    setSuggestions([]);
  };

  const openEventDialog = (event: EventCard) => {
    setError("");
    setSelectedEvent(event);
    setIncludeContact(true);
    const initial: TeamMember[] = Array.from({ length: event.minTeam }, (_, index) =>
      index === 0 && profile
        ? { name: profile.name, mobile: profile.mobile }
        : { name: "", mobile: "" },
    );
    setMembers(initial);
  };

  const toggleContact = (checked: boolean) => {
    setIncludeContact(checked);
    if (!profile || !selectedEvent) return;
    setMembers((current) => {
      const next = current.map((member) => ({ ...member }));
      if (checked) next[0] = { name: profile.name, mobile: profile.mobile };
      else next[0] = { name: "", mobile: "" };
      return next;
    });
  };

  const updateMember = (index: number, field: keyof TeamMember, value: string) => {
    setMembers((current) => current.map((member, i) => i === index ? { ...member, [field]: value } : member));
  };

  const addMember = () => {
    if (!selectedEvent || members.length >= selectedEvent.maxTeam) return;
    setMembers((current) => [...current, { name: "", mobile: "" }]);
  };

  const removeMember = (index: number) => {
    if (!selectedEvent || members.length <= selectedEvent.minTeam) return;
    setMembers((current) => current.filter((_, i) => i !== index));
    if (index === 0) setIncludeContact(false);
  };

  const submitEvent = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedEvent || busy) return;
    setError("");
    const cleaned = members.map((member) => ({
      name: member.name.trim(),
      mobile: normalizeTeamMobile(member.mobile),
    }));
    if (cleaned.some((member) => !member.name || !/^\d{10}$/.test(member.mobile))) {
      setError("Enter a name and valid 10-digit mobile number for every team member.");
      return;
    }
    if (new Set(cleaned.map((member) => member.mobile)).size !== cleaned.length) {
      setError("Each team member must have a different mobile number.");
      return;
    }

    setBusy(true);
    try {
      const response = await fetch("/api/registration/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ eventSlug: selectedEvent.slug, members: cleaned }),
      });
      const data = await readJson(response);
      addMessage("user", "Register my team for " + selectedEvent.name + ".");
      appendAssistant(data.message + " Your team has " + data.teamSize + " participant(s). You can choose another event if you are eligible.");
      setRegisteredEventSlugs((current) => current.includes(selectedEvent.slug) ? current : [...current, selectedEvent.slug]);
      setProfileFieldsLocked(true);
      setSelectedEvent(null);
      setMembers([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to register this team.");
    } finally {
      setBusy(false);
    }
  };

  const requestLoginOtp = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    const mobile = normalizeTeamMobile(lookupMobile);
    if (!/^\d{10}$/.test(mobile)) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    addMessage("user", "Use my registered mobile number ending in " + mobile.slice(-4) + ".");
    setBusy(true);
    try {
      const response = await fetch("/api/registration/login/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile }),
      });
      const data = await readJson(response);
      setLookupMobile(mobile);
      setMode("login-otp");
      appendAssistant(data.message + " Enter the six-digit code below. It expires in five minutes.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to start participant login.");
    } finally {
      setBusy(false);
    }
  };

  const verifyLoginOtp = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const response = await fetch("/api/registration/login/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ mobile: lookupMobile, otp }),
      });
      const data = await readJson(response);
      setOtp("");
      await loadEvents(
        data.participant as ParticipantProfile,
        Boolean(data.hasEventRegistrations),
        "You’re securely logged in on this device. Welcome back, " + data.participant.name + "! Your saved participant profile and event registrations are ready.",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to verify participant login.");
    } finally {
      setBusy(false);
    }
  };

  const requestOtp = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const response = await fetch("/api/registration/id-lookup/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: lookupMobile }),
      });
      const data = await readJson(response);
      setMode("lookup-otp");
      appendAssistant(data.message + " Enter the six-digit code below.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send the verification code.");
    } finally {
      setBusy(false);
    }
  };

  const verifyOtp = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const response = await fetch("/api/registration/id-lookup/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: lookupMobile, otp }),
      });
      const data = await readJson(response);
      setRevealedPersonId(data.participant.personId);
      setMode("lookup-done");
      addMessage("user", "Verify my mobile number.");
      appendAssistant("Your DATAVERSE person ID is " + data.participant.personId + ". Keep it safe for future reference.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to verify the code.");
    } finally {
      setBusy(false);
    }
  };

  const handleGeneralMessage = (event: FormEvent) => {
    event.preventDefault();
    const query = intentText.trim();
    if (!query) return;
    setIntentText("");
    const normalized = query.toLowerCase();
    if (/\b(log\s?in|sign[\s-]?in|switch account)\b/i.test(normalized)) {
      startLogin(query);
      return;
    }

    const asksForId = /\b(id|identity|registration number)\b/i.test(normalized)
      && /(unique|person|participant|my|need|want|show|find|get|retrieve)/i.test(normalized);

    if (asksForId && status.idLookupEnabled) {
      addMessage("user", query);
      setError("");
      setLookupMobile("");
      setOtp("");
      setMode("lookup-mobile");
      appendAssistant("I can help with that. Enter the mobile number you used during registration. I’ll send a verification code before showing your ID.");
      return;
    }

    addMessage("user", query);
    if (asksForId) {
      appendAssistant("Unique ID retrieval is not available yet. The organisers will enable it after the registration period. Please check back here later.");
      return;
    }

    if (mode === "welcome" && /(register|registration|join|participate)/i.test(normalized)) {
      startRegistration();
      return;
    }

    appendAssistant(mode === "events"
      ? "Your details are saved. Choose an event card to read its rules or begin team registration. You can also ask me for your unique ID after the lookup service is enabled."
      : "I can guide you through DATAVERSE registration and, once enabled, help retrieve your unique ID. Choose Start Registration to begin.");
  };

  const restartLookup = () => {
    setMode("welcome");
    setMessages((current) => [...current, makeMessage("assistant", "What would you like to do next?")]);
    setRevealedPersonId("");
  };

  return (
    <main className="fixed inset-0 z-40 flex h-[100dvh] w-full min-h-0 flex-col overflow-hidden bg-[#04070a] text-slate-100">
      <div className="absolute inset-0 bg-grid-pattern opacity-50 pointer-events-none" />
      <div className="absolute -top-48 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full bg-emerald-500/10 blur-[150px] pointer-events-none" />
      <header className="relative z-10 shrink-0 border-b border-emerald-500/20 bg-[#04070a]/95 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="inline-flex items-center gap-3 text-slate-300 hover:text-emerald-300 transition-colors">
            <ArrowLeft size={18}/>
            <span className="font-tech font-bold uppercase tracking-wider text-sm">Back to DATAVERSE</span>
          </Link>
          <div className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="DATAVERSE" width={150} height={44} className="h-8 w-auto object-contain"/>
            <span className="font-avengers text-xl text-emerald-400 italic">2K26</span>
          </div>
        </div>
      </header>

      <section className="relative z-10 mx-auto flex w-full max-w-6xl min-h-0 flex-1 flex-col px-2 py-2 sm:px-5 sm:py-4">
        <div className="doom-card flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-emerald-500/30 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="flex shrink-0 items-center gap-3 border-b border-emerald-500/20 bg-gradient-to-r from-emerald-950/90 to-slate-950/90 px-4 py-3 sm:px-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-400/40 grid place-items-center text-emerald-300">
                <Bot size={22}/>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-avengers text-xl tracking-wider text-slate-100">DATAVERSE BOT</div>
                <div className="text-[10px] font-tech uppercase tracking-[0.18em] text-emerald-400">Loyola College · SAGE</div>
              </div>
              <span className="text-[10px] font-tech font-bold tracking-wider text-emerald-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/> READY
              </span>
            </div>

            <div ref={chatScrollRef} className="flex min-h-0 flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-6 bg-[#050b0a]/90">
              {messages.map((message) => (
                <div key={message.id} className={"flex " + (message.role === "user" ? "justify-end" : "justify-start")}>
                  <div className={"max-w-[88%] sm:max-w-[80%] rounded-2xl px-4 py-3 text-sm font-tech leading-relaxed " +
                    (message.role === "user"
                      ? "bg-gradient-to-br from-emerald-500 to-green-700 text-black rounded-br-sm shadow-[0_6px_25px_rgba(0,255,136,0.12)]"
                      : "bg-slate-900/90 text-slate-200 border border-emerald-500/15 rounded-bl-sm")}>
                    {message.role === "assistant" && <div className="text-[9px] uppercase tracking-[0.2em] text-emerald-400 font-bold mb-1.5 flex items-center gap-1"><Bot size={11}/> Dataverse assistant</div>}
                    {message.text}
                  </div>
                </div>
              ))}

              {mode === "welcome" && (
                <div className="ml-1 flex flex-col sm:flex-row gap-2">
                  <button onClick={startRegistration} disabled={!registrationOpen} className="px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-black font-avengers tracking-wider text-lg flex items-center justify-center gap-2 hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed">
                    {registrationOpen ? "Start registration" : "Registration closed"} <ArrowRight size={16}/>
                  </button>
                  <button onClick={() => startLogin()} className="px-4 py-3 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-300 font-tech font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-emerald-950/40 transition">
                    <Phone size={15}/> Login
                  </button>
                  {status.idLookupEnabled && (
                    <button onClick={startIdLookup} className="px-4 py-3 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-300 font-tech font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-emerald-950/40 transition">
                      Retrieve my unique ID <ShieldCheck size={15}/>
                    </button>
                  )}
                </div>
              )}



              {mode === "chat" && (
                <div className="ml-1 text-[10px] text-emerald-400 font-tech uppercase tracking-widest">
                  Step {step + 1} of 5 · {["College", "City", "Department", "Name", "Mobile number"][step]}
                </div>
              )}

              {mode === "events" && (
                <div className="space-y-3">
                  {profile && (
                    <div className="rounded-2xl border border-emerald-400/35 bg-gradient-to-br from-emerald-950/60 via-slate-950 to-slate-950 p-4 sm:p-5">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-[10px] font-tech font-bold uppercase tracking-[0.2em] text-emerald-400">Current registered participant</div>
                          <h2 className="mt-1 font-avengers text-2xl sm:text-3xl text-slate-100">{profile.name}</h2>
                          <p className="mt-1 text-xs font-tech text-slate-400">{profile.college}</p>
                        </div>
                        <button type="button" onClick={openProfileEditor} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-2.5 text-xs font-tech font-bold uppercase tracking-wider text-emerald-200 hover:bg-emerald-500/20 transition-colors">
                          <Pencil size={14}/> Edit my details
                        </button>
                      </div>
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="rounded-lg border border-slate-800 bg-black/20 p-3">
                          <div className="text-[9px] font-tech uppercase tracking-widest text-slate-500">Mobile number</div>
                          <div className="mt-1 text-sm font-tech text-slate-100">{profile.mobile}</div>
                        </div>
                        <div className="rounded-lg border border-slate-800 bg-black/20 p-3">
                          <div className="text-[9px] font-tech uppercase tracking-widest text-slate-500">City</div>
                          <div className="mt-1 text-sm font-tech text-slate-100">{profile.city}</div>
                        </div>
                        <div className="rounded-lg border border-slate-800 bg-black/20 p-3 sm:col-span-2">
                          <div className="text-[9px] font-tech uppercase tracking-widest text-slate-500">Department</div>
                          <div className="mt-1 text-sm font-tech text-slate-100">{profile.department}</div>
                        </div>
                      </div>
                      <p className="mt-3 text-[11px] font-tech text-slate-400">Are these details correct? Review them now. You can edit your profile before continuing.</p>
                    </div>
                  )}
                  <div className={"rounded-xl px-4 py-3 border text-sm font-tech " + (registrationOpen ? "bg-emerald-950/30 border-emerald-500/25 text-emerald-100" : "bg-amber-950/30 border-amber-500/30 text-amber-100")}>
                    {registrationOpen ? "Registration is open. Choose an event below." : "Online registration is currently closed. You can still review the event details and rules."}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    {events.map((event) => (
                      <div key={event.slug} className="rounded-xl overflow-hidden border border-emerald-500/20 bg-slate-950/80 hover:border-emerald-400/50 transition-colors">
                        <div className="relative h-28 bg-slate-900">
                          <Image src={event.image} alt={event.name} fill className="object-cover opacity-80"/>
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"/>
                          <div className="absolute bottom-2 left-3 right-3 font-avengers text-2xl tracking-wider text-white">{event.name}</div>
                        </div>
                        <div className="p-3 space-y-2">
                          <div className="text-[10px] font-tech uppercase tracking-wider text-emerald-300">{event.tagline}</div>
                          <p className="text-xs font-tech text-slate-400 leading-relaxed line-clamp-3">{event.description}</p>
                          <div className="text-[10px] text-slate-300 flex items-center gap-1.5"><Users size={12} className="text-emerald-400"/>{event.teamSize}</div>
                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <button onClick={() => setShowRulesFor(event)} className="rounded-lg border border-slate-700 bg-slate-900 py-2 text-[10px] font-tech font-bold uppercase tracking-wider text-slate-300 hover:border-emerald-500/40">View rules</button>
                            <button disabled={!registrationOpen || !event.registrationOpen || registeredEventSlugs.includes(event.slug)} onClick={() => openEventDialog(event)} className="rounded-lg bg-gradient-to-r from-emerald-500 to-green-600 py-2 text-[10px] font-tech font-bold uppercase tracking-wider text-black disabled:opacity-40 disabled:cursor-not-allowed">{registeredEventSlugs.includes(event.slug) ? "Registered" : !registrationOpen || !event.registrationOpen ? "Registration closed" : "Choose event"}</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {events.length === 0 && <div className="text-sm text-slate-400">No events are available right now. Please contact the organisers.</div>}
                </div>
              )}

              {mode === "lookup-done" && (
                <div className="ml-1 rounded-xl border border-emerald-400/40 bg-emerald-950/30 p-4">
                  <div className="text-[10px] font-tech uppercase tracking-[0.2em] text-emerald-400 mb-2">Verified participant ID</div>
                  <div className="font-avengers text-3xl text-emerald-200 tracking-widest">{revealedPersonId}</div>
                  <p className="text-xs font-tech text-slate-400 mt-2">This is your individual DATAVERSE person ID. Event registration references are separate.</p>
                  <button onClick={restartLookup} className="mt-3 text-xs font-tech font-bold uppercase text-emerald-300 hover:text-emerald-200">Continue <ArrowRight size={12} className="inline"/></button>
                </div>
              )}

            </div>

            {mode === "chat" && (
              <form onSubmit={submitAnswer} className="shrink-0 border-t border-emerald-500/20 bg-slate-950 px-3 py-3 pb-[calc(env(safe-area-inset-bottom)+12px)] sm:px-5">
                {step === 0 && suggestions.length > 0 && (
                  <div className="mx-auto mb-2 w-full max-w-4xl rounded-xl border border-emerald-500/25 bg-[#07120e] overflow-hidden max-h-52 overflow-y-auto">
                    {suggestions.map((college) => (
                      <button type="button" key={college.name} onClick={() => chooseCollege(college)} className="w-full text-left px-3 py-2.5 hover:bg-emerald-950/50 border-b border-slate-800/70 last:border-0">
                        <div className="text-sm font-tech text-slate-100">{college.name}</div>
                        <div className="text-[10px] font-tech text-slate-500">{college.city}, {college.district} · {college.category}</div>
                      </button>
                    ))}
                  </div>
                )}
                {step === 2 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {COMMON_DEPARTMENTS.map((department) => (
                      <button key={department} type="button" onClick={() => setAnswer(department)} className="px-2.5 py-1 rounded-full border border-emerald-500/20 bg-emerald-950/20 text-[10px] font-tech text-emerald-200 hover:bg-emerald-950/50">{department}</button>
                    ))}
                  </div>
                )}
                {step === 0 && answer.trim().length >= 2 && (
                  <button type="button" onClick={() => { setSelectedCollege(null); setSuggestions([]); }} className="mx-auto mb-2 block w-full max-w-4xl text-[10px] font-tech text-emerald-300 underline underline-offset-2">My college is not listed — enter it manually</button>
                )}
                <div className="mx-auto flex w-full max-w-4xl items-center gap-2">
                  <input
                    value={answer}
                    onChange={(event) => setAnswer(event.target.value)}
                    type={step === 4 ? "tel" : "text"}
                    inputMode={step === 4 ? "tel" : "text"}
                    maxLength={step === 4 ? 14 : 180}
                    placeholder={step === 4 ? "10-digit mobile number" : "Type your answer..."}
                    className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-[#070d11] px-4 py-3 text-sm font-tech text-slate-100 placeholder:text-slate-600 outline-none focus:border-emerald-500"
                    disabled={busy}
                    autoComplete="off"
                    enterKeyHint="send"
                  />
                  <button type="submit" disabled={busy || !answer.trim()} className="h-11 w-12 shrink-0 grid place-items-center rounded-xl bg-emerald-500 text-black disabled:opacity-40 hover:bg-emerald-400 transition-colors">
                    {busy ? <Loader2 size={18} className="animate-spin"/> : <Send size={17}/>}
                  </button>
                </div>
                {error && <p className="mx-auto mt-2 block w-full max-w-4xl text-xs font-tech text-red-400">{error}</p>}
              </form>
            )}

            {mode === "lookup-mobile" && (
              <form onSubmit={requestOtp} className="p-3 sm:p-4 border-t border-emerald-500/20 bg-slate-950">
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-emerald-400"/>
                  <input value={lookupMobile} onChange={(event) => setLookupMobile(event.target.value)} type="tel" inputMode="tel" maxLength={14} placeholder="Registered 10-digit mobile number" className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-[#070d11] px-4 py-3 text-sm font-tech text-slate-100 outline-none focus:border-emerald-500"/>
                  <button type="submit" disabled={busy || !lookupMobile.trim()} className="h-11 px-4 rounded-xl bg-emerald-500 text-black font-tech font-bold text-xs uppercase disabled:opacity-40">{busy ? <Loader2 size={17} className="animate-spin"/> : "Send OTP"}</button>
                </div>
                {error && <p className="text-xs font-tech text-red-400 mt-2">{error}</p>}
              </form>
            )}

            {mode === "lookup-otp" && (
              <form onSubmit={verifyOtp} className="shrink-0 border-t border-emerald-500/20 bg-slate-950 px-3 py-3 sm:px-5">
                <div className="mx-auto flex w-full max-w-4xl items-center gap-2">
                  <ShieldCheck size={17} className="shrink-0 text-emerald-400"/>
                  <input value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))} type="text" inputMode="numeric" maxLength={6} placeholder="6-digit verification code" className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-[#070d11] px-4 py-3 text-sm font-tech tracking-[0.3em] text-slate-100 outline-none focus:border-emerald-500"/>
                  <button type="submit" disabled={busy || otp.length !== 6} className="h-11 shrink-0 rounded-xl bg-emerald-500 px-4 text-xs font-tech font-bold uppercase text-black disabled:opacity-40">{busy ? <Loader2 size={17} className="animate-spin"/> : "Verify"}</button>
                </div>
                {error && <p className="mx-auto mt-2 w-full max-w-4xl text-xs font-tech text-red-400">{error}</p>}
              </form>
            )}

            {mode === "login-mobile" && (
              <form onSubmit={requestLoginOtp} className="shrink-0 border-t border-emerald-500/20 bg-slate-950 px-3 py-3 pb-[calc(env(safe-area-inset-bottom)+12px)] sm:px-5">
                <div className="mx-auto flex w-full max-w-4xl items-center gap-2">
                  <Phone size={17} className="shrink-0 text-emerald-400"/>
                  <input value={lookupMobile} onChange={(event) => setLookupMobile(event.target.value)} type="tel" inputMode="tel" autoComplete="tel" maxLength={14} placeholder="Your registered 10-digit mobile number" className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-[#070d11] px-4 py-3 text-sm font-tech text-slate-100 outline-none focus:border-emerald-500" disabled={busy}/>
                  <button type="submit" disabled={busy || !lookupMobile.trim()} className="h-11 shrink-0 rounded-xl bg-emerald-500 px-4 text-xs font-tech font-bold uppercase text-black disabled:opacity-40">{busy ? <Loader2 size={17} className="animate-spin"/> : "Send code"}</button>
                </div>
                {error && <p className="mx-auto mt-2 w-full max-w-4xl text-xs font-tech text-red-400">{error}</p>}
              </form>
            )}

            {mode === "login-otp" && (
              <form onSubmit={verifyLoginOtp} className="shrink-0 border-t border-emerald-500/20 bg-slate-950 px-3 py-3 pb-[calc(env(safe-area-inset-bottom)+12px)] sm:px-5">
                <div className="mx-auto flex w-full max-w-4xl items-center gap-2">
                  <ShieldCheck size={17} className="shrink-0 text-emerald-400"/>
                  <input value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))} type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="6-digit login code" className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-[#070d11] px-4 py-3 text-sm font-tech tracking-[0.3em] text-slate-100 outline-none focus:border-emerald-500" disabled={busy}/>
                  <button type="submit" disabled={busy || otp.length !== 6} className="h-11 shrink-0 rounded-xl bg-emerald-500 px-4 text-xs font-tech font-bold uppercase text-black disabled:opacity-40">{busy ? <Loader2 size={17} className="animate-spin"/> : "Verify & login"}</button>
                </div>
                {error && <p className="mx-auto mt-2 w-full max-w-4xl text-xs font-tech text-red-400">{error}</p>}
              </form>
            )}

            {(mode === "welcome" || mode === "events") && (
              <form onSubmit={handleGeneralMessage} className="shrink-0 border-t border-emerald-500/20 bg-slate-950 px-3 py-3 pb-[calc(env(safe-area-inset-bottom)+12px)] sm:px-5">
                <div className="mx-auto flex w-full max-w-4xl items-center gap-2">
                  <input value={intentText} onChange={(event) => setIntentText(event.target.value)} placeholder="Message DATAVERSE… try “login” or ask a question" maxLength={160} className="min-w-0 flex-1 rounded-xl border border-emerald-500/25 bg-[#07100d] px-4 py-3 text-sm font-tech text-slate-100 placeholder:text-slate-600 outline-none focus:border-emerald-500"/>
                  <button type="submit" disabled={!intentText.trim()} className="h-11 w-11 shrink-0 grid place-items-center rounded-xl border border-emerald-500/30 bg-emerald-950/50 text-emerald-300 disabled:opacity-40" aria-label="Send message"><Send size={16}/></button>
                </div>
                {error && <p className="mx-auto mt-2 w-full max-w-4xl text-xs font-tech text-red-400">{error}</p>}
              </form>
            )}
          </div>


        </div>
      </section>

      {showProfileEditor && profileEditDraft && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
          <div className="doom-card relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-2xl border border-emerald-400/40 p-5 sm:p-7">
            <button type="button" onClick={() => { setShowProfileEditor(false); setError(""); }} className="absolute top-3 right-3 rounded-full p-2 text-slate-400 hover:text-white hover:bg-slate-800" aria-label="Close profile editor"><X size={19}/></button>
            <div className="text-[10px] uppercase tracking-[0.2em] text-emerald-400 font-tech font-bold">Participant details</div>
            <h2 className="font-avengers text-3xl sm:text-4xl text-avengers-chrome italic mt-1">Review your profile</h2>
            <p className="text-sm font-tech text-slate-400 mt-2">Check the information below and save any corrections.</p>
            <form onSubmit={saveProfile} className="mt-5 space-y-3">
              <label className="block space-y-1.5">
                <span className="text-[10px] font-tech font-bold uppercase tracking-wider text-slate-400">Full name</span>
                <input required minLength={2} maxLength={100} value={profileEditDraft.name} onChange={(event) => setProfileEditDraft((current) => current ? { ...current, name: event.target.value } : current)} className="w-full rounded-xl border border-slate-700 bg-[#060b0e] px-3 py-3 text-sm font-tech text-slate-100 outline-none focus:border-emerald-500"/>
              </label>
              <label className="block space-y-1.5">
                <span className="text-[10px] font-tech font-bold uppercase tracking-wider text-slate-400">Mobile number · Account identifier</span>
                <input value={profileEditDraft.mobile} disabled className="w-full rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-3 text-sm font-tech text-slate-500 cursor-not-allowed"/>
              </label>
              <label className="block space-y-1.5">
                <span className="text-[10px] font-tech font-bold uppercase tracking-wider text-slate-400">College</span>
                <input required minLength={2} maxLength={180} value={profileEditDraft.college} disabled={profileFieldsLocked || registeredEventSlugs.length > 0} onChange={(event) => setProfileEditDraft((current) => current ? { ...current, college: event.target.value } : current)} className="w-full rounded-xl border border-slate-700 bg-[#060b0e] px-3 py-3 text-sm font-tech text-slate-100 outline-none focus:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"/>
              </label>
              <label className="block space-y-1.5">
                <span className="text-[10px] font-tech font-bold uppercase tracking-wider text-slate-400">City</span>
                <input required minLength={2} maxLength={100} value={profileEditDraft.city} disabled={profileFieldsLocked || registeredEventSlugs.length > 0} onChange={(event) => setProfileEditDraft((current) => current ? { ...current, city: event.target.value } : current)} className="w-full rounded-xl border border-slate-700 bg-[#060b0e] px-3 py-3 text-sm font-tech text-slate-100 outline-none focus:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"/>
              </label>
              <label className="block space-y-1.5">
                <span className="text-[10px] font-tech font-bold uppercase tracking-wider text-slate-400">Department</span>
                <input required minLength={2} maxLength={120} value={profileEditDraft.department} disabled={profileFieldsLocked || registeredEventSlugs.length > 0} onChange={(event) => setProfileEditDraft((current) => current ? { ...current, department: event.target.value } : current)} className="w-full rounded-xl border border-slate-700 bg-[#060b0e] px-3 py-3 text-sm font-tech text-slate-100 outline-none focus:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"/>
              </label>
              {(profileFieldsLocked || registeredEventSlugs.length > 0) && (
                <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 text-xs font-tech leading-relaxed text-amber-200">
                  You have already registered for an event. College, city and department are locked because they are part of the saved event registration. Your name can still be corrected. For other corrections, contact the organisers.
                </div>
              )}
              {error && <div className="rounded-lg border border-red-500/30 bg-red-950/30 px-3 py-2 text-xs font-tech text-red-300">{error}</div>}
              <div className="flex gap-2 pt-2">
                <button type="button" disabled={profileEditorBusy} onClick={() => { setShowProfileEditor(false); setError(""); }} className="flex-1 rounded-xl border border-slate-700 bg-slate-900 py-3 text-xs font-tech font-bold uppercase text-slate-300">Cancel</button>
                <button type="submit" disabled={profileEditorBusy} className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 py-3 text-xs font-tech font-bold uppercase tracking-wider text-black disabled:opacity-50">{profileEditorBusy ? "Saving..." : "Save changes"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
          <div className="doom-card relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl border border-emerald-400/40 p-5 sm:p-7">
            <button type="button" onClick={() => { setSelectedEvent(null); setError(""); }} className="absolute top-3 right-3 rounded-full p-2 text-slate-400 hover:text-white hover:bg-slate-800"><X size={19}/></button>
            <div className="text-[10px] uppercase tracking-[0.2em] text-emerald-400 font-tech font-bold">Team registration</div>
            <h2 className="font-avengers text-3xl sm:text-4xl text-avengers-chrome italic mt-1">{selectedEvent.name}</h2>
            <p className="text-sm font-tech text-slate-400 mt-1">Team size: {selectedEvent.teamSize}</p>
            <form onSubmit={submitEvent} className="mt-5 space-y-4">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <div className="text-xs font-tech font-bold text-slate-200 mb-2">How many students are in your team?</div>
                <div className="flex gap-2">
                  {Array.from({ length: selectedEvent.maxTeam - selectedEvent.minTeam + 1 }, (_, index) => selectedEvent.minTeam + index).map((size) => (
                    <button key={size} type="button" onClick={() => setMembers((current) => size < current.length ? current.slice(0, size) : [...current, ...Array.from({ length: size - current.length }, () => ({ name: "", mobile: "" }))])} className={"flex-1 rounded-lg border py-2 text-sm font-tech font-bold transition " + (members.length === size ? "border-emerald-400 bg-emerald-500 text-black" : "border-slate-700 bg-slate-900 text-slate-300 hover:border-emerald-500/50")}>
                      {size}
                    </button>
                  ))}
                </div>
                <div className="text-[10px] font-tech text-slate-500 mt-2">Allowed team size: {selectedEvent.teamSize}</div>
              </div>
              <label className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-3">
                <input type="checkbox" checked={includeContact} onChange={(event) => toggleContact(event.target.checked)} className="mt-1 accent-emerald-500"/>
                <span><span className="block text-sm font-tech font-bold text-slate-100">Include me as a team member</span><span className="block text-xs font-tech text-slate-500 mt-0.5">Your registered name and mobile number will be added as the first participant.</span></span>
              </label>
              <div className="space-y-3">
                {members.map((member, index) => (
                  <div key={index} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase tracking-widest font-tech font-bold text-emerald-300">Student {index + 1}{includeContact && index === 0 ? " · You" : ""}</span>
                      {members.length > selectedEvent.minTeam && !(includeContact && index === 0) && <button type="button" onClick={() => removeMember(index)} className="text-slate-500 hover:text-red-400 text-xs">Remove</button>}
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2">
                      <input value={member.name} onChange={(event) => updateMember(index, "name", event.target.value)} disabled={includeContact && index === 0} placeholder="Student full name" className="w-full rounded-lg border border-slate-700 bg-[#060b0e] px-3 py-2.5 text-sm font-tech text-slate-100 disabled:opacity-60"/>
                      <input value={member.mobile} onChange={(event) => updateMember(index, "mobile", event.target.value)} disabled={includeContact && index === 0} placeholder="10-digit mobile number" type="tel" inputMode="tel" maxLength={14} className="w-full rounded-lg border border-slate-700 bg-[#060b0e] px-3 py-2.5 text-sm font-tech text-slate-100 disabled:opacity-60"/>
                    </div>
                  </div>
                ))}
              </div>
              {members.length < selectedEvent.maxTeam && <button type="button" onClick={addMember} className="text-xs font-tech font-bold uppercase tracking-wider text-emerald-300 hover:text-emerald-200 flex items-center gap-1"><Users size={14}/> Add another student</button>}
              <div className="text-[11px] font-tech text-slate-500">Every team member is assigned their own private person ID. The event reference is stored separately and is not shown here.</div>
              {error && <div className="rounded-lg border border-red-500/30 bg-red-950/30 px-3 py-2 text-xs font-tech text-red-300">{error}</div>}
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => { setSelectedEvent(null); setError(""); }} className="flex-1 rounded-xl border border-slate-700 bg-slate-900 py-3 text-xs font-tech font-bold uppercase text-slate-300">Cancel</button>
                <button type="submit" disabled={busy} className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 py-3 text-xs font-tech font-bold uppercase tracking-wider text-black disabled:opacity-50">{busy ? "Submitting..." : "Confirm registration"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showRulesFor && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
          <div className="doom-card relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-emerald-400/40 p-5 sm:p-7">
            <button type="button" onClick={() => setShowRulesFor(null)} className="absolute top-3 right-3 rounded-full p-2 text-slate-400 hover:text-white hover:bg-slate-800"><X size={19}/></button>
            <div className="text-[10px] uppercase tracking-[0.2em] text-emerald-400 font-tech font-bold">Event rules</div>
            <h2 className="font-avengers text-3xl text-avengers-chrome italic mt-1">{showRulesFor.name}</h2>
            <p className="text-sm font-tech text-slate-400 mt-1">{showRulesFor.teamSize}</p>
            <ul className="mt-5 space-y-3">
              {showRulesFor.rules.map((rule, index) => <li key={index} className="flex gap-2 text-sm font-tech text-slate-300"><Check size={15} className="text-emerald-400 mt-0.5 shrink-0"/><span>{rule}</span></li>)}
            </ul>
            <button onClick={() => setShowRulesFor(null)} className="mt-6 w-full rounded-xl border border-emerald-500/30 bg-slate-900 py-3 text-xs font-tech font-bold uppercase tracking-wider text-emerald-300">Close rules</button>
          </div>
        </div>
      )}
    </main>
  );
}
