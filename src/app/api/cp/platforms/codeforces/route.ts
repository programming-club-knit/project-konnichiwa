import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Student from "@/models/cp/student.js";

interface CodeforcesUser {
  handle: string;
  rating?: number;
  maxRating?: number;
  rank?: string;
  maxRank?: string;
  avatar?: string;
  titlePhoto?: string;
  country?: string;
  city?: string;
  organization?: string;
  contribution?: number;
  friendOfCount?: number;
}

interface CodeforcesRating {
  contestId: number;
  contestName: string;
  handle: string;
  rank: number;
  ratingUpdateTimeSeconds: number;
  oldRating: number;
  newRating: number;
}

interface CodeforcesSubmission {
  id: number;
  contestId?: number;
  creationTimeSeconds: number;
  relativeTimeSeconds: number;
  problem: {
    contestId?: number;
    index: string;
    name: string;
    type: string;
    rating?: number;
    tags?: string[];
  };
  author: {
    handle: string;
  };
  verdict: string;
  programmingLanguage: string;
  testset: string;
  passedTestCount: number;
}

interface CodeforcesResponse<T> {
  status: string;
  result: T;
  comment?: string;
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json(
        {
          success: false,
          message: "studentId is required",
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

    // Get Codeforces username from MongoDB
    const username = student.platforms?.codeforces?.username;

    if (!username) {
      return NextResponse.json(
        {
          success: false,
          message: "Codeforces username not added",
        },
        { status: 404 }
      );
    }

    // ==========================================
    // FETCH CODEFORCES PROFILE
    // ==========================================

    const profileResponse = await fetch(
      `https://codeforces.com/api/user.info?handles=${encodeURIComponent(
        username
      )}`,
      {
        cache: "no-store",
      }
    );

    const profileData: CodeforcesResponse<CodeforcesUser[]> =
      await profileResponse.json();

    if (
      profileData.status !== "OK" ||
      !profileData.result?.length
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Codeforces user not found",
        },
        { status: 404 }
      );
    }

    const profile = profileData.result[0];

    // ==========================================
    // FETCH RATING HISTORY
    // ==========================================

    const ratingResponse = await fetch(
      `https://codeforces.com/api/user.rating?handle=${encodeURIComponent(
        username
      )}`,
      {
        cache: "no-store",
      }
    );

    const ratingData: CodeforcesResponse<CodeforcesRating[]> =
      await ratingResponse.json();

    // ==========================================
    // FETCH SUBMISSIONS
    // ==========================================

    const submissionResponse = await fetch(
      `https://codeforces.com/api/user.status?handle=${encodeURIComponent(
        username
      )}&from=1&count=1000`,
      {
        cache: "no-store",
      }
    );

    const submissionData: CodeforcesResponse<
      CodeforcesSubmission[]
    > = await submissionResponse.json();

    // ==========================================
    // CALCULATE SOLVED PROBLEMS
    // ==========================================

    let solvedProblems = 0;

    if (
      submissionData.status === "OK" &&
      submissionData.result
    ) {
      const acceptedProblems = new Set<string>();

      for (const submission of submissionData.result) {
        if (submission.verdict === "OK") {
          const problemId = `${
            submission.problem.contestId || ""
          }-${submission.problem.index}`;

          acceptedProblems.add(problemId);
        }
      }

      solvedProblems = acceptedProblems.size;
    }

    // ==========================================
    // RESPONSE
    // ==========================================

    return NextResponse.json({
      success: true,

      student: {
        id: student._id.toString(),
        name: student.name,
        email: student.email,
        rollNumber: student.rollNumber,
        branch: student.branch,
        year: student.year,
      },

      codeforces: {
        username: profile.handle,

        rating: profile.rating || 0,

        maxRating: profile.maxRating || 0,

        rank: profile.rank || null,

        maxRank: profile.maxRank || null,

        contribution: profile.contribution || 0,

        friends: profile.friendOfCount || 0,

        country: profile.country || null,

        city: profile.city || null,

        organization: profile.organization || null,

        avatar: profile.avatar || null,

        solvedProblems,

        ratingHistory:
          ratingData.status === "OK"
            ? ratingData.result
            : [],

        submissions:
          submissionData.status === "OK"
            ? submissionData.result
            : [],
      },
    });
  } catch (error) {
    console.error("CP details error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch Codeforces details",
      },
      { status: 500 }
    );
  }
}