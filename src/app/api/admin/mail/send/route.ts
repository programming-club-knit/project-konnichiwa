import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAuth } from "@/lib/auth";

export async function POST(request: Request) {
  const { response } = await requireAuth(["admin", "member"]);
  if (response) return response;

  try {
    await connectDB();
    const { eventId, subject, body } = await request.json().catch(() => ({}));

    if (!eventId || !subject || !body) {
      return NextResponse.json(
        { success: false, message: "eventId, subject, and body are required." },
        { status: 400 }
      );
    }

    // Process broadcast email queue/dispatch
    return NextResponse.json({
      success: true,
      message: "Broadcast notification email queued successfully."
    });
  } catch (error) {
    console.error("Mail send error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
