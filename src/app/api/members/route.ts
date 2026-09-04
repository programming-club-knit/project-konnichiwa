import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";

export async function GET() {
  try {
    await connectDB();

    // Fetch approved executive members who have a post assigned or admin/member role
    const members = await User.find({
      $or: [
        { post: { $exists: true, $ne: "" } },
        { role: { $in: ["admin", "member"] } }
      ],
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
