import { NextResponse, type NextRequest } from "next/server";
import { requireStaff } from "@/lib/api-guard";
import { getServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface ResetBody {
  email?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const guard = await requireStaff();
  if (!guard.ok) return guard.response;

  let body: ResetBody;
  try {
    body = (await request.json()) as ResetBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin;
  const supabase = getServiceClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?type=recovery`,
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ sent: true });
}
