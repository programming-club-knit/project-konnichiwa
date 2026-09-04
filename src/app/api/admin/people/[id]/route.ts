import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Person from "@/models/person";
import { requireAuth } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { response } = await requireAuth(["admin", "member"]);
    if (response) return response;

    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const updated = await Person.findByIdAndUpdate(id, body, { new: true });
    if (!updated) {
      return NextResponse.json({ success: false, message: "Person not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Person updated successfully", person: updated });
  } catch (error) {
    console.error("Update person error:", error);
    return NextResponse.json({ success: false, message: "Failed to update person" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { response } = await requireAuth(["admin", "member"]);
    if (response) return response;

    await connectDB();
    const { id } = await params;

    const deleted = await Person.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: "Person not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Person deleted successfully" });
  } catch (error) {
    console.error("Delete person error:", error);
    return NextResponse.json({ success: false, message: "Failed to delete person" }, { status: 500 });
  }
}
