import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAuth } from "@/lib/auth";
import Event from "@/models/event";
import EventRegistration from "@/models/eventRegistration";
import { computeAcademicFromRoll } from "@/lib/academic";

type Params = { params: Promise<{ id: string }> };

// DELETE /api/registrations/[id] — admin only, soft-delete registration
export async function DELETE(_request: NextRequest, { params }: Params) {
  const { response } = await requireAuth(["admin"]);
  if (response) return response;

  try {
    await connectDB();
    const { id } = await params;
    const reg = await EventRegistration.findByIdAndUpdate(
      id,
      { $set: { deleted: true, deletedAt: new Date() } },
      { new: true }
    );
    if (!reg) {
      return NextResponse.json(
        { success: false, message: "Registration not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: "Registration moved to trash",
      registration: reg,
    });
  } catch (error) {
    console.error("deleteRegistration error:", error);
    return NextResponse.json(
      { success: false, message: "internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/registrations/[id] — admin only, edit registration
export async function PATCH(request: NextRequest, { params }: Params) {
  const { response } = await requireAuth(["admin"]);
  if (response) return response;

  try {
    await connectDB();
    const { id } = await params;
    const registration = await EventRegistration.findById(id);
    if (!registration) {
      return NextResponse.json(
        { success: false, message: "Registration not found" },
        { status: 404 }
      );
    }

    const event = await Event.findById(registration.eventId);
    if (!event) {
      return NextResponse.json(
        { success: false, message: "Associated event not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    if (registration.type === "team") {
      const { team, participants, leaderIndex } = body;

      if (team && team.teamName) {
        if (!registration.team) {
          registration.team = { teamName: "", dynamic: {} };
        }
        registration.team.teamName = team.teamName;
        registration.name = team.teamName;
        if (team.dynamic) {
          registration.team.dynamic = team.dynamic;
        }
      }

      if (participants && Array.isArray(participants)) {
        const min = Math.max(1, Number(event.teamMinSize || 1));
        const max = Math.max(min, Number(event.teamMaxSize || min));

        if (participants.length < min || participants.length > max) {
          return NextResponse.json(
            {
              success: false,
              message: `Team size must be between ${min} and ${max}`,
            },
            { status: 400 }
          );
        }

        for (let i = 0; i < participants.length; i++) {
          const p = participants[i];
          if (!p.name || !p.gender || !p.rollNo || !p.contactNo || !p.email) {
            return NextResponse.json(
              {
                success: false,
                message: `Participant #${i + 1} is missing required fields`,
              },
              { status: 400 }
            );
          }
          if (!/^[6-9]\d{9}$/.test(String(p.contactNo))) {
            return NextResponse.json(
              {
                success: false,
                message: `Participant #${i + 1}: invalid contact number`,
              },
              { status: 400 }
            );
          }
          const acad = computeAcademicFromRoll(p.rollNo);
          if (acad.valid) {
            p.year = acad.year;
            p.branch = acad.branch;
          }
        }
        registration.set("participants", participants);
      }

      if (leaderIndex !== undefined && Number.isFinite(leaderIndex)) {
        registration.leaderIndex = leaderIndex;
      }
    } else {
      // Individual registration
      const { name, gender, rollNo, contactNo, email, dynamic } = body;

      if (name !== undefined) registration.name = name;
      if (gender !== undefined) registration.gender = gender;
      if (contactNo !== undefined) {
        if (!/^[6-9]\d{9}$/.test(String(contactNo))) {
          return NextResponse.json(
            { success: false, message: "Invalid contact number" },
            { status: 400 }
          );
        }
        registration.contactNo = contactNo;
      }
      if (email !== undefined) registration.email = email;

      if (rollNo !== undefined) {
        const acad = computeAcademicFromRoll(rollNo);
        if (!acad.valid) {
          return NextResponse.json(
            { success: false, message: acad.reason },
            { status: 400 }
          );
        }
        registration.rollNo = rollNo;
        registration.year = acad.year;
        registration.branch = acad.branch;
      }

      if (dynamic !== undefined) {
        registration.dynamic = dynamic;
      }
    }

    await registration.save();
    return NextResponse.json({
      success: true,
      message: "Registration updated successfully",
      registration,
    });
  } catch (error) {
    console.error("editRegistration error:", error);
    return NextResponse.json(
      { success: false, message: "internal server error" },
      { status: 500 }
    );
  }
}
