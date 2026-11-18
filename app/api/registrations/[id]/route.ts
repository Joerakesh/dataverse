import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { z } from "zod";
import Registration from "@/models/Registration";
import Team from "@/models/Team";
import { requireParticipant } from "@/src/lib/authorization";

export async function DELETE(_request: Request, context: RouteContext<"/api/registrations/[id]">) {
  try {
    const user = await requireParticipant();
    const { id } = await context.params;
    if (!z.string().regex(/^[a-f\d]{24}$/i).safeParse(id).success) return NextResponse.json({ success: false, message: "Invalid registration ID." }, { status: 400 });
    const registration = await Registration.findOne({ _id: id, userId: user._id, status: { $in: ["pending", "confirmed"] } });
    if (!registration) return NextResponse.json({ success: false, message: "Registration not found." }, { status: 404 });
    registration.status = "cancelled";
    await registration.save();
    if (registration.teamId) {
      const team = await Team.findById(registration.teamId);
      if (team) {
        if (team.leaderId.equals(user._id)) {
          team.status = "disbanded";
          await team.save();
          await Registration.updateMany({ teamId: team._id, status: { $in: ["pending", "confirmed"] } }, { $set: { status: "cancelled" } });
        } else {
          team.members = team.members.filter((id: Types.ObjectId) => !id.equals(user._id));
          if (team.status === "full") team.status = "open";
          await team.save();
        }
      }
    }
    return NextResponse.json({ success: true, message: "Registration cancelled." });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
    console.error("Cancel registration error:", error);
    return NextResponse.json({ success: false, message: "Unable to cancel registration." }, { status: 500 });
  }
}
