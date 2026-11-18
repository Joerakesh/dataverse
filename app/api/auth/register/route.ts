import { NextResponse } from "next/server";
import { z } from "zod";

import { connectDB } from "@/src/lib/mongodb";
import User from "@/models/User";
import { hashPassword } from "@/src/lib/password";
import { createSession } from "@/src/lib/session";

const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(128),
  phone: z.string().trim().max(20).optional(),
  college: z.string().trim().min(2).max(150),
  department: z.string().trim().min(2).max(100),
  year: z.number().int().min(1).max(6),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid registration data.",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const data = validation.data;
    const email = data.email.toLowerCase();

    await connectDB();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "An account with this email already exists.",
        },
        { status: 409 },
      );
    }

    const passwordHash = await hashPassword(data.password);

    const user = await User.create({
      name: data.name,
      email,
      phone: data.phone,
      passwordHash,
      college: data.college,
      department: data.department,
      year: data.year,
    });

    await createSession(user._id.toString(), "participant");

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful.",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          college: user.college,
          department: user.department,
          year: user.year,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to complete registration.",
      },
      { status: 500 },
    );
  }
}
