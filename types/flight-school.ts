export interface FlightSchool {
  id: string
  name: string
  country: string
  countryCode: string
  city: string
  lat: number
  lng: number
  certifications: string[]
  dgcaConvertible: boolean
  isPartner: boolean
  fleetSize: number | null
  approxCostUSD: number | null
  durationMonths: number | null
  website: string | null
  rating: number | null
  notes: string | null
  images?: string[]
}

export interface SchoolFilters {
  country: string
  certifications: string[]
  partnerOnly: boolean
}
