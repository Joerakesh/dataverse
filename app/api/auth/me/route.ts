import { connection, NextResponse } from "next/server";
import { getCurrentAccount } from "@/src/lib/auth";

export async function GET() {
  try {
    await connection();
    const current = await getCurrentAccount();

    if (!current) {
      return NextResponse.json(
        { success: false, message: "Not authenticated." },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      accountType: current.accountType,
      account: {
        id: current.account._id.toString(),
        name: current.account.name,
        email: current.account.email,
      },
    });
  } catch (error) {
    console.error("Auth check error:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 },
    );
  }
}
