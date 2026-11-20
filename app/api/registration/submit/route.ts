import { NextResponse } from "next/server";
import { z } from "zod";
import Participant from "@/models/Participant";
import EventRegistration from "@/models/EventRegistration";
import EventCollegeQuota from "@/models/EventCollegeQuota";
import { SYMPOSIUM_EVENTS } from "@/src/data/events";
import {
  createOrFindParticipant,
  createRegistrationReference,
  getFlowParticipant,
  getPublicRegistrationStatus,
  normalizeIndianMobile,
  normalizeKey,
  normalizeRegistrationEmail,
  normalizeRegisterNumber,
} from "@/src/lib/public-registration";
import { isEventRegistrationOpen } from "@/src/lib/event-registration-settings";

const schema = z.object({
  eventSlug: z.string().trim().min(2).max(80),
  members: z.array(z.object({
    name: z.string().trim().min(2).max(100),
    mobile: z.string().trim().min(10).max(20),
    email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
    registerNumber: z.string().trim().min(1).max(60),
  })).min(1).max(3),
});

async function reserveDarkQuestTeam(collegeKey: string) {
  const existing = await EventCollegeQuota.findOneAndUpdate(
    { eventSlug: "dark-quest-blindfold-clues", collegeKey, teamCount: { $lt: 2 } },
    { $inc: { teamCount: 1 } },
    { returnDocument: "after" },
  );
  if (existing) return true;

  try {
    await EventCollegeQuota.create({
      eventSlug: "dark-quest-blindfold-clues",
      collegeKey,
      teamCount: 1,
    });
    return true;
  } catch (error) {
    if (!(error && typeof error === "object" && "code" in error && error.code === 11000)) throw error;
    const retry = await EventCollegeQuota.findOneAndUpdate(
      { eventSlug: "dark-quest-blindfold-clues", collegeKey, teamCount: { $lt: 2 } },
      { $inc: { teamCount: 1 } },
      { returnDocument: "after" },
    );
    return Boolean(retry);
  }
}

export async function POST(request: Request) {
  let darkQuestQuotaReserved = false;
  let reservedCollegeKey = "";
  let claimedParticipantIds: string[] = [];
  let claimedEventSlug = "";

  try {
    const contact = await getFlowParticipant();
    if (!contact) {
      return NextResponse.json({ success: false, message: "Your registration session expired. Please start again." }, { status: 401 });
    }
    if (!contact.email) {
      return NextResponse.json({ success: false, message: "Add an email address to your participant profile before registering an event." }, { status: 409 });
    }

    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Please check every team member's name, mobile number and email address.", errors: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const status = await getPublicRegistrationStatus();
    if (!status.registrationOpen) {
      return NextResponse.json({ success: false, message: "Online registration is currently closed." }, { status: 409 });
    }

    const event = SYMPOSIUM_EVENTS.find((item) => item.slug === parsed.data.eventSlug);
    claimedEventSlug = event?.slug ?? "";
    if (!event) {
      return NextResponse.json({ success: false, message: "That event is not available." }, { status: 404 });
    }
    if (!(await isEventRegistrationOpen(event.slug))) {
      return NextResponse.json({ success: false, message: "Registration for " + event.name + " is currently closed." }, { status: 409 });
    }

    if (parsed.data.members.length < event.minTeam || parsed.data.members.length > event.maxTeam) {
      return NextResponse.json({ success: false, message: "This event requires " + event.teamSize + "." }, { status: 400 });
    }

    const department = contact.department;
    const departmentKey = normalizeKey(department);
    const eligibleDepartment = /(computer|computing|data|information|\bit\b|mathemat|statistic|artificial intelligence|machine learning|software|cyber|analytics|business intelligence)/i.test(department);
    if (!eligibleDepartment) {
      return NextResponse.json({
        success: false,
        message: "The rulebook is intended for Computer Science, Computer Applications, Data Science, IT, Mathematics, Statistics and related disciplines. Please contact the organisers if your department is related but not recognised.",
      }, { status: 400 });
    }

    const membersWithDetails = parsed.data.members.map((member) => ({
      name: member.name.trim(),
      mobile: normalizeIndianMobile(member.mobile),
      email: normalizeRegistrationEmail(member.email),
      registerNumber: normalizeRegisterNumber(member.registerNumber),
    }));
    const phoneNumbers = membersWithDetails.map((member) => member.mobile);
    const emailAddresses = membersWithDetails.map((member) => member.email);
    if (new Set(phoneNumbers).size !== phoneNumbers.length) {
      return NextResponse.json({ success: false, message: "Each team member must have a different mobile number." }, { status: 400 });
    }
    if (new Set(emailAddresses).size !== emailAddresses.length) {
      return NextResponse.json({ success: false, message: "Each team member must have a different email address." }, { status: 400 });
    }
    const registerNumbers = membersWithDetails.map((member) => member.registerNumber);
    if (new Set(registerNumbers).size !== registerNumbers.length) {
      return NextResponse.json({ success: false, message: "Each team member must have a different college register number." }, { status: 400 });
    }

    const participantResults = await Promise.all(membersWithDetails.map((member) =>
      createOrFindParticipant({
        name: member.name,
        mobile: member.mobile,
        email: member.email,
        registerNumber: member.registerNumber,
        college: contact.college,
        city: contact.city,
        department: contact.department,
      }),
    ));
    const failedParticipant = participantResults.find((result) => "error" in result);
    if (failedParticipant && "error" in failedParticipant) {
      return NextResponse.json({ success: false, message: failedParticipant.error }, { status: 409 });
    }

    // Resolve previous event history in one database query instead of one query per member.
    const previousRegistrations = await EventRegistration.find({
      status: "confirmed",
      "members.mobile": { $in: phoneNumbers },
    }).select("eventSlug members.mobile").lean();
    const eventsByMobile = new Map<string, Set<string>>();
    for (const registration of previousRegistrations) {
      for (const registeredMember of registration.members) {
        if (!phoneNumbers.includes(registeredMember.mobile)) continue;
        const history = eventsByMobile.get(registeredMember.mobile) ?? new Set<string>();
        history.add(registration.eventSlug);
        eventsByMobile.set(registeredMember.mobile, history);
      }
    }

    for (const member of membersWithDetails) {
      const previousEvents = eventsByMobile.get(member.mobile) ?? new Set<string>();
      if (previousEvents.has(event.slug)) {
        return NextResponse.json({ success: false, message: member.name + " is already registered for this event." }, { status: 409 });
      }
      if (previousEvents.size >= 2) {
        return NextResponse.json({ success: false, message: member.name + " has already reached the two-event participation limit." }, { status: 409 });
      }
    }

    const resolvedMembers = membersWithDetails.map((member, index) => {
      const result = participantResults[index];
      if (!result || "error" in result) throw new Error("Unable to resolve participant profile.");
      return {
        participantId: result.participant._id,
        name: result.participant.name,
        mobile: result.participant.mobile,
        email: result.participant.email,
        registerNumber: result.participant.registerNumber,
      };
    });

    const collegeKey = contact.collegeKey || normalizeKey(contact.college);
    if (event.slug === "dark-quest-blindfold-clues") {
      darkQuestQuotaReserved = await reserveDarkQuestTeam(collegeKey);
      if (!darkQuestQuotaReserved) {
        return NextResponse.json({ success: false, message: "Dark Quest already has the maximum of two teams from your college." }, { status: 409 });
      }
      reservedCollegeKey = collegeKey;
    } else {
      const departmentQuotaKey = event.slug + "|" + collegeKey + "|" + departmentKey;
      const existingTeam = await EventRegistration.findOne({
        departmentQuotaKey,
        status: "confirmed",
      }).lean();
      if (existingTeam) {
        return NextResponse.json({ success: false, message: "Your college and department already have a team registered for this event." }, { status: 409 });
      }
    }

    const reservationResults = await Promise.all(resolvedMembers.map(async (member) => {
      const updated = await Participant.findOneAndUpdate(
        {
          _id: member.participantId,
          eventSlugs: { $ne: event.slug },
          $expr: { $lt: [{ $size: { $ifNull: ["$eventSlugs", []] } }, 2] },
        },
        { $addToSet: { eventSlugs: event.slug } },
        { returnDocument: "after" },
      );
      if (updated) return { member, updated: true as const };

      const current = await Participant.findById(member.participantId).select("eventSlugs").lean();
      return {
        member,
        updated: false as const,
        error: current?.eventSlugs?.includes(event.slug) ? "DUPLICATE_EVENT_MEMBER:" : "EVENT_LIMIT_REACHED:",
      };
    }));
    claimedParticipantIds = reservationResults
      .filter((result) => result.updated)
      .map((result) => result.member.participantId.toString());

    const failedReservation = reservationResults.find((result) => !result.updated);
    if (failedReservation && !failedReservation.updated) {
      throw new Error(failedReservation.error + failedReservation.member.name);
    }

    const registration = await EventRegistration.create({
      registrationReference: createRegistrationReference(),
      eventSlug: event.slug,
      eventName: event.name,
      contactParticipantId: contact._id,
      college: contact.college,
      collegeKey,
      city: contact.city,
      department,
      departmentKey,
      ...(event.slug === "dark-quest-blindfold-clues"
        ? {}
        : { departmentQuotaKey: event.slug + "|" + collegeKey + "|" + departmentKey }),
      members: resolvedMembers,
      teamSize: resolvedMembers.length,
      status: "confirmed",
    });

    void registration;
    claimedParticipantIds = [];
    darkQuestQuotaReserved = false;

    return NextResponse.json({
      success: true,
      message: "Your team has been registered for " + event.name + ".",
      event: event.name,
      teamSize: resolvedMembers.length,
      members: resolvedMembers.map((member) => member.name),
    }, { status: 201 });
  } catch (error) {
    if (claimedParticipantIds.length > 0) {
      await Participant.updateMany(
        { _id: { $in: claimedParticipantIds } },
        { $pull: { eventSlugs: claimedEventSlug } },
      ).catch(() => undefined);
    }
    if (darkQuestQuotaReserved && reservedCollegeKey) {
      await EventCollegeQuota.updateOne(
        { eventSlug: "dark-quest-blindfold-clues", collegeKey: reservedCollegeKey },
        { $inc: { teamCount: -1 } },
      ).catch(() => undefined);
    }
    if (error instanceof Error && error.message.startsWith("DUPLICATE_EVENT_MEMBER:")) {
      return NextResponse.json({ success: false, message: error.message.split(":").slice(1).join(":") + " is already registered for this event." }, { status: 409 });
    }
    if (error instanceof Error && error.message.startsWith("EVENT_LIMIT_REACHED:")) {
      return NextResponse.json({ success: false, message: error.message.split(":").slice(1).join(":") + " has already reached the two-event participation limit." }, { status: 409 });
    }
    if (error instanceof Error && /mobile number|email address|register number/i.test(error.message)) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
    if (error && typeof error === "object" && "code" in error && error.code === 11000) {
      return NextResponse.json({ success: false, message: "A team from this department or one of these participants is already registered for this event." }, { status: 409 });
    }
    console.error("Event registration error:", error);
    return NextResponse.json({ success: false, message: "Unable to complete this event registration. Please try again." }, { status: 500 });
  }
}
