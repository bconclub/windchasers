import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminCredentials, adminSessionToken } from "@/lib/admin-auth";

// On-site admin login: validates credentials and sets the session cookie the
// middleware checks. Replaces the browser's native Basic-auth popup.
export async function POST(request: Request) {
  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Bad request" }, { status: 400 });
  }

  const { user, pass } = adminCredentials();
  if (body.username !== user || body.password !== pass) {
    return NextResponse.json(
      { success: false, error: "Wrong username or password." },
      { status: 401 },
    );
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE, await adminSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return res;
}

// Logout: clear the session cookie.
export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
