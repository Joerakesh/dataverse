import { NextResponse } from "next/server";
import { randomInt } from "crypto";
import { z } from "zod";
import RegistrationOtp from "@/models/RegistrationOtp";
import Participant from "@/models/Participant";
import { getPublicRegistrationStatus } from "@/src/lib/public-registration";
import { hashRegistrationOtp, hashRegistrationRequestIp, sendRegistrationOtpEmail } from "@/src/lib/registration-email";

const schema = z.object({ email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()) });

export async function POST(request: Request) {
  try {
    const status = await getPublicRegistrationStatus();
    if (!status.idLookupEnabled) return NextResponse.json({ success: false, message: "Unique ID retrieval is not available yet." }, { status: 403 });

    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ success: false, message: "Enter the email address used during registration." }, { status: 400 });
    const email = parsed.data.email;
    const forwardedFor = request.headers.get("x-forwarded-for");
    const clientIp = forwardedFor?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
    const requestIpHash = hashRegistrationRequestIp(clientIp);
    const hourlyRequests = await RegistrationOtp.countDocuments({
      requestIpHash,
      purpose: "id-lookup",
      createdAt: { $gt: new Date(Date.now() - 60 * 60 * 1000) },
    });
    if (hourlyRequests >= 10) {
      return NextResponse.json({ success: false, message: "Too many verification requests from this connection. Please try again later." }, { status: 429 });
    }

    const recent = await RegistrationOtp.findOne({
      email,
      purpose: "id-lookup",
      createdAt: { $gt: new Date(Date.now() - 60 * 1000) },
    }).lean();
    if (recent) return NextResponse.json({ success: false, message: "Please wait a minute before requesting another code." }, { status: 429 });

    const participant = await Participant.findOne({ email }).select("name").lean();
    if (!participant) {
      return NextResponse.json({ success: true, message: "A verification code has been sent if this email is registered. Check your inbox and spam folder." });
    }

    const otp = String(randomInt(100000, 1000000));
    const otpHash = hashRegistrationOtp(otp);
    await RegistrationOtp.create({
      email,
      purpose: "id-lookup",
      requestIpHash,
      otpHash,
      attempts: 0,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      consumedAt: null,
    });

    try {
      await sendRegistrationOtpEmail(email, otp, "id-lookup", participant.name);
    } catch (error) {
      await RegistrationOtp.deleteOne({ email, purpose: "id-lookup", otpHash });
      if (error instanceof Error && error.message === "SES_EMAIL_PROVIDER_NOT_CONFIGURED") {
        return NextResponse.json({ success: false, message: "ID lookup email delivery has not been configured yet. Please contact the organisers." }, { status: 503 });
      }
      throw error;
    }

    return NextResponse.json({ success: true, message: "A verification code has been sent if this email is registered. Check your inbox and spam folder." });
  } catch (error) {
    if (error instanceof Error && error.message === "OTP_HASH_SECRET_NOT_CONFIGURED") {
      return NextResponse.json({ success: false, message: "ID lookup is not configured yet. Please contact the organisers." }, { status: 503 });
    }
    console.error("ID lookup OTP email request error:", error);
    return NextResponse.json({ success: false, message: "Unable to send a verification code. Please try again later." }, { status: 500 });
  }
}
