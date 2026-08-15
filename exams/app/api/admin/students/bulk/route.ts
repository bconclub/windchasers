import { NextResponse, type NextRequest } from "next/server";
import { requireStaff } from "@/lib/api-guard";
import { getServiceClient } from "@/lib/supabase/server";
import type { Batch } from "@/lib/types";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

interface BulkRow {
  name: string;
  email: string;
  phone: string;
  batch_code: string;
}

interface BulkBody {
  rows: BulkRow[];
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const guard = await requireStaff();
  if (!guard.ok) return guard.response;

  let body: BulkBody;
  try {
    body = (await request.json()) as BulkBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const rows = Array.isArray(body.rows) ? body.rows : [];
  if (rows.length === 0) {
    return NextResponse.json({ error: "No rows supplied" }, { status: 400 });
  }
  if (rows.length > 300) {
    return NextResponse.json({ error: "Upload at most 300 students at a time" }, { status: 400 });
  }

  const supabase = getServiceClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin;

  const { data: batchList } = await supabase.from("batches").select("*");
  const batchByCode = new Map<string, Batch>();
  for (const batch of (batchList ?? []) as Batch[]) {
    batchByCode.set(batch.code.trim().toLowerCase(), batch);
  }

  const failures: Array<{ email: string; reason: string }> = [];
  let created = 0;
  let enrolled = 0;

  for (const row of rows) {
    const email = row.email.trim().toLowerCase();
    if (!email) continue;

    try {
      const { data: invited, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(
        email,
        {
          data: { full_name: row.name.trim(), phone: row.phone.trim(), role: "student" },
          redirectTo: `${siteUrl}/auth/callback`,
        }
      );
      if (inviteError) throw inviteError;
      if (!invited.user) throw new Error("No user returned");

      await supabase
        .from("profiles")
        .update({
          full_name: row.name.trim(),
          email,
          phone: row.phone.trim() || null,
          role: "student",
          is_active: true,
        })
        .eq("id", invited.user.id);

      created += 1;

      const batch = row.batch_code ? batchByCode.get(row.batch_code.trim().toLowerCase()) : undefined;
      if (batch) {
        const { error: enrollError } = await supabase
          .from("batch_enrollments")
          .insert({ batch_id: batch.id, student_id: invited.user.id });
        if (!enrollError) enrolled += 1;
      } else if (row.batch_code) {
        failures.push({ email, reason: `Batch code ${row.batch_code} not found, student created` });
      }
    } catch (caught) {
      failures.push({
        email,
        reason: caught instanceof Error ? caught.message : "Could not create",
      });
    }
  }

  return NextResponse.json({ created, invited: created, enrolled, failures });
}
