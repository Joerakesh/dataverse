import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import AdminDashboard from "@/src/components/AdminDashboard";
import { getCurrentAccount } from "@/src/lib/auth";

export const metadata = {
  title: "Admin Dashboard | DATAVERSE 2K26",
  robots: { index: false, follow: false },
};

function AdminLoading() {
  return (
    <main className="min-h-screen bg-[#05090c] text-slate-100 grid place-items-center px-4">
      <div className="text-center">
        <div className="mx-auto mb-3 h-8 w-8 rounded-full border-2 border-emerald-500/30 border-t-emerald-400 animate-spin"/>
        <p className="text-xs font-tech uppercase tracking-widest text-emerald-300">Checking admin session</p>
      </div>
    </main>
  );
}

async function AdminContent() {
  await connection();
  const current = await getCurrentAccount();
  if (!current || current.accountType !== "admin") redirect("/admin/login");

  return (
    <AdminDashboard
      admin={{
        name: current.account.name,
        email: current.account.email,
        role: current.account.role,
        permissions: current.account.permissions ?? [],
      }}
    />
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<AdminLoading/>}>
      <AdminContent/>
    </Suspense>
  );
}
