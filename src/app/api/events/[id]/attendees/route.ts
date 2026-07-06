import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAuth } from "@/lib/auth";
import Event from "@/models/event";
import EventRegistration from "@/models/eventRegistration";

type Params = { params: Promise<{ id: string }> };

// GET /api/events/[id]/attendees — admin/member, list registrations for event
export async function GET(_request: NextRequest, { params }: Params) {
  const { response } = await requireAuth(["admin", "member"]);
  if (response) return response;

  try {
    await connectDB();
    const { id: eventId } = await params;
    const event = await Event.findById(eventId).select(
      "_id title registrationType"
    );
    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }

    const regs = await EventRegistration.find({
      eventId,
      deleted: { $ne: true },
    }).sort({ createdAt: 1 });

    return NextResponse.json({
      success: true,
      event: {
        _id: event._id,
        title: event.title,
        registrationType: event.registrationType,
      },
      attendees: regs,
      count: regs.length,
    });
  } catch (error) {
    console.error("getEventAttendees error:", error);
    return NextResponse.json(
      { success: false, message: "internal server error" },
      { status: 500 }
    );
  }
}
