import { randomBytes, createHash } from "crypto";
import { cookies } from "next/headers";
import { connectDB } from "./mongodb";
import Session from "../../models/Session";

const COOKIE_NAME = "dataverse_session";
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(
  userId: string,
  accountType: "participant" | "admin",
) {
  await connectDB();

  const token = randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);

  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  await Session.create({
    userId,
    accountType,
    tokenHash,
    expiresAt,
  });

  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: expiresAt,
  });

  return expiresAt;
}

export async function validateSession() {
  await connectDB();

  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  const tokenHash = hashToken(token);

  const session = await Session.findOne({
    tokenHash,
    expiresAt: { $gt: new Date() },
  }).lean();

  if (!session) return null;

  return session;
}

export async function revokeSession() {
  await connectDB();

  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (token) {
    await Session.deleteOne({
      tokenHash: hashToken(token),
    });
  }

  cookieStore.delete(COOKIE_NAME);
}
