import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getServiceClient } from "@/lib/supabase/server";
import { ADMIN_COOKIE, adminSessionToken } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

async function isAdmin(): Promise<boolean> {
  const token = cookies().get(ADMIN_COOKIE)?.value;
  return !!token && token === (await adminSessionToken());
}

/**
 * Toggle whether a flight school is shown on the public site.
 *   POST { id, visible }
 * Public visibility = verification_status === "verified" || is_partner.
 *   visible=true  → verification_status="verified"
 *   visible=false → verification_status="hidden" (and is_partner cleared so a
 *                   partner row is genuinely hidden, since RLS also shows partners)
 */
export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: { id?: string; visible?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Bad request" }, { status: 400 });
  }
  if (!body.id || typeof body.visible !== "boolean") {
    return NextResponse.json({ success: false, error: "id and visible required" }, { status: 400 });
  }

  const patch = body.visible
    ? { verification_status: "verified" }
    : { verification_status: "hidden", is_partner: false };

  const supabase = getServiceClient();
  const { error } = await supabase.from("flight_schools").update(patch).eq("id", body.id);
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, visible: body.visible });
}
