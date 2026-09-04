import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const coreOnly = searchParams.get("coreOnly") === "true";

    const filter: Record<string, any> = {
      status: "approved",
    };

    if (coreOnly) {
      filter.post = {
        $in: [
          "Secretary",
          "Joint Secretary",
          "Web Development Head",
          "Competitive Programming Head",
          "Cyber Security Head",
        ],
      };
    } else {
      filter.$or = [
        { post: { $exists: true, $ne: "" } },
        { role: { $in: ["admin", "member"] } },
      ];
    }

    // Strictly exclude sensitive fields (mobile, email, password, username, rollNo)
    // Only return public portfolio fields
    const members = await User.find(filter)
      .select("firstName lastName post role batch imageSrc github linkedin")
      .sort({ batch: -1, firstName: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      members: JSON.parse(JSON.stringify(members)),
    });
  } catch (error) {
    console.error("Fetch members error:", error);
    return NextResponse.json({ success: false, members: [] }, { status: 500 });
  }
}
