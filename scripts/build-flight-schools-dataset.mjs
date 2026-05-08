import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const RAW_PATH = path.join(ROOT, "data", "imports", "google-places-flight-schools.raw.json");
const CURATED_PATH = path.join(ROOT, "data", "flight-schools.json");
const OUTPUT_PATH = path.join(ROOT, "data", "flight-schools.generated.json");
const SUMMARY_PATH = path.join(ROOT, "data", "imports", "flight-schools-summary.json");

const CERT_BY_COUNTRY_CODE = {
  US: ["FAA", "ICAO"],
  CA: ["Transport Canada", "ICAO"],
  GB: ["CAA", "EASA pathway"],
  IE: ["EASA"],
  ES: ["EASA"],
  PT: ["EASA"],
  FR: ["EASA"],
  DE: ["EASA"],
  IT: ["EASA"],
  GR: ["EASA"],
  PL: ["EASA"],
  CZ: ["EASA"],
  NL: ["EASA"],
  HU: ["EASA"],
  AU: ["CASA", "ICAO"],
  NZ: ["CAA", "ICAO"],
  ZA: ["SACAA", "ICAO"],
  AE: ["GCAA", "ICAO"],
  PH: ["CAAP", "ICAO"],
  IN: ["DGCA", "ICAO"],
  LK: ["CAASL", "ICAO"],
  TH: ["CAAT", "ICAO"],
  MY: ["CAAM", "ICAO"],
  ID: ["DGCA Indonesia", "ICAO"],
  SG: ["CAAS", "ICAO"],
  SA: ["GACA", "ICAO"],
  QA: ["QCAA", "ICAO"],
  OM: ["CAA Oman", "ICAO"],
  BH: ["BCAA", "ICAO"],
  KW: ["DGCA Kuwait", "ICAO"],
  EG: ["ECAA", "ICAO"],
  KE: ["KCAA", "ICAO"],
  NA: ["NCAA", "ICAO"],
  BW: ["CAAB", "ICAO"],
  MA: ["DGAC Morocco", "ICAO"],
  BR: ["ANAC", "ICAO"],
  MX: ["AFAC", "ICAO"],
  AR: ["ANAC Argentina", "ICAO"],
  CL: ["DGAC Chile", "ICAO"],
  MV: ["MCAA", "ICAO"],
};

const COUNTRY_COSTS = {
  US: { min: 75000, max: 115000, duration: 18 },
  CA: { min: 65000, max: 105000, duration: 18 },
  AU: { min: 60000, max: 95000, duration: 18 },
  NZ: { min: 65000, max: 100000, duration: 18 },
  ZA: { min: 45000, max: 75000, duration: 15 },
  PH: { min: 40000, max: 70000, duration: 16 },
  AE: { min: 80000, max: 125000, duration: 18 },
  ES: { min: 60000, max: 95000, duration: 18 },
  HU: { min: 55000, max: 90000, duration: 18 },
  IN: { min: 50000, max: 85000, duration: 18 },
};

const NOISE_PATTERNS = [
  /air hostess/i,
  /cabin crew/i,
  /drone/i,
  /simulator center/i,
  /simulator centre/i,
  /maintenance/i,
  /engineering college/i,
  /travel agency/i,
  /museum/i,
  /hotel/i,
  /shop/i,
  /store/i,
  /consultancy/i,
  /consultant/i,
];

// Names that must never appear in the public dataset (own brand, duplicates, etc.)
const EXCLUDED_NAME_PATTERNS = [
  /wind\s*chasers/i,
];

// Hard-drop a school from the dataset if it's clearly not pilot training,
// or it's our own brand. Curated/partner records bypass this.
function shouldExcludeSchool(school) {
  if (school.sourceStatus === "curated" || school.sourceStatus === "partner") return false;
  const text = `${school.name} ${school.formattedAddress ?? ""}`;
  if (EXCLUDED_NAME_PATTERNS.some((pattern) => pattern.test(text))) return true;
  const hasNoise = NOISE_PATTERNS.some((pattern) => pattern.test(text));
  const hasStrong = STRONG_SCHOOL_PATTERNS.some((pattern) => pattern.test(text));
  if (hasNoise && !hasStrong) return true;
  return false;
}

const STRONG_SCHOOL_PATTERNS = [
  /flight school/i,
  /flying school/i,
  /pilot academy/i,
  /pilot training/i,
  /flight academy/i,
  /aviation academy/i,
  /airline pilot/i,
  /cpl/i,
];

const SCHOOLISH_PATTERNS = [
  /aviation/i,
  /aero/i,
  /air academy/i,
  /flying/i,
  /flight/i,
  /pilot/i,
  /school/i,
  /academy/i,
  /training/i,
  /college/i,
];

function slugify(value) {
  return String(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function readJson(filePath, fallback = []) {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

function inferCountryCode(school) {
  return school.countryCode || "";
}

function inferCertifications(school) {
  const countryCode = inferCountryCode(school);
  const countryCerts = CERT_BY_COUNTRY_CODE[countryCode] ?? ["ICAO"];
  const text = `${school.name} ${school.formattedAddress ?? ""} ${(school.googleTypes ?? []).join(" ")}`;
  const explicit = [];
  for (const cert of ["FAA", "EASA", "CASA", "DGCA", "GCAA", "CAA", "SACAA", "CAAP", "ICAO"]) {
    if (new RegExp(`\\b${cert}\\b`, "i").test(text)) explicit.push(cert);
  }
  return Array.from(new Set([...explicit, ...countryCerts])).slice(0, 4);
}

function scoreSchool(school) {
  const text = `${school.name} ${school.formattedAddress ?? ""} ${(school.googleTypes ?? []).join(" ")}`;
  const reasons = [];
  let score = 20;

  if (STRONG_SCHOOL_PATTERNS.some((pattern) => pattern.test(text))) {
    score += 35;
    reasons.push("strong flight-school wording");
  } else if (SCHOOLISH_PATTERNS.some((pattern) => pattern.test(text))) {
    score += 20;
    reasons.push("aviation education wording");
  }

  if ((school.googleTypes ?? []).includes("educational_institution") || (school.googleTypes ?? []).includes("school")) {
    score += 10;
    reasons.push("Google education type");
  }

  if ((school.googleTypes ?? []).includes("airport") || (school.googleTypes ?? []).includes("aircraft_rental_service")) {
    score += 5;
    reasons.push("airport or aircraft service type");
  }

  if (school.website) {
    score += 8;
    reasons.push("website available");
  }
  if (school.phone) {
    score += 5;
    reasons.push("phone available");
  }
  if ((school.googleReviewCount ?? 0) >= 100) {
    score += 8;
    reasons.push("substantial Google reviews");
  } else if ((school.googleReviewCount ?? 0) >= 20) {
    score += 4;
    reasons.push("some Google reviews");
  }
  if ((school.googleRating ?? 0) >= 4.5) {
    score += 4;
    reasons.push("high Google rating");
  }

  const noiseMatches = NOISE_PATTERNS.filter((pattern) => pattern.test(text));
  if (noiseMatches.length > 0) {
    score -= 35;
    reasons.push("possible non-flight-school result");
  }
  if ((school.googleTypes ?? []).includes("travel_agency")) {
    score -= 15;
    reasons.push("travel agency type");
  }
  if ((school.googleTypes ?? []).includes("university") && !/flight|pilot|aviation/i.test(school.name)) {
    score -= 15;
    reasons.push("generic university result");
  }

  score = Math.max(0, Math.min(100, score));
  const classification =
    score >= 65 ? "likely_school" : score >= 40 ? "possible_school" : "needs_review";

  return { score, classification, reasons };
}

function inferTrainingFocus(school) {
  const text = `${school.name} ${school.discoveryQuery ?? ""}`.toLowerCase();
  const focus = [];
  if (/cpl|commercial/.test(text)) focus.push("Commercial pilot training");
  if (/airline|atpl/.test(text)) focus.push("Airline pathway");
  if (/flight|flying|pilot/.test(text)) focus.push("Ab initio flight training");
  if (/academy|school|college|training/.test(text)) focus.push("Structured aviation training");
  return Array.from(new Set(focus)).slice(0, 4);
}

function normalizeGoogleSchool(school) {
  const { score, classification, reasons } = scoreSchool(school);
  const costs = COUNTRY_COSTS[school.countryCode] ?? null;

  return {
    id: school.id || `google-${slugify(`${school.name}-${school.city}-${school.country}`)}`,
    name: school.name,
    country: school.country || "",
    countryCode: school.countryCode || "",
    city: school.city || "",
    lat: school.lat,
    lng: school.lng,
    certifications: inferCertifications(school),
    dgcaConvertible: null,
    isPartner: false,
    fleetSize: null,
    approxCostUSD: costs ? Math.round((costs.min + costs.max) / 2) : null,
    costRangeUSD: costs ? [costs.min, costs.max] : null,
    durationMonths: costs?.duration ?? null,
    website: school.website,
    phone: school.phone,
    nationalPhoneNumber: school.nationalPhoneNumber ?? null,
    internationalPhoneNumber: school.internationalPhoneNumber ?? null,
    rating: school.googleRating,
    googleRating: school.googleRating,
    googleReviewCount: school.googleReviewCount,
    googlePlaceId: school.googlePlaceId,
    googleMapsUrl: school.googleMapsUrl,
    formattedAddress: school.formattedAddress,
    shortFormattedAddress: school.shortFormattedAddress ?? null,
    adrFormatAddress: school.adrFormatAddress ?? null,
    businessStatus: school.businessStatus,
    googleTypes: school.googleTypes ?? [],
    googlePrimaryType: school.googlePrimaryType,
    regularOpeningHours: school.regularOpeningHours ?? null,
    currentOpeningHours: school.currentOpeningHours ?? null,
    utcOffsetMinutes: school.utcOffsetMinutes ?? null,
    plusCode: school.plusCode ?? null,
    editorialSummary: school.editorialSummary ?? null,
    googleReviews: school.googleReviews ?? [],
    discoveryQuery: school.discoveryQuery,
    sourceStatus: "google_found",
    verificationStatus: "unreviewed",
    wcScore: score,
    wcClassification: classification,
    wcScoreReasons: reasons,
    trainingFocus: inferTrainingFocus(school),
    notes: school.editorialSummary ?? (
      classification === "likely_school"
        ? "Imported from Google Places. Needs WindChasers verification for licensing, costs, fleet, visa support, and DGCA conversion."
        : "Imported from Google Places. Review required before showing as a recommended flight school."
    ),
    images: [],
    googlePhotoNames: school.googlePhotoNames ?? [],
    firstDiscoveredAt: school.firstDiscoveredAt,
    lastCheckedAt: school.lastCheckedAt,
  };
}

function normalizeCuratedSchool(school) {
  return {
    ...school,
    phone: school.phone ?? null,
    googleRating: school.rating ?? null,
    googleReviewCount: school.googleReviewCount ?? null,
    googlePlaceId: school.googlePlaceId ?? null,
    googleMapsUrl: school.googleMapsUrl ?? null,
    formattedAddress: school.formattedAddress ?? `${school.city}, ${school.country}`,
    shortFormattedAddress: school.shortFormattedAddress ?? null,
    adrFormatAddress: school.adrFormatAddress ?? null,
    businessStatus: school.businessStatus ?? "OPERATIONAL",
    googleTypes: school.googleTypes ?? ["school", "educational_institution"],
    googlePrimaryType: school.googlePrimaryType ?? "school",
    sourceStatus: school.isPartner ? "partner" : "curated",
    verificationStatus: "verified",
    wcScore: school.isPartner ? 96 : 86,
    wcClassification: "verified_school",
    wcScoreReasons: [
      "curated WindChasers seed record",
      ...(school.isPartner ? ["WindChasers partner"] : []),
      ...(school.dgcaConvertible ? ["DGCA convertible marked"] : []),
    ],
    trainingFocus: school.trainingFocus ?? ["Commercial pilot training", "International student pathway"],
    costRangeUSD: school.costRangeUSD ?? null,
    googlePhotoNames: school.googlePhotoNames ?? [],
    googleReviews: school.googleReviews ?? [],
    editorialSummary: school.editorialSummary ?? null,
    regularOpeningHours: school.regularOpeningHours ?? null,
    currentOpeningHours: school.currentOpeningHours ?? null,
    utcOffsetMinutes: school.utcOffsetMinutes ?? null,
    plusCode: school.plusCode ?? null,
    nationalPhoneNumber: school.nationalPhoneNumber ?? null,
    internationalPhoneNumber: school.internationalPhoneNumber ?? null,
    firstDiscoveredAt: school.firstDiscoveredAt ?? null,
    lastCheckedAt: new Date().toISOString(),
  };
}

function mergeSchools(curated, google) {
  const byKey = new Map();

  for (const school of google.map(normalizeGoogleSchool)) {
    const key = school.googlePlaceId || slugify(`${school.name}-${school.city}-${school.country}`);
    byKey.set(key, school);
  }

  for (const school of curated.map(normalizeCuratedSchool)) {
    const possibleKeys = [
      school.googlePlaceId,
      slugify(`${school.name}-${school.city}-${school.country}`),
      ...Array.from(byKey.keys()).filter((key) => {
        const candidate = byKey.get(key);
        return (
          candidate.country === school.country &&
          (candidate.name.toLowerCase().includes(school.name.toLowerCase()) ||
            school.name.toLowerCase().includes(candidate.name.toLowerCase()))
        );
      }),
    ].filter(Boolean);

    const key = possibleKeys[0] || school.id;
    const existing = byKey.get(key);
    byKey.set(key, {
      ...(existing ?? {}),
      ...school,
      googlePlaceId: school.googlePlaceId ?? existing?.googlePlaceId ?? null,
      googleMapsUrl: school.googleMapsUrl ?? existing?.googleMapsUrl ?? null,
      phone: school.phone ?? existing?.phone ?? null,
      googleReviewCount: school.googleReviewCount ?? existing?.googleReviewCount ?? null,
      googleTypes: Array.from(new Set([...(school.googleTypes ?? []), ...(existing?.googleTypes ?? [])])),
    });
  }

  return Array.from(byKey.values())
    .filter((school) => school.name && typeof school.lat === "number" && typeof school.lng === "number")
    .filter((school) => !shouldExcludeSchool(school))
    .sort((a, b) => {
      const scoreDelta = (b.wcScore ?? 0) - (a.wcScore ?? 0);
      if (scoreDelta !== 0) return scoreDelta;
      return `${a.country} ${a.city} ${a.name}`.localeCompare(`${b.country} ${b.city} ${b.name}`);
    });
}

function summarize(schools) {
  const byCountry = {};
  const byClassification = {};
  const byStatus = {};
  for (const school of schools) {
    byCountry[school.country] = (byCountry[school.country] ?? 0) + 1;
    byClassification[school.wcClassification] = (byClassification[school.wcClassification] ?? 0) + 1;
    byStatus[school.sourceStatus] = (byStatus[school.sourceStatus] ?? 0) + 1;
  }
  return {
    generatedAt: new Date().toISOString(),
    total: schools.length,
    publicReady: schools.filter((school) =>
      ["verified_school", "likely_school"].includes(school.wcClassification)
    ).length,
    needsReview: schools.filter((school) => school.wcClassification !== "verified_school").length,
    byCountry: Object.fromEntries(Object.entries(byCountry).sort((a, b) => b[1] - a[1])),
    byClassification,
    byStatus,
  };
}

async function main() {
  const raw = await readJson(RAW_PATH);
  const curated = await readJson(CURATED_PATH);
  const schools = mergeSchools(curated, raw);
  const summary = summarize(schools);

  await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(schools, null, 2)}\n`);
  await fs.writeFile(SUMMARY_PATH, `${JSON.stringify(summary, null, 2)}\n`);

  console.log(`Generated ${schools.length} structured schools at ${OUTPUT_PATH}`);
  console.log(`Summary written to ${SUMMARY_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
