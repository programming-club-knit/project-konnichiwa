import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import { requireAuth } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

// PATCH /api/admin/users/[id] — Update user role, batch, post, status
export async function PATCH(request: Request, { params }: Params) {
  const { response } = await requireAuth(["admin"]);
  if (response) return response;

  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const { role, batch, post, status, imageSrc } = body;
    const updateData: Record<string, any> = {};

    if (role !== undefined) updateData.role = role;
    if (batch !== undefined) updateData.batch = batch;
    if (post !== undefined) updateData.post = post;
    if (status !== undefined) updateData.status = status;
    if (imageSrc !== undefined) updateData.imageSrc = imageSrc;

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).select("-password");

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ success: false, message: "Server error while updating user" }, { status: 500 });
  }
}

// DELETE /api/admin/users/[id] — Delete/deny user
export async function DELETE(_request: Request, { params }: Params) {
  const { response } = await requireAuth(["admin"]);
  if (response) return response;

  try {
    await connectDB();
    const { id } = await params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ success: false, message: "Server error while deleting user" }, { status: 500 });
  }
}
