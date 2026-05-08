import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const ENV_PATH = path.join(ROOT, ".env.local");
const OUTPUT_PATH = path.join(
  ROOT,
  "data",
  "imports",
  "google-places-flight-schools.raw.json"
);

const DEFAULT_COUNTRIES = ["United States", "Australia", "South Africa"];
const SEARCH_TERMS = [
  "flight school",
  "pilot training academy",
  "aviation academy",
  "flying school",
  "commercial pilot training",
  "CPL training",
  "airline pilot academy",
];

const SEARCH_FIELD_MASK = [
  "places.id",
  "places.name",
  "places.displayName",
  "places.formattedAddress",
  "places.location",
  "places.businessStatus",
  "places.types",
  "places.primaryType",
  "places.rating",
  "places.userRatingCount",
].join(",");

const DETAIL_FIELD_MASK = [
  "id",
  "name",
  "displayName",
  "formattedAddress",
  "shortFormattedAddress",
  "adrFormatAddress",
  "addressComponents",
  "location",
  "viewport",
  "businessStatus",
  "types",
  "primaryType",
  "nationalPhoneNumber",
  "internationalPhoneNumber",
  "websiteUri",
  "googleMapsUri",
  "rating",
  "userRatingCount",
  "regularOpeningHours",
  "currentOpeningHours",
  "utcOffsetMinutes",
  "plusCode",
  "editorialSummary",
  "photos",
  "reviews",
].join(",");

async function loadEnvFile(filePath) {
  try {
    const text = await fs.readFile(filePath, "utf8");
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
      const [key, ...rest] = trimmed.split("=");
      if (!process.env[key]) process.env[key] = rest.join("=").trim();
    }
  } catch {
    // .env.local is optional. The caller can pass env vars directly.
  }
}

function readArgs() {
  const args = process.argv.slice(2);
  const countries = [];
  let maxPerSearch = 20;
  let outputPath = OUTPUT_PATH;
  let refreshExisting = false;

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--country" && args[i + 1]) {
      countries.push(args[i + 1]);
      i += 1;
    } else if (arg === "--countries" && args[i + 1]) {
      countries.push(...args[i + 1].split(",").map((c) => c.trim()).filter(Boolean));
      i += 1;
    } else if (arg === "--max-per-search" && args[i + 1]) {
      maxPerSearch = Math.max(1, Math.min(20, Number(args[i + 1]) || 20));
      i += 1;
    } else if (arg === "--out" && args[i + 1]) {
      outputPath = path.resolve(ROOT, args[i + 1]);
      i += 1;
    } else if (arg === "--refresh-existing") {
      refreshExisting = true;
    }
  }

  return {
    countries: countries.length > 0 ? countries : DEFAULT_COUNTRIES,
    maxPerSearch,
    outputPath,
    refreshExisting,
  };
}

function pickAddressPart(addressComponents = [], type, format = "long") {
  const component = addressComponents.find((item) => item.types?.includes(type));
  return format === "short"
    ? component?.shortText ?? component?.longText ?? ""
    : component?.longText ?? component?.shortText ?? "";
}

function normalizePlace(place, query, country) {
  return {
    id: `google-${place.id}`,
    name: place.displayName?.text ?? "",
    country:
      pickAddressPart(place.addressComponents, "country") ||
      country,
    countryCode: pickAddressPart(place.addressComponents, "country", "short"),
    city:
      pickAddressPart(place.addressComponents, "locality") ||
      pickAddressPart(place.addressComponents, "administrative_area_level_2") ||
      pickAddressPart(place.addressComponents, "administrative_area_level_1") ||
      "",
    lat: place.location?.latitude ?? null,
    lng: place.location?.longitude ?? null,
    googlePlaceId: place.id,
    googlePlaceResourceName: place.name,
    googleMapsUrl: place.googleMapsUri ?? null,
    formattedAddress: place.formattedAddress ?? "",
    shortFormattedAddress: place.shortFormattedAddress ?? "",
    adrFormatAddress: place.adrFormatAddress ?? "",
    addressComponents: place.addressComponents ?? [],
    viewport: place.viewport ?? null,
    phone: place.internationalPhoneNumber ?? place.nationalPhoneNumber ?? null,
    nationalPhoneNumber: place.nationalPhoneNumber ?? null,
    internationalPhoneNumber: place.internationalPhoneNumber ?? null,
    website: place.websiteUri ?? null,
    businessStatus: place.businessStatus ?? null,
    googleRating: place.rating ?? null,
    googleReviewCount: place.userRatingCount ?? null,
    googleTypes: place.types ?? [],
    googlePrimaryType: place.primaryType ?? null,
    regularOpeningHours: place.regularOpeningHours ?? null,
    currentOpeningHours: place.currentOpeningHours ?? null,
    utcOffsetMinutes: place.utcOffsetMinutes ?? null,
    plusCode: place.plusCode ?? null,
    editorialSummary: place.editorialSummary?.text ?? null,
    googlePhotoNames: (place.photos ?? []).slice(0, 8).map((photo) => photo.name),
    googleReviews: (place.reviews ?? []).slice(0, 5).map((review) => ({
      rating: review.rating ?? null,
      text: review.text?.text ?? "",
      publishTime: review.publishTime ?? null,
      relativePublishTimeDescription: review.relativePublishTimeDescription ?? "",
    })),
    discoveryQuery: query,
    discoveryCountry: country,
    certifications: [],
    dgcaConvertible: null,
    isPartner: false,
    fleetSize: null,
    approxCostUSD: null,
    durationMonths: null,
    rating: place.rating ?? null,
    notes: null,
    sourceStatus: "google_found",
    verificationStatus: "unreviewed",
    firstDiscoveredAt: new Date().toISOString(),
    lastCheckedAt: new Date().toISOString(),
  };
}

async function googleRequest(url, apiKey, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${response.status} ${response.statusText}: ${body}`);
  }

  return response.json();
}

async function searchPlaces(apiKey, query, maxResultCount) {
  const data = await googleRequest(
    "https://places.googleapis.com/v1/places:searchText",
    apiKey,
    {
      method: "POST",
      headers: {
        "X-Goog-FieldMask": SEARCH_FIELD_MASK,
      },
      body: JSON.stringify({
        textQuery: query,
        maxResultCount,
      }),
    }
  );

  return data.places ?? [];
}

async function fetchDetails(apiKey, resourceName) {
  return googleRequest(`https://places.googleapis.com/v1/${resourceName}`, apiKey, {
    headers: {
      "X-Goog-FieldMask": DETAIL_FIELD_MASK,
    },
  });
}

async function readExisting(outputPath) {
  try {
    const text = await fs.readFile(outputPath, "utf8");
    return JSON.parse(text);
  } catch {
    return [];
  }
}

async function main() {
  await loadEnvFile(ENV_PATH);
  const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Missing GOOGLE_PLACES_API_KEY. Add a Places API enabled key to .env.local, then rerun this script."
    );
  }

  const { countries, maxPerSearch, outputPath, refreshExisting } = readArgs();
  const existing = await readExisting(outputPath);
  const byPlaceId = new Map(existing.map((school) => [school.googlePlaceId, school]));

  if (refreshExisting) {
    let index = 0;
    for (const school of Array.from(byPlaceId.values())) {
      if (!school.googlePlaceResourceName) continue;
      index += 1;
      console.log(`Refreshing ${index}/${byPlaceId.size}: ${school.name}`);
      const detail = await fetchDetails(apiKey, school.googlePlaceResourceName);
      byPlaceId.set(school.googlePlaceId, {
        ...normalizePlace(detail, school.discoveryQuery ?? "existing import", school.discoveryCountry ?? school.country),
        firstDiscoveredAt: school.firstDiscoveredAt,
      });
    }
  }

  for (const country of countries) {
    for (const term of SEARCH_TERMS) {
      const query = `${term} in ${country}`;
      console.log(`Searching: ${query}`);
      const results = await searchPlaces(apiKey, query, maxPerSearch);

      for (const result of results) {
        if (!result.id || byPlaceId.has(result.id)) continue;
        const detail = await fetchDetails(apiKey, result.name);
        byPlaceId.set(result.id, normalizePlace(detail, query, country));
      }
    }
  }

  const schools = Array.from(byPlaceId.values()).sort((a, b) =>
    `${a.country} ${a.city} ${a.name}`.localeCompare(`${b.country} ${b.city} ${b.name}`)
  );

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(schools, null, 2)}\n`);

  console.log(`Saved ${schools.length} raw Google Places candidates to ${outputPath}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
