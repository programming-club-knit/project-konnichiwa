import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAuth } from "@/lib/auth";
import EventRegistration from "@/models/eventRegistration";

type Params = { params: Promise<{ id: string }> };

// PATCH /api/registrations/[id]/restore — admin only, restore soft-deleted registration
export async function PATCH(_request: NextRequest, { params }: Params) {
  const { response } = await requireAuth(["admin"]);
  if (response) return response;

  try {
    await connectDB();
    const { id } = await params;
    const reg = await EventRegistration.findByIdAndUpdate(
      id,
      { $set: { deleted: false, deletedAt: null } },
      { new: true }
    );
    if (!reg) {
      return NextResponse.json(
        { success: false, message: "Registration not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: "Registration restored",
      registration: reg,
    });
  } catch (error) {
    console.error("restoreRegistration error:", error);
    return NextResponse.json(
      { success: false, message: "internal server error" },
      { status: 500 }
    );
  }
}
