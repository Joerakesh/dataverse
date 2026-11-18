import { getCurrentAccount } from "./auth";

export async function requireParticipant() {
  const current = await getCurrentAccount();

  if (!current || current.accountType !== "participant") {
    throw new Error("UNAUTHORIZED");
  }

  return current.account;
}

export async function requireAdmin() {
  const current = await getCurrentAccount();

  if (!current || current.accountType !== "admin") {
    throw new Error("UNAUTHORIZED");
  }

  return current.account;
}

export async function requirePermission(permission: string) {
  const admin = await requireAdmin();

  if (
    admin.role === "superadmin" ||
    admin.permissions.includes("*") ||
    admin.permissions.includes(permission)
  ) {
    return admin;
  }

  throw new Error("FORBIDDEN");
}
