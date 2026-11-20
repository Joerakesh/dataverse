import { connection, NextResponse } from "next/server";
import Participant from "@/models/Participant";
import { requirePermission } from "@/src/lib/authorization";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^$\{\}()|[\]\\]/g, "\\$&");
}

export async function GET(request: Request) {
  await connection();
  try {
    await requirePermission("users:view");
    const url = new URL(request.url);
    const page = Math.max(1, Number.parseInt(url.searchParams.get("page") ?? "1", 10) || 1);
    const limit = Math.min(100, Math.max(1, Number.parseInt(url.searchParams.get("limit") ?? "25", 10) || 25));
    const search = (url.searchParams.get("search") ?? "").trim().slice(0, 100);
    const filter: Record<string, unknown> = {};
    if (search) {
      const regex = new RegExp(escapeRegex(search), "i");
      filter.$or = [
        { name: regex }, { email: regex }, { mobile: regex },
        { college: regex }, { city: regex }, { department: regex },
        { registerNumber: regex }, { personId: regex },
      ];
    }
    const [users, total] = await Promise.all([
      Participant.find(filter)
        .select("personId name mobile email college city department registerNumber eventSlugs createdAt")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Participant.countDocuments(filter),
    ]);
    return NextResponse.json({
      success: true,
      users: users.map((user) => ({
        id: user._id.toString(),
        personId: user.personId,
        name: user.name,
        mobile: user.mobile,
        email: user.email ?? "",
        college: user.college,
        city: user.city,
        department: user.department,
        registerNumber: user.registerNumber ?? "",
        eventSlugs: user.eventSlugs ?? [],
        createdAt: user.createdAt,
      })),
      pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
    if (error instanceof Error && error.message === "FORBIDDEN") return NextResponse.json({ success: false, message: "You do not have permission to view users." }, { status: 403 });
    console.error("Admin users list error:", error);
    return NextResponse.json({ success: false, message: "Unable to load users." }, { status: 500 });
  }
}
