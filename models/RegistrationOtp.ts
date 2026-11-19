import { Schema, models, model } from "mongoose";

const RegistrationOtpSchema = new Schema({
  email: {
    type: String,
    required: function (this: { isNew: boolean }) { return this.isNew; },
    trim: true,
    lowercase: true,
    index: true,
  },
  // Kept optional so old SMS OTP documents can expire naturally after this rollout.
  mobile: { type: String, required: false, index: true },
  purpose: { type: String, enum: ["login", "id-lookup"], default: "id-lookup", index: true },
  requestIpHash: { type: String, required: true, index: true },
  otpHash: { type: String, required: true },
  attempts: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true },
  consumedAt: { type: Date, default: null },
}, { timestamps: true });

RegistrationOtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
RegistrationOtpSchema.index({ email: 1, purpose: 1, createdAt: -1 });
RegistrationOtpSchema.index({ mobile: 1, purpose: 1, createdAt: -1 });

export default models.RegistrationOtp || model("RegistrationOtp", RegistrationOtpSchema);
