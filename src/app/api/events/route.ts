import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAuth } from "@/lib/auth";
import Event from "@/models/event";
import { slugify, ensureUniqueSlug } from "@/lib/slug";

// GET /api/events — public, fetch all events
export async function GET() {
  try {
    await connectDB();
    const events = await Event.find().sort({ date: -1 });
    return NextResponse.json({
      success: true,
      events,
      count: events.length,
      message: "events are successfully fetched.",
    });
  } catch (error) {
    console.error("fetchEvents error:", error);
    return NextResponse.json(
      { success: false, message: "internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/events — admin/member, create event
export async function POST(request: Request) {
  const { user, response } = await requireAuth(["admin", "member"]);
  if (response) return response;

  try {
    await connectDB();
    const body = await request.json();
    const {
      title,
      description,
      date,
      time,
      status,
      googleFormLink,
      whatsappGroupLink,
      coverImageUrl,
      useCustomForm,
      forceGoogleForm,
      registrationFields,
      registrationType = "individual",
      teamMinSize = 1,
      teamMaxSize = 1,
      participantFields = [],
      resources = [],
      ruleBookUrl,
    } = body;

    const dupEvent = await Event.findOne({ title });
    if (dupEvent) {
      return NextResponse.json(
        { success: false, message: "Duplicate title not allowed." },
        { status: 409 }
      );
    }

    const regType = registrationType === "team" ? "team" : "individual";
    let minSize = Number(teamMinSize);
    let maxSize = Number(teamMaxSize);
    if (regType === "team") {
      if (!Number.isFinite(minSize) || minSize < 1) minSize = 1;
      if (!Number.isFinite(maxSize) || maxSize < minSize) maxSize = minSize;
    } else {
      minSize = 1;
      maxSize = 1;
    }

    const sanitizedResources = Array.isArray(resources)
      ? resources.filter(
          (r: { label?: string; url?: string }) => r && r.label && r.url
        )
      : [];

    const baseSlug = slugify(title);
    const slug = await ensureUniqueSlug(baseSlug);

    const event = await Event.create({
      title,
      slug,
      description,
      date,
      time,
      status,
      googleFormLink,
      whatsappGroupLink,
      coverImageUrl,
      forceGoogleForm: Boolean(forceGoogleForm),
      ruleBookUrl,
      useCustomForm: Boolean(useCustomForm),
      registrationFields: Array.isArray(registrationFields)
        ? registrationFields
        : [],
      registrationType: regType,
      teamMinSize: minSize,
      teamMaxSize: maxSize,
      participantFields: Array.isArray(participantFields)
        ? participantFields
        : [],
      resources: sanitizedResources,
    });

    return NextResponse.json({
      success: true,
      event,
      message: "event created successfully",
    });
  } catch (error) {
    console.error("createEvent error:", error);
    return NextResponse.json(
      { success: false, message: "internal server error" },
      { status: 500 }
    );
  }
}
