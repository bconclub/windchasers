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

            {/* Training Paths */}
            <div>
              <h4 className="font-semibold mb-4 text-white">Training Paths</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><Link href="/pilot-training" className="hover:text-white transition-colors">Pilot Training</Link></li>
                <li><Link href="/dgca" className="hover:text-white transition-colors">DGCA Ground</Link></li>
                <li><Link href="/international" className="hover:text-white transition-colors">International Flying</Link></li>
                <li><Link href="/helicopter" className="hover:text-white transition-colors">Helicopter License</Link></li>
              </ul>
            </div>

            {/* Pages */}
            <div>
              <h4 className="font-semibold mb-4 text-white">Pages</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/team" className="hover:text-white transition-colors">Our Team</Link></li>
                <li><Link href="/demo" className="hover:text-white transition-colors">Book a Demo</Link></li>
                <li><Link href="/assessment" className="hover:text-white transition-colors">Pilot Assessment</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="col-span-2 sm:col-span-2">
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
