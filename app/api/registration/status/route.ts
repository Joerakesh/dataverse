import { connection, NextResponse } from "next/server";
import { getPublicRegistrationStatus } from "@/src/lib/public-registration";
export async function GET() {
  try {
    await connection();
    return NextResponse.json({ success: true, ...(await getPublicRegistrationStatus()) });
  } catch (error) {
    console.error("Registration status error:", error);
    return NextResponse.json({ success: false, message: "Unable to load registration status." }, { status: 500 });
  }
}
