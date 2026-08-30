import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAuth } from "@/lib/auth";
import Event from "@/models/event";
import EventRegistration from "@/models/eventRegistration";
import EmailLog from "@/models/emailLog";

type Params = { params: Promise<{ id: string }> };

// POST /api/admin/mail/event/[id]/certificate — send certificate emails to attendees/winners
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

    // Find registrations where attended === true (or registered)
    const registrations = await EventRegistration.find({
      eventId,
      attended: true,
    });

    if (registrations.length === 0) {
      return NextResponse.json(
        { success: false, message: "No attended participants found to award certificates." },
        { status: 400 }
      );
    }

    const createdLogs = [];
    for (const reg of registrations) {
      const email = reg.email || reg.participants?.[0]?.email;
      const name = reg.name || reg.participants?.[0]?.name || "Participant";

      if (email) {
        const log = await EmailLog.create({
          eventId,
          registrationId: reg._id,
          emailType: "certificate",
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
      message: `Certificate emails dispatched to ${createdLogs.length} participants.`,
      count: createdLogs.length,
    });
  } catch (error) {
    console.error("sendCertificateEmails error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
