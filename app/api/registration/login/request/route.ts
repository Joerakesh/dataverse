import { connection, NextResponse } from "next/server";
import { randomInt } from "crypto";
import { z } from "zod";
import RegistrationOtp from "@/models/RegistrationOtp";
import Participant from "@/models/Participant";
import { normalizeIndianMobile } from "@/src/lib/public-registration";
import { hashRegistrationOtp, hashRegistrationRequestIp, sendRegistrationOtp } from "@/src/lib/sms";

const schema = z.object({
  mobile: z.string().trim().min(10).max(20),
});

const genericResponse = {
  success: true,
  message: "A verification code has been sent if this mobile number belongs to a DATAVERSE participant. Check your SMS messages.",
};

export async function POST(request: Request) {
  await connection();
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Enter your registered 10-digit mobile number." }, { status: 400 });
    }

    const mobile = normalizeIndianMobile(parsed.data.mobile);
    const forwardedFor = request.headers.get("x-forwarded-for");
    const clientIp = forwardedFor?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
    const requestIpHash = hashRegistrationRequestIp(clientIp);

    const hourlyRequests = await RegistrationOtp.countDocuments({
      requestIpHash,
      purpose: "login",
      createdAt: { $gt: new Date(Date.now() - 60 * 60 * 1000) },
    });
    if (hourlyRequests >= 10) {
      return NextResponse.json({ success: false, message: "Too many login attempts from this connection. Please try again later." }, { status: 429 });
    }

    const recent = await RegistrationOtp.findOne({
      mobile,
      purpose: "login",
      createdAt: { $gt: new Date(Date.now() - 60 * 1000) },
    }).lean();
    if (recent) {
      return NextResponse.json({ success: false, message: "Please wait a minute before requesting another login code." }, { status: 429 });
    }

    const participantExists = await Participant.exists({ mobile });
    if (!participantExists) {
      // Use the same response for registered and unregistered numbers to avoid account enumeration.
      return NextResponse.json(genericResponse);
    }

    const otp = String(randomInt(100000, 1000000));
    const otpHash = hashRegistrationOtp(otp);
    await RegistrationOtp.create({
      mobile,
      purpose: "login",
      requestIpHash,
      otpHash,
      attempts: 0,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      consumedAt: null,
    });

    try {
      await sendRegistrationOtp(mobile, otp);
    } catch (error) {
      await RegistrationOtp.deleteOne({ mobile, purpose: "login", otpHash });
      if (error instanceof Error && error.message === "SMS_PROVIDER_NOT_CONFIGURED") {
        return NextResponse.json({ success: false, message: "Participant login needs SMS delivery configured. Please contact the organisers." }, { status: 503 });
      }
      throw error;
    }

    return NextResponse.json(genericResponse);
  } catch (error) {
    if (error instanceof Error && error.message === "OTP_HASH_SECRET_NOT_CONFIGURED") {
      return NextResponse.json({ success: false, message: "Participant login is not configured yet. Please contact the organisers." }, { status: 503 });
    }
    console.error("Participant login OTP request error:", error);
    return NextResponse.json({ success: false, message: "Unable to start login. Please try again later." }, { status: 500 });
  }
}
