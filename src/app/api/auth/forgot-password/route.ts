import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { email } = await request.json().catch(() => ({}));
    if (!email) {
      return NextResponse.json({ success: false, message: "email is required" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    // Email delivery isn't wired up yet, so hand the raw token back directly.
    // TODO: send this via email once nodemailer/SMTP config is added, and stop returning it in the response.
    return NextResponse.json({ success: true, message: "Reset token generated", resetToken });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
