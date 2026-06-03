import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-accent-dark border-t border-white/10">
      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* Nav columns — spans 3 of 5 */}
          <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {/* Logo + tagline spans full width */}
            <div className="col-span-2 sm:col-span-4 mb-2">
              <Image
                src="/images/White transparent.png"
                alt="WindChasers"
                width={180}
                height={60}
                className="h-12 w-auto mb-3"
              />
              <p className="text-sm text-white/60">
                India&apos;s Top Pilot Training Academy
              </p>
            </div>

            {/* Licenses & Ratings */}
            <div>
              <h4 className="font-semibold mb-4 text-white">Licenses &amp; Ratings</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><Link href="/commercial-pilot-license" className="hover:text-white transition-colors">Commercial Pilot License</Link></li>
                <li><Link href="/private-pilot-license" className="hover:text-white transition-colors">Private Pilot License</Link></li>
                <li><Link href="/airline-transport-pilot-license" className="hover:text-white transition-colors">Airline Transport (ATPL)</Link></li>
                <li><Link href="/instrument-rating" className="hover:text-white transition-colors">Instrument Rating</Link></li>
                <li><Link href="/multi-engine-rating" className="hover:text-white transition-colors">Multi-Engine Rating</Link></li>
                <li><Link href="/certified-flight-instructor" className="hover:text-white transition-colors">Flight Instructor (CFI)</Link></li>
                <li><Link href="/type-rating" className="hover:text-white transition-colors">Type Ratings</Link></li>
              </ul>
            </div>

            {/* Programs */}
            <div>
              <h4 className="font-semibold mb-4 text-white">Programs</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><Link href="/dgca-ground-classes" className="hover:text-white transition-colors">DGCA Ground Classes</Link></li>
                <li><Link href="/diploma-in-aviation" className="hover:text-white transition-colors">Diploma in Aviation</Link></li>
                <li><Link href="/airline" className="hover:text-white transition-colors">Cadet &amp; Airline Track</Link></li>
                <li><Link href="/helicopter-training" className="hover:text-white transition-colors">Helicopter Training</Link></li>
                <li><Link href="/cabin-crew" className="hover:text-white transition-colors">Cabin Crew Program</Link></li>
                <li><Link href="/ielts-training-program" className="hover:text-white transition-colors">IELTS Training</Link></li>
              </ul>
            </div>

            {/* Train Abroad + Pages */}
            <div>
              <h4 className="font-semibold mb-4 text-white">Train Abroad</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><Link href="/pilot-training-in-india" className="hover:text-white transition-colors">India</Link></li>
                <li><Link href="/pilot-training-in-usa" className="hover:text-white transition-colors">USA</Link></li>
                <li><Link href="/pilot-training-in-canada" className="hover:text-white transition-colors">Canada</Link></li>
                <li><Link href="/pilot-training-in-australia" className="hover:text-white transition-colors">Australia</Link></li>
                <li><Link href="/pilot-training-in-new-zealand" className="hover:text-white transition-colors">New Zealand</Link></li>
                <li><Link href="/pilot-training-in-south-africa" className="hover:text-white transition-colors">South Africa</Link></li>
              </ul>
              <h4 className="font-semibold mb-4 mt-6 text-white">Company</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/team" className="hover:text-white transition-colors">Meet the Team</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/contact-us" className="hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="col-span-2 sm:col-span-4">
              <h4 className="font-semibold mb-4 text-white">Contact</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li>
                  <a href="mailto:aviators@windchasers.in" className="hover:text-gold transition-colors">
                    aviators@windchasers.in
                  </a>
                </li>
                <li>
                  <a href="tel:+919591004043" className="hover:text-gold transition-colors">
                    +91 9591004043
                  </a>
                </li>
                <li className="pt-2 text-white/40 text-xs leading-relaxed">
                  WindChasers Aviation Academy<br />
                  Kothanur, Bengaluru, Karnataka
                </li>
              </ul>
            </div>
          </div>

          {/* Map — spans 2 of 5 */}
          <div className="lg:col-span-2">
            <h4 className="font-semibold mb-4 text-white">Find Us</h4>
            <div className="rounded-xl overflow-hidden border border-white/10 h-56 lg:h-full min-h-[220px]">
              <iframe
                src="https://maps.google.com/maps?q=WindChasers+Aviation+Academy+Kothanur+Bengaluru&output=embed&z=15"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="WindChasers location"
                className="grayscale opacity-80 hover:opacity-100 hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 flex flex-col items-center gap-6">
          <Image
            src="/images/White transparent.png"
            alt="WindChasers"
            width={220}
            height={72}
            className="h-14 w-auto opacity-30"
          />
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-white/40">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link>
            <Link href="/terms-conditions" className="hover:text-white transition-colors">Terms &amp; Conditions</Link>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 w-full text-sm text-white/30 text-center sm:text-left">
            <p>&copy; {new Date().getFullYear()} WindChasers Aviation Academy. All rights reserved.</p>
            <p>
              Built with <span className="text-gold/60">❤️</span> at{" "}
              <a
                href="https://bconclub.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold/60 underline hover:text-gold/80 transition-colors"
              >
                BCON
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
