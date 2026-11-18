import { NextResponse } from "next/server";
import { z } from "zod";
import Registration from "@/models/Registration";
import { requireParticipant } from "@/src/lib/authorization";
import { getRegisterableEvent } from "@/src/lib/registration";

const schema = z.object({ eventId: z.string().regex(/^[a-f\d]{24}$/i) });

export async function POST(request: Request) {
  try {
    const user = await requireParticipant();
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ success: false, message: "Invalid event ID." }, { status: 400 });
    const result = await getRegisterableEvent(parsed.data.eventId);
    if ("error" in result) return NextResponse.json({ success: false, message: result.error }, { status: result.status });
    const { event } = result;
    if (event.teamSize.max > 1) return NextResponse.json({ success: false, message: "This event requires team registration." }, { status: 409 });
    const existing = await Registration.findOne({ userId: user._id, eventId: event._id, status: { $in: ["pending", "confirmed"] } });
    if (existing) return NextResponse.json({ success: false, message: "You are already registered for this event." }, { status: 409 });
    if (event.maxParticipants) {
      const count = await Registration.countDocuments({ eventId: event._id, status: { $in: ["pending", "confirmed"] } });
      if (count >= event.maxParticipants) return NextResponse.json({ success: false, message: "This event is full." }, { status: 409 });
    }
    const registration = await Registration.create({ userId: user._id, eventId: event._id, registrationType: "individual", status: "confirmed" });
    return NextResponse.json({ success: true, registration: { id: registration._id.toString(), eventId: event._id.toString(), status: registration.status } }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
    console.error("Registration error:", error);
    return NextResponse.json({ success: false, message: "Unable to register." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await requireParticipant();
    const registrations = await Registration.find({ userId: user._id }).populate("eventId", "name slug category date venue").sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, registrations });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
    console.error("List registrations error:", error);
    return NextResponse.json({ success: false, message: "Unable to load registrations." }, { status: 500 });
  }
}
