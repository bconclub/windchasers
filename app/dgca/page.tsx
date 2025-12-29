import Link from "next/link";

export default function DGCAPage() {
  return (
    <div className="pt-32 pb-20 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            DGCA <span className="text-gold">Ground Classes</span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Complete CPL theory training. Clear all DGCA exams before you start flying. Structured curriculum with experienced instructors.
          </p>
        </div>

        {/* Course Structure */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-gold">Course Structure</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-accent-dark p-8 rounded-lg border border-white/10">
              <h3 className="text-xl font-bold mb-4">Air Navigation</h3>
              <p className="text-white/60 mb-4">
                Charts, maps, flight planning, navigation techniques, and weather systems.
              </p>
              <div className="text-sm text-gold">100 hours</div>
            </div>

            <div className="bg-accent-dark p-8 rounded-lg border border-white/10">
              <h3 className="text-xl font-bold mb-4">Air Regulations</h3>
              <p className="text-white/60 mb-4">
                Aviation law, DGCA regulations, air traffic rules, and licensing procedures.
              </p>
              <div className="text-sm text-gold">50 hours</div>
            </div>

            <div className="bg-accent-dark p-8 rounded-lg border border-white/10">
              <h3 className="text-xl font-bold mb-4">Aviation Meteorology</h3>
              <p className="text-white/60 mb-4">
                Weather patterns, forecasting, atmospheric conditions, and hazardous weather.
              </p>
              <div className="text-sm text-gold">60 hours</div>
            </div>

            <div className="bg-accent-dark p-8 rounded-lg border border-white/10">
              <h3 className="text-xl font-bold mb-4">Technical General</h3>
              <p className="text-white/60 mb-4">
                Aircraft systems, engines, instruments, and basic aerodynamics.
              </p>
              <div className="text-sm text-gold">80 hours</div>
            </div>

            <div className="bg-accent-dark p-8 rounded-lg border border-white/10">
              <h3 className="text-xl font-bold mb-4">Technical Specific</h3>
              <p className="text-white/60 mb-4">
                Detailed aircraft systems, performance, and operational procedures.
              </p>
              <div className="text-sm text-gold">70 hours</div>
            </div>

            <div className="bg-accent-dark p-8 rounded-lg border border-white/10">
              <h3 className="text-xl font-bold mb-4">RTR (A)</h3>
              <p className="text-white/60 mb-4">
                Radio telephony procedures, communication protocols, and phraseology.
              </p>
              <div className="text-sm text-gold">40 hours</div>
            </div>
          </div>
        </div>

        {/* Exam Information */}
        <div className="bg-dark border-2 border-gold/30 rounded-lg p-12 mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-gold">DGCA Exam Format</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Exam Details</h3>
              <ul className="space-y-3 text-white/70">
                <li className="flex items-start">
                  <span className="text-gold mr-3">•</span>
                  <span>6 subjects, each 100 marks</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-3">•</span>
                  <span>70% passing marks required</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-3">•</span>
                  <span>Multiple choice questions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-3">•</span>
                  <span>All papers within 3 years</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">What You Get</h3>
              <ul className="space-y-3 text-white/70">
                <li className="flex items-start">
                  <span className="text-gold mr-3">•</span>
                  <span>Comprehensive study material</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-3">•</span>
                  <span>Regular mock tests</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-3">•</span>
                  <span>Doubt clearing sessions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-3">•</span>
                  <span>Exam registration support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/demo"
              className="bg-gold text-dark px-12 py-5 rounded-lg font-semibold text-lg hover:bg-gold/90 transition-colors inline-block"
            >
              Book Free Demo
            </Link>
            <Link
              href="/assessment"
              className="bg-white/10 text-white px-12 py-5 rounded-lg font-semibold text-lg hover:bg-white/20 transition-colors border border-white/20 inline-block"
            >
              Take Pilot Assessment Test
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
