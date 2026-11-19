"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, LoaderCircle, LockKeyhole, ShieldCheck } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const response = await fetch("/api/auth/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.success) throw new Error(data.message || "Unable to sign in.");
      router.replace("/admin");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to sign in.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#04070a] text-slate-100 grid place-items-center px-4 py-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none"/>
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[650px] h-[420px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none"/>
      <div className="relative w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-tech text-slate-400 hover:text-emerald-300 mb-6">
          <ArrowLeft size={14}/> Back to DATAVERSE
        </Link>
        <div className="rounded-2xl border border-emerald-500/30 bg-[#07100f]/95 shadow-[0_25px_90px_rgba(0,0,0,.55)] p-6 sm:p-8">
          <div className="w-12 h-12 rounded-xl border border-emerald-400/30 bg-emerald-950/50 text-emerald-300 grid place-items-center mb-5">
            <ShieldCheck size={24}/>
          </div>
          <div className="text-[10px] uppercase tracking-[.24em] font-tech text-emerald-400 font-bold">Staff access only</div>
          <h1 className="font-avengers text-4xl text-slate-100 italic tracking-wider mt-1">ADMIN SIGN IN</h1>
          <p className="text-sm text-slate-400 font-tech mt-2">Sign in with the admin account created by the DATAVERSE organisers.</p>

          <form onSubmit={submit} className="mt-7 space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-[10px] uppercase tracking-widest font-tech text-slate-400 mb-2">Admin email</label>
              <input id="admin-email" type="email" autoComplete="username" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-slate-700 bg-[#030809] px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500" placeholder="admin@college.edu"/>
            </div>
            <div>
              <label htmlFor="admin-password" className="block text-[10px] uppercase tracking-widest font-tech text-slate-400 mb-2">Password</label>
              <div className="relative">
                <input id="admin-password" type={showPassword ? "text" : "password"} autoComplete="current-password" required maxLength={128} value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-slate-700 bg-[#030809] px-4 py-3 pr-12 text-sm text-slate-100 outline-none focus:border-emerald-500" placeholder="Enter admin password"/>
                <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-emerald-300" aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff size={17}/> : <Eye size={17}/>}
                </button>
              </div>
            </div>
            {error && <div role="alert" className="rounded-lg border border-red-500/30 bg-red-950/30 px-3 py-2 text-xs font-tech text-red-300">{error}</div>}
            <button type="submit" disabled={busy || !email.trim() || !password} className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 py-3.5 text-sm font-tech font-bold uppercase tracking-wider text-black disabled:opacity-50 flex items-center justify-center gap-2">
              {busy ? <><LoaderCircle size={17} className="animate-spin"/> Signing in</> : <><LockKeyhole size={16}/> Sign in to admin</>}
            </button>
          </form>
        </div>
        <p className="text-center text-[10px] font-tech text-slate-600 mt-5">DATAVERSE 2K26 · Organiser console</p>
      </div>
    </main>
  );
}
