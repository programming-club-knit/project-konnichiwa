import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import type { AuthUser } from "@/types/auth";

const COOKIE_NAME = "token";
const SECRET_KEY = process.env.SECRET_KEY!;
const EXPIRY = process.env.EXPIRY || "30d";

if (!SECRET_KEY) {
  throw new Error("Missing SECRET_KEY environment variable");
}

export function signToken(userId: string) {
  return jwt.sign({ id: userId }, SECRET_KEY, { expiresIn: EXPIRY } as jwt.SignOptions);
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { id: string };
    await connectDB();
    const user = await User.findById(decoded.id).select("-password");
    return user;
  } catch {
    return null;
  }
}

/**
 * Mirrors the Express isAuthenticated + authorizeRoles middleware pair.
 * Call at the top of a route handler; if `response` is non-null, return it immediately.
 */
export async function requireAuth(
  allowedRoles?: Array<"admin" | "member" | "normal">
): Promise<{ user: AuthUser; response: null } | { user: null; response: NextResponse }> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      user: null,
      response: NextResponse.json(
        { success: false, message: "Authentication token not found or invalid" },
        { status: 401 }
      ),
    };
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return {
      user: null,
      response: NextResponse.json(
        { success: false, message: `Role '${user.role}' is not allowed to access this resource` },
        { status: 403 }
      ),
    };
  }

  return { user, response: null };
}
