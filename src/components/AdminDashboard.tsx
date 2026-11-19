"use client";

import { Fragment, useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Activity, CalendarClock, CheckCircle2, ChevronLeft, ChevronRight,
  CircleAlert, ClipboardList, Download, LoaderCircle, LogOut,
  RefreshCw, Search, ToggleLeft, ToggleRight, Users, XCircle, Building2, Pencil, Trash2, Save,
} from "lucide-react";

type AdminInfo = { name: string; email: string; role: string; permissions: string[] };
type Settings = {
  registrationEnabled: boolean;
  maintenanceMode: boolean;
  registrationDeadline: string | null;
};
type EventItem = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: string;
  teamSize: string;
  registrationOpen: boolean;
};
type Member = { id: string; name: string; mobile: string; email: string };
type Registration = {
  id: string;
  reference: string;
  eventSlug: string;
  eventName: string;
  college: string;
  city: string;
  department: string;
  teamSize: number;
  status: "confirmed" | "cancelled";
  createdAt: string;
  contact: { name: string; mobile: string; email: string } | null;
  members: Member[];
};
type Summary = { total: number; confirmed: number; cancelled: number; participants: number; colleges: number };
type Pagination = { page: number; limit: number; total: number; totalPages: number };

async function readJson(response: Response) {
  const data = await response.json().catch(() => ({}));
  if (response.status === 401) throw new Error("SESSION_EXPIRED");
  if (!response.ok || !data.success) throw new Error(data.message || "Request failed.");
  return data;
}

function Switch({ checked, disabled, onChange, label }: {
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={"inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-tech font-bold border transition disabled:opacity-50 " + (checked
        ? "border-emerald-400/40 bg-emerald-950/50 text-emerald-300 hover:bg-emerald-950"
        : "border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-500")}
    >
      {checked ? <ToggleRight size={19}/> : <ToggleLeft size={19}/>}
      {checked ? "ON" : "OFF"}
    </button>
  );
}

export default function AdminDashboard({ admin }: { admin: AdminInfo }) {
  const router = useRouter();
  const permissions = admin.permissions ?? [];
  const hasPermission = (permission: string) =>
    admin.role === "superadmin" || permissions.includes("*") || permissions.includes(permission);
  const canManageSettings = hasPermission("settings:manage");
  const canManageEvents = hasPermission("events:manage");
  const canViewRegistrations = hasPermission("registrations:view");
  const canManageRegistrations = hasPermission("registrations:manage");

  const [settings, setSettings] = useState<Settings | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [summary, setSummary] = useState<Summary>({ total: 0, confirmed: 0, cancelled: 0, participants: 0, colleges: 0 });
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 25, total: 0, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [savingGlobal, setSavingGlobal] = useState(false);
  const [savingEvent, setSavingEvent] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [expanded, setExpanded] = useState("");
  const [editingMember, setEditingMember] = useState<{ registrationId: string; member: Member } | null>(null);
  const [memberForm, setMemberForm] = useState({ name: "", mobile: "", email: "" });
  const [savingMember, setSavingMember] = useState("");

  const signOut = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" }).catch(() => undefined);
    router.replace("/admin/login");
    router.refresh();
  };

  const loadSettings = useCallback(async () => {
    if (!canManageSettings) return;
    const response = await fetch("/api/admin/settings", { cache: "no-store", credentials: "include" });
    const data = await readJson(response);
    setSettings(data.settings);
  }, [canManageSettings]);

  const loadEvents = useCallback(async () => {
    if (!canManageEvents) return;
    const response = await fetch("/api/admin/events", { cache: "no-store", credentials: "include" });
    const data = await readJson(response);
    setEvents(data.events ?? []);
  }, [canManageEvents]);

  const loadRegistrations = useCallback(async () => {
    if (!canViewRegistrations) return;
    const params = new URLSearchParams({
      page: String(page),
      limit: "25",
      search,
    });
    if (eventFilter) params.set("event", eventFilter);
    if (statusFilter) params.set("status", statusFilter);
    const response = await fetch("/api/admin/registrations?" + params.toString(), {
      cache: "no-store",
      credentials: "include",
    });
    const data = await readJson(response);
    setRegistrations(data.registrations ?? []);
    setPagination(data.pagination);
    setSummary(data.summary);
  }, [canViewRegistrations, page, search, eventFilter, statusFilter]);

  const refresh = useCallback(async (showSpinner = true) => {
    if (showSpinner) setRefreshing(true);
    setError("");
    try {
      await Promise.all([loadSettings(), loadEvents(), loadRegistrations()]);
    } catch (caught) {
      if (caught instanceof Error && caught.message === "SESSION_EXPIRED") {
        router.replace("/admin/login");
        return;
      }
      setError(caught instanceof Error ? caught.message : "Unable to refresh the dashboard.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [loadSettings, loadEvents, loadRegistrations, router]);

  useEffect(() => {
    void refresh(false);
  }, [refresh]);

  const toggleGlobalRegistration = async (enabled: boolean) => {
    setSavingGlobal(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ registrationEnabled: enabled }),
      });
      const data = await readJson(response);
      setSettings(data.settings);
      setNotice(enabled ? "Public registration is now open." : "Public registration has been closed.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to update registration.");
    } finally {
      setSavingGlobal(false);
    }
  };

  const toggleEventRegistration = async (item: EventItem, enabled: boolean) => {
    setSavingEvent(item.id);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/events/" + item.id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ registrationOpen: enabled }),
      });
      await readJson(response);
      setEvents((current) => current.map((event) => event.id === item.id ? { ...event, registrationOpen: enabled } : event));
      setNotice(item.name + " registration is now " + (enabled ? "open." : "closed."));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to update event registration.");
    } finally {
      setSavingEvent("");
    }
  };

  const openMemberEditor = (registrationId: string, member: Member) => {
    setEditingMember({ registrationId, member });
    setMemberForm({ name: member.name, mobile: member.mobile, email: member.email });
    setError("");
    setNotice("");
  };

  const saveMember = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingMember) return;
    setSavingMember(editingMember.member.id);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/registrations/" + editingMember.registrationId, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          participantId: editingMember.member.id,
          ...memberForm,
        }),
      });
      const data = await readJson(response);
      setEditingMember(null);
      setNotice(data.message || "Participant updated.");
      await loadRegistrations();
    } catch (caught) {
      if (caught instanceof Error && caught.message === "SESSION_EXPIRED") {
        router.replace("/admin/login");
        return;
      }
      setError(caught instanceof Error ? caught.message : "Unable to update participant.");
    } finally {
      setSavingMember("");
    }
  };

  const removeMember = async (registration: Registration, member: Member) => {
    if (!window.confirm("Remove " + member.name + " from " + registration.eventName + "? Their profile and other event registrations will remain.")) return;
    setSavingMember(member.id);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/registrations/" + registration.id, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ participantId: member.id }),
      });
      const data = await readJson(response);
      setNotice(data.message || "Participant removed from the team.");
      await loadRegistrations();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to remove participant.");
    } finally {
      setSavingMember("");
    }
  };

  const cancelTeam = async (registration: Registration) => {
    if (!window.confirm("Cancel the entire team registration " + registration.reference + "? This will release its event slot.")) return;
    setSavingMember(registration.id);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/registrations/" + registration.id, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({}),
      });
      const data = await readJson(response);
      setNotice(data.message || "Team registration cancelled.");
      setExpanded("");
      await loadRegistrations();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to cancel team registration.");
    } finally {
      setSavingMember("");
    }
  };

  const downloadCsv = () => {
    const columns = ["Registration reference", "Event", "College", "City", "Department", "Team size", "Status", "Registered at", "Members", "Member emails", "Registration contact email"];
    const escape = (value: string) => '"' + value.replace(/"/g, '""') + '"';
    const rows = registrations.map((item) => [
      item.reference, item.eventName, item.college, item.city, item.department,
      String(item.teamSize), item.status, new Date(item.createdAt).toISOString(),
      item.members.map((member) => member.name + " (" + member.mobile + ")").join("; "),
      item.members.map((member) => member.email).filter(Boolean).join("; "),
      item.contact?.email ?? "",
    ]);
    const csv = [columns, ...rows].map((row) => row.map(escape).join(",")).join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "dataverse-registrations-page-" + page + ".csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const effectiveOpen = Boolean(settings?.registrationEnabled && !settings?.maintenanceMode && (!settings.registrationDeadline || new Date(settings.registrationDeadline).getTime() > Date.now()));
  const enabledEvents = events.filter((event) => event.registrationOpen).length;

  const statCards = useMemo(() => [
    { label: "Total teams", value: summary.total, icon: <ClipboardList size={18}/>, hint: "All event registrations" },
    { label: "Confirmed", value: summary.confirmed, icon: <CheckCircle2 size={18}/>, hint: "Active team entries" },
    { label: "Participants", value: summary.participants, icon: <Users size={18}/>, hint: "Unique registered members" },
    { label: "Colleges", value: summary.colleges, icon: <Building2 size={18}/>, hint: "Represented institutions" },
  ], [summary]);

  return (
    <main className="min-h-screen bg-[#05090c] text-slate-100">
      <header className="border-b border-emerald-500/20 bg-[#05090c]/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-tech uppercase tracking-[.24em] text-emerald-400">DATAVERSE 2K26 · STAFF CONSOLE</div>
            <h1 className="font-avengers text-3xl sm:text-4xl tracking-wider italic mt-1">ADMIN DASHBOARD</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:block text-right">
              <div className="text-sm font-tech font-bold text-slate-100">{admin.name}</div>
              <div className="text-[10px] font-tech uppercase tracking-wider text-slate-500">{admin.role.replace("_", " ")}</div>
            </div>
            <button type="button" onClick={() => void refresh()} disabled={refreshing} className="rounded-lg border border-slate-700 bg-slate-900 p-2.5 text-slate-300 hover:border-emerald-500/50 hover:text-emerald-300 disabled:opacity-50" aria-label="Refresh dashboard">
              {refreshing ? <LoaderCircle size={17} className="animate-spin"/> : <RefreshCw size={17}/>}
            </button>
            <button type="button" onClick={signOut} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-xs font-tech font-bold uppercase tracking-wider text-slate-300 hover:border-red-500/40 hover:text-red-300">
              <LogOut size={15}/> <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-7">
        {error && <div role="alert" className="rounded-xl border border-red-500/30 bg-red-950/30 px-4 py-3 text-sm font-tech text-red-300 flex gap-2"><CircleAlert size={17} className="shrink-0"/>{error}</div>}
        {notice && <div role="status" className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 px-4 py-3 text-sm font-tech text-emerald-200 flex items-center gap-2"><CheckCircle2 size={17}/>{notice}</div>}

        {canManageSettings && (
          <section className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-[#0a1914] via-[#07100f] to-[#080d12] p-5 sm:p-7">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 text-[10px] font-tech uppercase tracking-[.2em] text-emerald-400 font-bold"><Activity size={14}/> Public registration control</div>
                <h2 className="font-avengers text-2xl sm:text-3xl mt-2">REGISTRATION GATE</h2>
                <p className="text-sm text-slate-400 font-tech mt-1">This switch controls registration for every event. You can still close or open individual events below.</p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className={"inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-tech font-bold " + (effectiveOpen ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/10 text-amber-300")}>
                    <span className={"w-1.5 h-1.5 rounded-full " + (effectiveOpen ? "bg-emerald-400" : "bg-amber-400")}/>
                    {effectiveOpen ? "REGISTRATION OPEN" : "REGISTRATION CLOSED"}
                  </span>
                  {settings?.maintenanceMode && <span className="text-[10px] font-tech text-amber-300 uppercase tracking-wider">Maintenance mode active</span>}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="text-sm font-tech text-slate-400 sm:text-right">
                  <div>Enabled events</div>
                  <div className="text-xl text-slate-100 font-bold">{enabledEvents} <span className="text-sm text-slate-500">/ {events.length}</span></div>
                </div>
                <button type="button" onClick={() => void toggleGlobalRegistration(!settings?.registrationEnabled)} disabled={savingGlobal || !settings || loading} className={"rounded-xl px-5 py-3 text-sm font-tech font-bold uppercase tracking-wider transition disabled:opacity-50 flex items-center justify-center gap-2 " + (settings?.registrationEnabled ? "border border-red-400/30 bg-red-950/40 text-red-200 hover:bg-red-950/70" : "bg-gradient-to-r from-emerald-500 to-green-600 text-black hover:brightness-110")}>
                  {savingGlobal ? <LoaderCircle size={17} className="animate-spin"/> : settings?.registrationEnabled ? <XCircle size={17}/> : <CheckCircle2 size={17}/>}
                  {settings?.registrationEnabled ? "Close public registration" : "Open public registration"}
                </button>
              </div>
            </div>
            {settings?.registrationDeadline && <div className="mt-5 pt-4 border-t border-slate-800 text-xs font-tech text-slate-500 flex items-center gap-2"><CalendarClock size={14}/> Deadline: {new Date(settings.registrationDeadline).toLocaleString("en-IN")}</div>}
          </section>
        )}

        {canManageEvents && (
          <section className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="text-[10px] font-tech uppercase tracking-[.2em] text-emerald-400 font-bold">Individual controls</div>
                <h2 className="font-avengers text-2xl sm:text-3xl tracking-wider mt-1">EVENT REGISTRATION</h2>
                <p className="text-xs sm:text-sm font-tech text-slate-500 mt-1">Switch any event on or off without affecting the others.</p>
              </div>
              <div className="text-xs font-tech text-slate-500">{enabledEvents} of {events.length} event registrations enabled</div>
            </div>
            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
              {events.map((item) => (
                <article key={item.id} className="rounded-xl border border-slate-800 bg-[#091116] p-4 flex flex-col justify-between gap-4">
                  <div>
                    <div className="text-[9px] font-tech uppercase tracking-[.18em] text-emerald-400">{item.category}</div>
                    <h3 className="font-avengers text-xl tracking-wide text-slate-100 mt-1">{item.name}</h3>
                    <p className="text-[11px] font-tech text-slate-500 mt-1">{item.tagline} · {item.teamSize}</p>
                  </div>
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-tech uppercase tracking-wider text-slate-500">{item.registrationOpen ? "Accepting teams" : "Not accepting"}</span>
                    <Switch checked={item.registrationOpen} disabled={!item.id || savingEvent === item.id || loading} label={"Toggle " + item.name + " registration"} onChange={(checked) => void toggleEventRegistration(item, checked)}/>
                  </div>
                </article>
              ))}
              {events.length === 0 && <div className="sm:col-span-2 xl:col-span-4 rounded-xl border border-slate-800 bg-slate-950 p-6 text-sm font-tech text-slate-500">No event records found.</div>}
            </div>
          </section>
        )}

        {canViewRegistrations && (
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <div className="text-[10px] font-tech uppercase tracking-[.2em] text-emerald-400 font-bold">Registration database</div>
                <h2 className="font-avengers text-2xl sm:text-3xl tracking-wider mt-1">ALL TEAM REGISTRATIONS</h2>
                <p className="text-xs sm:text-sm font-tech text-slate-500 mt-1">Search by reference, event, college, department, student name, mobile number or email.</p>
              </div>
              <button type="button" onClick={downloadCsv} disabled={registrations.length === 0} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-xs font-tech font-bold uppercase tracking-wider text-slate-300 hover:border-emerald-500/40 hover:text-emerald-300 disabled:opacity-40">
                <Download size={15}/> Export current page
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {statCards.map((item) => (
                <div key={item.label} className="rounded-xl border border-slate-800 bg-[#091116] p-4">
                  <div className="flex items-center justify-between text-slate-500"><span className="text-[10px] font-tech uppercase tracking-wider">{item.label}</span><span className="text-emerald-400">{item.icon}</span></div>
                  <div className="font-avengers text-3xl text-slate-100 mt-2">{item.value.toLocaleString("en-IN")}</div>
                  <div className="text-[10px] font-tech text-slate-600 mt-1">{item.hint}</div>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#091116] p-3 sm:p-4 flex flex-col lg:flex-row gap-2">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"/>
                <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search registrations..." className="w-full rounded-lg border border-slate-700 bg-[#04090c] pl-9 pr-3 py-2.5 text-sm font-tech text-slate-100 outline-none focus:border-emerald-500"/>
              </div>
              <select value={eventFilter} onChange={(event) => { setEventFilter(event.target.value); setPage(1); }} className="rounded-lg border border-slate-700 bg-[#04090c] px-3 py-2.5 text-xs font-tech text-slate-300 outline-none focus:border-emerald-500">
                <option value="">All events</option>
                {events.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
              </select>
              <select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }} className="rounded-lg border border-slate-700 bg-[#04090c] px-3 py-2.5 text-xs font-tech text-slate-300 outline-none focus:border-emerald-500">
                <option value="">All statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {loading ? (
              <div className="rounded-xl border border-slate-800 bg-[#091116] p-10 text-center text-sm font-tech text-slate-500"><LoaderCircle size={20} className="animate-spin inline mr-2"/>Loading registrations...</div>
            ) : registrations.length === 0 ? (
              <div className="rounded-xl border border-slate-800 bg-[#091116] p-10 text-center">
                <ClipboardList size={28} className="mx-auto text-slate-600"/>
                <div className="font-avengers text-xl text-slate-300 mt-3">NO REGISTRATIONS FOUND</div>
                <p className="text-xs font-tech text-slate-500 mt-1">Change your filters or refresh after participants register.</p>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-800 bg-[#091116] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] text-left">
                    <thead className="bg-slate-950/80 border-b border-slate-800">
                      <tr className="text-[10px] font-tech uppercase tracking-wider text-slate-500">
                        <th className="px-4 py-3">Registration</th>
                        <th className="px-4 py-3">Event</th>
                        <th className="px-4 py-3">College / Department</th>
                        <th className="px-4 py-3">Team</th>
                        <th className="px-4 py-3">Registered</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {registrations.map((item) => (
                        <Fragment key={item.id}>
                          <tr key={item.id} className="hover:bg-slate-900/50">
                            <td className="px-4 py-3">
                              <div className="text-xs font-tech font-bold text-emerald-300">{item.reference}</div>
                              <div className="text-[10px] font-tech text-slate-600">{item.city}</div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-xs font-tech text-slate-200">{item.eventName}</div>
                              <div className="text-[10px] font-tech text-slate-600">{item.teamSize} member(s)</div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-xs font-tech text-slate-200">{item.college}</div>
                              <div className="text-[10px] font-tech text-slate-500">{item.department}</div>
                            </td>
                            <td className="px-4 py-3 text-xs font-tech text-slate-300">{item.members.map((member) => member.name).join(", ")}</td>
                            <td className="px-4 py-3 text-[10px] font-tech text-slate-400">{new Date(item.createdAt).toLocaleString("en-IN")}</td>
                            <td className="px-4 py-3"><span className={"rounded-full px-2.5 py-1 text-[9px] font-tech font-bold uppercase " + (item.status === "confirmed" ? "bg-emerald-500/10 text-emerald-300" : "bg-slate-700/50 text-slate-400")}>{item.status}</span></td>
                            <td className="px-4 py-3"><button type="button" onClick={() => setExpanded((value) => value === item.id ? "" : item.id)} className="text-[10px] font-tech font-bold uppercase text-emerald-300 hover:text-emerald-200">{expanded === item.id ? "Hide" : "Details"}</button></td>
                          </tr>
                          {expanded === item.id && (
                            <tr key={item.id + "-details"} className="bg-slate-950/70">
                              <td colSpan={7} className="px-4 py-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div>
                                    <div className="text-[9px] uppercase tracking-widest text-slate-500 font-tech mb-2">Registered team members</div>
                                    <div className="space-y-2">
                                      {item.members.map((member) => (
                                        <div key={member.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-800 bg-[#071015] px-3 py-2">
                                          <div className="min-w-0">
                                            <div className="text-xs font-tech font-bold text-slate-200">{member.name}</div>
                                            <a className="block text-[11px] font-tech text-emerald-300 hover:underline" href={"tel:" + member.mobile}>{member.mobile}</a>
                                            {member.email && <a className="block text-[11px] font-tech text-sky-300 hover:underline" href={"mailto:" + member.email}>{member.email}</a>}
                                          </div>
                                          {canManageRegistrations && item.status === "confirmed" && (
                                            <div className="flex items-center gap-2">
                                              <button type="button" onClick={() => openMemberEditor(item.id, member)} className="inline-flex items-center gap-1 rounded-md border border-slate-700 px-2 py-1.5 text-[10px] font-tech font-bold uppercase text-slate-300 hover:border-emerald-500/50 hover:text-emerald-300">
                                                <Pencil size={12}/> Edit
                                              </button>
                                              <button type="button" disabled={savingMember === member.id} onClick={() => void removeMember(item, member)} className="inline-flex items-center gap-1 rounded-md border border-red-500/30 px-2 py-1.5 text-[10px] font-tech font-bold uppercase text-red-300 hover:bg-red-950/40 disabled:opacity-50">
                                                {savingMember === member.id ? <LoaderCircle size={12} className="animate-spin"/> : <Trash2 size={12}/>} Remove
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-[9px] uppercase tracking-widest text-slate-500 font-tech mb-2">Registration contact</div>
                                    <div className="text-xs font-tech text-slate-200">{item.contact?.name || "Not available"}</div>
                                    {item.contact?.mobile && <a className="text-xs font-tech text-emerald-300 hover:underline" href={"tel:" + item.contact.mobile}>{item.contact.mobile}</a>}
                                    {item.contact?.email && <a className="block text-xs font-tech text-sky-300 hover:underline" href={"mailto:" + item.contact.email}>{item.contact.email}</a>}
                                  </div>
                                </div>
                                {canManageRegistrations && item.status === "confirmed" && (
                                  <div className="mt-4 flex justify-end border-t border-slate-800 pt-3">
                                    <button type="button" disabled={savingMember === item.id} onClick={() => void cancelTeam(item)} className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 px-3 py-2 text-[10px] font-tech font-bold uppercase tracking-wider text-red-300 hover:bg-red-950/40 disabled:opacity-50">
                                      {savingMember === item.id ? <LoaderCircle size={13} className="animate-spin"/> : <XCircle size={13}/>} Cancel entire team
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-slate-800 bg-slate-950/60">
                  <div className="text-[10px] font-tech text-slate-500">Page {pagination.page} of {pagination.totalPages} · {pagination.total.toLocaleString("en-IN")} matching registrations</div>
                  <div className="flex items-center gap-2">
                    <button type="button" disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="rounded-lg border border-slate-700 p-2 text-slate-300 disabled:opacity-30"><ChevronLeft size={15}/></button>
                    <button type="button" disabled={page >= pagination.totalPages} onClick={() => setPage((value) => Math.min(pagination.totalPages, value + 1))} className="rounded-lg border border-slate-700 p-2 text-slate-300 disabled:opacity-30"><ChevronRight size={15}/></button>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {editingMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditingMember(null); }}>
            <form onSubmit={saveMember} className="w-full max-w-lg space-y-4 rounded-2xl border border-emerald-500/30 bg-[#081116] p-5 shadow-2xl shadow-black/50">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[10px] font-tech font-bold uppercase tracking-[.2em] text-emerald-400">Participant management</div>
                  <h3 className="mt-1 font-avengers text-2xl tracking-wide text-slate-100">EDIT PARTICIPANT</h3>
                  <p className="mt-1 text-xs font-tech text-slate-500">Changes update this participant&apos;s profile across all event registrations.</p>
                </div>
                <button type="button" onClick={() => setEditingMember(null)} className="rounded-lg border border-slate-700 p-2 text-slate-400 hover:text-white" aria-label="Close editor"><XCircle size={17}/></button>
              </div>
              <label className="block space-y-1.5">
                <span className="text-[10px] font-tech uppercase tracking-wider text-slate-400">Full name</span>
                <input required minLength={2} maxLength={100} value={memberForm.name} onChange={(event) => setMemberForm((current) => ({ ...current, name: event.target.value }))} className="w-full rounded-lg border border-slate-700 bg-[#04090c] px-3 py-2.5 text-sm font-tech text-slate-100 outline-none focus:border-emerald-500"/>
              </label>
              <label className="block space-y-1.5">
                <span className="text-[10px] font-tech uppercase tracking-wider text-slate-400">Mobile number</span>
                <input required inputMode="tel" maxLength={20} value={memberForm.mobile} onChange={(event) => setMemberForm((current) => ({ ...current, mobile: event.target.value }))} className="w-full rounded-lg border border-slate-700 bg-[#04090c] px-3 py-2.5 text-sm font-tech text-slate-100 outline-none focus:border-emerald-500"/>
              </label>
              <label className="block space-y-1.5">
                <span className="text-[10px] font-tech uppercase tracking-wider text-slate-400">Email address</span>
                <input required type="email" maxLength={254} value={memberForm.email} onChange={(event) => setMemberForm((current) => ({ ...current, email: event.target.value }))} className="w-full rounded-lg border border-slate-700 bg-[#04090c] px-3 py-2.5 text-sm font-tech text-slate-100 outline-none focus:border-emerald-500"/>
              </label>
              <div className="flex flex-wrap justify-end gap-2 border-t border-slate-800 pt-4">
                <button type="button" onClick={() => setEditingMember(null)} className="rounded-lg border border-slate-700 px-4 py-2.5 text-xs font-tech font-bold uppercase text-slate-300 hover:bg-slate-900">Cancel</button>
                <button type="submit" disabled={savingMember === editingMember.member.id} className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-xs font-tech font-bold uppercase text-slate-950 hover:bg-emerald-400 disabled:opacity-50">
                  {savingMember === editingMember.member.id ? <LoaderCircle size={14} className="animate-spin"/> : <Save size={14}/>} Save changes
                </button>
              </div>
            </form>
          </div>
        )}

        {!canManageSettings && !canManageEvents && !canViewRegistrations && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-5 text-sm font-tech text-amber-200">
            Your admin account is signed in, but it does not have dashboard permissions. Ask the superadmin to grant settings:manage, events:manage, registrations:view and registrations:manage.
          </div>
        )}

        <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 pt-5 text-[10px] font-tech text-slate-600">
          <span>DATAVERSE 2K26 · ADMIN CONSOLE</span>
          <span>All registration controls are enforced server-side.</span>
        </footer>
      </div>
    </main>
  );
}
