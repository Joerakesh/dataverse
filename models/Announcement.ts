import mongoose, { Schema, models, model } from "mongoose";

const AnnouncementSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    target: {
      type: String,
      enum: ["all", "participants", "organizers"],
      default: "all",
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      default: null,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

export default models.Announcement || model("Announcement", AnnouncementSchema);
