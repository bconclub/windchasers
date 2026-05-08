import { getServerClient } from "@/lib/supabase/server";
import type { FlightSchool } from "@/types/flight-school";

/**
 * Map a Supabase row (snake_case columns) back to the FlightSchool TS shape
 * used by client components. Keep this in lockstep with the client type.
 */
function rowToFlightSchool(row: Record<string, unknown>, photos: Record<string, string[]>): FlightSchool {
  const id = row.id as string;
  const costMin = row.cost_min_usd as number | null;
  const costMax = row.cost_max_usd as number | null;
  const countryCode = row.country_code as string;

  return {
    id,
    name: row.name as string,
    country: (row.country_name as string) || countryCode,
    countryCode,
    city: (row.city as string) || "",
    lat: row.lat as number,
    lng: row.lng as number,
    certifications: (row.certifications as string[]) ?? [],
    dgcaConvertible: row.dgca_convertible as boolean | null,
    isPartner: !!row.is_partner,
    fleetSize: row.fleet_size as number | null,
    approxCostUSD: row.approx_cost_usd as number | null,
    costRangeUSD: costMin != null && costMax != null ? [costMin, costMax] : null,
    durationMonths: row.duration_months as number | null,
    website: (row.website as string) || null,
    phone: (row.phone as string) || null,
    rating: row.rating as number | null,
    googleRating: row.google_rating as number | null,
    googleReviewCount: row.google_review_count as number | null,
    googlePlaceId: (row.google_place_id as string) || null,
    googleMapsUrl: (row.google_maps_url as string) || null,
    formattedAddress: (row.formatted_address as string) || null,
    shortFormattedAddress: (row.short_formatted_address as string) || null,
    nationalPhoneNumber: null,
    internationalPhoneNumber: null,
    businessStatus: (row.business_status as string) || null,
    googleTypes: (row.google_types as string[]) ?? [],
    googlePrimaryType: (row.google_primary_type as string) || null,
    regularOpeningHours: (row.regular_opening_hours as FlightSchool["regularOpeningHours"]) ?? null,
    currentOpeningHours: (row.current_opening_hours as FlightSchool["currentOpeningHours"]) ?? null,
    utcOffsetMinutes: row.utc_offset_minutes as number | null,
    editorialSummary: (row.editorial_summary as string) || null,
    googleReviews: [],
    sourceStatus: (row.source_status as string) || "google_found",
    verificationStatus: (row.verification_status as string) || "unreviewed",
    wcScore: typeof row.wc_score === "number" ? (row.wc_score as number) : undefined,
    wcClassification: (row.wc_classification as FlightSchool["wcClassification"]) ?? undefined,
    wcScoreReasons: (row.wc_score_reasons as string[]) ?? [],
    trainingFocus: (row.training_focus as string[]) ?? [],
    notes: (row.notes as string) || null,
    images: photos[id] ?? [],
    googlePhotoNames: [],
    firstDiscoveredAt: null,
    lastCheckedAt: null,
  };
}

/**
 * Fetches all publicly-visible flight schools (RLS gates this to verified + partner).
 * Joined with country name and ordered photo URLs.
 */
export async function getPublicFlightSchools(): Promise<FlightSchool[]> {
  const supabase = getServerClient();

  const [schoolsRes, photosRes, countriesRes] = await Promise.all([
    supabase
      .from("flight_schools")
      .select(
        "id,name,country_code,city,lat,lng,certifications,dgca_convertible,is_partner," +
          "fleet_size,approx_cost_usd,cost_min_usd,cost_max_usd,duration_months," +
          "website,phone,rating,google_rating,google_review_count," +
          "google_place_id,google_maps_url,formatted_address,short_formatted_address," +
          "business_status,google_types,google_primary_type," +
          "regular_opening_hours,current_opening_hours,utc_offset_minutes,editorial_summary," +
          "source_status,verification_status,wc_score,wc_classification,wc_score_reasons," +
          "training_focus,notes",
      )
      .order("wc_score", { ascending: false, nullsFirst: false }),
    supabase
      .from("flight_school_photos")
      .select("school_id,url,position")
      .not("url", "is", null)
      .order("position", { ascending: true }),
    supabase.from("countries").select("code,name"),
  ]);

  if (schoolsRes.error) throw schoolsRes.error;
  if (photosRes.error) throw photosRes.error;
  if (countriesRes.error) throw countriesRes.error;

  // Build photo map: school_id -> [url, ...] ordered
  const photoMap: Record<string, string[]> = {};
  for (const row of photosRes.data ?? []) {
    if (!row.url) continue;
    (photoMap[row.school_id] ||= []).push(row.url);
  }

  // Country code -> name
  const countryName: Record<string, string> = {};
  for (const c of countriesRes.data ?? []) {
    countryName[c.code] = c.name;
  }

  const schoolRows = (schoolsRes.data ?? []) as unknown as Array<Record<string, unknown>>;
  return schoolRows.map((row) =>
    rowToFlightSchool({ ...row, country_name: countryName[row.country_code as string] }, photoMap),
  );
}
