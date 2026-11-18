import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/src/lib/mongodb";
import Admin from "@/models/Admin";
import { verifyPassword } from "@/src/lib/password";
import { createSession } from "@/src/lib/session";

const schema = z.object({ email: z.string().trim().email().max(254), password: z.string().min(1).max(128) });

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ success: false, message: "Invalid email or password." }, { status: 400 });
    await connectDB();
    const admin = await Admin.findOne({ email: parsed.data.email.toLowerCase() });
    if (!admin || !admin.isActive || !(await verifyPassword(parsed.data.password, admin.passwordHash))) {
      return NextResponse.json({ success: false, message: "Invalid email or password." }, { status: 401 });
    }
    await createSession(admin._id.toString(), "admin");
    admin.lastLogin = new Date();
    await admin.save();
    return NextResponse.json({ success: true, admin: { id: admin._id.toString(), name: admin.name, email: admin.email, role: admin.role } });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 });
  }
}
