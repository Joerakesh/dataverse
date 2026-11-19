import { connection, NextResponse } from "next/server";
import { z } from "zod";
import Settings from "@/models/Settings";
import { requirePermission } from "@/src/lib/authorization";
import { getPublicRegistrationStatus } from "@/src/lib/public-registration";

const updateSchema = z.object({
  registrationEnabled: z.boolean().optional(),
  maintenanceMode: z.boolean().optional(),
  registrationDeadline: z.string().datetime().nullable().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "Provide at least one setting to update.",
});

export async function GET() {
  await connection();
  try {
    await requirePermission("settings:manage");
    const settings = await Settings.findOneAndUpdate(
      { symposiumName: "DATAVERSE" },
      { $setOnInsert: { symposiumName: "DATAVERSE", registrationEnabled: false, maintenanceMode: false } },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
    ).lean();
    const status = await getPublicRegistrationStatus();

    return NextResponse.json({
      success: true,
      settings: {
        registrationEnabled: settings.registrationEnabled,
        maintenanceMode: settings.maintenanceMode,
        registrationDeadline: settings.registrationDeadline?.toISOString() ?? null,
      },
      status,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ success: false, message: "You do not have permission to manage registration settings." }, { status: 403 });
    }
    console.error("Admin settings read error:", error);
    return NextResponse.json({ success: false, message: "Unable to load registration settings." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    await requirePermission("settings:manage");
    const parsed = updateSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Invalid registration settings.", errors: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const update: Record<string, unknown> = {};
    if (parsed.data.registrationEnabled !== undefined) update.registrationEnabled = parsed.data.registrationEnabled;
    if (parsed.data.maintenanceMode !== undefined) update.maintenanceMode = parsed.data.maintenanceMode;
    if (parsed.data.registrationDeadline !== undefined) {
      update.registrationDeadline = parsed.data.registrationDeadline ? new Date(parsed.data.registrationDeadline) : null;
    }

    const settings = await Settings.findOneAndUpdate(
      { symposiumName: "DATAVERSE" },
      { $set: update, $setOnInsert: { symposiumName: "DATAVERSE" } },
      { upsert: true, returnDocument: "after", runValidators: true, setDefaultsOnInsert: true },
    ).lean();

    const status = await getPublicRegistrationStatus();
    return NextResponse.json({
      success: true,
      message: "Registration settings updated.",
      settings: {
        registrationEnabled: settings.registrationEnabled,
        maintenanceMode: settings.maintenanceMode,
        registrationDeadline: settings.registrationDeadline?.toISOString() ?? null,
      },
      status,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ success: false, message: "You do not have permission to manage registration settings." }, { status: 403 });
    }
    console.error("Admin settings update error:", error);
    return NextResponse.json({ success: false, message: "Unable to update registration settings." }, { status: 500 });
  }
}
