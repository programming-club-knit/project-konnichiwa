import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Setting from "@/models/setting";

export async function GET() {
  try {
    await connectDB();
    const signupSetting = await Setting.findOne({ key: "allowSignup" });
    const allowSignup = signupSetting ? Boolean(signupSetting.value) : true;

    return NextResponse.json({
      success: true,
      allowSignup,
    });
  } catch (error) {
    console.error("Fetch public settings error:", error);
    return NextResponse.json({ success: true, allowSignup: true });
  }
}
