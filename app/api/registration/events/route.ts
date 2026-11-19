import { NextResponse } from "next/server";
import { SYMPOSIUM_EVENTS } from "@/src/data/events";
import { getPublicRegistrationStatus } from "@/src/lib/public-registration";
export const runtime = "nodejs";
export async function GET() {
  try {
    const status = await getPublicRegistrationStatus();
    const events = SYMPOSIUM_EVENTS.map((event) => ({
      id: event.id, slug: event.slug, name: event.name, tagline: event.tagline,
      description: event.description, teamSize: event.teamSize,
      minTeam: event.minTeam, maxTeam: event.maxTeam, rules: event.rules,
      image: event.character.image, registrationOpen: status.registrationOpen,
    }));
    return NextResponse.json({ success: true, registrationOpen: status.registrationOpen, events });
  } catch (error) {
    console.error("Public event list error:", error);
    return NextResponse.json({ success: false, message: "Unable to load events." }, { status: 500 });
  }
}
