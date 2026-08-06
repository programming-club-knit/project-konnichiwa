import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import { getCurrentUser } from "@/lib/auth";

export async function PUT(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json().catch(() => ({}));
    const { achievements } = body;

    if (!Array.isArray(achievements)) {
      return NextResponse.json({ success: false, message: "Achievements must be an array" }, { status: 400 });
    }

    // Clean & validate each achievement object
    const cleanAchievements = achievements.map((ach) => ({
      event: String(ach.event || "").trim(),
      status: String(ach.status || "").trim(),
      category: String(ach.category || "HACKATHONS").trim().toUpperCase(),
    })).filter((ach) => ach.event && ach.status);

    const updatedUser = await User.findByIdAndUpdate(
      currentUser._id,
      { $set: { achievements: cleanAchievements } },
      { new: true }
    ).select("-password");

    return NextResponse.json({
      success: true,
      message: "Achievements updated successfully!",
      achievements: updatedUser.achievements,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update achievements error:", error);
    return NextResponse.json({ success: false, message: "Failed to update achievements" }, { status: 500 });
  }
}
