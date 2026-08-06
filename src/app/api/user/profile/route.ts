import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const userObj = typeof (user as any).toObject === "function" ? (user as any).toObject() : user;
    if (userObj.imageSrc === undefined) {
      userObj.imageSrc = "";
    }

    return NextResponse.json({ success: true, user: userObj });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json().catch(() => ({}));
    const { firstName, lastName, username, mobile, password, imageSrc, rollNo } = body;

    const userToUpdate = await User.findById(currentUser._id);
    if (!userToUpdate) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    if (username && username !== userToUpdate.username) {
      const existingUser = await User.findOne({ username, _id: { $ne: currentUser._id } });
      if (existingUser) {
        return NextResponse.json({ success: false, message: "Username is already taken" }, { status: 409 });
      }
      userToUpdate.username = username;
    }

    if (firstName) userToUpdate.firstName = firstName;
    if (lastName) userToUpdate.lastName = lastName;
    if (mobile) userToUpdate.mobile = Number(mobile);
    if (password) userToUpdate.password = password;
    if (imageSrc !== undefined) userToUpdate.imageSrc = imageSrc;
    if (rollNo !== undefined) userToUpdate.rollNo = rollNo;

    await userToUpdate.save();

    const updatedUser = userToUpdate.toObject();
    delete updatedUser.password;
    if (updatedUser.imageSrc === undefined) updatedUser.imageSrc = "";

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ success: false, message: "Failed to update profile" }, { status: 500 });
  }
}
