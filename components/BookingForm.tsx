"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Calendar } from "lucide-react";
import { trackFormSubmission, sendTrackingData, getStoredUTMParams, getLandingPage, getStoredReferrer } from "@/lib/tracking";
import { getUserSessionData, saveUserSessionData, markBookingCompleted } from "@/lib/sessionStorage";
import { trackPilotLead } from "@/lib/analytics";

type DemoType = "online" | "offline";
type EducationLevel = "pursuing_10_2" | "completed_10_2" | "graduate";
type InterestSource = "dgca_ground" | "pilot_training_abroad" | "helicopter_license" | "other";

const interestOptions = [
  { value: "dgca_ground", label: "DGCA Ground Classes" },
  { value: "pilot_training_abroad", label: "Pilot Training Abroad" },
  { value: "helicopter_license", label: "Helicopter License" },
  { value: "other", label: "Other" },
];

// Generate hourly time slots from 10 AM to 5 PM
const timeSlots = Array.from({ length: 8 }, (_, i) => {
  const hour = 10 + i; // 10 AM to 5 PM (10, 11, 12, 13, 14, 15, 16, 17)
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour === 12 ? 12 : hour > 12 ? hour - 12 : hour;
  return {
    value: `${hour.toString().padStart(2, "0")}:00`,
    label: `${displayHour}:00 ${period}`,
  };
});

// Check if a date is Monday to Saturday (not Sunday)
const isWeekday = (dateString: string): boolean => {
  if (!dateString) return true;
  const date = new Date(dateString + "T00:00:00"); // Add time to avoid timezone issues
  const day = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  return day !== 0; // Return true if not Sunday
};

// Check if date is in the past
const isPastDate = (dateString: string): boolean => {
  if (!dateString) return false;
  const selectedDate = new Date(dateString + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate < today;
};

// Get minimum date (today)
const getMinDate = (): string => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

export default function BookingForm() {
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [userType, setUserType] = useState<'student' | 'parent'>('student');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    parentGuardianName: "",
    interest: "" as InterestSource | "",
    demoType: "online" as DemoType,
    education: "pursuing_10_2" as EducationLevel,
    preferredDate: "",
    preferredTime: "",
  });
  const [dateError, setDateError] = useState("");

  const mapSourceToInterest = (source: string): InterestSource | null => {
    const sourceLower = source.toLowerCase();
    // Exact matches first
    if (sourceLower === "dgca") {
      return "dgca_ground";
    }
    if (sourceLower === "abroad") {
      return "pilot_training_abroad";
    }
    if (sourceLower === "helicopter") {
      return "helicopter_license";
    }
    // Fallback to includes for other variations
    if (sourceLower.includes("dgca") || sourceLower.includes("ground")) {
      return "dgca_ground";
    }
    if (sourceLower.includes("abroad") || sourceLower.includes("international")) {
      return "pilot_training_abroad";
    }
    if (sourceLower.includes("helicopter")) {
      return "helicopter_license";
    }
    return null;
  };

  // Load user data from sessionStorage and URL params
  useEffect(() => {
    try {
      // Load from sessionStorage first
      const userData = getUserSessionData();
      if (userData) {
        const updates: Partial<typeof formData> = {};
        
        // Combine firstName and lastName for name field
        if (userData.firstName || userData.lastName) {
          const fullName = [userData.firstName, userData.lastName].filter(Boolean).join(" ");
          if (fullName) updates.name = fullName;
        }
        
        if (userData.email) updates.email = userData.email;
        if (userData.phone) updates.phone = userData.phone;
        if (userData.city) updates.city = userData.city;
        if (userData.interest) updates.interest = userData.interest as InterestSource;
        if (userData.demoType === "online" || userData.demoType === "offline") {
          updates.demoType = userData.demoType as DemoType;
        }
        if (userData.education) {
          updates.education = userData.education as EducationLevel;
        }
        if (userData.preferredDate) updates.preferredDate = userData.preferredDate;
        if (userData.preferredTime) updates.preferredTime = userData.preferredTime;
        
        if (Object.keys(updates).length > 0) {
          setFormData((prev) => ({ ...prev, ...updates }));
        }
      }
      
      // Then check URL params (they take precedence over sessionStorage)
      const prefill = searchParams?.get("prefill");
      const source = searchParams?.get("source");
      const demoTypeParam = searchParams?.get("demoType");
      
      // Handle demoType from URL params (takes precedence)
      if (demoTypeParam === "online" || demoTypeParam === "offline") {
        setFormData((prev) => ({ ...prev, demoType: demoTypeParam as DemoType }));
        saveUserSessionData({ demoType: demoTypeParam });
      }
      
      // Handle interest from URL params (takes precedence)
      if (prefill === "assessment" && source) {
        const mappedSource = mapSourceToInterest(source);
        if (mappedSource) {
          setFormData((prev) => ({ ...prev, interest: mappedSource }));
          saveUserSessionData({ interest: mappedSource });
        }
      } else if (!prefill && source) {
        // Also handle source param even without prefill (for backward compatibility)
        const mappedSource = mapSourceToInterest(source);
        if (mappedSource) {
          setFormData((prev) => ({ ...prev, interest: mappedSource }));
          saveUserSessionData({ interest: mappedSource });
        }
      }
      
      // Prefill name and email from URL params (assessment flow - takes precedence)
      if (prefill === "assessment") {
        const name = searchParams?.get("name");
        const email = searchParams?.get("email");
        
        if (name) {
          const decodedName = decodeURIComponent(name);
          setFormData((prev) => ({ ...prev, name: decodedName }));
          // Try to split and save to sessionStorage
          const nameParts = decodedName.trim().split(/\s+/);
          if (nameParts.length >= 2) {
            const lastName = nameParts.pop() || "";
            const firstName = nameParts.join(" ");
            saveUserSessionData({ firstName, lastName });
          } else if (nameParts.length === 1) {
            saveUserSessionData({ firstName: nameParts[0], lastName: "" });
          }
        }
        if (email) {
          const decodedEmail = decodeURIComponent(email);
          setFormData((prev) => ({ ...prev, email: decodedEmail }));
          saveUserSessionData({ email: decodedEmail });
        }
      }
    } catch (error) {
      console.error("Error reading search params or sessionStorage:", error);
    }
  }, [searchParams]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleStep1Next = () => {
    // Validate step 1 fields
    if (!formData.interest) {
      setSubmitStatus("error");
      return;
    }
    if (!formData.preferredDate) {
      setDateError("Please select a preferred date.");
      return;
    }
    if (formData.preferredDate && !isWeekday(formData.preferredDate)) {
      setDateError("Please select a date from Monday to Saturday. We are closed on Sundays.");
      return;
    }
    if (!formData.preferredTime) {
      setDateError("Please select a preferred time.");
      return;
    }
    setDateError("");
    setSubmitStatus("idle");
    setCurrentStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      let source: string | undefined;
      try {
        source = searchParams?.get("source") || undefined;
      } catch (error) {
        console.error("Error accessing search params:", error);
        source = undefined;
      }
      
      // Track form submission
      trackFormSubmission("booking", formData, source, formData.interest);

      // Get stored UTM params, landing page, and referrer
      const utmParams = getStoredUTMParams();
      const landingPage = getLandingPage();
      const referrer = getStoredReferrer();

      const requestBody = {
        ...formData,
        source,
        // Include UTM parameters
        utm_source: utmParams.utm_source || "",
        utm_medium: utmParams.utm_medium || "",
        utm_campaign: utmParams.utm_campaign || "",
        utm_term: utmParams.utm_term || "",
        utm_content: utmParams.utm_content || "",
        // Include referrer and landing page
        referrer: referrer || "",
        landing_page: landingPage || "",
      };
      
      console.log("Submitting booking form:", requestBody);

      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        // Determine source from URL param or form interest field
        let finalSource = source;
        if (!finalSource) {
          // Map interest field to source
          const interestMap: { [key: string]: string } = {
            'dgca_ground': 'dgca',
            'pilot_training_abroad': 'abroad',
            'helicopter_license': 'helicopter'
          };
          finalSource = interestMap[formData.interest] || 'unknown';
        }
        
        // Track pilot lead
        trackPilotLead(finalSource, 'demo_booking');
        
        // Send complete tracking data
        await sendTrackingData("/api/booking", {
          formData,
          source,
        });

        // Mark booking as completed
        markBookingCompleted();

        // Redirect to thank you page with form data
        const thankYouData = {
          preferredDate: formData.preferredDate,
          preferredTime: formData.preferredTime,
          demoType: formData.demoType,
          interest: formData.interest,
        };
        const dataParam = encodeURIComponent(JSON.stringify(thankYouData));
        window.location.href = `/thank-you?type=booking&data=${dataParam}`;
      } else {
        // Try to get error message from response
        let errorMsg = "Something went wrong. Please try again.";
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMsg = errorData.error;
          }
        } catch (e) {
          // If we can't parse the error, use default message
        }
        console.error("Booking form error:", response.status, errorMsg);
        setErrorMessage(errorMsg);
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Booking form submission error:", error);
      setErrorMessage("Network error. Please check your connection and try again.");
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6">
      {/* Heading */}
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-gold">Book a Demo</h2>
      
      {/* Step Indicator */}
      <div className="flex items-center justify-center mb-6 sm:mb-8">
        <div className="flex items-center">
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base ${
            currentStep >= 1 ? "bg-gold text-dark" : "bg-white/20 text-white/60"
          }`}>
            1
          </div>
          <div className={`w-12 sm:w-16 h-1 mx-2 ${currentStep >= 2 ? "bg-gold" : "bg-white/20"}`} />
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base ${
            currentStep >= 2 ? "bg-gold text-dark" : "bg-white/20 text-white/60"
          }`}>
            2
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 p-4 sm:p-6 md:p-8 border-2 border-white/20 rounded-lg bg-accent-dark/50 relative">
        {/* Toggle Switch - Top Right */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 flex flex-row items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setUserType('student')}
            className={`px-2.5 py-1.5 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-lg font-semibold text-xs sm:text-sm md:text-base transition-all whitespace-nowrap ${
              userType === 'student'
                ? 'bg-gold text-dark'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            <span className="hidden sm:inline">I&apos;m a </span>Student
          </button>
          <button
            type="button"
            onClick={() => setUserType('parent')}
            className={`px-2.5 py-1.5 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-lg font-semibold text-xs sm:text-sm md:text-base transition-all whitespace-nowrap ${
              userType === 'parent'
                ? 'bg-gold text-dark'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            <span className="hidden sm:inline">I&apos;m a </span>Parent
          </button>
        </div>
        <AnimatePresence mode="wait">
          {/* Step 1: Interest, Demo Type, Education, Preferred Date */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4 sm:space-y-6"
            >
            <div>
              <label htmlFor="interest" className="block text-sm font-medium mb-2">
                {userType === 'student' ? "I'm Interested In" : "Student Interested In"}
              </label>
              <select
                id="interest"
                required
                value={formData.interest}
                onChange={(e) => {
                  const newValue = e.target.value as InterestSource;
                  setFormData({ ...formData, interest: newValue });
                  saveUserSessionData({ interest: newValue });
                }}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-accent-dark border border-white/20 rounded-lg focus:border-gold focus:outline-none transition-colors text-sm sm:text-base cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23C5A572%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3E%3Cpolyline points=%226 9 12 15 18 9%22%3E%3C/polyline%3E%3C/svg%3E')] bg-[length:1.5em_1.5em] bg-[right_0.75rem_center] bg-no-repeat pr-10 sm:pr-12 hover:border-gold/50"
                style={{
                  colorScheme: 'dark',
                }}
              >
                <option value="">Select an option</option>
                {interestOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3 sm:mb-4">Demo Type</label>
              {/* Side by side on all screens, or stacked with scroll effect on mobile */}
              <div className="grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-4">
                {/* Mobile: Can be side by side or use scroll effect */}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setFormData({ ...formData, demoType: "online" });
                    saveUserSessionData({ demoType: "online" });
                  }}
                  className={`p-3 sm:p-4 rounded-lg border-2 transition-all text-left ${
                    formData.demoType === "online"
                      ? "border-gold bg-gold/10"
                      : "border-white/20 hover:border-white/40"
                  }`}
                >
                  <div className="font-semibold mb-1 text-sm sm:text-base">Online</div>
                  <div className="text-xs sm:text-sm text-white/60">15-30 min consultation</div>
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setFormData({ ...formData, demoType: "offline" });
                    saveUserSessionData({ demoType: "offline" });
                  }}
                  className={`p-3 sm:p-4 rounded-lg border-2 transition-all text-left ${
                    formData.demoType === "offline"
                      ? "border-gold bg-gold/10"
                      : "border-white/20 hover:border-white/40"
                  }`}
                >
                  <div className="font-semibold mb-1 text-sm sm:text-base">Campus Visit</div>
                  <div className="text-xs sm:text-sm text-white/60">30-60 min with simulator</div>
                </motion.button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {userType === 'student' ? "Highest Level of Education" : "Student's Current Education Level"}
              </label>
              <select
                required
                value={formData.education}
                  onChange={(e) => {
                    const newValue = e.target.value as EducationLevel;
                    setFormData({ ...formData, education: newValue });
                    saveUserSessionData({ education: newValue });
                  }}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-accent-dark border border-white/20 rounded-lg focus:border-gold focus:outline-none transition-colors text-sm sm:text-base cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23C5A572%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3E%3Cpolyline points=%226 9 12 15 18 9%22%3E%3C/polyline%3E%3C/svg%3E')] bg-[length:1.5em_1.5em] bg-[right_0.75rem_center] bg-no-repeat pr-10 sm:pr-12 hover:border-gold/50"
                style={{
                  colorScheme: 'dark',
                }}
              >
                <option value="pursuing_10_2">Pursuing 10+2</option>
                <option value="completed_10_2">10+2 Completed</option>
                <option value="graduate">Graduate</option>
              </select>
            </div>

            <div>
              <label htmlFor="preferredDate" className="block text-sm font-medium mb-2">
                Preferred Date (Monday - Saturday)
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="preferredDate"
                  required
                  min={getMinDate()}
                  value={formData.preferredDate}
                  onClick={(e) => {
                    const input = e.currentTarget;
                    if (input.showPicker) {
                      input.showPicker();
                    }
                  }}
                  onChange={(e) => {
                    const selectedDate = e.target.value;
                    if (selectedDate) {
                      if (isPastDate(selectedDate)) {
                        setDateError("Please select a future date.");
                        setFormData({ ...formData, preferredDate: "", preferredTime: "" });
                      } else if (!isWeekday(selectedDate)) {
                        setDateError("Please select a date from Monday to Saturday. We are closed on Sundays.");
                        setFormData({ ...formData, preferredDate: "", preferredTime: "" });
                      } else {
                        setDateError("");
                        setFormData({ ...formData, preferredDate: selectedDate, preferredTime: "" });
                        saveUserSessionData({ preferredDate: selectedDate, preferredTime: "" });
                      }
                    } else {
                      setDateError("");
                      setFormData({ ...formData, preferredDate: "", preferredTime: "" });
                    }
                  }}
                  className={`w-full px-4 py-3 pr-12 bg-accent-dark border rounded-lg focus:outline-none transition-colors cursor-pointer ${
                    dateError ? "border-red-500" : "border-white/20 focus:border-gold"
                  }`}
                  style={{
                    colorScheme: 'dark',
                  }}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    const input = document.getElementById('preferredDate') as HTMLInputElement;
                    if (input) {
                      if (input.showPicker) {
                        input.showPicker();
                      } else {
                        input.focus();
                        input.click();
                      }
                    }
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/60 hover:text-white transition-colors z-10"
                  aria-label="Open date picker"
                  tabIndex={-1}
                >
                  <Calendar className="w-5 h-5" />
                </button>
              </div>
              {dateError && (
                <p className="mt-2 text-sm text-red-400">{dateError}</p>
              )}
            </div>

            {formData.preferredDate && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Preferred Time (Hourly Slots)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {timeSlots.map((slot) => (
                    <motion.button
                      key={slot.value}
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setDateError("");
                        setFormData({ ...formData, preferredTime: slot.value });
                        saveUserSessionData({ preferredTime: slot.value });
                      }}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.preferredTime === slot.value
                          ? "border-gold bg-gold/10 text-gold"
                          : "border-white/20 hover:border-white/40 text-white/70"
                      }`}
                    >
                      {slot.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleStep1Next}
              className="w-full bg-gold text-dark py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-base hover:bg-gold/90 transition-colors"
            >
              Continue
            </button>
          </motion.div>
        )}

          {/* Step 2: Name, Email, Phone, Preferred Time, Message */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4 sm:space-y-6"
            >
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                {userType === 'student' ? "Your Name" : "Student's Name"}
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setFormData({ ...formData, name: newValue });
                  // Save to sessionStorage - try to split name into first/last
                  const nameParts = newValue.trim().split(/\s+/);
                  if (nameParts.length >= 2) {
                    const lastName = nameParts.pop() || "";
                    const firstName = nameParts.join(" ");
                    saveUserSessionData({ firstName, lastName });
                  } else if (nameParts.length === 1) {
                    saveUserSessionData({ firstName: nameParts[0], lastName: "" });
                  }
                }}
                className="w-full px-4 py-3 bg-accent-dark border border-white/20 rounded-lg focus:border-gold focus:outline-none transition-colors"
              />
            </div>

            {userType === 'parent' && (
              <div>
                <label htmlFor="parentGuardianName" className="block text-sm font-medium mb-2">
                  Your Name (Parent/Guardian)
                </label>
                <input
                  type="text"
                  id="parentGuardianName"
                  required
                  value={formData.parentGuardianName}
                  onChange={(e) => {
                    setFormData({ ...formData, parentGuardianName: e.target.value });
                  }}
                  className="w-full px-4 py-3 bg-accent-dark border border-white/20 rounded-lg focus:border-gold focus:outline-none transition-colors"
                />
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Your Email (Optional)
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setFormData({ ...formData, email: newValue });
                    saveUserSessionData({ email: newValue });
                  }}
                  className="w-full px-4 py-3 bg-accent-dark border border-white/20 rounded-lg focus:border-gold focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  Your Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setFormData({ ...formData, phone: newValue });
                    saveUserSessionData({ phone: newValue });
                  }}
                  className="w-full px-4 py-3 bg-accent-dark border border-white/20 rounded-lg focus:border-gold focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium mb-2">
                City (Optional)
              </label>
              <input
                type="text"
                id="city"
                value={formData.city}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setFormData({ ...formData, city: newValue });
                  saveUserSessionData({ city: newValue });
                }}
                className="w-full px-4 py-3 bg-accent-dark border border-white/20 rounded-lg focus:border-gold focus:outline-none transition-colors"
                placeholder="Enter your city"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="flex-1 bg-dark border-2 border-gold text-white py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-base hover:bg-accent-dark transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gold text-dark py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-base hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Book Demo Session"}
              </button>
            </div>
          </motion.div>
          )}
        </AnimatePresence>

        {submitStatus === "success" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-center"
          >
            Demo session booked successfully! We&apos;ll contact you soon.
          </motion.div>
        )}

        {submitStatus === "error" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-center"
          >
            {errorMessage || "Something went wrong. Please try again."}
          </motion.div>
        )}
      </form>
    </div>
  );
}
