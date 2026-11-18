import { connectDB } from "./mongodb";
import Event from "@/models/Event";
import Settings from "@/models/Settings";

export async function getRegisterableEvent(eventId: string) {
  await connectDB();
  const [event, settings] = await Promise.all([
    Event.findById(eventId),
    Settings.findOne().sort({ createdAt: 1 }),
  ]);

  if (!event || event.status !== "published") return { error: "Event not found.", status: 404 as const };
  if (!event.registrationOpen || settings?.registrationEnabled === false || settings?.maintenanceMode) {
    return { error: "Registration is currently closed.", status: 409 as const };
  }
  const deadline = settings?.registrationDeadline;
  if (deadline && deadline.getTime() <= Date.now()) {
    return { error: "The registration deadline has passed.", status: 409 as const };
  }
  return { event, settings };
}
