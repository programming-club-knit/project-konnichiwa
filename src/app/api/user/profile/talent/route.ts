import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import { getCurrentUser } from "@/lib/auth";

export async function PUT(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json().catch(() => ({}));
    const {
      showInHireUs,
      availability,
      headlineRole,
      domain,
      skills,
      github,
      linkedin,
      portfolio,
      resume,
    } = body;

    let parsedSkills: string[] = [];
    if (Array.isArray(skills)) {
      parsedSkills = skills.map((s) => String(s).trim()).filter(Boolean);
    } else if (typeof skills === "string") {
      parsedSkills = skills.split(",").map((s) => s.trim()).filter(Boolean);
    }

    const updateData: Record<string, any> = {
      showInHireUs: Boolean(showInHireUs),
      availability: availability || "Full-time",
      headlineRole: headlineRole ? String(headlineRole).trim() : "",
      domain: domain ? String(domain).trim() : "",
      skills: parsedSkills,
      github: github ? String(github).trim() : "",
      linkedin: linkedin ? String(linkedin).trim() : "",
      portfolio: portfolio ? String(portfolio).trim() : "",
      resume: resume ? String(resume).trim() : "",
    };

    const updatedUser = await User.findByIdAndUpdate(
      currentUser._id,
      { $set: updateData },
      { new: true }
    ).select("-password");

    return NextResponse.json({
      success: true,
      message: "Hire-Us talent profile updated successfully!",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update talent error:", error);
    return NextResponse.json({ success: false, message: "Failed to update talent profile" }, { status: 500 });
  }
}
