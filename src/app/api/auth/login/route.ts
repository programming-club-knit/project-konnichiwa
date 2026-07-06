import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import { signToken, setAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await request.json().catch(() => ({}));

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "email and password are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "email or password invalid" },
        { status: 400 }
      );
    }

    const isMatched = await user.matchPassword(password);
    if (!isMatched) {
      return NextResponse.json(
        { success: false, message: "email or password invalid" },
        { status: 400 }
      );
    }

    if (user.status !== "approved") {
      return NextResponse.json(
        { success: false, message: "you are not an approved member" },
        { status: 400 }
      );
    }

    const token = signToken(user._id.toString());
    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      message: "member loggedin successfully!",
      role: user.role,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ success: false, message: "internal server error" }, { status: 500 });
  }
}
