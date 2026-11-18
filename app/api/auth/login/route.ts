import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/src/lib/mongodb";
import User from "@/models/User";
import { verifyPassword } from "@/src/lib/password";
import { createSession } from "@/src/lib/session";

const loginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(1).max(128),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password format." },
        { status: 400 },
      );
    }

    const { email, password } = validation.data;

    await connectDB();

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    // Generic response to avoid revealing whether an account exists.
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 },
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { success: false, message: "Account is inactive." },
        { status: 403 },
      );
    }

    const passwordValid = await verifyPassword(password, user.passwordHash);

    if (!passwordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 },
      );
    }

    await createSession(user._id.toString(), "participant");

    return NextResponse.json(
      {
        success: true,
        message: "Login successful.",
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          college: user.college,
          department: user.department,
          year: user.year,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Participant login error:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 },
    );
  }
}
