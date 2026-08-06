import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Setting from "@/models/setting";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  const { user, response } = await requireAuth(["admin"]);
  if (response) return response;

  try {
    await connectDB();
    const signupSetting = await Setting.findOne({ key: "allowSignup" });
    const allowSignup = signupSetting ? Boolean(signupSetting.value) : true;

    return NextResponse.json({
      success: true,
      settings: {
        allowSignup,
      },
    });
  } catch (error) {
    console.error("Fetch admin settings error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const { user, response } = await requireAuth(["admin"]);
  if (response) return response;

  try {
    await connectDB();
    const { allowSignup } = await request.json().catch(() => ({}));

    if (typeof allowSignup !== "boolean") {
      return NextResponse.json({ success: false, message: "Invalid allowSignup value" }, { status: 400 });
    }

    const updated = await Setting.findOneAndUpdate(
      { key: "allowSignup" },
      { value: allowSignup },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      message: `Signups ${allowSignup ? "enabled" : "disabled"} successfully`,
      allowSignup: Boolean(updated.value),
    });
  } catch (error) {
    console.error("Update admin settings error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
