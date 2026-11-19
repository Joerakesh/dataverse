import { connection, NextResponse } from "next/server";
import EventRegistration from "@/models/EventRegistration";
import { requirePermission } from "@/src/lib/authorization";

function escapeRegex(value: string) {
  return value.split("").map((character) =>
    "\\^$.*+?()[]{}|".includes(character) ? "\\" + character : character
  ).join("");
}

export async function GET(request: Request) {
  await connection();
  try {
    await requirePermission("registrations:view");

    const url = new URL(request.url);
    const page = Math.max(1, Number.parseInt(url.searchParams.get("page") ?? "1", 10) || 1);
    const limit = Math.min(100, Math.max(1, Number.parseInt(url.searchParams.get("limit") ?? "25", 10) || 25));
    const search = (url.searchParams.get("search") ?? "").trim().slice(0, 120);
    const eventSlug = (url.searchParams.get("event") ?? "").trim();
    const status = (url.searchParams.get("status") ?? "").trim();

    const filter: Record<string, unknown> = {};
    if (eventSlug) filter.eventSlug = eventSlug;
    if (status === "confirmed" || status === "cancelled") filter.status = status;
    if (search) {
      const regex = new RegExp(escapeRegex(search), "i");
      filter.$or = [
        { registrationReference: regex },
        { eventName: regex },
        { college: regex },
        { city: regex },
        { department: regex },
        { "members.name": regex },
        { "members.mobile": regex },
        { "members.email": regex },
      ];
    }

    const [registrations, matchingTotal, total, confirmed, cancelled, uniqueParticipants, uniqueColleges] = await Promise.all([
      EventRegistration.find(filter)
        .select("registrationReference eventSlug eventName college city department members teamSize status createdAt contactParticipantId")
        .populate("contactParticipantId", "name mobile email")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      EventRegistration.countDocuments(filter),
      EventRegistration.countDocuments({}),
      EventRegistration.countDocuments({ status: "confirmed" }),
      EventRegistration.countDocuments({ status: "cancelled" }),
      EventRegistration.distinct("members.mobile", { status: "confirmed" }),
      EventRegistration.distinct("collegeKey", { status: "confirmed" }),
    ]);

    return NextResponse.json({
      success: true,
      registrations: registrations.map((item) => ({
        id: item._id.toString(),
        reference: item.registrationReference,
        eventSlug: item.eventSlug,
        eventName: item.eventName,
        college: item.college,
        city: item.city,
        department: item.department,
        teamSize: item.teamSize,
        status: item.status,
        createdAt: item.createdAt,
        contact: item.contactParticipantId && typeof item.contactParticipantId === "object"
          ? {
              name: "name" in item.contactParticipantId ? item.contactParticipantId.name : "",
              mobile: "mobile" in item.contactParticipantId ? item.contactParticipantId.mobile : "",
              email: "email" in item.contactParticipantId ? item.contactParticipantId.email : "",
            }
          : null,
        members: item.members.map((member: { name: string; mobile: string; email?: string }) => ({ name: member.name, mobile: member.mobile, email: member.email ?? "" })),
      })),
      pagination: {
        page,
        limit,
        total: matchingTotal,
        totalPages: Math.max(1, Math.ceil(matchingTotal / limit)),
      },
      summary: {
        total,
        confirmed,
        cancelled,
        participants: uniqueParticipants.length,
        colleges: uniqueColleges.length,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ success: false, message: "You do not have permission to view registrations." }, { status: 403 });
    }
    console.error("Admin registrations list error:", error);
    return NextResponse.json({ success: false, message: "Unable to load registrations." }, { status: 500 });
  }
}
