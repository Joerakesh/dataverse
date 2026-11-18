import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import { connectDB } from "./lib/mongodb";
import User from "../models/User";
import Event from "../models/Event";
import Registration from "../models/Registration";
import Team from "../models/Team";
import Announcement from "../models/Announcement";
import Admin from "../models/Admin";
import Settings from "../models/Settings";
import { initialEvents } from "./seed/event";

async function seed() {
  try {
    await connectDB();

    console.log("Connected to MongoDB.");

    // Seed events by slug
    for (const event of initialEvents) {
      await Event.findOneAndUpdate(
        { slug: event.slug },
        { $set: event },
        { upsert: true, returnDocument: "after" },
      );
    }

    console.log(`Events processed: ${initialEvents.length}`);

    // Seed initial admin
    const adminEmail = process.env.SEED_ADMIN_EMAIL?.toLowerCase();
    const adminPassword = process.env.SEED_ADMIN_PASSWORD;
    const adminName = process.env.SEED_ADMIN_NAME;

    if (!adminEmail || !adminPassword || !adminName) {
      throw new Error("Missing seed admin environment variables.");
    }

    const existingAdmin = await Admin.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash(adminPassword, 12);

      await Admin.create({
        name: adminName,
        email: adminEmail,
        passwordHash,
        role: "superadmin",
        permissions: ["*"],
        isActive: true,
      });

      console.log("Initial admin created.");
    } else {
      console.log("Initial admin already exists. Skipped.");
    }

    // Seed default settings
    await Settings.findOneAndUpdate(
      { symposiumName: "DATAVERSE" },
      {
        $setOnInsert: {
          symposiumName: "DATAVERSE",
          registrationEnabled: false,
          maintenanceMode: false,
          theme: {
            primaryColor: "#0f172a",
            accentColor: "#22c55e",
          },
        },
      },
      { upsert: true, returnDocument: "after" },
    );

    console.log("Settings initialized.");

    console.log("Seed completed successfully.");
  } catch (error) {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seed();
