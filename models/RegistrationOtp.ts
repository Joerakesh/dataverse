import { Schema, models, model } from "mongoose";
const RegistrationOtpSchema = new Schema({
  mobile: { type: String, required: true, index: true },
  requestIpHash: { type: String, required: true, index: true },
  otpHash: { type: String, required: true },
  attempts: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true },
  consumedAt: { type: Date, default: null },
}, { timestamps: true });
RegistrationOtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
RegistrationOtpSchema.index({ mobile: 1, createdAt: -1 });
export default models.RegistrationOtp || model("RegistrationOtp", RegistrationOtpSchema);
