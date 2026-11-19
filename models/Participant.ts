import { Schema, models, model } from "mongoose";

const ParticipantSchema = new Schema(
  {
    personId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    mobile: { type: String, required: true, unique: true, index: true },
    college: { type: String, required: true, trim: true, maxlength: 180 },
    collegeKey: { type: String, required: true, index: true },
    city: { type: String, required: true, trim: true, maxlength: 100 },
    department: { type: String, required: true, trim: true, maxlength: 120 },
    departmentKey: { type: String, required: true, index: true },
    eventSlugs: { type: [String], default: [] },
  },
  { timestamps: true },
);

export default models.Participant || model("Participant", ParticipantSchema);
