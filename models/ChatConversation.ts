import { Schema, models, model } from "mongoose";

const ChatMessageSchema = new Schema(
  {
    role: { type: String, enum: ["assistant", "user"], required: true },
    text: { type: String, required: true, maxlength: 4000 },
    messageId: { type: String, required: true, maxlength: 80 },
  },
  { _id: false },
);

const ChatConversationSchema = new Schema(
  {
    conversationId: { type: String, required: true, unique: true, index: true, maxlength: 80 },
    participantId: { type: Schema.Types.ObjectId, ref: "Participant", default: null, index: true },
    messages: { type: [ChatMessageSchema], default: [] },
    lastMessageAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true },
);

ChatConversationSchema.index({ updatedAt: -1 });

export default models.ChatConversation || model("ChatConversation", ChatConversationSchema);
