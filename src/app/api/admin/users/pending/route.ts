import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  const { response } = await requireAuth(["admin"]);
  if (response) return response;

  try {
    await connectDB();
    const pendingUsers = await User.find({ status: "pending" }).select("-password");
    return NextResponse.json({ success: true, count: pendingUsers.length, pendingUsers });
  } catch (error) {
    console.error("getallpendings error:", error);
    return NextResponse.json({ success: false, message: "internal server error" }, { status: 500 });
  }
}
