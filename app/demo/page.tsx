import { Suspense } from "react";
import Link from "next/link";
import { ClipboardCheck } from "lucide-react";
import BookingForm from "@/components/BookingForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Free Demo | WindChasers Aviation Academy",
  description: "Get personalized guidance from our experts. Choose between an online consultation or visit our campus with simulator access.",
};

export default function DemoPage() {
  return (
    <div className="pt-32 pb-20 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Book Your <span className="text-gold">Free Demo</span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Get personalized guidance from our experts. Choose between an online consultation or visit our campus with simulator access.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-gradient-to-br from-accent-dark to-dark p-8 rounded-xl border-2 border-gold/30 hover:border-gold/60 transition-all shadow-lg hover:shadow-gold/20">
            <div className="flex items-center mb-6">
              <div className="w-14 h-14 rounded-lg bg-gold/10 flex items-center justify-center mr-4">
                <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gold">Online Demo</h3>
            </div>
            <ul className="space-y-3 text-white/70">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-gold mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>15-30 minute video consultation</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-gold mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Career path discussion</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-gold mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Complete cost breakdown</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-gold mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Course structure overview</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-gold mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Q&A with instructors</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-accent-dark to-dark p-8 rounded-xl border-2 border-gold/30 hover:border-gold/60 transition-all shadow-lg hover:shadow-gold/20">
            <div className="flex items-center mb-6">
              <div className="w-14 h-14 rounded-lg bg-gold/10 flex items-center justify-center mr-4">
                <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gold">Campus Visit</h3>
            </div>
            <ul className="space-y-3 text-white/70">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-gold mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>30-60 minute campus tour</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-gold mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Simulator experience session</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-gold mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Meet instructors in person</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-gold mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>See training facilities</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-gold mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Detailed course roadmap</span>
              </li>
            </ul>
          </div>
        </div>

        <Suspense fallback={<div className="text-center py-8">Loading form...</div>}>
          <BookingForm />
        </Suspense>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/assessment"
            className="inline-flex items-center gap-3 bg-dark border-2 border-gold text-white px-8 py-4 rounded-lg font-semibold hover:bg-accent-dark transition-colors"
          >
            <ClipboardCheck className="w-5 h-5 text-gold" />
            <span>Take Assessment</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
