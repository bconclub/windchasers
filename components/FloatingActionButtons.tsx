"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ClipboardCheck, Calendar } from "lucide-react";
import { hasCompletedAssessment, hasCompletedBooking } from "@/lib/sessionStorage";

export default function FloatingActionButtons() {
  const pathname = usePathname();
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);
  const [bookingCompleted, setBookingCompleted] = useState(false);

  // Check completion status on mount and pathname change
  useEffect(() => {
    setAssessmentCompleted(hasCompletedAssessment());
    setBookingCompleted(hasCompletedBooking());
  }, [pathname]);

  // Hide floating buttons completely on assessment, demo, and thank-you pages
  if (pathname === "/assessment" || pathname === "/demo" || pathname === "/thank-you") {
    return null;
  }

  // Hide completely if both actions are completed
  if (assessmentCompleted && bookingCompleted) {
    return null;
  }

  // Determine which buttons to show
  const showAssessmentButton = !assessmentCompleted;
  const showDemoButton = !bookingCompleted;

  // Don't render if no buttons should be shown
  if (!showAssessmentButton && !showDemoButton) {
    return null;
  }

  return (
    <>
      {/* Desktop - Inline buttons centered */}
      <div className="hidden md:block fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="flex flex-row gap-3">
          {showAssessmentButton && (
            <Link
              href="/assessment"
              className="w-[160px] h-12 bg-dark border-2 border-gold rounded-lg flex items-center justify-center gap-2 text-white font-semibold hover:bg-accent-dark transition-colors shadow-lg hover:shadow-xl text-sm"
            >
              <ClipboardCheck className="w-4 h-4 text-gold" />
              <span>Take Assessment</span>
            </Link>
          )}
          {showDemoButton && (
            <Link
              href="/demo"
              className="w-[160px] h-12 bg-gold text-dark rounded-lg flex items-center justify-center gap-2 font-semibold hover:bg-gold/90 transition-colors shadow-lg hover:shadow-xl text-sm"
            >
              <Calendar className="w-4 h-4" />
              <span>Book a Demo</span>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile - Side-by-side bottom bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex shadow-2xl">
        {showDemoButton && (
          <Link
            href="/demo"
            className="flex-1 bg-gold text-dark h-16 flex items-center justify-center gap-2 font-semibold active:bg-gold/90 transition-colors"
          >
            <Calendar className="w-5 h-5" />
            <span className="text-sm">Book a Demo</span>
          </Link>
        )}
        {showAssessmentButton && (
          <Link
            href="/assessment"
            className="flex-1 bg-dark border-t-2 border-gold h-16 flex items-center justify-center gap-2 text-white font-semibold active:bg-accent-dark transition-colors"
          >
            <ClipboardCheck className="w-5 h-5 text-gold" />
            <span className="text-sm">Take Assessment</span>
          </Link>
        )}
      </div>
    </>
  );
}

