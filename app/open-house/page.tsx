"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Users, Gamepad2, Building2 } from "lucide-react";
import ImageCarousel from "@/components/ImageCarousel";
import { useTracking } from "@/hooks/useTracking";
import { getTrackingData, getLandingPage, getStoredReferrer } from "@/lib/tracking";

const AGENDA_ITEMS = [
  {
    icon: BookOpen,
    title: "Full CPL roadmap session",
    desc: "End-to-end breakdown of what it takes to earn your Commercial Pilot Licence — timelines, costs, and what to expect.",
  },
  {
    icon: Users,
    title: "Meet our instructors",
    desc: "Sit down with ex-Air Force pilots. Ask anything — their experience, training philosophy, and what they look for in students.",
  },
  {
    icon: Gamepad2,
    title: "Experience the flight simulator",
    desc: "Get hands-on time in our industry-standard simulator. Feel what flying actually feels like before committing.",
  },
  {
    icon: Building2,
    title: "Tour the facility",
    desc: "Walk through our classrooms, briefing rooms, and sim bay. See exactly where you'll spend the next chapter of your life.",
  },
];

const FACILITY_IMAGES = [
  "/facility/WC1.webp",
  "/facility/WC2.webp",
  "/facility/WC3.webp",
  "/facility/WC4.webp",
  "/facility/WC5.webp",
  "/facility/WC6.webp",
  "/facility/WC7.webp",
];

type Status =
  | ""
  | "Completed 12th"
  | "Pursuing 12th"
  | "Graduate or above"
  | "Below 12th";

interface FormState {
  name: string;
  phone: string;
  email: string;
  status: Status;
  city: string;
  parentAttending: boolean;
}

export default function OpenHousePage() {
  const router = useRouter();
  const { sessionId, utmParams } = useTracking();

  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    email: "",
    status: "",
    city: "",
    parentAttending: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    document.title =
      "Pilot Career Open House Bangalore · April 11 · WindChasers";
  }, []);

  // Redirect "Below 12th" after 3s
  useEffect(() => {
    if (!blocked) return;
    const t = setTimeout(() => router.push("/"), 3000);
    return () => clearTimeout(t);
  }, [blocked, router]);

  const scrollToRegister = () => {
    document.getElementById("register")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.phone || !form.email || !form.status || !form.city) {
      setError("Please fill in all fields.");
      return;
    }

    if (form.status === "Below 12th") {
      setBlocked(true);
      return;
    }

    setSubmitting(true);
    try {
      const trackingData = getTrackingData();
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          city: form.city,
          status: form.status,
          parentAttending: form.parentAttending,
          source: "open-house",
          // UTM + session tracking
          sessionId,
          utmParams,
          ...utmParams,
          referrer: getStoredReferrer(),
          landing_page: getLandingPage(),
          pageViews: trackingData.pageViews,
          formSubmissions: trackingData.formSubmissions,
          userInfo: trackingData.userInfo,
        }),
      });

      if (!res.ok) throw new Error("Submission failed");
      router.push("/thank-you?type=booking");
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Vimeo background */}
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
          <iframe
            className="absolute top-1/2 left-[70%] md:left-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2 border-0"
            src="https://player.vimeo.com/video/1160946921?autoplay=1&muted=1&controls=0&badge=0&byline=0&portrait=0&title=0&background=1"
            title="Aviation Background"
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            loading="lazy"
            style={{ pointerEvents: "none" }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-dark/70 via-dark/80 to-dark z-10" />

        <div className="relative z-20 max-w-4xl mx-auto px-6 lg:px-8 text-center pt-20">
          {/* Event badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-6 px-4 py-1.5 rounded-full border border-gold/40 bg-gold/10 text-gold text-sm font-medium tracking-wide"
          >
            FREE EVENT · APRIL 11, 2026
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white"
          >
            Bangalore&apos;s Only{" "}
            <span className="text-gold">Pilot Career</span> Open House
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="text-xl md:text-2xl text-white/70 mb-8"
          >
            Where Bangalore&apos;s future pilots are made.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-white/60 text-base md:text-lg mb-10"
          >
            <span>📅 April 11, 2026</span>
            <span>🕦 11:30 AM onwards</span>
            <span>📍 WindChasers HQ, Bangalore</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
          >
            <button
              onClick={scrollToRegister}
              className="bg-gold text-dark px-10 py-4 rounded-lg font-semibold text-lg hover:bg-gold/90 transition-colors"
            >
              Reserve Your Spot
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── What's Happening ── */}
      <section className="py-20 px-6 lg:px-8 bg-accent-dark">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-center mb-4 text-gold"
          >
            What&apos;s Happening
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-white/60 text-center text-lg mb-14"
          >
            One morning. Everything you need to make the decision.
          </motion.p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {AGENDA_ITEMS.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group p-7 rounded-xl bg-gradient-to-br from-accent-dark to-dark border-2 border-white/10 hover:border-gold/50 transition-all duration-300 hover:shadow-lg hover:shadow-gold/20 hover:-translate-y-1"
              >
                <div className="w-13 h-13 mb-5 flex items-center justify-center rounded-xl bg-gold/10 group-hover:bg-gold/20 transition-colors border border-gold/20 w-14 h-14">
                  <Icon className="w-7 h-7 text-gold" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-bold mb-2 text-white group-hover:text-gold transition-colors">
                  {title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who Should Attend ── */}
      <section className="py-20 px-6 lg:px-8 bg-dark">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-center mb-14 text-gold"
          >
            Who Should Attend
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-8 rounded-xl border-2 border-white/10 hover:border-gold/40 transition-colors"
            >
              <div className="text-3xl mb-4">🎓</div>
              <h3 className="text-2xl font-bold text-white mb-3">Students</h3>
              <p className="text-white/60 leading-relaxed">
                If you&apos;ve completed 12th grade or are a graduate with a
                dream of flying professionally, this event is built for you.
                Come with questions — leave with a clear plan.
              </p>
              <ul className="mt-5 space-y-2 text-white/50 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-gold">✓</span> Completed 12th (Science or Commerce)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold">✓</span> Graduates considering a career change
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold">✓</span> Anyone serious about CPL or helicopter training
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="p-8 rounded-xl border-2 border-white/10 hover:border-gold/40 transition-colors"
            >
              <div className="text-3xl mb-4">👨‍👩‍👧</div>
              <h3 className="text-2xl font-bold text-white mb-3">Parents</h3>
              <p className="text-white/60 leading-relaxed">
                Aviation training is a significant investment. We believe
                parents deserve straight answers — on costs, timelines, career
                outcomes, and what happens after the licence.
              </p>
              <ul className="mt-5 space-y-2 text-white/50 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-gold">✓</span> Full cost breakdown, no hidden fees
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold">✓</span> Direct Q&amp;A with senior instructors
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold">✓</span> Realistic career timelines and outcomes
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Registration Form ── */}
      <section
        id="register"
        className="py-20 px-6 lg:px-8 bg-accent-dark scroll-mt-20"
      >
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-3 text-gold">
              Reserve Your Spot
            </h2>
            <p className="text-white/60 text-center mb-10">
              Free entry. Limited seats. April 11 · 11:30 AM.
            </p>

            {blocked ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-xl border border-white/10 bg-dark p-8 text-center"
              >
                <p className="text-white/80 text-lg leading-relaxed mb-2">
                  This event is exclusively for students who have completed
                  12th.
                </p>
                <p className="text-white/50 text-sm">
                  Visit our homepage for more.{" "}
                  <span className="text-gold">Redirecting…</span>
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="space-y-5"
              >
                {/* Name */}
                <div>
                  <label className="block text-sm text-white/60 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your full name"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-gold/50 transition-colors"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm text-white/60 mb-1.5">
                    Phone
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-gold/50 transition-colors"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm text-white/60 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@email.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-gold/50 transition-colors"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm text-white/60 mb-1.5">
                    Current Status
                  </label>
                  <select
                    required
                    value={form.status}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        status: e.target.value as Status,
                      }))
                    }
                    className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold/50 transition-colors appearance-none"
                  >
                    <option value="" disabled>
                      Select your status
                    </option>
                    <option value="Completed 12th">Completed 12th</option>
                    <option value="Pursuing 12th">Pursuing 12th</option>
                    <option value="Graduate or above">Graduate or above</option>
                    <option value="Below 12th">Below 12th</option>
                  </select>
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm text-white/60 mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Bangalore"
                    value={form.city}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, city: e.target.value }))
                    }
                    className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-gold/50 transition-colors"
                  />
                </div>

                {/* Parent attending toggle */}
                <div className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-dark">
                  <span className="text-white/70 text-sm">
                    Will a parent / guardian be attending?
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        parentAttending: !f.parentAttending,
                      }))
                    }
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 transition-colors duration-200 focus:outline-none ${
                      form.parentAttending
                        ? "bg-gold border-gold"
                        : "bg-white/10 border-white/20"
                    }`}
                    aria-pressed={form.parentAttending}
                    aria-label="Parent attending toggle"
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 mt-0.5 ${
                        form.parentAttending ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>

                {/* Error */}
                {error && (
                  <p className="text-red-400 text-sm text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gold text-dark py-4 rounded-lg font-semibold text-lg hover:bg-gold/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? "Registering…" : "Register for Free"}
                </button>

                <p className="text-white/30 text-xs text-center">
                  No spam. We&apos;ll only send you event details and a reminder.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Past Events ── */}
      <ImageCarousel
        images={FACILITY_IMAGES}
        title="Inside WindChasers"
        subtitle="A look at where India's next generation of pilots train."
      />
    </>
  );
}
