import Link from "next/link";

export default function HelicopterPage() {
  return (
    <div className="pt-32 pb-20 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Helicopter <span className="text-gold">Pilot License</span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            HPL training for specialized aviation careers. Offshore operations, medical evacuation, VIP transport, and more.
          </p>
        </div>

        {/* Training Path */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-gold">Training Path</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-accent-dark p-8 rounded-lg border border-white/10">
              <div className="text-4xl font-bold text-gold mb-4">01</div>
              <h3 className="text-xl font-bold mb-3">Ground School</h3>
              <p className="text-white/60 mb-4">
                DGCA theoretical exams covering helicopter systems, aerodynamics, and regulations.
              </p>
              <div className="text-sm text-gold">6-8 months</div>
            </div>

            <div className="bg-accent-dark p-8 rounded-lg border border-white/10">
              <div className="text-4xl font-bold text-gold mb-4">02</div>
              <h3 className="text-xl font-bold mb-3">Flight Training</h3>
              <p className="text-white/60 mb-4">
                Minimum 40 hours dual instruction and 10 hours solo flight in helicopters.
              </p>
              <div className="text-sm text-gold">4-6 months</div>
            </div>

            <div className="bg-accent-dark p-8 rounded-lg border border-white/10">
              <div className="text-4xl font-bold text-gold mb-4">03</div>
              <h3 className="text-xl font-bold mb-3">License Issuance</h3>
              <p className="text-white/60 mb-4">
                DGCA skill test and license issuance. Start your helicopter pilot career.
              </p>
              <div className="text-sm text-gold">After completion</div>
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-gold/10 border-2 border-gold/50 rounded-lg p-12 mb-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-gold">Entry Requirements</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <ul className="space-y-3 text-white/80">
              <li className="flex items-start">
                <span className="text-gold mr-3">✓</span>
                <span>Age: 18 years minimum</span>
              </li>
              <li className="flex items-start">
                <span className="text-gold mr-3">✓</span>
                <span>Education: 10+2 with Physics & Maths</span>
              </li>
              <li className="flex items-start">
                <span className="text-gold mr-3">✓</span>
                <span>English proficiency required</span>
              </li>
            </ul>
            <ul className="space-y-3 text-white/80">
              <li className="flex items-start">
                <span className="text-gold mr-3">✓</span>
                <span>Class 1 Medical certificate</span>
              </li>
              <li className="flex items-start">
                <span className="text-gold mr-3">✓</span>
                <span>No flying experience needed</span>
              </li>
              <li className="flex items-start">
                <span className="text-gold mr-3">✓</span>
                <span>Valid government ID</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Career Opportunities */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-gold">Career Opportunities</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-accent-dark p-8 rounded-lg border border-white/10">
              <h3 className="text-xl font-bold mb-3">Offshore Operations</h3>
              <p className="text-white/60">
                Oil rig crew transport, offshore platform support. High-demand specialized sector.
              </p>
            </div>

            <div className="bg-accent-dark p-8 rounded-lg border border-white/10">
              <h3 className="text-xl font-bold mb-3">Medical Evacuation</h3>
              <p className="text-white/60">
                Air ambulance services, emergency medical transport. Critical life-saving operations.
              </p>
            </div>

            <div className="bg-accent-dark p-8 rounded-lg border border-white/10">
              <h3 className="text-xl font-bold mb-3">VIP Transport</h3>
              <p className="text-white/60">
                Corporate and executive charter. Premium service for business leaders.
              </p>
            </div>

            <div className="bg-accent-dark p-8 rounded-lg border border-white/10">
              <h3 className="text-xl font-bold mb-3">Tourism</h3>
              <p className="text-white/60">
                Scenic tours, charter services. Growing industry in tourist destinations.
              </p>
            </div>

            <div className="bg-accent-dark p-8 rounded-lg border border-white/10">
              <h3 className="text-xl font-bold mb-3">Agriculture</h3>
              <p className="text-white/60">
                Crop spraying, agricultural surveys. Specialized farming operations.
              </p>
            </div>

            <div className="bg-accent-dark p-8 rounded-lg border border-white/10">
              <h3 className="text-xl font-bold mb-3">Utility Services</h3>
              <p className="text-white/60">
                Power line inspection, pipeline monitoring. Infrastructure support.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Start Your Helicopter Career</h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            Specialized training for a unique aviation career. Book a demo to experience our helicopter simulator.
          </p>
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
