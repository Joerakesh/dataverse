import { Schema, models, model } from "mongoose";
const RegistrationMemberSchema = new Schema({
  participantId: { type: Schema.Types.ObjectId, ref: "Participant", required: true },
  name: { type: String, required: true, trim: true },
  mobile: { type: String, required: true },
}, { _id: false });
const EventRegistrationSchema = new Schema({
  registrationReference: { type: String, required: true, unique: true, index: true },
  eventSlug: { type: String, required: true, index: true },
  eventName: { type: String, required: true },
  contactParticipantId: { type: Schema.Types.ObjectId, ref: "Participant", required: true },
  college: { type: String, required: true },
  collegeKey: { type: String, required: true, index: true },
  city: { type: String, required: true },
  department: { type: String, required: true },
  departmentKey: { type: String, required: true, index: true },
  departmentQuotaKey: { type: String, unique: true, sparse: true },
  members: { type: [RegistrationMemberSchema], required: true },
  teamSize: { type: Number, required: true, min: 1, max: 3 },
  status: { type: String, enum: ["confirmed", "cancelled"], default: "confirmed", index: true },
}, { timestamps: true });
EventRegistrationSchema.index({ eventSlug: 1, "members.mobile": 1 }, { unique: true, partialFilterExpression: { status: "confirmed" } });
export default models.EventRegistration || model("EventRegistration", EventRegistrationSchema);
