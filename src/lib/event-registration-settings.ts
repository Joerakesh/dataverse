import Event from "@/models/Event";
import { SYMPOSIUM_EVENTS } from "@/src/data/events";

export async function ensureEventRegistrationSettings() {
  await Promise.all(SYMPOSIUM_EVENTS.map((item) => Event.findOneAndUpdate(
    { slug: item.slug },
    {
      $setOnInsert: {
        name: item.name + " - " + item.tagline,
        slug: item.slug,
        category: item.category,
        shortDescription: item.description.slice(0, 240),
        description: item.description,
        rules: item.rules,
        teamSize: { min: item.minTeam, max: item.maxTeam },
        venue: item.venue,
        registrationOpen: true,
        status: "published",
        image: item.character.image,
        displayOrder: Number(item.id),
      },
    },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
  )));
}

export async function getEventRegistrationSettings() {
  await ensureEventRegistrationSettings();
  const records = await Event.find({
    slug: { $in: SYMPOSIUM_EVENTS.map((item) => item.slug) },
  }).select("_id slug registrationOpen status").lean();

  const bySlug = new Map(records.map((record) => [record.slug, record]));
  return SYMPOSIUM_EVENTS.map((item) => {
    const record = bySlug.get(item.slug);
    return {
      id: record?._id.toString() ?? "",
      slug: item.slug,
      name: item.name,
      tagline: item.tagline,
      category: item.category,
      teamSize: item.teamSize,
      registrationOpen: Boolean(record?.registrationOpen) && record?.status === "published",
    };
  });
}

export async function isEventRegistrationOpen(slug: string) {
  await ensureEventRegistrationSettings();
  const record = await Event.findOne({ slug }).select("registrationOpen status").lean();
  return Boolean(record?.registrationOpen) && record?.status === "published";
}
