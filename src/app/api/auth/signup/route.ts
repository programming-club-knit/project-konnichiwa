import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import Setting from "@/models/setting";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json().catch(() => ({}));
    const { firstName, lastName, email, password, username, mobile, batch, post } = body;

    if (!firstName || !lastName || !email || !password || !username || !mobile) {
      return NextResponse.json(
        { success: false, message: "firstName, lastName, email, password, username and mobile are required" },
        { status: 400 }
      );
    }

    try {
      const s = await Setting.findOne({ key: "allowSignup" });
      const allowed = s ? Boolean(s.value) : true;
      if (!allowed) {
        return NextResponse.json(
          { success: false, message: "New registrations are currently closed" },
          { status: 403 }
        );
      }
    } catch {
      // If settings fetch fails, default to allowing signup
    }

    const postEnumValues: string[] = User.schema.path("post").enumValues;
    if (post !== undefined && post !== null && post !== "") {
      if (!postEnumValues.includes(post)) {
        return NextResponse.json({ success: false, message: "Invalid post selection" }, { status: 400 });
      }
    }

    if (batch !== undefined && batch !== null && batch !== "") {
      const b = Number(batch);
      if (!Number.isFinite(b) || b < 2000 || b > 2100) {
        return NextResponse.json({ success: false, message: "Invalid batch year" }, { status: 400 });
      }
    }

    const duplicateEmailUser = await User.findOne({ email });
    if (duplicateEmailUser) {
      return NextResponse.json({ success: false, message: "Email already Exists." }, { status: 409 });
    }

    const duplicateUsernameUser = await User.findOne({ username });
    if (duplicateUsernameUser) {
      return NextResponse.json({ success: false, message: "Same UserName already Exists." }, { status: 409 });
    }

    await User.create({ firstName, lastName, email, password, username, mobile, batch, post });

    return NextResponse.json(
      { success: true, message: "Registered successfully. An admin needs to approve your account before you can log in." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { success: false, message: "registration is unsuccessful!" },
      { status: 500 }
    );
  }
}
