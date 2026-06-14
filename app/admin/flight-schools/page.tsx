import { getServiceClient } from "@/lib/supabase/server";
import type { FlightSchool } from "@/types/flight-school";
import FlightSchoolsAdmin from "../components/FlightSchoolsAdmin";

export const metadata = {
  title: "Admin · Flight Schools",
};

export const dynamic = "force-dynamic";

type Summary = {
  generatedAt: string;
  total: number;
  publicReady: number;
  needsReview: number;
  byCountry: Record<string, number>;
  byClassification: Record<string, number>;
  byStatus: Record<string, number>;
};

function rowToFlightSchool(row: Record<string, unknown>, countryName: string): FlightSchool {
  const costMin = row.cost_min_usd as number | null;
  const costMax = row.cost_max_usd as number | null;
  return {
    id: row.id as string,
    name: row.name as string,
    country: countryName || (row.country_code as string),
    countryCode: row.country_code as string,
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
    regularOpeningHours: null,
    currentOpeningHours: null,
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
    images: [],
    googlePhotoNames: [],
    firstDiscoveredAt: null,
    lastCheckedAt: null,
  };
}

function summarize(schools: FlightSchool[]): Summary {
  const byCountry: Record<string, number> = {};
  const byClassification: Record<string, number> = {};
  const byStatus: Record<string, number> = {};
  for (const s of schools) {
    byCountry[s.country] = (byCountry[s.country] ?? 0) + 1;
    if (s.wcClassification) byClassification[s.wcClassification] = (byClassification[s.wcClassification] ?? 0) + 1;
    if (s.sourceStatus) byStatus[s.sourceStatus] = (byStatus[s.sourceStatus] ?? 0) + 1;
  }
  return {
    generatedAt: new Date().toISOString(),
    total: schools.length,
    publicReady: schools.filter((s) => s.verificationStatus === "verified" || s.isPartner).length,
    needsReview: schools.filter((s) => s.verificationStatus === "unreviewed").length,
    byCountry: Object.fromEntries(Object.entries(byCountry).sort((a, b) => b[1] - a[1])),
    byClassification,
    byStatus,
  };
}

async function loadAdminData(): Promise<{ schools: FlightSchool[]; summary: Summary }> {
  try {
    const supabase = getServiceClient();
    const [schoolsRes, countriesRes, photosRes] = await Promise.all([
      supabase
        .from("flight_schools")
        .select(
          "id,name,country_code,city,lat,lng,certifications,dgca_convertible,is_partner," +
            "fleet_size,approx_cost_usd,cost_min_usd,cost_max_usd,duration_months," +
            "website,phone,rating,google_rating,google_review_count," +
            "google_place_id,google_maps_url,formatted_address,short_formatted_address," +
            "business_status,google_types,google_primary_type,utc_offset_minutes,editorial_summary," +
            "source_status,verification_status,wc_score,wc_classification,wc_score_reasons," +
            "training_focus,notes",
        )
        .order("wc_score", { ascending: false, nullsFirst: false })
        .limit(2000),
      supabase.from("countries").select("code,name"),
      supabase
        .from("flight_school_photos")
        .select("school_id,url,position")
        .not("url", "is", null)
        .order("position", { ascending: true }),
    ]);
    if (schoolsRes.error) throw schoolsRes.error;
    if (countriesRes.error) throw countriesRes.error;
    const countryName: Record<string, string> = {};
    for (const c of countriesRes.data ?? []) countryName[c.code] = c.name;
    const photoMap: Record<string, string[]> = {};
    for (const p of (photosRes.data ?? []) as Array<{ school_id: string; url: string }>) {
      if (p.url) (photoMap[p.school_id] ||= []).push(p.url);
    }
    const rows = (schoolsRes.data ?? []) as unknown as Array<Record<string, unknown>>;
    const schools = rows.map((r) => {
      const s = rowToFlightSchool(r, countryName[r.country_code as string] ?? "");
      s.images = photoMap[s.id] ?? [];
      return s;
    });
    return { schools, summary: summarize(schools) };
  } catch (err) {
    console.error("[/admin/flight-schools] Failed to load schools from Supabase:", err);
    return {
      schools: [],
      summary: {
        generatedAt: new Date().toISOString(),
        total: 0,
        publicReady: 0,
        needsReview: 0,
        byCountry: {},
        byClassification: {},
        byStatus: {},
      },
    };
  }
}

export default async function FlightSchoolsAdminPage() {
  const { schools, summary } = await loadAdminData();
  return <FlightSchoolsAdmin schools={schools} summary={summary} />;
}
