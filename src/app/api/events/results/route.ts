import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Event from "@/models/event";

// GET /api/events/results — public, fetch published event results
export async function GET() {
  try {
    await connectDB();
    const events = await Event.find({ "winners.published": true })
      .sort({ date: -1 })
      .populate({
        path: "winners.overall",
        select: "name team.teamName type registrationId participants",
      })
      .populate({
        path: "winners.overallFirstYear",
        select: "name team.teamName type registrationId participants",
      })
      .populate({
        path: "winners.overallFirstYearGirls",
        select: "name team.teamName type registrationId participants",
      })
      .populate({
        path: "winners.overallGirls",
        select: "name team.teamName type registrationId participants",
      })
      .populate({
        path: "winners.dynamicCategories.winners",
        select: "name team.teamName type registrationId participants",
      });

    return NextResponse.json({ success: true, results: events });
  } catch (error) {
    console.error("getEventResults error:", error);
    return NextResponse.json(
      { success: false, message: "internal server error" },
      { status: 500 }
    );
  }
}
