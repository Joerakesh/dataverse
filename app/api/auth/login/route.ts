import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    success: false,
    message: "Participant login has been replaced by the DATAVERSE registration assistant. Open /register to register for events.",
  }, { status: 410 });
}
