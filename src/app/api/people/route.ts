import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Person from "@/models/person";

export const DEFAULT_PEOPLE_MEMBERS = [
  {
    name: "Aseem Srivastava",
    batch: "Batch of '17",
    company: "MBZUAI",
    role: "Postdoctoral Researcher",
    domain: "AI & LLMs",
    imageSrc: "/peoples/aseem.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    isPTSCAlumni: true,
    order: 1,
  },
  {
    name: "Prashant Tripathi",
    batch: "Batch of '21",
    company: "Google",
    role: "Software Engineer",
    domain: "CP & Algorithms",
    imageSrc: "/peoples/prashant-tripathi.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    isPTSCAlumni: true,
    order: 2,
  },
  {
    name: "Sudhi Awasthi",
    batch: "Batch of '21",
    company: "Bloomberg",
    role: "Senior Software Engineer",
    domain: "High-Performance Systems",
    imageSrc: "/peoples/sudhi-awasthi.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    isPTSCAlumni: true,
    order: 3,
  },
];

export async function GET() {
  try {
    await connectDB();
    let people = await Person.find({}).sort({ order: 1, createdAt: -1 });

    // Auto-seed default people if DB is empty
    if (!people || people.length === 0) {
      people = await Person.insertMany(DEFAULT_PEOPLE_MEMBERS);
    }

    return NextResponse.json({ success: true, people });
  } catch (error) {
    console.error("Get people error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch people" }, { status: 500 });
  }
}
