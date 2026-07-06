import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import { requireAuth } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { response } = await requireAuth(["admin"]);
  if (response) return response;

  try {
    await connectDB();
    const { id } = await params;
    const user = await User.findByIdAndUpdate(
      id,
      { $set: { role: "member", status: "approved" } },
      { new: true }
    ).select("-password");

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "User approved to be a member", user });
  } catch (error) {
    console.error("Error approving user:", error);
    return NextResponse.json({ success: false, message: "Server error while approving user" }, { status: 500 });
  }
}
