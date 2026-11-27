// Aviators bike rally registration. Validates the form and records the rider in
// PROXe (source "event"). No payment and no file uploads here: the licence and
// ID copies are collected on WhatsApp after registration.
//
// POST { name, phone, email, age, blood_group, area, emergency_name,
//        emergency_phone, bike, bike_reg, licence_no, licence_valid_till,
//        riding_years, tshirt, role, consent, participate, ...attribution }
//   -> { ok: true, name }
import { NextResponse } from "next/server";
import { BLOOD_GROUPS, RALLY, TSHIRT_SIZES, rallyToProxe } from "@/lib/bike-rally";

export const dynamic = "force-dynamic";

const s = (v: unknown, max = 120) => (typeof v === "string" ? v.trim().replace(/\s+/g, " ").slice(0, max) : "");
const phone10 = (v: unknown) => s(v, 20).replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");
const ROLES = ["Airline pilot", "General aviation pilot", "Student pilot", "Flight instructor", "Engineer", "Ground professional", "Aviation enthusiast"];

export async function POST(request: Request) {
  const b = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const bad = (error: string) => NextResponse.json({ error }, { status: 400 });

  const name = s(b.name, 80);
  const phone = phone10(b.phone);
  const email = s(b.email, 120);
  const age = Number(s(b.age, 3));
  const blood_group = s(b.blood_group, 4);
  const area = s(b.area, 80);
  const emergency_name = s(b.emergency_name, 80);
  const emergency_phone = phone10(b.emergency_phone);
  const bike = s(b.bike, 80);
  const bike_reg = s(b.bike_reg, 16).toUpperCase();
  const licence_no = s(b.licence_no, 24).toUpperCase();
  const licence_valid_till = s(b.licence_valid_till, 10);
  const riding_years = Number(s(b.riding_years, 2));
  const tshirt = s(b.tshirt, 4);
  const role = ROLES.includes(s(b.role, 40)) ? s(b.role, 40) : "";

  if (name.length < 2) return bad("Please enter your full name as on your ID.");
  if (!/^[6-9]\d{9}$/.test(phone)) return bad("Please enter a valid 10-digit mobile number.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return bad("Please enter a valid email address.");
  if (!Number.isInteger(age) || age < 18 || age > 80) return bad("Riders must be 18 or older. Please check your age.");
  if (!(BLOOD_GROUPS as readonly string[]).includes(blood_group)) return bad("Please pick your blood group.");
  if (area.length < 2) return bad("Please enter your area of residence.");
  if (emergency_name.length < 2 || !/^[6-9]\d{9}$/.test(emergency_phone)) return bad("Please add an emergency contact name and 10-digit number.");
  if (emergency_phone === phone) return bad("The emergency contact number should be someone else's.");
  if (bike.length < 2) return bad("Please enter your bike make and model.");
  if (!/^[A-Z0-9 -]{6,16}$/.test(bike_reg)) return bad("Please check the bike registration number.");
  if (!/^[A-Z0-9 -]{8,24}$/.test(licence_no)) return bad("Please check your driving licence number.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(licence_valid_till) || licence_valid_till < RALLY.dateIso) return bad("Your driving licence must be valid on the day of the rally.");
  if (!Number.isInteger(riding_years) || riding_years < 0 || riding_years > 70) return bad("Please enter your riding experience in years.");
  if (!(TSHIRT_SIZES as readonly string[]).includes(tshirt)) return bad("Please pick a T-shirt size.");
  if (!role) return bad("Please tell us what you do in aviation.");
  if (b.consent !== true) return bad("Please accept the safety declaration.");
  if (b.participate !== true) return bad("Please confirm you will ride in the rally.");

  const reg = { name, phone, email, age, blood_group, area, emergency_name, emergency_phone, bike, bike_reg, licence_no, licence_valid_till, riding_years, tshirt, role };
  const proxe = await rallyToProxe(reg, b);
  if (!proxe.ok) {
    console.error("Bike rally: PROXe failed", proxe.error);
    return NextResponse.json({ error: "We could not save your registration. Please try again, or message us on WhatsApp." }, { status: 502 });
  }
  return NextResponse.json({ ok: true, name: name.split(" ")[0] });
}
