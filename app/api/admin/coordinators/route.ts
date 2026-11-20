import { connection, NextResponse } from "next/server";
import { z } from "zod";
import Admin from "@/models/Admin";
import Event from "@/models/Event";
import { hashPassword } from "@/src/lib/password";
import { requirePermission } from "@/src/lib/authorization";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  password: z.string().min(8).max(128),
  eventIds: z.array(z.string().regex(/^[a-f\d]{24}$/i)).min(1).max(100),
});

export async function GET() {
  await connection();
  try {
    await requirePermission("coordinators:manage");
    const coordinators = await Admin.find({ role: "event_manager" })
      .select("name email role assignedEventIds isActive createdAt")
      .populate("assignedEventIds", "name slug")
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ success: true, coordinators });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
    if (error instanceof Error && error.message === "FORBIDDEN") return NextResponse.json({ success: false, message: "You do not have permission to manage coordinators." }, { status: 403 });
    console.error("List coordinators error:", error);
    return NextResponse.json({ success: false, message: "Unable to load coordinators." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await connection();
  try {
    await requirePermission("coordinators:manage");
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ success: false, message: "Enter a name, valid email, password (at least 8 characters), and one or more assigned events.", errors: parsed.error.flatten().fieldErrors }, { status: 400 });

    const eventIds = [...new Set(parsed.data.eventIds)];
    const events = await Event.find({ _id: { $in: eventIds }, status: { $ne: "archived" } }).select("_id").lean();
    if (events.length !== eventIds.length) return NextResponse.json({ success: false, message: "One or more selected events are invalid or archived." }, { status: 400 });
    const existing = await Admin.findOne({ email: parsed.data.email }).select("_id").lean();
    if (existing) return NextResponse.json({ success: false, message: "An admin account already uses this email address." }, { status: 409 });

    const coordinator = await Admin.create({
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash: await hashPassword(parsed.data.password),
      role: "event_manager",
      permissions: ["registrations:view"],
      assignedEventIds: eventIds,
      isActive: true,
    });
    return NextResponse.json({
      success: true,
      message: "Coordinator account created. Share the credentials securely.",
      coordinator: {
        id: coordinator._id.toString(),
        name: coordinator.name,
        email: coordinator.email,
        role: coordinator.role,
        assignedEventIds: coordinator.assignedEventIds.map((id: { toString(): string }) => id.toString()),
      },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
    if (error instanceof Error && error.message === "FORBIDDEN") return NextResponse.json({ success: false, message: "You do not have permission to manage coordinators." }, { status: 403 });
    if (error && typeof error === "object" && "code" in error && error.code === 11000) return NextResponse.json({ success: false, message: "An admin account already uses this email address." }, { status: 409 });
    console.error("Create coordinator error:", error);
    return NextResponse.json({ success: false, message: "Unable to create coordinator account." }, { status: 500 });
  }
}
