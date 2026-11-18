import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { z } from "zod";
import Registration from "@/models/Registration";
import Team from "@/models/Team";
import { requireParticipant } from "@/src/lib/authorization";
import { getRegisterableEvent } from "@/src/lib/registration";

const schema = z.object({ inviteCode: z.string().trim().min(6).max(32).transform((value) => value.toUpperCase()) });

export async function POST(request: Request) {
  try {
    const user = await requireParticipant();
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ success: false, message: "Invalid invite code." }, { status: 400 });
    const team = await Team.findOne({ inviteCode: parsed.data.inviteCode, status: "open" });
    if (!team) return NextResponse.json({ success: false, message: "Team not found or full." }, { status: 404 });
    const result = await getRegisterableEvent(team.eventId.toString());
    if ("error" in result) return NextResponse.json({ success: false, message: result.error }, { status: result.status });
    const { event } = result;
    if (team.members.some((id: Types.ObjectId) => id.equals(user._id))) return NextResponse.json({ success: false, message: "You are already on this team." }, { status: 409 });
    if (await Registration.exists({ userId: user._id, eventId: event._id, status: { $in: ["pending", "confirmed"] } })) return NextResponse.json({ success: false, message: "You are already registered for this event." }, { status: 409 });
    if (team.members.length >= event.teamSize.max) return NextResponse.json({ success: false, message: "This team is full." }, { status: 409 });
    if (event.maxParticipants && (await Registration.countDocuments({ eventId: event._id, status: { $in: ["pending", "confirmed"] } })) >= event.maxParticipants) return NextResponse.json({ success: false, message: "This event is full." }, { status: 409 });
    team.members.push(user._id);
    if (team.members.length >= event.teamSize.max) team.status = "full";
    await team.save();
    try {
      await Registration.create({ userId: user._id, eventId: event._id, teamId: team._id, registrationType: "team", status: "confirmed" });
    } catch (error) {
      team.members = team.members.filter((id: Types.ObjectId) => !id.equals(user._id));
      team.status = "open";
      await team.save();
      throw error;
    }
    return NextResponse.json({ success: true, team: { id: team._id.toString(), name: team.name, status: team.status } }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
    console.error("Join team error:", error);
    return NextResponse.json({ success: false, message: "Unable to join team." }, { status: 500 });
  }
}
