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

