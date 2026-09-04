import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import { requireAuth } from "@/lib/auth";

// GET /api/admin/users — fetch all users
export async function GET() {
  const { response } = await requireAuth(["admin", "member"]);
  if (response) return response;

  try {
    await connectDB();
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return NextResponse.json({ success: true, count: users.length, users });
  } catch (error) {
    console.error("getAllUsers error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
