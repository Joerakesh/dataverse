import { connection, NextResponse } from "next/server";
import { z } from "zod";
import ChatConversation from "@/models/ChatConversation";
import { connectDB } from "@/src/lib/mongodb";
import { getFlowParticipant } from "@/src/lib/public-registration";

const schema = z.object({
  conversationId: z.string().regex(/^[a-f0-9-]{36}$/i),
  messages: z.array(z.object({
    id: z.string().min(1).max(80),
    role: z.enum(["assistant", "user"]),
    text: z.string().trim().min(1).max(4000),
  })).min(1).max(200),
});

export async function POST(request: Request) {
  await connection();
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Invalid conversation data." }, { status: 400 });
    }

    await connectDB();
    const participant = await getFlowParticipant();
    const messages = parsed.data.messages.map((message) => ({
      messageId: message.id,
      role: message.role,
      text: message.text,
    }));

    await ChatConversation.findOneAndUpdate(
      { conversationId: parsed.data.conversationId },
      {
        $set: {
          messages,
          lastMessageAt: new Date(),
          ...(participant ? { participantId: participant._id } : {}),
        },
      },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Persist registration conversation error:", error);
    return NextResponse.json({ success: false, message: "Unable to save this conversation." }, { status: 500 });
  }
}
