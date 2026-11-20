"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw, LogOut, Search, LoaderCircle, Users, MessageSquare, CalendarDays, ShieldCheck, CheckCircle2 } from "lucide-react";

type Section = "events" | "registrations" | "users" | "coordinators" | "conversations";
type AdminInfo = { name: string; email: string; role: string; permissions: string[] };
type EventItem = { id: string; slug: string; name: string; tagline?: string; category?: string; teamSize?: string; registrationOpen: boolean };
type RegistrationItem = { id: string; reference: string; eventSlug: string; eventName: string; college: string; city: string; department: string; teamSize: number; status: string; createdAt: string; members: { id: string; name: string; mobile: string; email: string; registerNumber?: string }[] };
type UserItem = { id: string; personId: string; name: string; email: string; mobile: string; college: string; city: string; department: string; registerNumber: string; eventSlugs: string[] };
type CoordinatorItem = { _id: string; name: string; email: string; isActive: boolean; assignedEventIds: ({ _id: string; name: string; slug: string } | string)[] };
type ConversationItem = { id: string; conversationId: string; participant: { name: string; email: string; mobile: string; college: string; registerNumber: string } | null; messageCount: number; preview: string; updatedAt: string };
type MessageItem = { id: string; role: "assistant" | "user"; text: string };
type Pagination = { page: number; limit: number; total: number; totalPages: number };

const SECTION_LABELS: Record<Section, string> = {
  events: "Events",
  registrations: "Registrations",
  users: "Users",
  coordinators: "Coordinators",
  conversations: "Conversations",
};

async function readJson(response: Response) {
  const data = await response.json().catch(() => ({}));
  if (response.status === 401) throw new Error("SESSION_EXPIRED");
  if (!response.ok || !data.success) throw new Error(data.message || "Request failed.");
  return data;
}

function can(admin: AdminInfo, permission: string) {
  return admin.role === "superadmin" || admin.permissions.includes("*") || admin.permissions.includes(permission);
}

export default function AdminSection({ admin, section }: { admin: AdminInfo; section: Section }) {
  const router = useRouter();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [registrations, setRegistrations] = useState<RegistrationItem[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [coordinators, setCoordinators] = useState<CoordinatorItem[]>([]);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<{ participant: ConversationItem["participant"]; messages: MessageItem[] } | null>(null);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 30, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);

  const signOut = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" }).catch(() => undefined);
    router.replace("/admin/login");
    router.refresh();
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      if (section === "events") {
        const data = await readJson(await fetch("/api/admin/events", { cache: "no-store", credentials: "include" }));
        setEvents(data.events ?? []);
      } else if (section === "registrations") {
        const params = new URLSearchParams({ page: String(page), limit: "100", search: query });
        const data = await readJson(await fetch("/api/admin/registrations?" + params, { cache: "no-store", credentials: "include" }));
        setRegistrations(data.registrations ?? []);
        setPagination(data.pagination);
      } else if (section === "users") {
        const params = new URLSearchParams({ page: String(page), limit: "100", search: query });
        const data = await readJson(await fetch("/api/admin/users?" + params, { cache: "no-store", credentials: "include" }));
        setUsers(data.users ?? []);
        setPagination(data.pagination);
      } else if (section === "coordinators") {
        const [coordinatorData, eventData] = await Promise.all([
          readJson(await fetch("/api/admin/coordinators", { cache: "no-store", credentials: "include" })),
          readJson(await fetch("/api/admin/events", { cache: "no-store", credentials: "include" })),
        ]);
        setCoordinators(coordinatorData.coordinators ?? []);
        setEvents(eventData.events ?? []);
      } else {
        const data = await readJson(await fetch("/api/admin/conversations?page=" + page + "&limit=30", { cache: "no-store", credentials: "include" }));
        setConversations(data.conversations ?? []);
        setPagination(data.pagination);
      }
    } catch (caught) {
      if (caught instanceof Error && caught.message === "SESSION_EXPIRED") {
        router.replace("/admin/login");
        return;
      }
      setError(caught instanceof Error ? caught.message : "Unable to load this section.");
    } finally {
      setLoading(false);
    }
  }, [section, query, page, router]);

  useEffect(() => { setPage(1); setQuery(""); setSearch(""); }, [section]);
  useEffect(() => { void load(); }, [load]);

  const toggleEvent = async (event: EventItem) => {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      await readJson(await fetch("/api/admin/events/" + event.id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ registrationOpen: !event.registrationOpen }),
      }));
      setEvents((items) => items.map((item) => item.id === event.id ? { ...item, registrationOpen: !item.registrationOpen } : item));
      setNotice(event.name + " registration " + (!event.registrationOpen ? "opened." : "closed."));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to update event.");
    } finally {
      setSaving(false);
    }
  };

  const createCoordinator = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim() || form.password.length < 8 || selectedEventIds.length === 0) return;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const data = await readJson(await fetch("/api/admin/coordinators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...form, eventIds: selectedEventIds }),
      }));
      setNotice(data.message || "Coordinator account created.");
      setForm({ name: "", email: "", password: "" });
      setSelectedEventIds([]);
      await load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to create coordinator.");
    } finally {
      setSaving(false);
    }
  };

  const openConversation = async (id: string) => {
    setError("");
    try {
      const data = await readJson(await fetch("/api/admin/conversations/" + id, { cache: "no-store", credentials: "include" }));
      setSelectedConversation({ participant: data.conversation.participant, messages: data.conversation.messages ?? [] });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to load conversation.");
    }
  };

  const allowedLinks: { key: Section; href: string; permission: string }[] = [
    { key: "events", href: "/admin/manage/events", permission: "events:manage" },
    { key: "registrations", href: "/admin/manage/registrations", permission: "registrations:view" },
    { key: "users", href: "/admin/manage/users", permission: "users:view" },
    { key: "coordinators", href: "/admin/manage/coordinators", permission: "coordinators:manage" },
    { key: "conversations", href: "/admin/manage/conversations", permission: "conversations:view" },
  ];

  return (
    <main className="min-h-screen bg-[#05090c] text-slate-100">
      <header className="border-b border-emerald-500/20 bg-[#05090c]/95">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div>
            <div className="text-[10px] font-tech uppercase tracking-[.24em] text-emerald-400">DATAVERSE 2K26 · STAFF CONSOLE</div>
            <h1 className="mt-1 font-avengers text-3xl tracking-wider italic sm:text-4xl">{SECTION_LABELS[section].toUpperCase()}</h1>
            <p className="mt-1 text-[10px] font-tech uppercase tracking-wider text-slate-500">{admin.name} · {admin.role.replaceAll("_", " ")}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/admin" className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-xs font-tech font-bold uppercase text-slate-300 hover:border-emerald-500/40"><ArrowLeft size={14}/> Dashboard</Link>
            <button type="button" onClick={() => void load()} disabled={loading} className="rounded-lg border border-slate-700 bg-slate-900 p-2.5 text-slate-300 hover:border-emerald-500/50 disabled:opacity-50" aria-label="Refresh"><RefreshCw size={16}/></button>
            <button type="button" onClick={signOut} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-xs font-tech font-bold uppercase text-slate-300 hover:border-red-500/40"><LogOut size={14}/><span className="hidden sm:inline">Sign out</span></button>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6 sm:py-7">
        <nav className="flex flex-wrap gap-2">
          {allowedLinks.filter((item) => can(admin, item.permission)).map((item) => (
            <Link key={item.key} href={item.href} className={"rounded-lg border px-3 py-2 text-[10px] font-tech font-bold uppercase tracking-wider " + (item.key === section ? "border-emerald-400/50 bg-emerald-950/40 text-emerald-200" : "border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-100")}>{item.key}</Link>
          ))}
        </nav>
        {error && <div role="alert" className="rounded-xl border border-red-500/30 bg-red-950/30 px-4 py-3 text-sm font-tech text-red-300">{error}</div>}
        {notice && <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/30 px-4 py-3 text-sm font-tech text-emerald-200"><CheckCircle2 size={16}/>{notice}</div>}
        {loading ? <div className="rounded-xl border border-slate-800 bg-[#091116] p-10 text-center text-sm font-tech text-slate-500"><LoaderCircle className="mr-2 inline animate-spin" size={18}/>Loading {SECTION_LABELS[section].toLowerCase()}…</div> : null}

        {!loading && section === "events" && (
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {events.map((event) => <article key={event.id} className="rounded-xl border border-slate-800 bg-[#091116] p-4">
              <div className="text-[9px] font-tech uppercase tracking-widest text-emerald-400">{event.category ?? "Event"}</div>
              <h2 className="mt-1 font-avengers text-xl text-slate-100">{event.name}</h2>
              <p className="mt-1 text-xs font-tech text-slate-500">{event.tagline ?? event.teamSize ?? event.slug}</p>
              <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-3">
                <span className="text-[10px] font-tech uppercase text-slate-400">{event.registrationOpen ? "Registration open" : "Registration closed"}</span>
                <button type="button" disabled={saving || !event.id} onClick={() => void toggleEvent(event)} className="rounded-lg border border-emerald-500/30 px-3 py-2 text-[10px] font-tech font-bold uppercase text-emerald-300 disabled:opacity-40">Toggle</button>
              </div>
            </article>)}
            {events.length === 0 && <p className="text-sm font-tech text-slate-500">No event records found.</p>}
          </section>
        )}

        {!loading && section === "registrations" && (
          <section className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <div className="relative min-w-[220px] flex-1"><Search size={15} className="absolute left-3 top-3 text-slate-500"/><input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { setPage(1); setQuery(search); } }} placeholder="Search event, college, team, roll number…" className="w-full rounded-lg border border-slate-800 bg-[#091116] py-2.5 pl-9 pr-3 text-xs font-tech text-slate-100 outline-none focus:border-emerald-500"/></div>
              <button type="button" onClick={() => { setPage(1); setQuery(search); }} className="rounded-lg border border-emerald-500/30 px-4 py-2.5 text-xs font-tech font-bold uppercase text-emerald-300">Search</button>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#091116]">
              <table className="w-full min-w-[920px] text-left">
                <thead className="border-b border-slate-800 bg-slate-950/70"><tr className="text-[10px] font-tech uppercase tracking-wider text-slate-500"><th className="px-4 py-3">Reference</th><th className="px-4 py-3">Event</th><th className="px-4 py-3">College</th><th className="px-4 py-3">Team members / roll numbers</th><th className="px-4 py-3">Status</th></tr></thead>
                <tbody className="divide-y divide-slate-800/80">{registrations.map((item) => <tr key={item.id} className="align-top hover:bg-slate-900/40">
                  <td className="px-4 py-3 text-xs font-tech text-emerald-300">{item.reference}</td>
                  <td className="px-4 py-3 text-xs font-tech text-slate-200">{item.eventName}</td>
                  <td className="px-4 py-3"><div className="text-xs font-tech text-slate-200">{item.college}</div><div className="text-[10px] text-slate-500">{item.department} · {item.city}</div></td>
                  <td className="space-y-1 px-4 py-3">{item.members.map((member) => <div key={member.id} className="text-[11px] font-tech text-slate-300">{member.name} <span className="text-emerald-300">({member.registerNumber || "Roll no. pending"})</span></div>)}</td>
                  <td className="px-4 py-3 text-[10px] font-tech uppercase text-slate-400">{item.status}</td>
                </tr>)}</tbody>
              </table>
              {registrations.length === 0 && <div className="p-8 text-center text-xs font-tech text-slate-500">No registrations found for this filter.</div>}
            </div>
            {admin.role === "event_manager" && <p className="text-[10px] font-tech text-slate-500">This view is scoped to the event(s) assigned to your coordinator account.</p>}
          </section>
        )}

        {!loading && section === "users" && (
          <section className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <div className="relative min-w-[220px] flex-1"><Search size={15} className="absolute left-3 top-3 text-slate-500"/><input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void load(); }} placeholder="Search name, email, college, roll number…" className="w-full rounded-lg border border-slate-800 bg-[#091116] py-2.5 pl-9 pr-3 text-xs font-tech text-slate-100 outline-none focus:border-emerald-500"/></div>
              <button type="button" onClick={() => void load()} className="rounded-lg border border-emerald-500/30 px-4 py-2.5 text-xs font-tech font-bold uppercase text-emerald-300">Search</button>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#091116]">
              <table className="w-full min-w-[960px] text-left">
                <thead className="border-b border-slate-800 bg-slate-950/70"><tr className="text-[10px] font-tech uppercase tracking-wider text-slate-500"><th className="px-4 py-3">Student</th><th className="px-4 py-3">Register number</th><th className="px-4 py-3">College / department</th><th className="px-4 py-3">Contact</th><th className="px-4 py-3">Events</th></tr></thead>
                <tbody className="divide-y divide-slate-800/80">{users.map((user) => <tr key={user.id} className="hover:bg-slate-900/40">
                  <td className="px-4 py-3"><div className="text-xs font-tech text-slate-100">{user.name}</div><div className="text-[10px] text-slate-500">{user.personId}</div></td>
                  <td className="px-4 py-3 text-xs font-tech font-bold text-emerald-300">{user.registerNumber || "Not provided"}</td>
                  <td className="px-4 py-3"><div className="text-xs font-tech text-slate-200">{user.college}</div><div className="text-[10px] text-slate-500">{user.department} · {user.city}</div></td>
                  <td className="px-4 py-3"><div className="text-xs font-tech text-slate-300">{user.mobile}</div><div className="text-[10px] text-slate-500">{user.email}</div></td>
                  <td className="px-4 py-3 text-xs font-tech text-slate-400">{user.eventSlugs.length}</td>
                </tr>)}</tbody>
              </table>
              {users.length === 0 && <div className="p-8 text-center text-xs font-tech text-slate-500">No users found.</div>}
            </div>
          </section>
        )}

        {!loading && section === "coordinators" && (
          <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
            <form onSubmit={createCoordinator} className="space-y-4 rounded-xl border border-slate-800 bg-[#091116] p-5">
              <div className="flex items-center gap-2 text-emerald-300"><ShieldCheck size={17}/><span className="text-[10px] font-tech font-bold uppercase tracking-widest">Create event coordinator</span></div>
              <label className="block space-y-1"><span className="text-[10px] font-tech uppercase text-slate-500">Full name</span><input required minLength={2} maxLength={100} value={form.name} onChange={(event) => setForm((v) => ({ ...v, name: event.target.value }))} className="w-full rounded-lg border border-slate-700 bg-[#04090c] px-3 py-2.5 text-sm font-tech outline-none focus:border-emerald-500"/></label>
              <label className="block space-y-1"><span className="text-[10px] font-tech uppercase text-slate-500">Login email</span><input required type="email" maxLength={254} value={form.email} onChange={(event) => setForm((v) => ({ ...v, email: event.target.value }))} className="w-full rounded-lg border border-slate-700 bg-[#04090c] px-3 py-2.5 text-sm font-tech outline-none focus:border-emerald-500"/></label>
              <label className="block space-y-1"><span className="text-[10px] font-tech uppercase text-slate-500">Initial password</span><input required minLength={8} maxLength={128} type="password" value={form.password} onChange={(event) => setForm((v) => ({ ...v, password: event.target.value }))} className="w-full rounded-lg border border-slate-700 bg-[#04090c] px-3 py-2.5 text-sm font-tech outline-none focus:border-emerald-500"/></label>
              <div className="space-y-2"><div className="text-[10px] font-tech uppercase text-slate-500">Assign event(s)</div>
                <div className="max-h-56 space-y-2 overflow-y-auto rounded-lg border border-slate-800 bg-[#04090c] p-3">
                  {events.map((event) => <label key={event.id} className="flex items-center gap-2 text-xs font-tech text-slate-300"><input type="checkbox" checked={selectedEventIds.includes(event.id)} onChange={(e) => setSelectedEventIds((ids) => e.target.checked ? [...ids, event.id] : ids.filter((id) => id !== event.id))} className="accent-emerald-500"/>{event.name}</label>)}
                  {events.length === 0 && <p className="text-xs text-slate-500">No events available.</p>}
                </div>
              </div>
              <button type="submit" disabled={saving || !form.name.trim() || !form.email.trim() || form.password.length < 8 || selectedEventIds.length === 0} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-3 text-xs font-tech font-bold uppercase text-slate-950 disabled:opacity-40">{saving ? <LoaderCircle size={15} className="animate-spin"/> : <Users size={15}/>} Create coordinator account</button>
              <p className="text-[10px] leading-relaxed text-slate-500">The coordinator signs in with these credentials and can only view registrations belonging to the selected events.</p>
            </form>
            <div className="space-y-3">
              <div className="text-[10px] font-tech font-bold uppercase tracking-widest text-slate-400">Existing coordinators</div>
              {coordinators.map((coordinator) => <article key={coordinator._id} className="rounded-xl border border-slate-800 bg-[#091116] p-4">
                <div className="flex items-start justify-between gap-3"><div><div className="text-sm font-tech font-bold text-slate-100">{coordinator.name}</div><div className="text-xs text-slate-500">{coordinator.email}</div></div><span className={"rounded-full px-2 py-1 text-[9px] font-tech uppercase " + (coordinator.isActive ? "bg-emerald-500/10 text-emerald-300" : "bg-slate-700 text-slate-400")}>{coordinator.isActive ? "Active" : "Disabled"}</span></div>
                <div className="mt-3 flex flex-wrap gap-1.5">{coordinator.assignedEventIds.map((event, index) => <span key={typeof event === "string" ? event : event._id || index} className="rounded-md border border-slate-700 px-2 py-1 text-[9px] font-tech text-slate-400">{typeof event === "string" ? event : event.name}</span>)}</div>
              </article>)}
              {coordinators.length === 0 && <div className="rounded-xl border border-slate-800 bg-[#091116] p-6 text-xs font-tech text-slate-500">No event coordinator accounts created yet.</div>}
            </div>
          </section>
        )}

        {!loading && section === "conversations" && (
          <section className="grid gap-4 lg:grid-cols-[minmax(280px,0.9fr)_minmax(0,1.3fr)]">
            <div className="space-y-2">
              {conversations.map((item) => <button key={item.id} type="button" onClick={() => void openConversation(item.id)} className="w-full rounded-xl border border-slate-800 bg-[#091116] p-4 text-left transition hover:border-emerald-500/40">
                <div className="flex items-center justify-between gap-2"><span className="text-xs font-tech font-bold text-slate-100">{item.participant?.name || "Visitor / no profile yet"}</span><span className="text-[9px] text-slate-500">{new Date(item.updatedAt).toLocaleString("en-IN")}</span></div>
                {item.participant && <div className="mt-1 text-[10px] text-slate-500">{item.participant.email} · {item.participant.registerNumber || "No roll number"}</div>}
                <p className="mt-2 line-clamp-2 text-[11px] font-tech text-slate-400">{item.preview}</p>
                <div className="mt-2 text-[9px] uppercase tracking-wider text-emerald-300">{item.messageCount} messages · open conversation</div>
              </button>)}
              {conversations.length === 0 && <div className="rounded-xl border border-slate-800 bg-[#091116] p-6 text-xs font-tech text-slate-500">No chatbot conversations saved yet.</div>}
            </div>
            <div className="min-h-80 rounded-xl border border-slate-800 bg-[#091116] p-4">
              {selectedConversation ? <>
                <div className="mb-4 border-b border-slate-800 pb-3"><div className="text-sm font-tech font-bold text-slate-100">{selectedConversation.participant?.name || "Visitor conversation"}</div><div className="text-[10px] text-slate-500">{selectedConversation.participant?.email || "No linked participant profile"}</div></div>
                <div className="max-h-[70vh] space-y-3 overflow-y-auto">{selectedConversation.messages.map((message) => <div key={message.id} className={"max-w-[92%] rounded-xl border px-3 py-2.5 text-xs font-tech leading-relaxed " + (message.role === "user" ? "ml-auto border-emerald-500/30 bg-emerald-950/30 text-emerald-100" : "border-slate-700 bg-slate-950 text-slate-300")}><div className="mb-1 text-[9px] font-bold uppercase tracking-wider text-slate-500">{message.role === "user" ? "Participant" : "Assistant"}</div>{message.text}</div>)}</div>
              </> : <div className="grid h-full min-h-72 place-items-center text-center text-xs font-tech text-slate-500"><div><MessageSquare size={25} className="mx-auto mb-2 text-slate-600"/>Select a conversation to read its messages.</div></div>}
            </div>
          </section>
        )}
        {!loading && (section === "registrations" || section === "users" || section === "conversations") && (
          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#091116] px-4 py-3">
            <span className="text-[10px] font-tech text-slate-500">Page {pagination.page} of {pagination.totalPages} · {pagination.total.toLocaleString("en-IN")} records</span>
            <div className="flex items-center gap-2">
              <button type="button" disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="rounded-lg border border-slate-700 px-3 py-2 text-[10px] font-tech uppercase text-slate-300 disabled:opacity-30">Previous</button>
              <button type="button" disabled={page >= pagination.totalPages} onClick={() => setPage((value) => Math.min(pagination.totalPages, value + 1))} className="rounded-lg border border-slate-700 px-3 py-2 text-[10px] font-tech uppercase text-slate-300 disabled:opacity-30">Next</button>
            </div>
          </div>
        )}
        <footer className="flex items-center justify-between border-t border-slate-800 pt-4 text-[10px] font-tech text-slate-600"><span>DATAVERSE 2K26 · STAFF CONSOLE</span><span className="inline-flex items-center gap-1"><CalendarDays size={12}/> Secure, role-based access</span></footer>
      </div>
    </main>
  );
}
