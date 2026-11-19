import { redirect } from "next/navigation";
import { connection } from "next/server";
import AdminLogin from "@/src/components/AdminLogin";
import { getCurrentAccount } from "@/src/lib/auth";

export const metadata = {
  title: "Admin Login | DATAVERSE 2K26",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  await connection();
  const current = await getCurrentAccount();
  if (current?.accountType === "admin") redirect("/admin");
  return <AdminLogin />;
}
