import { connection, NextResponse } from "next/server";
import { z } from "zod";
import EventRegistration from "@/models/EventRegistration";
import Participant from "@/models/Participant";
import {
  createOrFindParticipant,
  createRegistrationFlow,
  getFlowParticipant,
  getPublicRegistrationStatus,
  normalizeIndianMobile,
  normalizeKey,
  normalizeRegistrationEmail,
  normalizeRegisterNumber,
} from "@/src/lib/public-registration";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  mobile: z.string().trim().min(10).max(20),
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  college: z.string().trim().min(2).max(180),
  city: z.string().trim().min(2).max(100),
  department: z.string().trim().min(2).max(120),
  registerNumber: z.string().trim().min(1).max(60),
});

const editSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  college: z.string().trim().min(2).max(180),
  city: z.string().trim().min(2).max(100),
  department: z.string().trim().min(2).max(120),
  registerNumber: z.string().trim().min(1).max(60),
});

function publicParticipant(participant: {
  name: string;
  mobile: string;
  email?: string | null;
  college: string;
  city: string;
  department: string;
  registerNumber?: string;
}) {
  return {
    name: participant.name,
    mobile: participant.mobile,
    email: participant.email ?? "",
    college: participant.college,
    city: participant.city,
    department: participant.department,
    registerNumber: participant.registerNumber ?? "",
  };
}

export async function GET() {
  await connection();
  try {
    const participant = await getFlowParticipant();
    if (!participant) {
      return NextResponse.json({ success: false, message: "No active registration flow." }, { status: 401 });
    }
    return NextResponse.json({ success: true, participant: publicParticipant(participant), hasEventRegistrations: (participant.eventSlugs?.length ?? 0) > 0 });
  } catch (error) {
    console.error("Read registration profile error:", error);
    return NextResponse.json({ success: false, message: "Unable to restore your registration." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await connection();
  try {
    const status = await getPublicRegistrationStatus();
    if (!status.registrationOpen) {
      return NextResponse.json({ success: false, message: "Online registration is currently closed. Please check back when the organisers reopen it." }, { status: 409 });
    }

    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Please check all your details, including your email address.", errors: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    let mobile: string;
    let email: string;
    try {
      mobile = normalizeIndianMobile(parsed.data.mobile);
      email = normalizeRegistrationEmail(parsed.data.email);
    } catch (error) {
      return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Invalid participant contact details." }, { status: 400 });
    }

    let registerNumber: string;
    try { registerNumber = normalizeRegisterNumber(parsed.data.registerNumber); }
    catch (error) { return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Enter a valid college register number." }, { status: 400 }); }
    const result = await createOrFindParticipant({ ...parsed.data, registerNumber, mobile, email });
    if ("error" in result) {
      return NextResponse.json({ success: false, message: result.error }, { status: 409 });
    }

    await createRegistrationFlow(result.participant._id.toString());
    // Person ID is deliberately not returned to the public registration client.
    return NextResponse.json({
      success: true,
      message: "Your details have been saved. Choose the events you would like to enter.",
      participant: publicParticipant(result.participant),
      hasEventRegistrations: (result.participant.eventSlugs?.length ?? 0) > 0,
    }, { status: 201 });
  } catch (error) {
    console.error("Create participant profile error:", error);
    return NextResponse.json({ success: false, message: "Unable to save your details. Please try again." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  await connection();
  try {
    const participant = await getFlowParticipant();
    if (!participant) {
      return NextResponse.json({ success: false, message: "Your registration session has expired. Please refresh and try again." }, { status: 401 });
    }

    const parsed = editSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Please check all your profile details, including your email address.", errors: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const email = normalizeRegistrationEmail(parsed.data.email);
    let registerNumber: string;
    try { registerNumber = normalizeRegisterNumber(parsed.data.registerNumber); }
    catch (error) { return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Enter a valid college register number." }, { status: 400 }); }
    if (participant.email && participant.email !== email) {
      return NextResponse.json({ success: false, message: "Your registered email cannot be changed here. Contact the organisers if it needs correction." }, { status: 409 });
    }
    if (!participant.email) {
      const emailOwner = await Participant.findOne({ email }).select("_id").lean();
      if (emailOwner && emailOwner._id.toString() !== participant._id.toString()) {
        return NextResponse.json({ success: false, message: "This email address is already linked to another participant." }, { status: 409 });
      }
      participant.email = email;
    }

    const hasEventRegistrations = (participant.eventSlugs?.length ?? 0) > 0;
    const protectedDetailsChanged =
      parsed.data.college.trim() !== participant.college ||
      parsed.data.city.trim() !== participant.city ||
      parsed.data.department.trim() !== participant.department ||
      (Boolean(participant.registerNumber) && registerNumber !== participant.registerNumber);

    if (hasEventRegistrations && protectedDetailsChanged) {
      return NextResponse.json({
        success: false,
        message: "College, city, department and an existing register number cannot be changed after you have registered for an event. Contact the organisers if these details are incorrect.",
      }, { status: 409 });
    }

    participant.name = parsed.data.name;
    if (!hasEventRegistrations) {
      participant.college = parsed.data.college;
      participant.collegeKey = normalizeKey(parsed.data.college);
      participant.city = parsed.data.city;
      participant.department = parsed.data.department;
      participant.departmentKey = normalizeKey(parsed.data.department);
    }
    if (!participant.registerNumber) {
      const rollOwner = await Participant.findOne({ collegeKey: participant.collegeKey, registerNumber }).select("_id").lean();
      if (rollOwner && rollOwner._id.toString() !== participant._id.toString()) {
        return NextResponse.json({ success: false, message: "This college register number is already linked to another participant." }, { status: 409 });
      }
      participant.registerNumber = registerNumber;
    }
    await participant.save();

    await EventRegistration.updateMany(
      { "members.participantId": participant._id },
      { $set: { "members.$[member].name": participant.name, "members.$[member].email": participant.email, "members.$[member].registerNumber": participant.registerNumber } },
      { arrayFilters: [{ "member.participantId": participant._id }] },
    );

    return NextResponse.json({
      success: true,
      message: "Your participant profile has been updated.",
      participant: publicParticipant(participant),
    });
  } catch (error) {
    console.error("Update participant profile error:", error);
    return NextResponse.json({ success: false, message: "Unable to update your profile. Please try again." }, { status: 500 });
  }
}
