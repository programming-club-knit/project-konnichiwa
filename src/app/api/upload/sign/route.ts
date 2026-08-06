import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import crypto from "crypto";

// POST /api/upload/sign — generates a signed Cloudinary upload signature
export async function POST() {
  // Allow any authenticated user to get an upload signature
  const { response } = await requireAuth();
  if (response) return response;

  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!apiSecret || !apiKey || !cloudName) {
    return NextResponse.json(
      { success: false, message: "Cloudinary env vars not configured on server." },
      { status: 500 }
    );
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "ptsc-events";

  // Build the string to sign: must be sorted key=value pairs joined with &
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;

  // HMAC-SHA1 of the params using the API secret
  const signature = crypto
    .createHash("sha1")
    .update(paramsToSign + apiSecret)
    .digest("hex");

  return NextResponse.json({
    success: true,
    signature,
    timestamp,
    apiKey,
    cloudName,
    folder,
  });
}
