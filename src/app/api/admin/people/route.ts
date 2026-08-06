import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Person from "@/models/person";
import { requireAuth } from "@/lib/auth";
import { DEFAULT_PEOPLE_MEMBERS } from "@/app/api/people/route";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(["admin"]);
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized. Admin required." }, { status: 401 });
    }

    await connectDB();
    const body = await request.json().catch(() => ({}));
    const { name, batch, company, role, domain, imageSrc, github, linkedin, isPTSCAlumni, order } = body;

    if (!name || !batch || !company || !role || !domain) {
      return NextResponse.json(
        { success: false, message: "Name, batch, company, role, and domain are required." },
        { status: 400 }
      );
    }

    const person = await Person.create({
      name,
      batch,
      company,
      role,
      domain,
      imageSrc: imageSrc || "",
      github: github || "",
      linkedin: linkedin || "",
      isPTSCAlumni: isPTSCAlumni !== undefined ? Boolean(isPTSCAlumni) : true,
      order: order !== undefined ? Number(order) : 0,
    });

    return NextResponse.json({ success: true, message: "Person added successfully", person }, { status: 201 });
  } catch (error) {
    console.error("Create person error:", error);
    return NextResponse.json({ success: false, message: "Failed to create person" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth(["admin"]);
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized. Admin required." }, { status: 401 });
    }

    await connectDB();
    
    // Seed or reset initial default people members
    await Person.deleteMany({});
    const seeded = await Person.insertMany(DEFAULT_PEOPLE_MEMBERS);

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${seeded.length} default people members.`,
      people: seeded,
    });
  } catch (error) {
    console.error("Seed people error:", error);
    return NextResponse.json({ success: false, message: "Failed to seed people" }, { status: 500 });
  }
}
