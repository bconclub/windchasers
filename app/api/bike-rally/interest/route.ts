// Bike rally step 1 ("I'm in" on /bike-rally): name, mobile and role go to
// PROXe as an event lead tagged rally_stage "interested", with utm/click
// attribution. The full registration (/api/bike-rally) later updates the same
// lead, since PROXe matches leads on phone.
//
// POST { name, phone, role, ...attribution } -> { ok: true, name }
import { NextResponse } from "next/server";
import { ROLES, rallyInterestToProxe } from "@/lib/bike-rally";

export const dynamic = "force-dynamic";

const s = (v: unknown, max = 120) => (typeof v === "string" ? v.trim().replace(/\s+/g, " ").slice(0, max) : "");

export async function POST(request: Request) {
  const b = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const bad = (error: string) => NextResponse.json({ error }, { status: 400 });

  const name = s(b.name, 80);
  const phone = s(b.phone, 20).replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");
  const role = ROLES.includes(s(b.role, 40)) ? s(b.role, 40) : "";

  if (name.length < 2) return bad("Please enter your name.");
  if (!/^[6-9]\d{9}$/.test(phone)) return bad("Please enter a valid 10-digit mobile number.");
  if (!role) return bad("Please tell us what you do in aviation.");

  const proxe = await rallyInterestToProxe({ name, phone, role }, b);
  if (!proxe.ok) {
    console.error("Bike rally interest: PROXe failed", proxe.error);
    return NextResponse.json({ error: "We could not save that. Please try again, or message us on WhatsApp." }, { status: 502 });
  }
  return NextResponse.json({ ok: true, name: name.split(" ")[0] });
}
