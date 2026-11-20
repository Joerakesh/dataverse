import { connection } from "next/server";
import { notFound, redirect } from "next/navigation";
import AdminSection from "@/src/components/AdminSection";
import { getCurrentAccount } from "@/src/lib/auth";

type Section = "events" | "registrations" | "users" | "coordinators" | "conversations";
const permissions: Record<Section, string> = {
  events: "events:manage",
  registrations: "registrations:view",
  users: "users:view",
  coordinators: "coordinators:manage",
  conversations: "conversations:view",
};

export const metadata = {
  title: "Admin Management | DATAVERSE 2K26",
  robots: { index: false, follow: false },
};

export default async function AdminManagementPage({ params }: { params: Promise<{ section: string }> }) {
  await connection();
  const { section: rawSection } = await params;
  const sections: Section[] = ["events", "registrations", "users", "coordinators", "conversations"];
  if (!sections.includes(rawSection as Section)) notFound();
  const section = rawSection as Section;

  const current = await getCurrentAccount();
  if (!current || current.accountType !== "admin") redirect("/admin/login");
  const accountPermissions = current.account.permissions ?? [];
  if (current.account.role !== "superadmin" && !accountPermissions.includes("*") && !accountPermissions.includes(permissions[section])) {
    redirect("/admin");
  }

  return (
    <AdminSection
      admin={{
        name: current.account.name,
        email: current.account.email,
        role: current.account.role,
        permissions: current.account.permissions ?? [],
      }}
      section={section}
    />
  );
}
