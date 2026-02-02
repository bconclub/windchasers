import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-accent-dark border-t border-white/10 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Image
              src="/images/White transparent.png"
              alt="WindChasers"
              width={180}
              height={60}
              className="h-12 w-auto mb-4"
            />
            <p className="text-sm text-white/60">
              India's Top Pilot Training Academy
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Training Paths</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link href="/dgca" className="hover:text-white transition-colors">DGCA Ground</Link></li>
              <li><Link href="/international" className="hover:text-white transition-colors">International Flying</Link></li>
              <li><Link href="/helicopter" className="hover:text-white transition-colors">Helicopter License</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link href="/assessment" className="hover:text-white transition-colors">Pilot Assessment Test</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
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
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-16 pt-12 pb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-white/40">
            <p>&copy; {new Date().getFullYear()} WindChasers Aviation Academy. All rights reserved.</p>
            <p className="text-center sm:text-right">
              Built with <span className="text-gold">❤️</span> at{" "}
              <a 
                href="https://bconclub.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gold underline hover:text-gold/80 transition-colors"
              >
                BCON Club
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
