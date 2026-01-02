"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import AirplanePathModal from "@/components/AirplanePathModal";
import VideoCarousel from "@/components/VideoCarousel";
import ImageCarousel from "@/components/ImageCarousel";

export default function Home() {
  const [showAirplaneModal, setShowAirplaneModal] = useState(false);
  const videoRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    document.title = "Windchasers - India's Top Pilot Training Academy- Bangalore";
  }, []);

  const scrollToPathSelection = () => {
    const pathSection = document.getElementById("path-selection");
    pathSection?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle video looping within timeframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from YouTube
      if (event.origin !== 'https://www.youtube.com') return;
      
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        
        // When video reaches end (394 seconds), restart at 334 seconds
        if (data && data.event === 'onStateChange' && data.info === 0) {
          // Video ended, seek to start time
          if (videoRef.current?.contentWindow) {
            videoRef.current.contentWindow.postMessage(
              JSON.stringify({
                event: 'command',
                func: 'seekTo',
                args: [334, true]
              }),
              'https://www.youtube.com'
            );
            // Play the video
            videoRef.current.contentWindow.postMessage(
              JSON.stringify({
                event: 'command',
                func: 'playVideo',
                args: []
              }),
              'https://www.youtube.com'
            );
          }
        }
      } catch (e) {
        // Not JSON, ignore
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const videos = [
    {
      id: "1",
      thumbnail: "",
      embedUrl: "https://player.vimeo.com/video/1150072244",
    },
    {
      id: "2",
      thumbnail: "",
      embedUrl: "https://player.vimeo.com/video/1150072000",
    },
    {
      id: "3",
      thumbnail: "",
      embedUrl: "https://player.vimeo.com/video/1150070765",
    },
    {
      id: "4",
      thumbnail: "",
      embedUrl: "https://player.vimeo.com/video/1150070605",
    },
    {
      id: "5",
      thumbnail: "",
      embedUrl: "https://player.vimeo.com/video/1150070400",
    },
    {
      id: "6",
      thumbnail: "",
      embedUrl: "https://player.vimeo.com/video/1150071458",
    },
    {
      id: "7",
      thumbnail: "",
      embedUrl: "https://player.vimeo.com/video/1150071201",
    },
    {
      id: "8",
      thumbnail: "",
      embedUrl: "https://player.vimeo.com/video/1150072494",
    },
    {
      id: "9",
      thumbnail: "",
      embedUrl: "https://player.vimeo.com/video/1150070211",
    },
    {
      id: "10",
      thumbnail: "",
      embedUrl: "https://player.vimeo.com/video/1150069889",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* YouTube Video Background */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <iframe
            ref={videoRef}
            className="absolute top-1/2 left-[70%] md:left-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2 border-0"
            src="https://www.youtube.com/embed/a9o-PE-DLNA?autoplay=1&mute=1&loop=1&playlist=a9o-PE-DLNA&start=334&end=394&controls=0&showinfo=0&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&enablejsapi=1"
            title="Aviation Background"
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            loading="lazy"
            style={{ pointerEvents: 'none' }}
          />
        </div>

        {/* Background overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark/70 via-dark/80 to-dark z-10" />

        <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 text-center pt-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight text-white"
          >
            Your Career Path to the <span className="text-gold">Cockpit</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/70 mb-12 max-w-3xl mx-auto"
          >
            No false promises. Real costs. Real guidance. DGCA approved training with commercial pilot instructors.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <button
              onClick={scrollToPathSelection}
              className="bg-gold text-dark px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gold/90 transition-colors"
            >
              Choose Your Path
            </button>
          </motion.div>

          {/* Trust Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 pt-8 border-t border-white/10"
          >
            <div className="grid grid-cols-3 gap-4 md:gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-gold/10 border-2 border-gold/30">
                  <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div className="text-gold font-semibold text-sm md:text-base mb-2">100+ Successful Pilots</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-gold/10 border-2 border-gold/30">
                  <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="text-gold font-semibold text-sm md:text-base mb-2">DGCA Approved Curriculum</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-gold/10 border-2 border-gold/30">
                  <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                  </svg>
                </div>
                <div className="text-gold font-semibold text-sm md:text-base mb-2">Top Tier Instructors</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Path Selection - Split Screen */}
      <section id="path-selection" className="relative min-h-screen flex flex-col md:flex-row">
        {/* Airplane Half */}
        <div
          className="relative w-full md:w-1/2 min-h-[50vh] md:min-h-screen group cursor-pointer overflow-hidden"
          onClick={() => setShowAirplaneModal(true)}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: "url('/images/PIlot Traingin  v1.webp')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-dark/80" />

          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="text-center transform group-hover:scale-105 transition-transform duration-300">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white">
                  Airplane
                </h2>
                <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-md mx-auto">
                  Private Pilot License / Commercial Pilot License
                </p>
                <div className="inline-block bg-gold text-dark px-6 py-3 rounded-lg font-semibold hover:bg-gold/90 transition-colors">
                  <span>Explore Path</span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/10 transition-colors duration-300" />
        </div>

        {/* Helicopter Half */}
        <Link
          href="/helicopter"
          className="relative w-full md:w-1/2 min-h-[50vh] md:min-h-screen group overflow-hidden"
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: "url('/images/Helicopter Training.webp')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-bl from-orange-900/40 to-dark/80" />

          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="text-center transform group-hover:scale-105 transition-transform duration-300">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white">
                  Helicopter
                </h2>
                <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-md mx-auto">
                  Private Pilot License (Helicopter)
                </p>
                <div className="inline-block bg-gold text-dark px-6 py-3 rounded-lg font-semibold hover:bg-gold/90 transition-colors">
                  <span>Explore Path</span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/10 transition-colors duration-300" />
        </Link>

        {/* Divider Line */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-px h-full bg-gold/30 hidden md:block" />
      </section>

      {/* Airplane Path Modal */}
      <AirplanePathModal
        isOpen={showAirplaneModal}
        onClose={() => setShowAirplaneModal(false)}
      />

      {/* Video Gallery */}
      <VideoCarousel
        videos={videos}
        title="Student to Pilot"
        subtitle="Real journeys. Real results."
      />

      {/* Why WindChasers */}
      <section className="py-20 px-6 lg:px-8 bg-accent-dark">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gold">
            Why WindChasers
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="group p-8 rounded-xl bg-gradient-to-br from-accent-dark to-dark border-2 border-white/10 hover:border-gold/50 transition-all duration-300 hover:shadow-lg hover:shadow-gold/20 hover:-translate-y-1"
            >
              <div className="w-14 h-14 mb-6 flex items-center justify-center rounded-xl bg-gold/10 group-hover:bg-gold/20 transition-colors border border-gold/20">
                <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-gold transition-colors">Expert Guidance</h3>
              <p className="text-white/60 leading-relaxed">
                Ex-Air Force instructors with thousands of flight hours. Real-world experience in the cockpit.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="group p-8 rounded-xl bg-gradient-to-br from-accent-dark to-dark border-2 border-white/10 hover:border-gold/50 transition-all duration-300 hover:shadow-lg hover:shadow-gold/20 hover:-translate-y-1"
            >
              <div className="w-14 h-14 mb-6 flex items-center justify-center rounded-xl bg-gold/10 group-hover:bg-gold/20 transition-colors border border-gold/20">
                <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-gold transition-colors">Flexible Paths</h3>
              <p className="text-white/60 leading-relaxed">
                DGCA ground classes in India or pilot training abroad. Choose the path that fits your goals and budget.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group p-8 rounded-xl bg-gradient-to-br from-accent-dark to-dark border-2 border-white/10 hover:border-gold/50 transition-all duration-300 hover:shadow-lg hover:shadow-gold/20 hover:-translate-y-1"
            >
              <div className="w-14 h-14 mb-6 flex items-center justify-center rounded-xl bg-gold/10 group-hover:bg-gold/20 transition-colors border border-gold/20">
                <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-gold transition-colors">Career Support</h3>
              <p className="text-white/60 leading-relaxed">
                Placement assistance with partner airlines. We help you from training to cockpit.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="group p-8 rounded-xl bg-gradient-to-br from-accent-dark to-dark border-2 border-white/10 hover:border-gold/50 transition-all duration-300 hover:shadow-lg hover:shadow-gold/20 hover:-translate-y-1"
            >
              <div className="w-14 h-14 mb-6 flex items-center justify-center rounded-xl bg-gold/10 group-hover:bg-gold/20 transition-colors border border-gold/20">
                <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-gold transition-colors">Advanced Simulators</h3>
              <p className="text-white/60 leading-relaxed">
                Train on industry-standard flight simulators. Professional-grade equipment for realistic training.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="group p-8 rounded-xl bg-gradient-to-br from-accent-dark to-dark border-2 border-white/10 hover:border-gold/50 transition-all duration-300 hover:shadow-lg hover:shadow-gold/20 hover:-translate-y-1"
            >
              <div className="w-14 h-14 mb-6 flex items-center justify-center rounded-xl bg-gold/10 group-hover:bg-gold/20 transition-colors border border-gold/20">
                <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-gold transition-colors">Honest Pricing</h3>
              <p className="text-white/60 leading-relaxed">
                Complete cost breakdown upfront. No surprises, no hidden fees. Know exactly what you&apos;re investing.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="group p-8 rounded-xl bg-gradient-to-br from-accent-dark to-dark border-2 border-white/10 hover:border-gold/50 transition-all duration-300 hover:shadow-lg hover:shadow-gold/20 hover:-translate-y-1"
            >
              <div className="w-14 h-14 mb-6 flex items-center justify-center rounded-xl bg-gold/10 group-hover:bg-gold/20 transition-colors border border-gold/20">
                <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-gold transition-colors">Proven Track Record</h3>
              <p className="text-white/60 leading-relaxed">
                Graduates flying with major airlines. Real success stories, not marketing fluff.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Facility Gallery */}
      <ImageCarousel
        images={[
          "/facility/WC1.webp",
          "/facility/WC2.webp",
          "/facility/WC3.webp",
          "/facility/WC4.webp",
          "/facility/WC5.webp",
          "/facility/WC6.webp",
          "/facility/WC7.webp",
        ]}
        title="Our Facility"
        subtitle="State-of-the-art training infrastructure with advanced simulators and modern classrooms."
      />

      {/* CTA Section */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-white/70 mb-8">
            Discover your path to becoming a pilot. Take our free assessment to get personalized guidance.
          </p>
          <Link
            href="/assessment"
            className="inline-block bg-gold text-dark px-12 py-5 rounded-lg font-semibold text-lg hover:bg-gold/90 transition-colors"
          >
            Take Assessment
          </Link>
        </div>
      </section>
    </>
  );
}
