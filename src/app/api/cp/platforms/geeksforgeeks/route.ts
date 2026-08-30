// app/api/platforms/geeksforgeeks/route.ts

import { NextRequest } from "next/server";
import {
  getGeeksForGeeksStats,
} from "@/lib/platforms/geeksforgeeks";

export async function GET(
  request: NextRequest
) {
  const username =
    request.nextUrl.searchParams.get("username");

  if (!username) {
    return Response.json(
      {
        success: false,
        error: "Username is required",
      },
      { status: 400 }
    );
  }

  try {
    const stats =
      await getGeeksForGeeksStats(username);

    return Response.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch GFG stats",
      },
      { status: 500 }
    );
  }
}