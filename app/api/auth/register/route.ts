import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    success: false,
    message: "Public participant accounts are no longer used. Open /register to register for DATAVERSE 2K26.",
  }, { status: 410 });
}
