import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAuth } from "@/lib/auth";
import EventRegistration from "@/models/eventRegistration";

// GET /api/registrations — admin/member, list registrations (optionally filtered by eventId)
export async function GET(request: NextRequest) {
  const { response } = await requireAuth(["admin", "member"]);
  if (response) return response;

  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");
    const deleted = searchParams.get("deleted");

    const filter: Record<string, any> = eventId ? { eventId } : {};
    if (deleted === "true") {
      filter.deleted = true;
    } else {
      filter.deleted = { $ne: true };
    }

    const regs = await EventRegistration.find(filter).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: regs.length,
      registrations: regs,
    });
  } catch (error) {
    console.error("listRegistrations error:", error);
    return NextResponse.json(
      { success: false, message: "internal server error" },
      { status: 500 }
    );
  }
}
