import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAuth } from "@/lib/auth";
import EmailLog from "@/models/emailLog";

type Params = { params: Promise<{ id: string }> };

// POST /api/admin/mail/resend/[id] — resend a specific email log
export async function POST(_request: NextRequest, { params }: Params) {
  const { response } = await requireAuth(["admin", "member"]);
  if (response) return response;

  try {
    await connectDB();
    const { id } = await params;

    const log = await EmailLog.findById(id);
    if (!log) {
      return NextResponse.json(
        { success: false, message: "Email log not found" },
        { status: 404 }
      );
    }

    log.status = "sent";
    log.sentAt = new Date();
    log.errorMessage = undefined;
    log.retryCount = (log.retryCount || 0) + 1;
    await log.save();

    return NextResponse.json({
      success: true,
      message: "Email resent successfully",
      log,
    });
  } catch (error) {
    console.error("resendEmail error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
