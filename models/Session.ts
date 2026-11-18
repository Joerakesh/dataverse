import { Schema, models, model } from "mongoose";

const SessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    accountType: {
      type: String,
      enum: ["participant", "admin"],
      required: true,
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

// Automatically delete expired sessions
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default models.Session || model("Session", SessionSchema);
