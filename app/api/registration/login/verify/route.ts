import { connection, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { z } from "zod";
import Participant from "@/models/Participant";
import RegistrationOtp from "@/models/RegistrationOtp";
import { createRegistrationFlow } from "@/src/lib/public-registration";
import { hashRegistrationOtp } from "@/src/lib/registration-email";

const schema = z.object({
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  otp: z.string().regex(/^\d{6}$/),
});

export async function POST(request: Request) {
  await connection();
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Enter your registered email address and six-digit verification code." }, { status: 400 });
    }

    const email = parsed.data.email;
    const record = await RegistrationOtp.findOne({
      email,
      purpose: "login",
      consumedAt: null,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    if (!record || record.attempts >= 5) {
      return NextResponse.json({ success: false, message: "That code is invalid or expired. Request a new login code." }, { status: 400 });
    }

    const expected = Buffer.from(record.otpHash, "hex");
    const received = Buffer.from(hashRegistrationOtp(parsed.data.otp), "hex");
    if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
      record.attempts += 1;
      await record.save();
      return NextResponse.json({ success: false, message: "That verification code is incorrect." }, { status: 400 });
    }

    const participant = await Participant.findOne({ email });
    if (!participant) {
      record.consumedAt = new Date();
      await record.save();
      return NextResponse.json({ success: false, message: "No DATAVERSE participant profile was found for this email address." }, { status: 404 });
    }

    record.consumedAt = new Date();
    await record.save();

    await createRegistrationFlow(participant._id.toString());

    return NextResponse.json({
      success: true,
      message: "You are securely logged in.",
      participant: {
        name: participant.name,
        mobile: participant.mobile,
        email: participant.email,
        college: participant.college,
        city: participant.city,
        department: participant.department,
      },
      hasEventRegistrations: (participant.eventSlugs?.length ?? 0) > 0,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "OTP_HASH_SECRET_NOT_CONFIGURED") {
      return NextResponse.json({ success: false, message: "Participant login is not configured yet. Please contact the organisers." }, { status: 503 });
    }
    console.error("Participant login OTP verification error:", error);
    return NextResponse.json({ success: false, message: "Unable to verify login. Please try again." }, { status: 500 });
  }
}
