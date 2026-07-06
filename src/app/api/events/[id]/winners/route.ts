import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAuth } from "@/lib/auth";
import Event from "@/models/event";

type Params = { params: Promise<{ id: string }> };

// PATCH /api/events/[id]/winners — admin only, assign winners
export async function PATCH(request: NextRequest, { params }: Params) {
  const { response } = await requireAuth(["admin"]);
  if (response) return response;

  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const { winners } = body;

    // Sanitize winners: remove empty strings to avoid CastError for ObjectIds
    const sanitizedWinners: Record<string, any> = {};

    // Handle Overall (Array)
    if (winners.overall) {
      if (!Array.isArray(winners.overall)) {
        winners.overall = [winners.overall];
      }
      sanitizedWinners.overall = winners.overall.filter(
        (id: any) => id && typeof id === "string" && id.trim() !== ""
      );
    } else {
      sanitizedWinners.overall = [];
    }

    // Handle single-winner categories
    const categories = [
      "overallFirstYear",
      "overallFirstYearGirls",
      "overallGirls",
    ];
    categories.forEach((cat) => {
      if (
        winners[cat] &&
        typeof winners[cat] === "string" &&
        winners[cat].trim() !== ""
      ) {
        sanitizedWinners[cat] = winners[cat];
      } else {
        sanitizedWinners[cat] = null;
      }
    });

    // Handle published flag
    sanitizedWinners.published = !!winners.published;

    // Handle Dynamic Categories
    if (
      winners.dynamicCategories &&
      Array.isArray(winners.dynamicCategories)
    ) {
      sanitizedWinners.dynamicCategories = winners.dynamicCategories.map(
        (cat: any) => ({
          title: cat.title || "Untitled Category",
          winners: Array.isArray(cat.winners)
            ? cat.winners.filter(
                (id: any) =>
                  id && typeof id === "string" && id.trim() !== ""
              )
            : [],
        })
      );
    } else {
      sanitizedWinners.dynamicCategories = [];
    }

    const event = await Event.findByIdAndUpdate(
      id,
      { $set: { winners: sanitizedWinners } },
      { new: true }
    );

    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      event,
      message: "Winners assigned successfully",
    });
  } catch (error) {
    console.error("assignWinners error:", error);
    return NextResponse.json(
      { success: false, message: "internal server error" },
      { status: 500 }
    );
  }
}
