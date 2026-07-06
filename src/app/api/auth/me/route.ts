import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  const { user, response } = await requireAuth();
  if (response) return response;

  return NextResponse.json({ success: true, user });
}
