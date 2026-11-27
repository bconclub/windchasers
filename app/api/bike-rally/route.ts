// Aviators bike rally rider details (/bike-rally/register, 5 screens).
// Called on every Continue with everything entered so far plus `step` (the
// screen just finished). Checks screens 1..step and updates the rider's PROXe
// event lead (matched on phone): "details N of 5" for screens 1-4, and
// "registered" on screen 5. Free, open event: no payment. No file uploads:
// licence and ID copies are collected on WhatsApp after registration.
//
// POST { step, name, phone, email, age, blood_group, area, role,
//        emergency_name, emergency_phone, bike, bike_reg, riding_years,
//        licence_no, licence_valid_till, tshirt, consent, participate,
//        ...attribution }
//   -> { ok: true, name, saved } | { error, field, errors } (400)
import { NextResponse } from "next/server";
import { REG_STEPS, cleanRally, fieldsUpTo, rallyErrors, rallyToProxe } from "@/lib/bike-rally";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const b = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const last = REG_STEPS.length;
  // No step = the whole form at once: treat as the last screen.
  const step = Math.min(last, Math.max(1, Math.floor(Number(b.step)) || last));
  const c = cleanRally(b);

  const errors = rallyErrors(c, fieldsUpTo(step));
  const first = Object.keys(errors)[0] as keyof typeof errors | undefined;
  if (first) return NextResponse.json({ error: errors[first], field: first, errors }, { status: 400 });

  const registered = step === last;
  const proxe = await rallyToProxe(c, { done: step, registered }, b);
  if (!proxe.ok) {
    console.error(`Bike rally: PROXe (step ${step}) failed`, proxe.error);
    // A lost partial save should not stop the rider; the next screen sends everything again.
    if (registered) return NextResponse.json({ error: "We could not save your registration. Please try again, or message us on WhatsApp." }, { status: 502 });
  }
  return NextResponse.json({ ok: true, name: c.name.split(" ")[0], saved: proxe.ok });
}
