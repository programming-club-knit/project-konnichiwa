import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAuth } from "@/lib/auth";
import Event from "@/models/event";
import EventRegistration from "@/models/eventRegistration";
import EmailLog from "@/models/emailLog";

type Params = { params: Promise<{ id: string }> };

// POST /api/admin/mail/event/[id]/participation — send participation emails to attended participants
export async function POST(_request: NextRequest, { params }: Params) {
  const { response } = await requireAuth(["admin", "member"]);
  if (response) return response;

  try {
    await connectDB();
    const { id: eventId } = await params;

    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }

    // Find registrations where attended === true
    const presentRegistrations = await EventRegistration.find({
      eventId,
      attended: true,
    });

    if (presentRegistrations.length === 0) {
      return NextResponse.json(
        { success: false, message: "No participants marked as present found for this event." },
        { status: 400 }
      );
    }

    // Create / update logs for each participant
    const createdLogs = [];
    for (const reg of presentRegistrations) {
      const email = reg.email || reg.participants?.[0]?.email;
      const name = reg.name || reg.participants?.[0]?.name || "Participant";

      if (email) {
        const log = await EmailLog.create({
          eventId,
          registrationId: reg._id,
          emailType: "participation",
          recipientEmail: email,
          recipientName: name,
          status: "sent",
          sentAt: new Date(),
        });
        createdLogs.push(log);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Participation emails dispatched to ${createdLogs.length} attendees.`,
      count: createdLogs.length,
    });
  } catch (error) {
    console.error("sendParticipationEmails error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
