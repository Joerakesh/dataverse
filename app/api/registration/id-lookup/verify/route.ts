import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { z } from "zod";
import Participant from "@/models/Participant";
import RegistrationOtp from "@/models/RegistrationOtp";
import { getPublicRegistrationStatus, normalizeIndianMobile } from "@/src/lib/public-registration";
import { hashRegistrationOtp } from "@/src/lib/sms";

const schema = z.object({
  mobile: z.string().trim().min(10).max(20),
  otp: z.string().regex(/^\d{6}$/),
});

export async function POST(request: Request) {
  try {
    const status = await getPublicRegistrationStatus();
    if (!status.idLookupEnabled) return NextResponse.json({ success: false, message: "Unique ID retrieval is not available yet." }, { status: 403 });

    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ success: false, message: "Enter your mobile number and six-digit verification code." }, { status: 400 });
    const mobile = normalizeIndianMobile(parsed.data.mobile);
    const record = await RegistrationOtp.findOne({
      mobile,
      consumedAt: null,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    if (!record || record.attempts >= 5) {
      return NextResponse.json({ success: false, message: "The code is invalid or expired. Request a new code." }, { status: 400 });
    }

    const expected = Buffer.from(record.otpHash, "hex");
    const received = Buffer.from(hashRegistrationOtp(parsed.data.otp), "hex");
    if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
      record.attempts += 1;
      await record.save();
      return NextResponse.json({ success: false, message: "That verification code is incorrect." }, { status: 400 });
    }

    record.consumedAt = new Date();
    await record.save();

    const participant = await Participant.findOne({ mobile }).select("personId name").lean();
    if (!participant) return NextResponse.json({ success: false, message: "No DATAVERSE participant record was found for this mobile number." }, { status: 404 });

    return NextResponse.json({ success: true, participant: { personId: participant.personId, name: participant.name } });
  } catch (error) {
    if (error instanceof Error && error.message === "OTP_HASH_SECRET_NOT_CONFIGURED") {
      return NextResponse.json({ success: false, message: "ID lookup is not configured yet. Please contact the organisers." }, { status: 503 });
    }
    console.error("ID lookup verification error:", error);
    return NextResponse.json({ success: false, message: "Unable to verify your code. Please try again." }, { status: 500 });
  }
}
