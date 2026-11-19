import { redirect } from "next/navigation";
import { connection } from "next/server";
import AdminDashboard from "@/src/components/AdminDashboard";
import { getCurrentAccount } from "@/src/lib/auth";

export const metadata = {
  title: "Admin Dashboard | DATAVERSE 2K26",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
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
