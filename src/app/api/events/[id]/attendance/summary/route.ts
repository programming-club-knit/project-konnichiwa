import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAuth } from "@/lib/auth";
import EventRegistration from "@/models/eventRegistration";

type Params = { params: Promise<{ id: string }> };

// GET /api/events/[id]/attendance/summary — admin/member
export async function GET(_request: NextRequest, { params }: Params) {
  const { response } = await requireAuth(["admin", "member"]);
  if (response) return response;

  try {
    await connectDB();
    const { id: eventId } = await params;
    const total = await EventRegistration.countDocuments({
      eventId,
      deleted: { $ne: true },
    });
    const present = await EventRegistration.countDocuments({
      eventId,
      attended: true,
      deleted: { $ne: true },
    });

    return NextResponse.json({
      success: true,
      summary: { present, absent: Math.max(total - present, 0), total },
    });
  } catch (error) {
    console.error("getAttendanceSummary error:", error);
    return NextResponse.json(
      { success: false, message: "internal server error" },
      { status: 500 }
    );
  }
}
