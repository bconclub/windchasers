import { NextResponse, type NextRequest } from "next/server";
import { requireStaff } from "@/lib/api-guard";
import { getServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface AddStudentBody {
  full_name?: string;
  email?: string;
  phone?: string;
  batch_id?: string;
}

function siteUrl(request: NextRequest): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const guard = await requireStaff();
  if (!guard.ok) return guard.response;

  let body: AddStudentBody;
  try {
    body = (await request.json()) as AddStudentBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const fullName = (body.full_name ?? "").trim();
  if (!email || !fullName) {
    return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
  }

  const supabase = getServiceClient();

  try {
    const { data: invited, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(
      email,
      {
        data: {
          full_name: fullName,
          phone: (body.phone ?? "").trim(),
          role: "student",
        },
        redirectTo: `${siteUrl(request)}/auth/callback`,
      }
    );
    if (inviteError) throw inviteError;
    if (!invited.user) throw new Error("Supabase did not return the new user");

    // The auth trigger creates the profile, make sure the details are current
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        email,
        phone: (body.phone ?? "").trim() || null,
        role: "student",
        is_active: true,
      })
      .eq("id", invited.user.id);
    if (profileError) throw profileError;

    if (body.batch_id) {
      const { error: enrollError } = await supabase
        .from("batch_enrollments")
        .insert({ batch_id: body.batch_id, student_id: invited.user.id });
      if (enrollError && enrollError.code !== "23505") throw enrollError;
    }

    return NextResponse.json({ id: invited.user.id });
  } catch (caught) {
    const message = caught instanceof Error ? caught.message : "Could not create the student";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
