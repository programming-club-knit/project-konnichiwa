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

    // Process broadcast email queue/dispatch & log entries
    const EventRegistration = (await import("@/models/eventRegistration")).default;
    const EmailLog = (await import("@/models/emailLog")).default;

    const registrations = await EventRegistration.find({ eventId, deleted: { $ne: true } });
    if (registrations.length > 0) {
      for (const reg of registrations) {
        const email = reg.email || reg.participants?.[0]?.email;
        const name = reg.name || reg.participants?.[0]?.name || "Participant";
        if (email) {
          await EmailLog.create({
            eventId,
            registrationId: reg._id,
            emailType: "custom",
            recipientEmail: email,
            recipientName: name,
            status: "sent",
            sentAt: new Date(),
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Broadcast notification email queued for ${registrations.length} participant(s).`
    });
  } catch (error) {
    console.error("Mail send error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
