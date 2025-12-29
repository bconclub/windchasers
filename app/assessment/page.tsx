import AssessmentForm from "@/components/AssessmentForm";

export default function AssessmentPage() {
  return (
    <div className="pt-32 pb-20 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Pilot <span className="text-gold">Aptitude Test</span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            20 questions to assess your natural aptitude for pilot training. Takes 5-10 minutes. Get instant results and personalized guidance.
          </p>
        </div>

        <div className="bg-accent-dark p-8 rounded-lg border border-white/10 mb-12 max-w-3xl mx-auto">
          <h3 className="text-xl font-bold mb-4">What This Test Measures</h3>
          <ul className="space-y-2 text-white/70">
            <li className="flex items-start">
              <span className="text-gold mr-3">•</span>
              <span>Decision-making under pressure</span>
            </li>
            <li className="flex items-start">
              <span className="text-gold mr-3">•</span>
              <span>Spatial awareness and coordination</span>
            </li>
            <li className="flex items-start">
              <span className="text-gold mr-3">•</span>
              <span>Multi-tasking capabilities</span>
            </li>
            <li className="flex items-start">
              <span className="text-gold mr-3">•</span>
              <span>Technical aptitude</span>
            </li>
            <li className="flex items-start">
              <span className="text-gold mr-3">•</span>
              <span>Stress management</span>
            </li>
            <li className="flex items-start">
              <span className="text-gold mr-3">•</span>
              <span>Learning ability and discipline</span>
            </li>
          </ul>
        </div>

        <AssessmentForm />
      </div>
    </div>
  );
}
