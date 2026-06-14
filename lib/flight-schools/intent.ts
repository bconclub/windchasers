import type { FlightSchool } from "@/types/flight-school";

// A school is publicly visible when it's verified or a WindChasers partner
// (matches the Supabase RLS policy).
export function isVisible(s: Pick<FlightSchool, "verificationStatus" | "isPartner">): boolean {
  return s.verificationStatus === "verified" || !!s.isPartner;
}

const TRAINING_RE =
  /\b(flight training|ab[ -]?initio|commercial|cpl|atpl|ppl|instrument|type rating|cadet|pilot|aviation training)\b/i;

/**
 * Internal "intent / quality" score (0–100). NOT shown on the public site.
 * Helps the admin pick which of 925 schools are worth serving: ones that
 * genuinely do flight training, have real flight images, good reviews, and
 * complete details rank highest.
 */
export function intentScore(s: FlightSchool): number {
  let score = 0;
  const reasons: string[] = [];

  // Real flight images — the strongest signal a place is a genuine school.
  const imgCount = s.images?.length ?? 0;
  if (imgCount > 0) { score += 25; reasons.push("has photos"); }
  if (imgCount >= 3) { score += 10; reasons.push("3+ photos"); }

  // Flight-training intent from focus tags / primary type / name.
  const focusBlob = [
    ...(s.trainingFocus ?? []),
    s.googlePrimaryType ?? "",
    s.name ?? "",
  ].join(" ");
  if (TRAINING_RE.test(focusBlob)) { score += 20; reasons.push("flight-training intent"); }

  // Certifications (EASA/FAA/DGCA…) — a regulated, real operation.
  if ((s.certifications?.length ?? 0) > 0) { score += 10; reasons.push("certified"); }

  // Quality from Google.
  const rating = s.googleRating ?? s.rating ?? 0;
  if (rating >= 4.5) score += 10;
  else if (rating >= 4) score += 6;
  const reviews = s.googleReviewCount ?? 0;
  score += Math.round((Math.min(reviews, 200) / 200) * 15); // up to +15
  if (reviews >= 25) reasons.push("well-reviewed");

  // Completeness / details.
  if (s.website) score += 5;
  if (s.editorialSummary || s.notes) score += 5;

  return Math.min(100, score);
}

export function intentTier(score: number): { label: string; tone: string } {
  if (score >= 75) return { label: "High", tone: "bg-emerald-400/15 text-emerald-200" };
  if (score >= 50) return { label: "Medium", tone: "bg-[#C5A572]/16 text-[#e4c28c]" };
  if (score >= 30) return { label: "Low", tone: "bg-amber-400/12 text-amber-100" };
  return { label: "Weak", tone: "bg-red-400/12 text-red-100" };
}
