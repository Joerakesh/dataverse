import { Schema, Types, models, model } from "mongoose";

const TeamSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    leaderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
    inviteCode: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["open", "full", "disbanded"],
      default: "open",
    },
  },
  { timestamps: true },
);

export default models.Team || model("Team", TeamSchema);
