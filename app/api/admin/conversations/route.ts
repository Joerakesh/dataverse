import { connection, NextResponse } from "next/server";
import ChatConversation from "@/models/ChatConversation";
import { requirePermission } from "@/src/lib/authorization";

export async function GET(request: Request) {
  await connection();
  try {
    await requirePermission("conversations:view");
    const url = new URL(request.url);
    const page = Math.max(1, Number.parseInt(url.searchParams.get("page") ?? "1", 10) || 1);
    const limit = Math.min(50, Math.max(1, Number.parseInt(url.searchParams.get("limit") ?? "20", 10) || 20));
    const [items, total] = await Promise.all([
      ChatConversation.aggregate([
        { $sort: { updatedAt: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        {
          $lookup: {
            from: "participants",
            localField: "participantId",
            foreignField: "_id",
            as: "participantRecord",
          },
        },
        { $unwind: { path: "$participantRecord", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            conversationId: 1,
            lastMessageAt: 1,
            updatedAt: 1,
            messageCount: { $size: { $ifNull: ["$messages", []] } },
            preview: { $ifNull: [{ $arrayElemAt: ["$messages.text", -1] }, ""] },
            participant: {
              name: "$participantRecord.name",
              email: "$participantRecord.email",
              mobile: "$participantRecord.mobile",
              college: "$participantRecord.college",
              registerNumber: "$participantRecord.registerNumber",
            },
          },
        },
      ]),
      ChatConversation.countDocuments({}),
    ]);

    return NextResponse.json({
      success: true,
      conversations: items.map((item) => ({
        id: item._id.toString(),
        conversationId: item.conversationId,
        participant: item.participant?.name ? {
          name: item.participant.name,
          email: item.participant.email ?? "",
          mobile: item.participant.mobile ?? "",
          college: item.participant.college ?? "",
          registerNumber: item.participant.registerNumber ?? "",
        } : null,
        messageCount: item.messageCount,
        preview: item.preview,
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
