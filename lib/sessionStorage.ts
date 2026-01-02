export interface UserSessionData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  city?: string;
  interest?: string;
  demoType?: string;
  education?: string;
  preferredDate?: string;
  preferredTime?: string;
  assessmentScore?: number;
  tier?: string;
}

const SESSION_STORAGE_KEY = "user_data";

/**
 * Get user data from sessionStorage
 */
export function getUserSessionData(): UserSessionData | null {
  if (typeof window === "undefined") return null;
  
  try {
    const data = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data) as UserSessionData;
  } catch (error) {
    console.error("Error reading sessionStorage:", error);
    return null;
  }
}

/**
 * Save user data to sessionStorage
 * Merges with existing data to preserve fields not being updated
 */
export function saveUserSessionData(data: Partial<UserSessionData>): void {
  if (typeof window === "undefined") return;
  
  try {
    const existing = getUserSessionData() || {};
    const updated = { ...existing, ...data };
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Error saving to sessionStorage:", error);
  }
}

/**
 * Clear user data from sessionStorage
 */
export function clearUserSessionData(): void {
  if (typeof window === "undefined") return;
  
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing sessionStorage:", error);
  }
}

const PRICING_ACCESS_KEY = "pricing_access_granted";

/**
 * Check if pricing access has been granted (form submitted)
 */
export function hasPricingAccess(): boolean {
  if (typeof window === "undefined") return false;
  
  try {
    const access = sessionStorage.getItem(PRICING_ACCESS_KEY);
    return access === "true";
  } catch (error) {
    console.error("Error reading pricing access:", error);
    return false;
  }
}

/**
 * Grant pricing access (set flag after form submission)
 */
export function grantPricingAccess(): void {
  if (typeof window === "undefined") return;
  
  try {
    sessionStorage.setItem(PRICING_ACCESS_KEY, "true");
  } catch (error) {
    console.error("Error granting pricing access:", error);
  }
}

const ASSESSMENT_COMPLETED_KEY = "assessment_completed";
const BOOKING_COMPLETED_KEY = "booking_completed";

/**
 * Check if assessment has been completed
 */
export function hasCompletedAssessment(): boolean {
  if (typeof window === "undefined") return false;
  
  try {
    const userData = getUserSessionData();
    // Check if assessmentScore exists in user data
    if (userData?.assessmentScore !== undefined) {
      return true;
    }
    // Also check the flag (for backwards compatibility)
    const completed = sessionStorage.getItem(ASSESSMENT_COMPLETED_KEY);
    return completed === "true";
  } catch (error) {
    console.error("Error reading assessment completion:", error);
    return false;
  }
}

/**
 * Mark assessment as completed
 */
export function markAssessmentCompleted(): void {
  if (typeof window === "undefined") return;
  
  try {
    sessionStorage.setItem(ASSESSMENT_COMPLETED_KEY, "true");
  } catch (error) {
    console.error("Error marking assessment as completed:", error);
  }
}

/**
 * Check if booking has been completed
 */
export function hasCompletedBooking(): boolean {
  if (typeof window === "undefined") return false;
  
  try {
    const completed = sessionStorage.getItem(BOOKING_COMPLETED_KEY);
    return completed === "true";
  } catch (error) {
    console.error("Error reading booking completion:", error);
    return false;
  }
}

/**
 * Mark booking as completed
 */
export function markBookingCompleted(): void {
  if (typeof window === "undefined") return;
  
  try {
    sessionStorage.setItem(BOOKING_COMPLETED_KEY, "true");
  } catch (error) {
    console.error("Error marking booking as completed:", error);
  }
}

