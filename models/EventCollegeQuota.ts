import { Schema, models, model } from "mongoose";
const EventCollegeQuotaSchema = new Schema({
  eventSlug: { type: String, required: true },
  collegeKey: { type: String, required: true },
  teamCount: { type: Number, required: true, default: 0, min: 0 },
}, { timestamps: true });
EventCollegeQuotaSchema.index({ eventSlug: 1, collegeKey: 1 }, { unique: true });
export default models.EventCollegeQuota || model("EventCollegeQuota", EventCollegeQuotaSchema);
