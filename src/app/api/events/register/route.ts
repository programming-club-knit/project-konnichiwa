import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import Event from "@/models/event";
import EventRegistration from "@/models/eventRegistration";
import { computeAcademicFromRoll } from "@/lib/academic";

// Generate a unique registration ID: PTSC<yy><event_initial><random 3 digit>
async function generateRegistrationId(event: any): Promise<string> {
  const year = new Date().getFullYear().toString().slice(-2);
  const initialRaw = (event.title || "X").trim().charAt(0) || "X";
  const initial = /[A-Z0-9]/.test(initialRaw.toUpperCase())
    ? initialRaw.toUpperCase()
    : "X";

  for (let attempt = 0; attempt < 20; attempt++) {
    const rand = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    const id = `PTSC${year}${initial}${rand}`;
    const exists = await EventRegistration.exists({ registrationId: id });
    if (!exists) return id;
  }
  throw new Error(
    "Unable to generate a unique registration ID after multiple attempts"
  );
}

// POST /api/events/register — public (optional auth), register for event
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { eventId } = body;

    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }

    // Deadline check — skip for authenticated users
    const user = await getCurrentUser();
    if (!user && event.date && new Date() > new Date(event.date)) {
      return NextResponse.json(
        { success: false, message: "Registration deadline has passed" },
        { status: 400 }
      );
    }

    // Generate registration ID
    let registrationId: string;
    try {
      registrationId = await generateRegistrationId(event);
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Could not generate registration ID. Please try again later.",
        },
        { status: 500 }
      );
    }

    // --- TEAM REGISTRATION ---
    if (event.registrationType === "team") {
      const { team = {}, participants = [], leaderIndex = 0 } = body;
      const min = Math.max(1, Number(event.teamMinSize || 1));
      const max = Math.max(min, Number(event.teamMaxSize || min));

      if (!team.teamName || !String(team.teamName).trim()) {
        return NextResponse.json(
          { success: false, message: "Team name is required" },
          { status: 400 }
        );
      }
      if (
        !Array.isArray(participants) ||
        participants.length < min ||
        participants.length > max
      ) {
        return NextResponse.json(
          {
            success: false,
            message: `Team size must be between ${min} and ${max}`,
          },
          { status: 400 }
        );
      }

      // Validate each participant
      for (let i = 0; i < participants.length; i++) {
        const p = participants[i] || {};
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
        if (!acad.valid) {
          return NextResponse.json(
            {
              success: false,
              message: `Participant #${i + 1}: ${acad.reason}`,
            },
            { status: 400 }
          );
        }
        p.year = acad.year;
        p.branch = acad.branch;
        participants[i] = p;
      }

      // Validate team-level custom fields
      if (event.useCustomForm && Array.isArray(event.registrationFields)) {
        for (const f of event.registrationFields) {
          if (
            f.required &&
            !(team.dynamic && String(team.dynamic[f.name] || "").trim())
          ) {
            return NextResponse.json(
              { success: false, message: `${f.label} is required` },
              { status: 400 }
            );
          }
          if (f.validation && team.dynamic && team.dynamic[f.name]) {
            const r = new RegExp(f.validation);
            if (!r.test(String(team.dynamic[f.name]))) {
              return NextResponse.json(
                { success: false, message: `Invalid ${f.label}` },
                { status: 400 }
              );
            }
          }
        }
      }

      // Validate participant-level custom fields
      if (Array.isArray(event.participantFields)) {
        for (const f of event.participantFields) {
          for (let i = 0; i < participants.length; i++) {
            const dyn = participants[i].dynamic || {};
            if (f.required && !String(dyn[f.name] || "").trim()) {
              return NextResponse.json(
                {
                  success: false,
                  message: `Participant #${i + 1}: ${f.label} is required`,
                },
                { status: 400 }
              );
            }
            if (f.validation && dyn[f.name]) {
              const r = new RegExp(f.validation);
              if (!r.test(String(dyn[f.name]))) {
                return NextResponse.json(
                  {
                    success: false,
                    message: `Participant #${i + 1}: invalid ${f.label}`,
                  },
                  { status: 400 }
                );
              }
            }
          }
        }
      }

      const reg = await EventRegistration.create({
        eventId,
        type: "team",
        registrationId,
        name: team.teamName,
        team: {
          teamName: team.teamName,
          dynamic: team.dynamic || {},
        },
        participants: participants.map((p: any) => ({
          name: p.name,
          gender: p.gender,
          rollNo: p.rollNo,
          year: p.year,
          branch: p.branch,
          contactNo: p.contactNo,
          email: p.email,
          dynamic: p.dynamic || {},
        })),
        leaderIndex: Number.isFinite(leaderIndex) ? leaderIndex : 0,
      });

      // TODO: Send confirmation emails to participants (port email logic separately)

      return NextResponse.json(
        {
          success: true,
          registration: reg,
          whatsappGroupLink: event.whatsappGroupLink || null,
          message: "Registered successfully",
        },
        { status: 201 }
      );
    }

    // --- INDIVIDUAL REGISTRATION ---
    const { name, gender, rollNo, contactNo, email, ...dynamic } = body;
    // Remove non-dynamic fields from the dynamic spread
    delete dynamic.eventId;

    const acad = computeAcademicFromRoll(rollNo);
    if (!acad.valid) {
      return NextResponse.json(
        { success: false, message: acad.reason },
        { status: 400 }
      );
    }

    const reg = await EventRegistration.create({
      eventId,
      type: "individual",
      registrationId,
      name,
      gender,
      rollNo,
      year: acad.year,
      branch: acad.branch,
      contactNo,
      email,
      dynamic,
    });

    // TODO: Send confirmation email (port email logic separately)

    return NextResponse.json(
      {
        success: true,
        registration: reg,
        whatsappGroupLink: event.whatsappGroupLink || null,
        message: "Registered successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("registerEvent error:", error);
    return NextResponse.json(
      { success: false, message: "internal server error" },
      { status: 500 }
    );
  }
}
