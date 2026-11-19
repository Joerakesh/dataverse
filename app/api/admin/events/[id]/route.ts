import { NextResponse } from "next/server";
import { z } from "zod";
import Event from "@/models/Event";
import { requirePermission } from "@/src/lib/authorization";

const schema = z.object({
  name: z.string().trim().min(2).max(120).optional(), slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  category: z.string().trim().min(2).max(80).optional(), description: z.string().trim().min(1).max(10000).optional(),
  shortDescription: z.string().trim().max(300).optional(), rules: z.array(z.string().trim().max(2000)).max(100).optional(),
  teamSize: z.object({ min: z.number().int().min(1).max(100), max: z.number().int().min(1).max(100) }).optional(),
  venue: z.string().trim().max(200).optional(), date: z.coerce.date().optional(), startTime: z.string().max(20).optional(), endTime: z.string().max(20).optional(),
  registrationOpen: z.boolean().optional(), maxParticipants: z.number().int().positive().optional(), status: z.enum(["draft", "published", "archived"]).optional(),
  image: z.string().url().optional(), displayOrder: z.number().int().optional(),
}).refine((data) => !data.teamSize || data.teamSize.min <= data.teamSize.max, { message: "Minimum team size must not exceed maximum." });

export async function PATCH(request: Request, context: RouteContext<"/api/admin/events/[id]">) {
  try {
    await requirePermission("events:manage");
    const { id } = await context.params;
    if (!/^[a-f\d]{24}$/i.test(id)) return NextResponse.json({ success: false, message: "Invalid event ID." }, { status: 400 });
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ success: false, message: "Invalid event data.", errors: parsed.error.flatten().fieldErrors }, { status: 400 });
    const event = await Event.findByIdAndUpdate(id, { $set: parsed.data }, { returnDocument: "after", runValidators: true });
    if (!event) return NextResponse.json({ success: false, message: "Event not found." }, { status: 404 });
    return NextResponse.json({ success: true, event });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
    if (error instanceof Error && error.message === "FORBIDDEN") return NextResponse.json({ success: false, message: "Permission denied." }, { status: 403 });
    if (error && typeof error === "object" && "code" in error && error.code === 11000) return NextResponse.json({ success: false, message: "An event with this slug already exists." }, { status: 409 });
    console.error("Update event error:", error);
    return NextResponse.json({ success: false, message: "Unable to update event." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext<"/api/admin/events/[id]">) {
  try {
    await requirePermission("events:manage");
    const { id } = await context.params;
    if (!/^[a-f\d]{24}$/i.test(id)) return NextResponse.json({ success: false, message: "Invalid event ID." }, { status: 400 });
    const event = await Event.findByIdAndUpdate(id, { $set: { status: "archived", registrationOpen: false } }, { returnDocument: "after" });
    if (!event) return NextResponse.json({ success: false, message: "Event not found." }, { status: 404 });
    return NextResponse.json({ success: true, message: "Event archived." });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
    if (error instanceof Error && error.message === "FORBIDDEN") return NextResponse.json({ success: false, message: "Permission denied." }, { status: 403 });
    console.error("Archive event error:", error);
    return NextResponse.json({ success: false, message: "Unable to archive event." }, { status: 500 });
  }
}
