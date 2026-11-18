import { Schema, models, model } from "mongoose";

const EventSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    shortDescription: { type: String },
    description: { type: String, required: true },
    rules: [{ type: String }],
    teamSize: {
      min: { type: Number, default: 1 },
      max: { type: Number, default: 1 },
    },
    venue: { type: String },
    date: { type: Date },
    startTime: { type: String },
    endTime: { type: String },
    registrationOpen: { type: Boolean, default: false },
    maxParticipants: { type: Number },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    image: { type: String },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default models.Event || model("Event", EventSchema);
