import { connection, NextResponse } from "next/server";
import { Types } from "mongoose";
import ChatConversation from "@/models/ChatConversation";
import "@/models/Participant";
import { requirePermission } from "@/src/lib/authorization";

export async function GET(_request: Request, context: RouteContext<"/api/admin/conversations/[id]">) {
  await connection();
  try {
    await requirePermission("conversations:view");
    const { id } = await context.params;
    if (!Types.ObjectId.isValid(id)) return NextResponse.json({ success: false, message: "Invalid conversation ID." }, { status: 400 });
    const item = await ChatConversation.findById(id)
      .populate("participantId", "name email mobile college registerNumber")
      .lean();
    if (!item) return NextResponse.json({ success: false, message: "Conversation not found." }, { status: 404 });
    return NextResponse.json({
      success: true,
      conversation: {
        id: item._id.toString(),
        conversationId: item.conversationId,
        participant: item.participantId && typeof item.participantId === "object" && "name" in item.participantId
          ? {
              name: item.participantId.name,
              email: "email" in item.participantId ? item.participantId.email : "",
              mobile: "mobile" in item.participantId ? item.participantId.mobile : "",
              college: "college" in item.participantId ? item.participantId.college : "",
              registerNumber: "registerNumber" in item.participantId ? item.participantId.registerNumber : "",
            }
          : null,
        messages: item.messages.map((message) => ({ id: message.messageId, role: message.role, text: message.text })),
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
    if (error instanceof Error && error.message === "FORBIDDEN") return NextResponse.json({ success: false, message: "You do not have permission to view conversations." }, { status: 403 });
    console.error("Admin conversation detail error:", error);
    return NextResponse.json({ success: false, message: "Unable to load this conversation." }, { status: 500 });
  }
}
