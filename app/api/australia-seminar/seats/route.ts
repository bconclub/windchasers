// Seats for the Australia seminar: capacity, and how many are actually taken
// (paid Razorpay orders for this event). Never a made-up number: if Razorpay
// is not configured or cannot be read, `taken` is null and the page shows
// only the capacity.
//
// GET -> { capacity, taken, left }
import { NextResponse } from "next/server";
import { countPaidOrders } from "@/lib/razorpay";
import { SEMINAR } from "@/lib/australia-seminar";

export const dynamic = "force-dynamic";

let cache: { at: number; taken: number | null } | null = null;

export async function GET() {
  if (!cache || Date.now() - cache.at > 60_000) {
    const taken = await countPaidOrders(SEMINAR.slug).catch(() => null);
    cache = { at: Date.now(), taken };
  }
  const taken = cache.taken;
  return NextResponse.json(
    { capacity: SEMINAR.capacity, taken, left: taken === null ? null : Math.max(0, SEMINAR.capacity - taken) },
    { headers: { "Cache-Control": "no-store" } },
  );
}
