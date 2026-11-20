import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import AdminLogin from "@/src/components/AdminLogin";
import { getCurrentAccount } from "@/src/lib/auth";

export const metadata = {
  title: "Admin Login | DATAVERSE 2K26",
  robots: { index: false, follow: false },
};

function AdminLoginLoading() {
  return (
    <main className="min-h-screen bg-[#04070a] text-slate-100 grid place-items-center px-4">
      <div className="text-center">
        <div className="mx-auto mb-3 h-8 w-8 rounded-full border-2 border-emerald-500/30 border-t-emerald-400 animate-spin"/>
        <p className="text-xs font-tech uppercase tracking-widest text-emerald-300">Checking admin session</p>
      </div>
    </main>
  );
}

async function AdminLoginContent() {
  await connection();
  const current = await getCurrentAccount();
  if (current?.accountType === "admin") {
    redirect(current.account.role === "event_manager" ? "/admin/manage/registrations" : "/admin");
  }
  return <AdminLogin/>;
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<AdminLoginLoading/>}>
      <AdminLoginContent/>
    </Suspense>
  );
}
