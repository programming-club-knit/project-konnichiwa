import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Student from "@/models/cp/student";

export async function PUT(req:any) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      studentId,
      platforms,
    } = body;

    // Validate student ID
    if (!studentId) {
      return NextResponse.json(
        {
          success: false,
          message: "Student ID is required",
        },
        { status: 400 }
      );
    }

    // Find student
    const student = await Student.findById(studentId);

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          message: "Student not found",
        },
        { status: 404 }
      );
    }

    // Update only provided platform details
    if (platforms?.codeforces) {
      student.platforms.codeforces.username =
        platforms.codeforces.username || null;
    }

    if (platforms?.codechef) {
      student.platforms.codechef.username =
        platforms.codechef.username || null;
    }

    if (platforms?.leetcode) {
      student.platforms.leetcode.username =
        platforms.leetcode.username || null;
    }

    if (platforms?.atcoder) {
      student.platforms.atcoder.username =
        platforms.atcoder.username || null;
    }

    await student.save();

    return NextResponse.json(
      {
        success: true,
        message: "Platform details updated successfully",

        student: {
          id: student._id.toString(),
          name: student.name,
          email: student.email,
          platforms: student.platforms,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update platform details error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update platform details",
      },
      { status: 500 }
    );
  }
}