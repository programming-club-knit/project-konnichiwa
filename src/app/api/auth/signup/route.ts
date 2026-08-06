import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import Setting from "@/models/setting";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json().catch(() => ({}));
    const { firstName, lastName, email, password, username, mobile, batch, post, registrationType } = body;

    if (!firstName || !lastName || !email || !password || !username || !mobile) {
      return NextResponse.json(
        { success: false, message: "First name, last name, email, password, username, and mobile are required" },
        { status: 400 }
      );
    }

    // Check global signup enabled/disabled setting
    const s = await Setting.findOne({ key: "allowSignup" });
    const allowed = s ? Boolean(s.value) : true;
    if (!allowed) {
      return NextResponse.json(
        { success: false, message: "New registrations are currently closed by administrator." },
        { status: 403 }
      );
    }

    const isGeneralUser = registrationType === "general" || (!post && email.toLowerCase().endsWith("@knit.ac.in"));

    if (isGeneralUser) {
      if (!email.toLowerCase().endsWith("@knit.ac.in")) {
        return NextResponse.json(
          { success: false, message: "General student registration requires an @knit.ac.in email address." },
          { status: 400 }
        );
      }
    } else {
      if (!post) {
        return NextResponse.json(
          { success: false, message: "Executive registration requires selecting a PTSC post." },
          { status: 400 }
        );
      }
      const postEnumValues: string[] = User.schema.path("post").enumValues;
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
      return NextResponse.json({ success: false, message: "Email already exists." }, { status: 409 });
    }

    const duplicateUsernameUser = await User.findOne({ username });
    if (duplicateUsernameUser) {
      return NextResponse.json({ success: false, message: "Username already exists." }, { status: 409 });
    }

    // General KNIT students get auto-approved as "normal" role (profile access only, no admin panel).
    // Executive members start as "pending" to be reviewed & promoted by admin.
    const userRole = "normal";
    const userStatus = isGeneralUser ? "approved" : "pending";

    await User.create({
      firstName,
      lastName,
      email,
      password,
      username,
      mobile,
      batch: batch ? Number(batch) : undefined,
      post: post || undefined,
      role: userRole,
      status: userStatus,
    });

    return NextResponse.json(
      {
        success: true,
        message: isGeneralUser
          ? "Registered successfully! You can now log in to your account."
          : "Executive registration submitted! An admin will review and grant access.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { success: false, message: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
