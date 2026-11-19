import { connection, NextResponse } from "next/server";
import Event from "@/models/Event";
import { connectDB } from "@/src/lib/mongodb";

export async function GET() {
  await connection();
  try {
    await connectDB();
    const events = await Event.find({ status: "published" }).sort({ displayOrder: 1, date: 1 }).lean();
    return NextResponse.json({ success: true, events });
  } catch (error) {
    console.error("List events error:", error);
    return NextResponse.json({ success: false, message: "Unable to load events." }, { status: 500 });
  }
}
