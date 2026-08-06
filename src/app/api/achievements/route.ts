import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";

export const SAMPLE_ACHIEVEMENT_USERS = [
  {
    firstName: "Akash",
    lastName: "Singh",
    username: "akash_singh",
    email: "akash.23401@knit.ac.in",
    password: "password123",
    mobile: 9876543210,
    role: "member",
    status: "approved",
    imageSrc: "/teams/pfp.jpg",
    achievements: [
      { event: "GSoC '24", status: "@Keploy", category: "GSOC" },
      { event: "LFX '25", status: "@LitmusChaos", category: "LFX" },
      { event: "SIH '25", status: "Winner", category: "SIH" },
      { event: "ICPC '25", status: "Regional Finalist", category: "ICPC" },
      { event: "HackGlobal Singapore", status: "Finalists", category: "HACKATHONS" },
      { event: "NITK '25", status: "Grand Winner", category: "HACKATHONS" },
    ],
  },
  {
    firstName: "Inchara",
    lastName: "J",
    username: "inchara_j",
    email: "inchara.23402@knit.ac.in",
    password: "password123",
    mobile: 9876543211,
    role: "member",
    status: "approved",
    imageSrc: "/teams/pfp.jpg",
    achievements: [
      { event: "GSoC '26", status: "@Kornia", category: "GSOC" },
      { event: "SIH '24", status: "Winner", category: "SIH" },
      { event: "SIH '25", status: "Winner", category: "SIH" },
      { event: "ICPC '25", status: "Rank #14", category: "ICPC" },
      { event: "HackNocturne", status: "Winner", category: "HACKATHONS" },
    ],
  },
  {
    firstName: "Kamini",
    lastName: "Banait",
    username: "kamini_banait",
    email: "kamini.23403@knit.ac.in",
    password: "password123",
    mobile: 9876543212,
    role: "member",
    status: "approved",
    imageSrc: "/teams/pfp.jpg",
    achievements: [
      { event: "GSoC '26", status: "@LLVM", category: "GSOC" },
      { event: "SIH '24", status: "Winner", category: "SIH" },
      { event: "SIH '25", status: "Winner", category: "SIH" },
      { event: "HackToFuture", status: "Winner", category: "HACKATHONS" },
    ],
  },
  {
    firstName: "Abhay",
    lastName: "Pratap",
    username: "abhay_pratap",
    email: "abhay.23404@knit.ac.in",
    password: "password123",
    mobile: 9876543213,
    role: "member",
    status: "approved",
    imageSrc: "/teams/pfp.jpg",
    achievements: [
      { event: "GSoC '25", status: "@AsyncAPI", category: "GSOC" },
      { event: "LFX '24", status: "@CNCF", category: "LFX" },
      { event: "SIH '24", status: "Grand Winner", category: "SIH" },
      { event: "ACM Winter School '24", status: "Selected Scholar", category: "ACM" },
      { event: "CodeChef '25", status: "5★ Candidate Master", category: "CP" },
    ],
  },
];

export async function GET() {
  try {
    await connectDB();

    // Query approved users who have achievements and are not hidden by admin
    let users = await User.find({
      status: "approved",
      hideAchievementsCard: { $ne: true },
      "achievements.0": { $exists: true },
    }).select("firstName lastName username email imageSrc achievements hideAchievementsCard role post batch");

    // Auto-seed sample achievement users if none exist in DB
    if (!users || users.length === 0) {
      for (const sampleUser of SAMPLE_ACHIEVEMENT_USERS) {
        const exists = await User.findOne({ email: sampleUser.email });
        if (!exists) {
          await User.create(sampleUser);
        }
      }

      users = await User.find({
        status: "approved",
        hideAchievementsCard: { $ne: true },
        "achievements.0": { $exists: true },
      }).select("firstName lastName username email imageSrc achievements hideAchievementsCard role post batch");
    }

    const cards = users.map((u) => ({
      id: u._id.toString(),
      name: `${u.firstName} ${u.lastName}`,
      username: u.username,
      imageSrc: u.imageSrc || "/teams/pfp.jpg",
      achievements: u.achievements || [],
    }));

    return NextResponse.json({ success: true, cards });
  } catch (error) {
    console.error("Get achievements error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch achievements" }, { status: 500 });
  }
}
