import { validateSession } from "./session";
import User from "../../models/User";
import Admin from "../../models/Admin";

export async function getCurrentAccount() {
  const session = await validateSession();

  if (!session) return null;

  if (session.accountType === "participant") {
    const user = await User.findById(session.userId).select("-passwordHash");

    if (!user || !user.isActive) return null;

    return {
      accountType: "participant" as const,
      account: user,
      session,
    };
  }

  if (session.accountType === "admin") {
    const admin = await Admin.findById(session.userId).select("-passwordHash");

    if (!admin || !admin.isActive) return null;

    return {
      accountType: "admin" as const,
      account: admin,
      session,
    };
  }

  return null;
}
