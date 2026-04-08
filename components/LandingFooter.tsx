"use client";

import { MessageCircle, Calendar } from "lucide-react";

export default function LandingFooter() {
  return (
    <footer className="bg-[#1A1A1A]">
      {/* Logo Row */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="flex justify-center md:justify-start">
          <img
            src="/images/White transparent.png"
            alt="WindChasers"
            className="h-10 w-auto"
          />
        </div>
      </div>

      {/* WhatsApp CTA Strip */}
      <div className="bg-[#C5A572]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[#1A1A1A] font-medium text-center md:text-left">
              Stay updated on batches, events, and aviation news.
            </p>
            <a
              href="https://chat.whatsapp.com/COsk2RyqhcL8wrh6dn4irg"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#1A1A1A] text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-[#0D0D0D] transition-colors w-full md:w-auto"
            >
              <MessageCircle className="w-4 h-4" />
              Join our WhatsApp Community
            </a>
          </div>
        </div>
      </div>

      {/* Book a Consultation */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Book a one-on-one consultation with an aviation expert.
          </h3>
          <p className="text-gray-400 mb-8">
            Free. 30 minutes. Online or at our Bangalore campus.
          </p>
          <a
            href="https://calendly.com/windchasers"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#C5A572] text-[#1A1A1A] px-8 py-4 rounded-full font-semibold text-base hover:bg-[#C5A572]/90 transition-colors"
          >
            <Calendar className="w-5 h-5" />
            Schedule a Call
          </a>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p className="text-center md:text-left">
              &copy; 2026 WindChasers Aviation Academy. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://pilot.windchasers.in"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#C5A572] transition-colors"
              >
                pilot.windchasers.in
              </a>
              <span className="text-white/20">|</span>
              <a
                href="mailto:aviators@windchasers.in"
                className="hover:text-[#C5A572] transition-colors"
              >
                aviators@windchasers.in
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
