import { connection, NextResponse } from "next/server";
import ChatConversation from "@/models/ChatConversation";
import "@/models/Participant";
import { requirePermission } from "@/src/lib/authorization";

export async function GET(request: Request) {
  await connection();
  try {
    await requirePermission("conversations:view");
    const url = new URL(request.url);
    const page = Math.max(1, Number.parseInt(url.searchParams.get("page") ?? "1", 10) || 1);
    const limit = Math.min(50, Math.max(1, Number.parseInt(url.searchParams.get("limit") ?? "20", 10) || 20));
    const [items, total] = await Promise.all([
      ChatConversation.find({})
        .select("conversationId participantId messages lastMessageAt createdAt updatedAt")
        .populate("participantId", "name email mobile college registerNumber")
        .sort({ updatedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      ChatConversation.countDocuments({}),
    ]);

    return NextResponse.json({
      success: true,
      conversations: items.map((item) => ({
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
        messageCount: item.messages.length,
        preview: item.messages.at(-1)?.text ?? "",
        lastMessageAt: item.lastMessageAt,
        updatedAt: item.updatedAt,
      })),
      pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
    if (error instanceof Error && error.message === "FORBIDDEN") return NextResponse.json({ success: false, message: "You do not have permission to view conversations." }, { status: 403 });
    console.error("Admin conversations list error:", error);
    return NextResponse.json({ success: false, message: "Unable to load conversations." }, { status: 500 });
  }
}
