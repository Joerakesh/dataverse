import { connection, NextResponse } from "next/server";
import { z } from "zod";
import { createOrFindParticipant, createRegistrationFlow, getFlowParticipant, normalizeIndianMobile } from "@/src/lib/public-registration";
const schema = z.object({
  name: z.string().trim().min(2).max(100),
  mobile: z.string().trim().min(10).max(20),
  college: z.string().trim().min(2).max(180),
  city: z.string().trim().min(2).max(100),
  department: z.string().trim().min(2).max(120),
});
export async function GET() {
  await connection();
  try {
    const participant = await getFlowParticipant();
    if (!participant) return NextResponse.json({ success: false, message: "No active registration flow." }, { status: 401 });
    return NextResponse.json({ success: true, participant: {
      name: participant.name, mobile: participant.mobile, college: participant.college,
      city: participant.city, department: participant.department,
    } });
  } catch (error) {
    console.error("Read registration profile error:", error);
    return NextResponse.json({ success: false, message: "Unable to restore your registration." }, { status: 500 });
  }
}
export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ success: false, message: "Please check all your details.", errors: parsed.error.flatten().fieldErrors }, { status: 400 });
    let mobile: string;
    try {
      mobile = normalizeIndianMobile(parsed.data.mobile);
    } catch (error) {
      return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Invalid mobile number." }, { status: 400 });
    }
    const result = await createOrFindParticipant({ ...parsed.data, mobile });
    if ("error" in result) return NextResponse.json({ success: false, message: result.error }, { status: 409 });
    await createRegistrationFlow(result.participant._id.toString());
    // Person ID is deliberately not returned to the public registration client.
    return NextResponse.json({
      success: true,
      message: "Your details have been saved. Choose the events you would like to enter.",
      participant: {
        name: result.participant.name, mobile: result.participant.mobile,
        college: result.participant.college, city: result.participant.city,
        department: result.participant.department,
      },
    }, { status: 201 });
  } catch (error) {
    console.error("Create participant profile error:", error);
    return NextResponse.json({ success: false, message: "Unable to save your details. Please try again." }, { status: 500 });
  }
}
