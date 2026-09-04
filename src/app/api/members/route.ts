import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";

export async function GET() {
  try {
    await connectDB();

    // Fetch approved team members who have an active post assigned and a valid batch
    const members = await User.find({
      post: { $exists: true, $nin: ["", null] },
      batch: { $exists: true, $nin: [null] },
      status: "approved"
    })
      .select("firstName lastName username email mobile batch post role status imageSrc")
      .sort({ batch: -1, firstName: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      members: JSON.parse(JSON.stringify(members)),
    });
  } catch (error) {
    console.error("Fetch members error:", error);
    return NextResponse.json({ success: false, members: [] }, { status: 500 });
  }
}
