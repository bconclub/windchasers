import { NextResponse } from "next/server";

/**
 * WhatsApp group redirect.
 *
 * Meta rejects template URL buttons that point straight at chat.whatsapp.com
 * ("Direct links to WhatsApp aren't allowed for buttons"), so the approved
 * templates link here instead and we bounce the tap to the real invite. Also
 * means a group link can be rotated without a new template review.
 */
const GROUPS: Record<string, string> = {
  "wings-of-freedom": "https://chat.whatsapp.com/BiPGKSg03CzETSljBUO9sa",
  webinar: "https://chat.whatsapp.com/IEi11O7U90T88K2d7YMOxx",
};

export function GET(_req: Request, { params }: { params: { slug: string } }) {
  const target = GROUPS[params.slug?.toLowerCase()];
  // Unknown slug lands on the event page rather than a 404 - a dead end on a
  // link we sent ourselves is worse than an extra click.
  return NextResponse.redirect(target || "https://windchasers.in/wings-of-freedom", 302);
}
