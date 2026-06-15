"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Calendar } from "lucide-react";
import { trackFormSubmission, sendTrackingData, getStoredUTMParams, getLandingPage, getStoredReferrer, getStoredClickIds, deriveTrafficSource } from "@/lib/tracking";
import { getUserSessionData, saveUserSessionData, markBookingCompleted } from "@/lib/sessionStorage";
import { track, trackLead, EVENTS } from "@/lib/analytics/events";
import {
  isSlotInPast,
  getMinBookingDateIST,
  getBookingTimeSlots,
  getBookingWindowLabel,
  isAllowedBookingTime,
  type BookingDemoType,
} from "@/lib/booking-time";

type DemoType = BookingDemoType;
type EducationLevel = "pursuing_10_2" | "completed_10_2" | "graduate" | "working_professional";
type InterestSource = "dgca_ground" | "pilot_training_abroad" | "helicopter_license" | "other";

const interestOptions = [
  { value: "dgca_ground", label: "DGCA Ground Classes" },
  { value: "pilot_training_abroad", label: "Pilot Training Abroad" },
  { value: "helicopter_license", label: "Helicopter License" },
  { value: "other", label: "Other" },
];

// Check if a date is Monday to Saturday (not Sunday)
const isWeekday = (dateString: string): boolean => {
  if (!dateString) return true;
  const date = new Date(dateString + "T00:00:00"); // Add time to avoid timezone issues
  const day = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  return day !== 0; // Return true if not Sunday
};

// Check if date is in the past relative to today in IST. Same comparison
// the server-side guard uses, see lib/booking-time.ts.
const isPastDate = (dateString: string): boolean => {
  if (!dateString) return false;
  return dateString < getMinBookingDateIST();
};

// Get minimum date (today in IST, not browser-local).
const getMinDate = (): string => getMinBookingDateIST();

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
  const [formStarted, setFormStarted] = useState(false);

  // Fire form_start the first time the visitor interacts with the form.
  const onFormStart = () => {
    if (!formStarted) {
      setFormStarted(true);
      track(EVENTS.FORM_START, { form_name: "booking" });
    }
  };

  const mapSourceToInterest = (source: string): InterestSource | null => {
    // Direct InterestSource values (from lastVisitedProgram)
    if (source === "dgca_ground" || source === "pilot_training_abroad" || source === "helicopter_license" || source === "other") {
      return source as InterestSource;
    }
    const sourceLower = source.toLowerCase();
    if (sourceLower.includes("dgca") || sourceLower.includes("ground")) {
      return "dgca_ground";
    }
    if (sourceLower.includes("abroad") || sourceLower.includes("international") || sourceLower === "abroad") {
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
        setFormData((prev) => ({
          ...prev,
          demoType: demoTypeParam as DemoType,
          preferredTime: "",
        }));
        saveUserSessionData({ demoType: demoTypeParam, preferredTime: "" });
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
      } else if (!source && !prefill) {
        // No URL source, fall back to last visited program page from session
        const freshData = getUserSessionData();
        if (!freshData?.interest && freshData?.lastVisitedProgram) {
          const mapped = mapSourceToInterest(freshData.lastVisitedProgram);
          if (mapped) {
            setFormData((prev) => ({ ...prev, interest: mapped }));
          }
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
  const timeSlots = getBookingTimeSlots(formData.demoType);

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
    if (!isAllowedBookingTime(formData.demoType, formData.preferredTime)) {
      setDateError("Please choose a time inside the selected session window.");
      setFormData({ ...formData, preferredTime: "" });
      saveUserSessionData({ preferredTime: "" });
      return;
    }
    // Past-time guard: catches the case where the user picked a slot, then
    // waited long enough that the slot is now within the booking buffer, OR
    // the previously-picked time got carried over from sessionStorage.
    if (isSlotInPast(formData.preferredDate, formData.preferredTime)) {
      setDateError("This slot has already passed. Please pick a future time.");
      setFormData({ ...formData, preferredTime: "" });
      return;
    }
    setDateError("");
    setSubmitStatus("idle");
    track(EVENTS.FORM_STEP, { form_name: "booking", step: 2 });
    setCurrentStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Email + city are required.
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setSubmitStatus("error");
      setErrorMessage("Please enter a valid email address.");
      track(EVENTS.FORM_ERROR, { form_name: "booking", field: "email" });
      return;
    }
    if (!formData.city.trim()) {
      setSubmitStatus("error");
      setErrorMessage("Please enter your city.");
      track(EVENTS.FORM_ERROR, { form_name: "booking", field: "city" });
      return;
    }

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

      // Get stored UTM params, click IDs, landing page, and referrer
      const utmParams = getStoredUTMParams();
      const clickIds = getStoredClickIds();
      const landingPage = getLandingPage();
      const referrer = getStoredReferrer();
      const trafficSource = deriveTrafficSource();

      const requestBody = {
        ...formData,
        source,
        // Include UTM parameters
        utm_source: utmParams.utm_source || "",
        utm_medium: utmParams.utm_medium || "",
        utm_campaign: utmParams.utm_campaign || "",
        utm_term: utmParams.utm_term || "",
        utm_content: utmParams.utm_content || "",
        // Include ad-network click IDs (Meta/Google/etc auto-tag)
        gclid: clickIds.gclid || "",
        fbclid: clickIds.fbclid || "",
        msclkid: clickIds.msclkid || "",
        ttclid: clickIds.ttclid || "",
        li_fat_id: clickIds.li_fat_id || "",
        twclid: clickIds.twclid || "",
        wbraid: clickIds.wbraid || "",
        gbraid: clickIds.gbraid || "",
        traffic_source: trafficSource || "",
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
        
        // One clearly-named lead conversion: demo_booked (GA4) + Meta Lead.
        trackLead(EVENTS.DEMO_BOOKED, {
          form_name: "booking",
          audience: userType,
          interest: formData.interest || "",
          demo_type: formData.demoType,
          source: finalSource || "",
        });
        
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
    <div className="max-w-2xl mx-auto px-2 sm:px-6">
      {/* Heading */}
      {/* Step Indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center gap-2">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
            currentStep >= 1 ? "bg-[#C5A572] text-[#1A1A1A]" : "bg-white/10 text-white/40"
          }`}>1</div>
          <div className={`w-16 h-0.5 transition-colors ${currentStep >= 2 ? "bg-[#C5A572]" : "bg-white/10"}`} />
          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
            currentStep >= 2 ? "bg-[#C5A572] text-[#1A1A1A]" : "bg-white/10 text-white/40"
          }`}>2</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 p-6 md:p-8 rounded-2xl relative"
        style={{
          background: "rgba(32,32,31,0.7)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(77,70,59,0.4)",
        }}
      >
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
                  onFormStart();
                  const newValue = e.target.value as InterestSource;
                  setFormData({ ...formData, interest: newValue });
                  saveUserSessionData({ interest: newValue });
                }}
                className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#444] rounded-lg focus:border-[#C5A572] focus:outline-none transition-colors text-sm cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23C5A572%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3E%3Cpolyline points=%226 9 12 15 18 9%22%3E%3C/polyline%3E%3C/svg%3E')] bg-[length:1.5em_1.5em] bg-[right_0.75rem_center] bg-no-repeat pr-10 hover:border-[#C5A572]/50"
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

            {/* Section below interest select - shows when interest is selected */}
            {formData.interest && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 bg-gold/10 border border-gold/30 rounded-lg"
              >
                <p className="text-sm text-white/80">
                  <span className="font-semibold text-gold">Selected:</span> {interestOptions.find(opt => opt.value === formData.interest)?.label}
                </p>
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-medium mb-3 sm:mb-4">Demo Type</label>
              {/* Inline Tiles */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setDateError("");
                    setFormData({
                      ...formData,
                      demoType: "online",
                      preferredTime: "",
                    });
                    saveUserSessionData({
                      demoType: "online",
                      preferredTime: "",
                    });
                  }}
                  className={`p-3 sm:p-4 rounded-lg border-2 transition-all text-left ${
                    formData.demoType === "online"
                      ? "border-[#C5A572] bg-[#C5A572]/10 text-white"
                      : "border-[#444] hover:border-[#C5A572]/50 text-white/60"
                  }`}
                >
                  <div className="font-semibold mb-1 text-sm sm:text-base">Online</div>
                  <div className="text-xs sm:text-sm text-white/60">15-30 min consultation</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDateError("");
                    setFormData({
                      ...formData,
                      demoType: "offline",
                      preferredTime: "",
                    });
                    saveUserSessionData({
                      demoType: "offline",
                      preferredTime: "",
                    });
                  }}
                  className={`p-3 sm:p-4 rounded-lg border-2 transition-all text-left ${
                    formData.demoType === "offline"
                      ? "border-[#C5A572] bg-[#C5A572]/10 text-white"
                      : "border-[#444] hover:border-[#C5A572]/50 text-white/60"
                  }`}
                >
                  <div className="font-semibold mb-1 text-sm sm:text-base">Campus Visit</div>
                  <div className="text-xs sm:text-sm text-white/60">30-60 min with simulator</div>
                </button>
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
                className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#444] rounded-lg focus:border-[#C5A572] focus:outline-none transition-colors text-sm cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23C5A572%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3E%3Cpolyline points=%226 9 12 15 18 9%22%3E%3C/polyline%3E%3C/svg%3E')] bg-[length:1.5em_1.5em] bg-[right_0.75rem_center] bg-no-repeat pr-10 hover:border-[#C5A572]/50"
                style={{
                  colorScheme: 'dark',
                }}
              >
                <option value="pursuing_10_2">Pursuing 10+2</option>
                <option value="completed_10_2">10+2 Completed</option>
                <option value="graduate">Graduate</option>
                <option value="working_professional">Working Professional</option>
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
                  className={`w-full px-4 py-3 pr-12 bg-[#1A1A1A] border rounded-lg focus:outline-none transition-colors cursor-pointer text-sm ${
                    dateError ? "border-red-500" : "border-[#444] focus:border-[#C5A572]"
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

            {formData.preferredDate && (() => {
              // Filter out any slot that's already in the past for the
              // selected date (IST, with the booking buffer applied). Same
              // check the server enforces in /api/booking, so this isn't
              // just cosmetic.
              const availableSlots = timeSlots.filter(
                (slot) => !isSlotInPast(formData.preferredDate, slot.value)
              );
              const noSlotsLeft = availableSlots.length === 0;

              return (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Preferred Time
                  </label>
                  <p className="mb-3 text-xs text-white/60">
                    {getBookingWindowLabel(formData.demoType)}
                  </p>
                  {noSlotsLeft ? (
                    <div className="rounded-lg border border-[#C5A572]/30 bg-[#C5A572]/5 px-4 py-3 text-sm text-white/80">
                      No slots available for this date. Please pick another
                      date or session type.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {availableSlots.map((slot) => (
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
                              ? "border-[#C5A572] bg-[#C5A572]/10 text-[#C5A572]"
                              : "border-[#444] hover:border-[#C5A572]/50 text-white/60"
                          }`}
                        >
                          {slot.label}
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

            <button
              type="button"
              onClick={handleStep1Next}
              disabled={
                !!formData.preferredDate &&
                timeSlots.every((slot) =>
                  isSlotInPast(formData.preferredDate, slot.value)
                )
              }
              className="w-full bg-[#C5A572] text-[#1A1A1A] py-3.5 rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-[#C5A572]/90 transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
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
                className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#444] rounded-lg focus:border-[#C5A572] focus:outline-none transition-colors text-sm"
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
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#444] rounded-lg focus:border-[#C5A572] focus:outline-none transition-colors text-sm"
                />
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setFormData({ ...formData, email: newValue });
                    saveUserSessionData({ email: newValue });
                  }}
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#444] rounded-lg focus:border-[#C5A572] focus:outline-none transition-colors text-sm"
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
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#444] rounded-lg focus:border-[#C5A572] focus:outline-none transition-colors text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium mb-2">
                City
              </label>
              <input
                type="text"
                id="city"
                required
                value={formData.city}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setFormData({ ...formData, city: newValue });
                  saveUserSessionData({ city: newValue });
                }}
                className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#444] rounded-lg focus:border-[#C5A572] focus:outline-none transition-colors text-sm"
                placeholder="Enter your city"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="flex-1 bg-transparent border border-[#C5A572]/40 text-[#C5A572] py-3.5 rounded-lg font-bold text-sm uppercase tracking-wider hover:border-[#C5A572] transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-[#C5A572] text-[#1A1A1A] py-3.5 rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-[#C5A572]/90 transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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
