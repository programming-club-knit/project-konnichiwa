import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAuth } from "@/lib/auth";
import Event from "@/models/event";
import EventRegistration from "@/models/eventRegistration";

type Params = { params: Promise<{ id: string }> };

// PATCH /api/events/[id]/attendance — admin/member, bulk update attendance
export async function PATCH(request: NextRequest, { params }: Params) {
  const { response } = await requireAuth(["admin", "member"]);
  if (response) return response;

  try {
    await connectDB();
    const { id: eventId } = await params;
    const body = await request.json();
    const { updates } = body || {};

    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json(
        { success: false, message: "updates must be a non-empty array" },
        { status: 400 }
      );
    }

    const event = await Event.findById(eventId).select("_id");
    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }

    const ops = updates
      .filter((u: any) => u && u.regId)
      .map((u: any) => ({
        updateOne: {
          filter: {
            _id: new mongoose.Types.ObjectId(u.regId),
            eventId: new mongoose.Types.ObjectId(eventId),
          },
          update: {
            $set: {
              attended: !!u.attended,
              attendedAt: u.attended ? new Date() : null,
            },
          },
        },
      }));

    if (ops.length === 0) {
      return NextResponse.json(
        { success: false, message: "No valid updates provided" },
        { status: 400 }
      );
    }

    const result = await EventRegistration.bulkWrite(ops, { ordered: false });

    const regs = await EventRegistration.find({
      eventId,
      deleted: { $ne: true },
    }).sort({ createdAt: 1 });

    const present = regs.filter((r: any) => r.attended === true).length;

    return NextResponse.json({
      success: true,
      modifiedCount: result.modifiedCount || 0,
      attendees: regs,
      summary: { present, total: regs.length },
    });
  } catch (error) {
    console.error("updateEventAttendance error:", error);
    return NextResponse.json(
      { success: false, message: "internal server error" },
      { status: 500 }
    );
  }
}
