import { connection, NextResponse } from "next/server";
import { randomInt } from "crypto";
import { z } from "zod";
import RegistrationOtp from "@/models/RegistrationOtp";
import Participant from "@/models/Participant";
import { hashRegistrationOtp, hashRegistrationRequestIp, sendRegistrationOtpEmail } from "@/src/lib/registration-email";

const schema = z.object({
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
});

const genericResponse = {
  success: true,
  message: "A verification code has been sent if this email belongs to a DATAVERSE participant. Check your inbox and spam folder.",
};

export async function POST(request: Request) {
  await connection();
  try {
    if ((!process.env.AWS_REGION && !process.env.AWS_DEFAULT_REGION)
      || !process.env.AWS_ACCESS_KEY_ID
      || !process.env.AWS_SECRET_ACCESS_KEY
      || !process.env.SES_FROM_EMAIL
      || !process.env.OTP_HASH_SECRET
      || process.env.OTP_HASH_SECRET.length < 32) {
      return NextResponse.json({ success: false, message: "Participant login email delivery is not configured yet. Please contact the organisers." }, { status: 503 });
    }

    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Enter the email address used when registering for DATAVERSE." }, { status: 400 });
    }

    const email = parsed.data.email;
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
      email,
      purpose: "login",
      createdAt: { $gt: new Date(Date.now() - 60 * 1000) },
    }).lean();
    if (recent) {
      return NextResponse.json({ success: false, message: "Please wait a minute before requesting another login code." }, { status: 429 });
    }

    const participant = await Participant.findOne({ email }).select("name").lean();
    if (!participant) return NextResponse.json(genericResponse);

    const otp = String(randomInt(100000, 1000000));
    const otpHash = hashRegistrationOtp(otp);
    await RegistrationOtp.create({
      email,
      purpose: "login",
      requestIpHash,
      otpHash,
      attempts: 0,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      consumedAt: null,
    });

    try {
      await sendRegistrationOtpEmail(email, otp, "login", participant.name);
    } catch (error) {
      await RegistrationOtp.deleteOne({ email, purpose: "login", otpHash });
      if (error instanceof Error && error.message === "SES_EMAIL_PROVIDER_NOT_CONFIGURED") {
        return NextResponse.json({ success: false, message: "Participant login email delivery is not configured. Please contact the organisers." }, { status: 503 });
      }
      throw error;
    }

    return NextResponse.json(genericResponse);
  } catch (error) {
    if (error instanceof Error && error.message === "OTP_HASH_SECRET_NOT_CONFIGURED") {
      return NextResponse.json({ success: false, message: "Participant login is not configured yet. Please contact the organisers." }, { status: 503 });
    }
    console.error("Participant login OTP email request error:", error);
    return NextResponse.json({ success: false, message: "Unable to start login. Please try again later." }, { status: 500 });
  }
}
