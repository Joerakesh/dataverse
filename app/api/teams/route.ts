import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import Registration from "@/models/Registration";
import Team from "@/models/Team";
import { requireParticipant } from "@/src/lib/authorization";
import { getRegisterableEvent } from "@/src/lib/registration";

const schema = z.object({ eventId: z.string().regex(/^[a-f\d]{24}$/i), name: z.string().trim().min(2).max(60) });

export async function POST(request: Request) {
  try {
    const user = await requireParticipant();
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ success: false, message: "Provide a valid event ID and team name." }, { status: 400 });
    const result = await getRegisterableEvent(parsed.data.eventId);
    if ("error" in result) return NextResponse.json({ success: false, message: result.error }, { status: result.status });
    const { event } = result;
    if (event.teamSize.max < 2) return NextResponse.json({ success: false, message: "This event does not support teams." }, { status: 409 });
    const existing = await Registration.findOne({ userId: user._id, eventId: event._id, status: { $in: ["pending", "confirmed"] } });
    if (existing) return NextResponse.json({ success: false, message: "You are already registered for this event." }, { status: 409 });
    if (event.maxParticipants && (await Registration.countDocuments({ eventId: event._id, status: { $in: ["pending", "confirmed"] } })) >= event.maxParticipants) {
      return NextResponse.json({ success: false, message: "This event is full." }, { status: 409 });
    }
    const inviteCode = randomBytes(6).toString("hex").toUpperCase();
    const team = await Team.create({ name: parsed.data.name, eventId: event._id, leaderId: user._id, members: [user._id], inviteCode, status: "open" });
    try {
      await Registration.create({ userId: user._id, eventId: event._id, teamId: team._id, registrationType: "team", status: "confirmed" });
    } catch (error) {
      await Team.deleteOne({ _id: team._id });
      throw error;
    }
    return NextResponse.json({ success: true, team: { id: team._id.toString(), name: team.name, inviteCode, status: team.status } }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
    console.error("Team creation error:", error);
    return NextResponse.json({ success: false, message: "Unable to create team." }, { status: 500 });
  }
}
