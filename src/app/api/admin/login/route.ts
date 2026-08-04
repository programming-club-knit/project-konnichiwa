import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import { signToken, setAuthCookie } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await request.json().catch(() => ({}));

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    // 1. Optimize query: only select needed fields and use .lean() to reduce memory, CPU and bandwidth
    const user = await User.findOne({ email })
      .select("password role status")
      .lean();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 400 }
      );
    }

    // 2. Perform direct password compare on the lean object
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 400 }
      );
    }

    // 3. Ensure role is admin
    if (user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Access denied. Admin role required." },
        { status: 403 }
      );
    }

    // 4. Ensure user is approved
    if (user.status !== "approved") {
      return NextResponse.json(
        { success: false, message: "Your admin account is pending approval." },
        { status: 403 }
      );
    }

    const token = signToken(user._id.toString());
    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      message: "Admin logged in successfully!",
      role: user.role,
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
