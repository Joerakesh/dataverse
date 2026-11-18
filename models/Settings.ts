import { Schema, models, model } from "mongoose";

const SettingsSchema = new Schema(
  {
    symposiumName: {
      type: String,
      default: "DATAVERSE",
    },
    edition: {
      type: String,
    },
    registrationEnabled: {
      type: Boolean,
      default: false,
    },
    registrationDeadline: {
      type: Date,
      default: null,
    },
    contactEmail: {
      type: String,
    },
    contactPhone: {
      type: String,
    },
    socialLinks: {
      instagram: String,
      linkedin: String,
      website: String,
    },
    theme: {
      primaryColor: String,
      accentColor: String,
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default models.Settings || model("Settings", SettingsSchema);
