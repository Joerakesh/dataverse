import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
import { connectDB } from "@/src/lib/mongodb";
import Participant from "@/models/Participant";
import RegistrationFlow from "@/models/RegistrationFlow";
import Settings from "@/models/Settings";

const FLOW_COOKIE = "dv_registration_flow";
const FLOW_DURATION_MS = 12 * 60 * 60 * 1000;

export function normalizeKey(value: string) {
  return value.normalize("NFKD").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");
}

export function normalizeIndianMobile(value: string) {
  const digits = value.replace(/\D/g, "");
  const mobile = digits.length === 10
    ? digits
    : digits.length === 12 && digits.startsWith("91")
      ? digits.slice(2)
      : digits.length === 11 && digits.startsWith("0")
        ? digits.slice(1)
        : "";
  if (!/^[6-9]\d{9}$/.test(mobile)) {
    throw new Error("Enter a valid 10-digit Indian mobile number.");
  }
  return mobile;
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function createPersonId() {
  return "DV26-" + randomBytes(4).toString("hex").toUpperCase();
}

export function createRegistrationReference() {
  return "DVR26-" + randomBytes(5).toString("hex").toUpperCase();
}

export async function createOrFindParticipant(input: {
  name: string;
  mobile: string;
  college: string;
  city: string;
  department: string;
}) {
  await connectDB();
  const mobile = normalizeIndianMobile(input.mobile);
  const collegeKey = normalizeKey(input.college);
  const departmentKey = normalizeKey(input.department);
  const existing = await Participant.findOne({ mobile });

  if (existing) {
    if (normalizeKey(existing.name) !== normalizeKey(input.name)) {
      return { error: "This mobile number is already linked to a participant with a different name. Please check the number or contact the organisers." } as const;
    }
    if (existing.collegeKey !== collegeKey || existing.departmentKey !== departmentKey) {
      return { error: "This mobile number is already registered with a different college or department. Please contact the organisers if those details need correction." } as const;
    }
    return { participant: existing } as const;
  }

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const participant = await Participant.create({
        personId: createPersonId(),
        name: input.name.trim(),
        mobile,
        college: input.college.trim(),
        collegeKey,
        city: input.city.trim(),
        department: input.department.trim(),
        departmentKey,
        eventSlugs: [],
      });
      return { participant } as const;
    } catch (error) {
      if (error && typeof error === "object" && "code" in error && error.code === 11000) {
        const duplicate = await Participant.findOne({ mobile });
        if (duplicate) {
          if (normalizeKey(duplicate.name) !== normalizeKey(input.name) ||
              duplicate.collegeKey !== collegeKey ||
              duplicate.departmentKey !== departmentKey) {
            return { error: "This mobile number is already linked to another participant profile. Please check the details or contact the organisers." } as const;
          }
          return { participant: duplicate } as const;
        }
        continue;
      }
      throw error;
    }
  }

  return { error: "Unable to create the participant record. Please try again." } as const;
}

export async function createRegistrationFlow(participantId: string) {
  await connectDB();
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + FLOW_DURATION_MS);
  await RegistrationFlow.create({ tokenHash: hashToken(token), participantId, expiresAt });

  const cookieStore = await cookies();
  cookieStore.set(FLOW_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: expiresAt,
  });
}

export async function getFlowParticipant() {
  await connectDB();
  const cookieStore = await cookies();
  const token = cookieStore.get(FLOW_COOKIE)?.value;
  if (!token) return null;

  const flow = await RegistrationFlow.findOne({
    tokenHash: hashToken(token),
    expiresAt: { $gt: new Date() },
  });
  if (!flow) return null;
  return Participant.findById(flow.participantId);
}

export async function getPublicRegistrationStatus() {
  await connectDB();
  const settings = await Settings.findOne({ symposiumName: "DATAVERSE" }).sort({ createdAt: 1 }).lean();
  const now = Date.now();
  const deadline = settings?.registrationDeadline ? new Date(settings.registrationDeadline).getTime() : null;
  const registrationOpen = settings
    ? settings.registrationEnabled !== false && settings.maintenanceMode !== true && (!deadline || deadline > now)
    : true;

  const releaseValue = process.env.DATAVERSE_ID_LOOKUP_ENABLED_AT;
  const releaseDate = releaseValue ? new Date(releaseValue) : null;
  const idLookupEnabled = Boolean(releaseDate && !Number.isNaN(releaseDate.getTime()) && now >= releaseDate.getTime());

  return {
    registrationOpen,
    registrationDeadline: deadline ? new Date(deadline).toISOString() : null,
    idLookupEnabled,
    idLookupEnabledAt: releaseDate && !Number.isNaN(releaseDate.getTime()) ? releaseDate.toISOString() : null,
  };
}
