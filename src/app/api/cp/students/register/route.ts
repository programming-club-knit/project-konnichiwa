import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Student from "@/models/cp/student";

export async function POST(req:any) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      name,
      email,
      rollNumber,
      branch,
      year,
      platforms,
    } = body;

    // Validate required fields
    if (!name || !email || !rollNumber || !branch || !year) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide all required fields",
        },
        { status: 400 }
      );
    }

    // Check if student already exists
    const existingStudent = await Student.findOne({
      $or: [
        { email: email.toLowerCase() },
        { rollNumber },
      ],
    });

    if (existingStudent) {
      return NextResponse.json(
        {
          success: false,
          message: "Student already exists",
        },
        { status: 409 }
      );
    }

    // Create student
    const student = await Student.create({
      name,
      email: email.toLowerCase(),
      rollNumber,
      branch,
      year,

      platforms: {
        codeforces: {
          username: platforms?.codeforces?.username || null,
        },

        codechef: {
          username: platforms?.codechef?.username || null,
        },

        leetcode: {
          username: platforms?.leetcode?.username || null,
        },

        atcoder: {
          username: platforms?.atcoder?.username || null,
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Student registered successfully",

        student: {
          id: student._id.toString(),
          name: student.name,
          email: student.email,
          rollNumber: student.rollNumber,
          branch: student.branch,
          year: student.year,
          platforms: student.platforms,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Student registration error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to register student",
      },
      { status: 500 }
    );
  }
}