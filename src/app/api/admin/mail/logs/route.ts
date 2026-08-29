import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAuth } from "@/lib/auth";
import EmailLog from "@/models/emailLog";

// GET /api/admin/mail/logs?eventId=... — fetch email logs for an event
export async function GET(request: NextRequest) {
  const { response } = await requireAuth(["admin", "member"]);
  if (response) return response;

  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");

    if (!eventId) {
      return NextResponse.json(
        { success: false, message: "eventId parameter is required." },
        { status: 400 }
      );
    }

    const logs = await EmailLog.find({ eventId })
      .sort({ createdAt: -1 })
      .limit(200);

    return NextResponse.json({
      success: true,
      logs,
      count: logs.length,
    });
  } catch (error) {
    console.error("fetchEmailLogs error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
