import { connection, NextResponse } from "next/server";
import EventRegistration from "@/models/EventRegistration";
import Event from "@/models/Event";
import "@/models/Participant";
import { requireAdmin } from "@/src/lib/authorization";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(request: Request) {
  await connection();
  try {
    const admin = await requireAdmin();
    if (admin.role !== "superadmin" && !admin.permissions.includes("*") && !admin.permissions.includes("registrations:view")) {
      throw new Error("FORBIDDEN");
    }

    const url = new URL(request.url);
    const page = Math.max(1, Number.parseInt(url.searchParams.get("page") ?? "1", 10) || 1);
    const limit = Math.min(100, Math.max(1, Number.parseInt(url.searchParams.get("limit") ?? "25", 10) || 25));
    const search = (url.searchParams.get("search") ?? "").trim().slice(0, 120);
    const requestedEventSlug = (url.searchParams.get("event") ?? "").trim();
    const status = (url.searchParams.get("status") ?? "").trim();

    const scopeFilter: Record<string, unknown> = {};
    if (admin.role === "event_manager") {
      const assignedEvents = await Event.find({
        _id: { $in: admin.assignedEventIds ?? [] },
        status: { $ne: "archived" },
      }).select("slug").lean();
      const assignedSlugs = assignedEvents.map((event) => event.slug);
      scopeFilter.eventSlug = requestedEventSlug
        ? (assignedSlugs.includes(requestedEventSlug) ? requestedEventSlug : { $in: [] })
        : { $in: assignedSlugs };
    } else if (requestedEventSlug) {
      scopeFilter.eventSlug = requestedEventSlug;
    }

    const filter: Record<string, unknown> = { ...scopeFilter };
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
        { "members.registerNumber": regex },
      ];
    }

    // Page data, count, and compact summary run concurrently. Summary uses
    // aggregation rather than materialising large distinct-value arrays.
    const [registrations, matchingTotal, statsResult] = await Promise.all([
      EventRegistration.find(filter)
        .select("registrationReference eventSlug eventName college city department members teamSize status createdAt contactParticipantId")
        .populate("contactParticipantId", "name mobile email")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      EventRegistration.countDocuments(filter),
      EventRegistration.aggregate([
        { $match: scopeFilter },
        {
          $facet: {
            counts: [
              { $group: {
                _id: null,
                total: { $sum: 1 },
                confirmed: { $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] } },
                cancelled: { $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] } },
              } },
            ],
            participants: [
              { $match: { status: "confirmed" } },
              { $unwind: "$members" },
              { $group: { _id: "$members.mobile" } },
              { $count: "count" },
            ],
            colleges: [
              { $match: { status: "confirmed" } },
              { $group: { _id: "$collegeKey" } },
              { $count: "count" },
            ],
          },
        },
      ]),
    ]);

    const stats = statsResult[0] ?? {};
    const counts = stats.counts?.[0] ?? { total: 0, confirmed: 0, cancelled: 0 };
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
        members: item.members.map((member: { participantId: { toString(): string } | string; name: string; mobile: string; email?: string; registerNumber?: string }) => ({
          id: member.participantId.toString(),
          name: member.name,
          mobile: member.mobile,
          email: member.email ?? "",
          registerNumber: member.registerNumber ?? "",
        })),
      })),
      pagination: {
        page,
        limit,
        total: matchingTotal,
        totalPages: Math.max(1, Math.ceil(matchingTotal / limit)),
      },
      summary: {
        total: counts.total ?? 0,
        confirmed: counts.confirmed ?? 0,
        cancelled: counts.cancelled ?? 0,
        participants: stats.participants?.[0]?.count ?? 0,
        colleges: stats.colleges?.[0]?.count ?? 0,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
    if (error instanceof Error && error.message === "FORBIDDEN") return NextResponse.json({ success: false, message: "You do not have permission to view registrations." }, { status: 403 });
    console.error("Admin registrations list error:", error);
    return NextResponse.json({ success: false, message: "Unable to load registrations." }, { status: 500 });
  }
}
