import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-accent-dark border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-gold font-bold text-lg mb-4">WINDCHASERS</h3>
            <p className="text-sm text-white/60">
              DGCA approved pilot training with real cost transparency.
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
              <li><Link href="/assessment" className="hover:text-white transition-colors">Aptitude Test</Link></li>
              <li><Link href="/demo" className="hover:text-white transition-colors">Book Demo</Link></li>
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

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-sm text-white/40">
          <p>&copy; {new Date().getFullYear()} WindChasers Aviation Academy. All rights reserved.</p>
          <p className="mt-2">DGCA Approved | Ex-Air Force Instructors</p>
        </div>
      </div>
    </footer>
  );
}
