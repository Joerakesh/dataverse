import { SYMPOSIUM_EVENTS } from "@/src/data/events";

export type InitialEvent = {
  name: string;
  slug: string;
  category: string;
  shortDescription?: string;
  description: string;
  rules?: string[];
  teamSize?: { min: number; max: number };
  venue?: string;
  startTime?: string;
  endTime?: string;
  registrationOpen?: boolean;
  status?: "draft" | "published" | "archived";
  image?: string;
  displayOrder?: number;
};

export const initialEvents: InitialEvent[] = SYMPOSIUM_EVENTS.map((event) => ({
  name: event.name + " - " + event.tagline,
  slug: event.slug,
  category: event.category,
  shortDescription: event.description.slice(0, 240),
  description: event.description,
  rules: event.rules,
  teamSize: { min: event.minTeam, max: event.maxTeam },
  venue: "Centenary Building",
  startTime: "09:00 AM onwards",
  registrationOpen: true,
  status: "published",
  image: event.character.image,
  displayOrder: Number(event.id),
}));
