import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAuth } from "@/lib/auth";
import Event from "@/models/event";
import { slugify, ensureUniqueSlug } from "@/lib/slug";

type Params = { params: Promise<{ id: string }> };

// GET /api/events/[id] — public, fetch event by ID
export async function GET(_request: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error("fetchEventById error:", error);
    return NextResponse.json(
      { success: false, message: "internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/events/[id] — admin/member, edit event
export async function PATCH(request: NextRequest, { params }: Params) {
  const { response } = await requireAuth(["admin", "member"]);
  if (response) return response;

  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const {
      title,
      description,
      date,
      status,
      googleFormLink,
      whatsappGroupLink,
      coverImageUrl,
      time,
      useCustomForm,
      forceGoogleForm,
      registrationFields,
      registrationType,
      teamMinSize,
      teamMaxSize,
      participantFields,
      resources,
      ruleBookUrl,
    } = body;

    let newSlug: string | undefined;
    if (title) {
      const base = slugify(title);
      newSlug = await ensureUniqueSlug(base, id);
    }

    const patch: Record<string, any> = {
      $set: {
        title,
        slug: newSlug,
        description,
        date,
        status,
        googleFormLink,
        whatsappGroupLink,
        coverImageUrl,
        time,
        ruleBookUrl,
        useCustomForm: Boolean(useCustomForm),
        ...(forceGoogleForm !== undefined
          ? { forceGoogleForm: Boolean(forceGoogleForm) }
          : {}),
        registrationFields: Array.isArray(registrationFields)
          ? registrationFields
          : [],
        resources: Array.isArray(resources)
          ? resources.filter(
              (r: { label?: string; url?: string }) => r && r.label && r.url
            )
          : [],
      },
    };

    if (registrationType)
      patch.$set.registrationType =
        registrationType === "team" ? "team" : "individual";

    if (registrationType === "team") {
      const minSize = Number(teamMinSize);
      const maxSize = Number(teamMaxSize);
      if (Number.isFinite(minSize))
        patch.$set.teamMinSize = Math.max(1, minSize);
      if (Number.isFinite(maxSize))
        patch.$set.teamMaxSize = Math.max(patch.$set.teamMinSize || 1, maxSize);
      if (Array.isArray(participantFields))
        patch.$set.participantFields = participantFields;
    } else if (registrationType === "individual") {
      patch.$set.teamMinSize = 1;
      patch.$set.teamMaxSize = 1;
      patch.$set.participantFields = [];
    }

    const event = await Event.findByIdAndUpdate(id, patch, { new: true });
    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      event,
      message: "event edited successfully",
    });
  } catch (error) {
    console.error("editEvent error:", error);
    return NextResponse.json(
      { success: false, message: "internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/events/[id] — admin/member, delete event
export async function DELETE(_request: NextRequest, { params }: Params) {
  const { response } = await requireAuth(["admin", "member"]);
  if (response) return response;

  try {
    await connectDB();
    const { id } = await params;
    const event = await Event.findByIdAndDelete(id);
    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      event,
      message: "event deleted successfully",
    });
  } catch (error) {
    console.error("deleteEvent error:", error);
    return NextResponse.json(
      { success: false, message: "internal server error" },
      { status: 500 }
    );
  }
}
