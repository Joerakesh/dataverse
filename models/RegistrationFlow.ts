import { Schema, models, model } from "mongoose";
const RegistrationFlowSchema = new Schema({
  tokenHash: { type: String, required: true, unique: true, index: true },
  participantId: { type: Schema.Types.ObjectId, ref: "Participant", required: true },
  expiresAt: { type: Date, required: true },
}, { timestamps: true });
RegistrationFlowSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export default models.RegistrationFlow || model("RegistrationFlow", RegistrationFlowSchema);
