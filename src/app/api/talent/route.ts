import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";

export async function GET() {
  try {
    await connectDB();

    // Query approved users who opted into showInHireUs
    const users = await User.find({
      status: "approved",
      showInHireUs: true,
    }).select("firstName lastName username email imageSrc availability headlineRole domain skills github linkedin portfolio resume");

    const talent = users.map((u) => ({
      id: u._id.toString(),
      name: `${u.firstName} ${u.lastName}`,
      availability: u.availability || "Full-time",
      role: u.headlineRole || "Software Engineer",
      domain: u.domain || "Web Development",
      skills: Array.isArray(u.skills) && u.skills.length > 0 ? u.skills : [],
      imageSrc: u.imageSrc || "/teams/default-avatar.png",
      github: u.github || "",
      linkedin: u.linkedin || "",
      portfolio: u.portfolio || "",
      resume: u.resume || "",
    }));

    return NextResponse.json({ success: true, talent });
  } catch (error) {
    console.error("Get talent error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch talent" }, { status: 500 });
  }
}
