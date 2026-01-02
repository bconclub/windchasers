// Tracking utility for user journey and analytics

export interface TrackingData {
  sessionId: string;
  pageViews: PageView[];
  utmParams: UTMParams;
  assessmentData?: AssessmentTracking;
  formSubmissions: FormSubmission[];
  userInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

export interface PageView {
  path: string;
  timestamp: string;
  timeSpent?: number; // in seconds
  referrer?: string;
}

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

export interface AssessmentTracking {
  score: number;
  tier: "excellent" | "good" | "fair" | "needs-improvement";
  readinessStatus: string;
  answers: any[];
  timestamp: string;
}

export interface FormSubmission {
  type: "booking" | "assessment" | "lead" | "pricing";
  source?: string;
  interest?: string;
  timestamp: string;
  data: any;
}

// Generate or retrieve session ID
export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  
  let sessionId = sessionStorage.getItem("windchasers_session_id");
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem("windchasers_session_id", sessionId);
  }
  return sessionId;
}

// Parse UTM parameters from URL
export function getUTMParams(): UTMParams {
  if (typeof window === "undefined") return {};
  
  const params = new URLSearchParams(window.location.search);
  const utmParams: UTMParams = {};
  
  const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
  utmKeys.forEach((key) => {
    const value = params.get(key);
    if (value) {
      utmParams[key as keyof UTMParams] = value;
    }
  });
  
  return utmParams;
}

const UTM_STORAGE_KEY = "utm_params";
const LANDING_PAGE_KEY = "landing_page";
const REFERRER_KEY = "referrer";

/**
 * Capture and store UTM parameters, landing page, and referrer on initial page load
 * This should be called once when the user first lands on the site
 */
export function captureAndStoreUTMParams(): void {
  if (typeof window === "undefined") return;
  
  try {
    // Only store if we don't already have UTM params (preserve first touch)
    const existingUTM = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (!existingUTM) {
      const utmParams = getUTMParams();
      // Only store if we have at least one UTM parameter
      if (Object.keys(utmParams).length > 0) {
        sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utmParams));
      }
    }
    
    // Store landing page (first page visited) - only on first visit
    const existingLandingPage = sessionStorage.getItem(LANDING_PAGE_KEY);
    if (!existingLandingPage) {
      sessionStorage.setItem(LANDING_PAGE_KEY, window.location.pathname);
    }
    
    // Store referrer (only on first visit, and only if not empty)
    const existingReferrer = sessionStorage.getItem(REFERRER_KEY);
    if (!existingReferrer && document.referrer) {
      sessionStorage.setItem(REFERRER_KEY, document.referrer);
    }
  } catch (error) {
    console.error("Error storing UTM params:", error);
  }
}

/**
 * Get stored UTM parameters (from first touch)
 * Falls back to current URL params if not stored
 */
export function getStoredUTMParams(): UTMParams {
  if (typeof window === "undefined") return {};
  
  try {
    const stored = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as UTMParams;
    }
    // Fallback to current URL params if not stored
    return getUTMParams();
  } catch (error) {
    console.error("Error reading stored UTM params:", error);
    return getUTMParams();
  }
}

/**
 * Get landing page (first page visited in session)
 */
export function getLandingPage(): string {
  if (typeof window === "undefined") return "";
  
  try {
    return sessionStorage.getItem(LANDING_PAGE_KEY) || window.location.pathname;
  } catch (error) {
    console.error("Error reading landing page:", error);
    return window.location.pathname;
  }
}

/**
 * Get referrer (where user came from)
 */
export function getStoredReferrer(): string {
  if (typeof window === "undefined") return "";
  
  try {
    return sessionStorage.getItem(REFERRER_KEY) || document.referrer || "";
  } catch (error) {
    console.error("Error reading referrer:", error);
    return document.referrer || "";
  }
}

// Get all tracking data
export function getTrackingData(): TrackingData {
  const sessionId = getSessionId();
  const utmParams = getUTMParams();
  
  // Get stored data from sessionStorage
  const storedData = typeof window !== "undefined" 
    ? sessionStorage.getItem("windchasers_tracking_data")
    : null;
  
  const baseData: TrackingData = {
    sessionId,
    pageViews: storedData ? JSON.parse(storedData).pageViews || [] : [],
    utmParams,
    formSubmissions: storedData ? JSON.parse(storedData).formSubmissions || [] : [],
  };
  
  if (storedData) {
    const parsed = JSON.parse(storedData);
    if (parsed.assessmentData) baseData.assessmentData = parsed.assessmentData;
    if (parsed.userInfo) baseData.userInfo = parsed.userInfo;
  }
  
  return baseData;
}

// Track page view
export function trackPageView(path: string, timeSpent?: number): void {
  if (typeof window === "undefined") return;
  
  const pageView: PageView = {
    path,
    timestamp: new Date().toISOString(),
    timeSpent,
    referrer: document.referrer || undefined,
  };
  
  const trackingData = getTrackingData();
  trackingData.pageViews.push(pageView);
  
  // Store in sessionStorage
  sessionStorage.setItem("windchasers_tracking_data", JSON.stringify(trackingData));
  
  // Also send to analytics
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", "page_view", {
      page_path: path,
      session_id: trackingData.sessionId,
    });
  }
}

// Track form submission
export function trackFormSubmission(
  type: "booking" | "assessment" | "lead" | "pricing",
  data: any,
  source?: string,
  interest?: string
): void {
  if (typeof window === "undefined") return;
  
  const submission: FormSubmission = {
    type,
    source,
    interest,
    timestamp: new Date().toISOString(),
    data,
  };
  
  const trackingData = getTrackingData();
  trackingData.formSubmissions.push(submission);
  
  // Update user info if available
  if (data.name || data.email || data.phone) {
    trackingData.userInfo = {
      name: data.name || trackingData.userInfo?.name,
      email: data.email || trackingData.userInfo?.email,
      phone: data.phone || trackingData.userInfo?.phone,
    };
  }
  
  sessionStorage.setItem("windchasers_tracking_data", JSON.stringify(trackingData));
}

// Track assessment with readiness score
export function trackAssessment(
  score: number,
  answers: any[]
): AssessmentTracking {
  if (typeof window === "undefined") {
    return {
      score,
      tier: "needs-improvement",
      readinessStatus: "",
      answers,
      timestamp: new Date().toISOString(),
    };
  }
  
  // Determine tier and readiness status
  let tier: "excellent" | "good" | "fair" | "needs-improvement";
  let readinessStatus: string;
  
  if (score >= 80) {
    tier = "excellent";
    readinessStatus = "Ready to start";
  } else if (score >= 60) {
    tier = "good";
    readinessStatus = "Minor prep needed";
  } else if (score >= 40) {
    tier = "fair";
    readinessStatus = "Prep required";
  } else {
    tier = "needs-improvement";
    readinessStatus = "Not ready yet";
  }
  
  const assessmentData: AssessmentTracking = {
    score,
    tier,
    readinessStatus,
    answers,
    timestamp: new Date().toISOString(),
  };
  
  const trackingData = getTrackingData();
  trackingData.assessmentData = assessmentData;
  
  sessionStorage.setItem("windchasers_tracking_data", JSON.stringify(trackingData));
  
  return assessmentData;
}

// Get readiness score logic
export function getReadinessScore(score: number): {
  tier: "excellent" | "good" | "fair" | "needs-improvement";
  status: string;
  description: string;
} {
  if (score >= 80) {
    return {
      tier: "excellent",
      status: "Ready to start",
      description: "You're ready to begin your pilot training journey!",
    };
  } else if (score >= 60) {
    return {
      tier: "good",
      status: "Minor prep needed",
      description: "You're almost ready! A bit of preparation will help you excel.",
    };
  } else if (score >= 40) {
    return {
      tier: "fair",
      status: "Prep required",
      description: "Some preparation is recommended before starting training.",
    };
  } else {
    return {
      tier: "needs-improvement",
      status: "Not ready yet",
      description: "Consider additional preparation before beginning pilot training.",
    };
  }
}

// Send tracking data to API
export async function sendTrackingData(endpoint: string, additionalData?: any): Promise<void> {
  const trackingData = getTrackingData();
  
  try {
    await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...trackingData,
        ...additionalData,
      }),
    });
  } catch (error) {
    console.error("Error sending tracking data:", error);
  }
}


