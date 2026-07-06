import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import { requireAuth } from "@/lib/auth";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { response } = await requireAuth(["admin"]);
  if (response) return response;

  try {
    await connectDB();
    const { id } = await params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return NextResponse.json({ success: false, message: "user not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "user denied for to be a member" });
  } catch (error) {
    console.error("Error denying user:", error);
    return NextResponse.json({ success: false, message: "Server error while denying user" }, { status: 500 });
  }
}
