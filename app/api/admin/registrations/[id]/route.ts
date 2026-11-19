import { connection, NextResponse } from "next/server";
import { z } from "zod";
import { Types } from "mongoose";
import EventRegistration from "@/models/EventRegistration";
import Participant from "@/models/Participant";
import EventCollegeQuota from "@/models/EventCollegeQuota";
import { SYMPOSIUM_EVENTS } from "@/src/data/events";
import { requirePermission } from "@/src/lib/authorization";
import {
  normalizeIndianMobile,
  normalizeRegistrationEmail,
} from "@/src/lib/public-registration";

const idSchema = z.string().regex(/^[a-f\d]{24}$/i);
const updateMemberSchema = z.object({
  participantId: idSchema,
  name: z.string().trim().min(2).max(100),
  mobile: z.string().trim().min(10).max(20),
  email: z.string().trim().email().max(254),
});
const removeMemberSchema = z.object({ participantId: idSchema });

async function releaseEventFromParticipantIfUnused(participantId: unknown, eventSlug: string, registrationId: unknown) {
  const anotherActiveRegistration = await EventRegistration.exists({
    _id: { $ne: registrationId },
    eventSlug,
    status: "confirmed",
    "members.participantId": participantId,
  });

  if (!anotherActiveRegistration) {
    await Participant.updateOne(
      { _id: participantId },
      { $pull: { eventSlugs: eventSlug } },
    );
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext<"/api/admin/registrations/[id]">,
) {
  await connection();

  try {
    await requirePermission("registrations:manage");

    const { id } = await context.params;
    if (!idSchema.safeParse(id).success) {
      return NextResponse.json({ success: false, message: "Invalid registration ID." }, { status: 400 });
    }

    const parsed = updateMemberSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Enter a valid participant name, mobile number and email address." }, { status: 400 });
    }

    const registration = await EventRegistration.findById(id);
    if (!registration || registration.status !== "confirmed") {
      return NextResponse.json({ success: false, message: "Active registration not found." }, { status: 404 });
    }

    const memberExists = registration.members.some(
      (member: { participantId: Types.ObjectId }) => member.participantId.toString() === parsed.data.participantId,
    );
    if (!memberExists) {
      return NextResponse.json({ success: false, message: "That participant is not part of this registration." }, { status: 404 });
    }

    let mobile: string;
    let email: string;
    try {
      mobile = normalizeIndianMobile(parsed.data.mobile);
      email = normalizeRegistrationEmail(parsed.data.email);
    } catch (error) {
      return NextResponse.json({
        success: false,
        message: error instanceof Error ? error.message : "Enter valid participant contact details.",
      }, { status: 400 });
    }

    const participant = await Participant.findById(parsed.data.participantId);
    if (!participant) {
      return NextResponse.json({ success: false, message: "Participant profile not found." }, { status: 404 });
    }

    const [mobileOwner, emailOwner] = await Promise.all([
      Participant.findOne({ mobile }).select("_id").lean(),
      Participant.findOne({ email }).select("_id").lean(),
    ]);

    if (mobileOwner && mobileOwner._id.toString() !== participant._id.toString()) {
      return NextResponse.json({ success: false, message: "That mobile number is already linked to another participant." }, { status: 409 });
    }
    if (emailOwner && emailOwner._id.toString() !== participant._id.toString()) {
      return NextResponse.json({ success: false, message: "That email address is already linked to another participant." }, { status: 409 });
    }

    participant.name = parsed.data.name;
    participant.mobile = mobile;
    participant.email = email;
    await participant.save();

    // Participant details are denormalised into every event registration.
    // Keep all existing registrations in sync with the canonical profile.
    await EventRegistration.updateMany(
      { "members.participantId": participant._id },
      {
        $set: {
          "members.$[member].name": participant.name,
          "members.$[member].mobile": participant.mobile,
          "members.$[member].email": participant.email,
        },
      },
      { arrayFilters: [{ "member.participantId": participant._id }] },
    );

    return NextResponse.json({
      success: true,
      message: "Participant details updated across their registrations.",
      participant: {
        id: participant._id.toString(),
        name: participant.name,
        mobile: participant.mobile,
        email: participant.email,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ success: false, message: "You do not have permission to manage participants." }, { status: 403 });
    }
    if (error && typeof error === "object" && "code" in error && error.code === 11000) {
      return NextResponse.json({ success: false, message: "That mobile number or email address is already in use." }, { status: 409 });
    }
    console.error("Admin participant update error:", error);
    return NextResponse.json({ success: false, message: "Unable to update participant details." }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext<"/api/admin/registrations/[id]">,
) {
  await connection();

  try {
    await requirePermission("registrations:manage");

    const { id } = await context.params;
    if (!idSchema.safeParse(id).success) {
      return NextResponse.json({ success: false, message: "Invalid registration ID." }, { status: 400 });
    }

    let body: unknown = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }
    const parsed = removeMemberSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Invalid participant ID." }, { status: 400 });
    }

    const registration = await EventRegistration.findById(id);
    if (!registration || registration.status !== "confirmed") {
      return NextResponse.json({ success: false, message: "Active registration not found." }, { status: 404 });
    }

    if (parsed.data.participantId) {
      const member = registration.members.find(
        (item: { participantId: Types.ObjectId }) => item.participantId.toString() === parsed.data.participantId,
      );
      if (!member) {
        return NextResponse.json({ success: false, message: "That participant is not part of this registration." }, { status: 404 });
      }

      const remainingMembers = registration.members.filter(
        (item: { participantId: Types.ObjectId }) => item.participantId.toString() !== parsed.data.participantId,
      );
      const event = SYMPOSIUM_EVENTS.find((item) => item.slug === registration.eventSlug);
      const minimumTeamSize = event?.minTeam ?? 1;
      if (remainingMembers.length < minimumTeamSize) {
        return NextResponse.json({
          success: false,
          message: "This event requires at least " + minimumTeamSize + " member(s). Cancel the full team registration to remove its final participant.",
        }, { status: 409 });
      }

      registration.members = remainingMembers;
      registration.teamSize = remainingMembers.length;
      if (registration.contactParticipantId.toString() === parsed.data.participantId) {
        registration.set("contactParticipantId", remainingMembers[0].participantId);
      }
      await registration.save();
      await releaseEventFromParticipantIfUnused(member.participantId, registration.eventSlug, registration._id);

      return NextResponse.json({
        success: true,
        message: "Participant removed from this team.",
        teamSize: registration.teamSize,
      });
    }

    const participantIds = registration.members.map((member: { participantId: Types.ObjectId }) => member.participantId);
    const eventSlug = registration.eventSlug;
    const collegeKey = registration.collegeKey;

    registration.status = "cancelled";
    registration.set("departmentQuotaKey", undefined);
    await registration.save();

    if (eventSlug === "dark-quest-blindfold-clues") {
      await EventCollegeQuota.updateOne(
        { eventSlug, collegeKey, teamCount: { $gt: 0 } },
        { $inc: { teamCount: -1 } },
      );
    }

    await Promise.all(
      participantIds.map((participantId: Types.ObjectId) =>
        releaseEventFromParticipantIfUnused(participantId, eventSlug, registration._id),
      ),
    );

    return NextResponse.json({ success: true, message: "Team registration cancelled." });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ success: false, message: "You do not have permission to manage participants." }, { status: 403 });
    }
    console.error("Admin participant removal error:", error);
    return NextResponse.json({ success: false, message: "Unable to remove the participant or cancel the team." }, { status: 500 });
  }
}
