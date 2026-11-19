import { NextResponse } from "next/server";
import EventRegistration from "@/models/EventRegistration";
import { getFlowParticipant } from "@/src/lib/public-registration";

export const runtime = "nodejs";

export async function GET() {
  try {
    const participant = await getFlowParticipant();
    if (!participant) {
      return NextResponse.json({ success: false, message: "Your registration session has expired." }, { status: 401 });
    }

    const registrations = await EventRegistration.find({
      status: "confirmed",
      $or: [
        { contactParticipantId: participant._id },
        { "members.mobile": participant.mobile },
      ],
    }).select("eventSlug").lean();

    return NextResponse.json({
      success: true,
      registeredEventSlugs: Array.from(new Set(registrations.map((item) => item.eventSlug))),
    });
  } catch (error) {
    console.error("Read participant event registrations error:", error);
    return NextResponse.json({ success: false, message: "Unable to load your event registrations." }, { status: 500 });
  }
}
