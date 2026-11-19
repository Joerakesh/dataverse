import { NextResponse } from "next/server";
import { randomInt } from "crypto";
import { z } from "zod";
import RegistrationOtp from "@/models/RegistrationOtp";
import Participant from "@/models/Participant";
import { getPublicRegistrationStatus, normalizeIndianMobile } from "@/src/lib/public-registration";
import { hashRegistrationOtp, hashRegistrationRequestIp, sendRegistrationOtp } from "@/src/lib/sms";

export const runtime = "nodejs";
const schema = z.object({ mobile: z.string().trim().min(10).max(20) });

export async function POST(request: Request) {
  try {
    const status = await getPublicRegistrationStatus();
    if (!status.idLookupEnabled) return NextResponse.json({ success: false, message: "Unique ID retrieval is not available yet." }, { status: 403 });

    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ success: false, message: "Enter a valid mobile number." }, { status: 400 });
    const mobile = normalizeIndianMobile(parsed.data.mobile);
    const forwardedFor = request.headers.get("x-forwarded-for");
    const clientIp = forwardedFor?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
    const requestIpHash = hashRegistrationRequestIp(clientIp);
    const hourlyRequests = await RegistrationOtp.countDocuments({
      requestIpHash,
      createdAt: { $gt: new Date(Date.now() - 60 * 60 * 1000) },
    });
    if (hourlyRequests >= 10) {
      return NextResponse.json({ success: false, message: "Too many verification requests from this connection. Please try again later." }, { status: 429 });
    }

    const participantExists = await Participant.exists({ mobile });
    if (!participantExists) {
      // Same public response as a successful request prevents phone-number enumeration.
      return NextResponse.json({ success: true, message: "A verification code has been sent if this number is registered. Check your SMS messages." });
    }

    const recent = await RegistrationOtp.findOne({
      mobile,
      createdAt: { $gt: new Date(Date.now() - 60 * 1000) },
    }).lean();
    if (recent) return NextResponse.json({ success: false, message: "Please wait a minute before requesting another code." }, { status: 429 });

    const otp = String(randomInt(100000, 1000000));
    const otpHash = hashRegistrationOtp(otp);
    await RegistrationOtp.create({
      mobile,
      requestIpHash,
      otpHash,
      attempts: 0,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      consumedAt: null,
    });

    try {
      await sendRegistrationOtp(mobile, otp);
    } catch (error) {
      await RegistrationOtp.deleteOne({ mobile, otpHash });
      if (error instanceof Error && error.message === "SMS_PROVIDER_NOT_CONFIGURED") {
        return NextResponse.json({ success: false, message: "ID lookup is enabled, but SMS delivery has not been configured yet. Please contact the organisers." }, { status: 503 });
      }
      throw error;
    }

    // Keep the response generic so mobile-number existence is not disclosed.
    return NextResponse.json({ success: true, message: "A verification code has been sent if this number is registered. Check your SMS messages." });
  } catch (error) {
    if (error instanceof Error && error.message === "OTP_HASH_SECRET_NOT_CONFIGURED") {
      return NextResponse.json({ success: false, message: "ID lookup is not configured yet. Please contact the organisers." }, { status: 503 });
    }
    console.error("ID lookup OTP request error:", error);
    return NextResponse.json({ success: false, message: "Unable to send a verification code. Please try again later." }, { status: 500 });
  }
}
