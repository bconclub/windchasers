export interface FlightSchool {
  id: string
  name: string
  country: string
  countryCode: string
  city: string
  lat: number
  lng: number
  certifications: string[]
  dgcaConvertible: boolean | null
  isPartner: boolean
  fleetSize: number | null
  approxCostUSD: number | null
  costRangeUSD?: [number, number] | null
  durationMonths: number | null
  website: string | null
  phone?: string | null
  rating: number | null
  googleRating?: number | null
  googleReviewCount?: number | null
  googlePlaceId?: string | null
  googleMapsUrl?: string | null
  formattedAddress?: string | null
  shortFormattedAddress?: string | null
  adrFormatAddress?: string | null
  nationalPhoneNumber?: string | null
  internationalPhoneNumber?: string | null
  businessStatus?: string | null
  googleTypes?: string[]
  googlePrimaryType?: string | null
  regularOpeningHours?: {
    openNow?: boolean
    weekdayDescriptions?: string[]
  } | null
  currentOpeningHours?: {
    openNow?: boolean
    weekdayDescriptions?: string[]
  } | null
  utcOffsetMinutes?: number | null
  plusCode?: Record<string, unknown> | null
  editorialSummary?: string | null
  googleReviews?: Array<{
    rating: number | null
    text: string
    publishTime: string | null
    relativePublishTimeDescription: string
  }>
  discoveryQuery?: string | null
  sourceStatus?: "google_found" | "curated" | "partner" | string
  verificationStatus?: "unreviewed" | "verified" | "hidden" | string
  wcScore?: number
  wcClassification?: "verified_school" | "likely_school" | "possible_school" | "needs_review" | string
  wcScoreReasons?: string[]
  trainingFocus?: string[]
  notes: string | null
  images?: string[]
  googlePhotoNames?: string[]
  firstDiscoveredAt?: string | null
  lastCheckedAt?: string | null
}

export interface SchoolFilters {
  country: string
  certifications: string[]
  partnerOnly: boolean
}
