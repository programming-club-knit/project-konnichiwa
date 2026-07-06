import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Event from "@/models/event";

type Params = { params: Promise<{ slug: string }> };

// GET /api/events/slug/[slug] — public, fetch event by slug
export async function GET(_request: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { slug } = await params;
    const event = await Event.findOne({ slug });
    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error("fetchEventBySlug error:", error);
    return NextResponse.json(
      { success: false, message: "internal server error" },
      { status: 500 }
    );
  }
}
