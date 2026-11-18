import { Schema, models, model } from "mongoose";

const RegistrationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    teamId: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },
    registrationType: {
      type: String,
      enum: ["individual", "team"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "confirmed",
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

RegistrationSchema.index(
  { userId: 1, eventId: 1 },
  { unique: true, partialFilterExpression: { status: { $in: ["pending", "confirmed"] } } },
);

export default models.Registration || model("Registration", RegistrationSchema);
