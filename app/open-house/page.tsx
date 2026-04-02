"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, BookOpen, Gamepad2, X, ChevronDown } from "lucide-react";
import { useTracking } from "@/hooks/useTracking";
import { getTrackingData, getLandingPage, getStoredReferrer } from "@/lib/tracking";

// URL-encode filenames from public/open house/
const asset = (filename: string) =>
  `/open%20house/${encodeURIComponent(filename)}`;

const TOPICS = [
  {
    title: "Step-by-step roadmap",
    desc: "The exact path from completing 12th to holding a CPL. No gaps.",
  },
  {
    title: "Life after CPL",
    desc: "What happens the day you get your licence. Real timelines, real expectations.",
  },
  {
    title: "Career path after CPL",
    desc: "Airlines, charters, cargo, instructing. What each path looks like.",
  },
  {
    title: "Cadet programme vs CPL",
    desc: "Two routes to the cockpit. Which one is right for you.",
  },
  {
    title: "Money talk: what is the real cost?",
    desc: "Full cost breakdown. Training, exams, medicals, everything.",
  },
  {
    title: "Biggest mistakes student pilots make",
    desc: "What trips most aspirants up and how to avoid it.",
  },
  {
    title: "How WindChasers solves this",
    desc: "Our approach, our track record, and why it works.",
  },
];

const TEAM = [
  {
    Icon: Users,
    label: "Senior commercial pilots with active airline experience",
  },
  {
    Icon: BookOpen,
    label: "DGCA certified ground instructors",
  },
  {
    Icon: Gamepad2,
    label: "Simulator instructors. Hands-on time included.",
  },
];

const GALLERY_VIDEOS = [
  "Open hosue 5.mp4",
  "Open House May 4.mp4",
  "SnapInsta.to_AQON7tga2fQpN5m1Ud2WRyJKpvSyLHIidvDWsvuwpiCkZlV0-oAIHCUrfCjBi0pnxOD1ddsZQWYg71BiH30ZQEpYCzwwF-1YKkrWFY0.mp4",
  "WC Open House Nove 2024.mp4",
];

const GALLERY_IMAGES = [
  "Open Hosue 3.jpg",
  "Open Hosue 4.jpg",
  "Open Houe 2.jpg",
  "Open HOuse 1.jpg",
  "Open House May 25 1.jpg",
  "Open House May 25 2.jpg",
  "Open House May 25.jpg",
  "WC November 2024.jpg",
  "WC Open house April 15 1.jpg",
  "WC Open house April 15 2.jpg",
  "WC Open house April 15.jpg",
];

type Role = "" | "student" | "parent";

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

  const [role, setRole] = useState<Role>("");
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
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  useEffect(() => {
    document.title =
      "Pilot Career Open House Bangalore · April 11 · WindChasers";
  }, []);

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

    if (!role) {
      setError("Please select whether you are a student or a parent.");
      return;
    }

    if (!form.name || !form.phone || !form.email || !form.city) {
      setError("Please fill in all fields.");
      return;
    }

    if (role === "student" && !form.status) {
      setError("Please select your current status.");
      return;
    }

    if (role === "student" && form.status === "Below 12th") {
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
          role,
          status: role === "student" ? form.status : "",
          parentAttending: role === "student" ? form.parentAttending : null,
          source: "open-house",
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
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
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
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white"
          >
            Bangalore&apos;s Only{" "}
            <span className="text-gold">Pilot Career Open House</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/70 mb-8"
          >
            Where Bangalore&apos;s future pilots are made.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="text-base md:text-lg text-white/50 mb-10"
          >
            April 11, 2026 · 11:30 AM onwards · WindChasers HQ, Bangalore
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
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

      {/* Topics covered */}
      <section className="py-20 px-6 lg:px-8 bg-accent-dark">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-center mb-4 text-gold"
          >
            Topics covered
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-white/60 text-center text-lg mb-14"
          >
            One morning. Every answer you need.
          </motion.p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {TOPICS.map(({ title, desc }, i) => {
              const isLast = i === TOPICS.length - 1;
              return (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  className={[
                    "bg-dark border-l-4 border-gold rounded-r-xl p-6",
                    isLast ? "col-span-2 lg:col-span-2 lg:col-start-2" : "",
                  ].join(" ")}
                >
                  <h3 className="text-white font-bold text-base md:text-lg mb-2 leading-snug">
                    {title}
                  </h3>
                  <p className="text-white/55 text-sm leading-relaxed">{desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Meet our team */}
      <section className="py-20 px-6 lg:px-8 bg-dark">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-center mb-4 text-gold"
          >
            Meet our instructors
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-white/60 text-center text-lg mb-14 max-w-2xl mx-auto"
          >
            Sit down with our senior instructors. Ask anything about the CPL
            path, training philosophy, and what it takes.
          </motion.p>

          <div className="grid md:grid-cols-3 gap-6">
            {TEAM.map(({ Icon, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group bg-dark border border-white/10 hover:border-gold/40 rounded-xl p-8 flex flex-col items-center text-center transition-colors duration-300"
              >
                <div className="w-14 h-14 mb-5 flex items-center justify-center rounded-xl bg-gold/10 group-hover:bg-gold/20 transition-colors border border-gold/20">
                  <Icon className="w-7 h-7 text-gold" strokeWidth={1.5} />
                </div>
                <p className="text-white/75 text-base leading-relaxed">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration form */}
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
                <p className="text-white/80 text-lg leading-relaxed mb-3">
                  This open house is exclusively for students who have completed
                  12th or above. Visit our homepage to explore how to prepare.
                </p>
                <p className="text-white/40 text-sm">
                  Redirecting you{" "}
                  <span className="text-gold">shortly...</span>
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Role selector */}
                <div>
                  <label className="block text-sm text-white/60 mb-2">
                    I am a…
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {(["student", "parent"] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`py-3 rounded-lg font-medium text-sm capitalize transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 ${
                          role === r
                            ? "bg-gold text-dark"
                            : "bg-dark border border-white/10 text-white/60 hover:border-white/30"
                        }`}
                      >
                        {r === "student" ? "Student / Aspiring Pilot" : "Parent / Guardian"}
                      </button>
                    ))}
                  </div>
                </div>

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

                {role === "student" && (
                  <div>
                    <label className="block text-sm text-white/60 mb-1.5">
                      Current Status
                    </label>
                    <div className="relative">
                      <select
                        required
                        value={form.status}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            status: e.target.value as Status,
                          }))
                        }
                        className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold/50 transition-colors appearance-none pr-10"
                      >
                        <option value="" disabled>
                          Select your status
                        </option>
                        <option value="Completed 12th">Completed 12th</option>
                        <option value="Pursuing 12th">Pursuing 12th</option>
                        <option value="Graduate or above">Graduate or above</option>
                        <option value="Below 12th">Below 12th</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    </div>
                  </div>
                )}

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

                {role === "student" && (
                  <div className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-dark">
                    <span className="text-white/70 text-sm">
                      Will a parent or guardian be attending?
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setForm((f) => ({
                          ...f,
                          parentAttending: !f.parentAttending,
                        }))
                      }
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-dark ${
                        form.parentAttending
                          ? "bg-gold border-gold"
                          : "bg-white/10 border-white/20"
                      }`}
                      aria-pressed={form.parentAttending}
                      aria-label="Parent attending toggle"
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 mt-0.5 ${
                          form.parentAttending
                            ? "translate-x-5"
                            : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>
                )}

                {error && (
                  <p className="text-red-400 text-sm text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gold text-dark py-4 rounded-lg font-semibold text-lg hover:bg-gold/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-accent-dark"
                >
                  {submitting ? "Registering..." : "Register for Free"}
                </button>

                <p className="text-white/30 text-xs text-center">
                  No spam. We&apos;ll only send you event details and a reminder.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* Past open houses gallery */}
      <section className="py-20 px-6 lg:px-8 bg-dark">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-center mb-14 text-gold"
          >
            From our past open houses
          </motion.h2>

          {/* Videos: horizontal scroll on mobile, 2-col grid on desktop */}
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory lg:grid lg:grid-cols-2 lg:overflow-visible lg:pb-0 mb-10">
            {GALLERY_VIDEOS.map((v, i) => (
              <motion.video
                key={v}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                src={asset(v)}
                autoPlay
                muted
                loop
                playsInline
                className="flex-none w-72 h-48 rounded-xl object-cover snap-start lg:w-full lg:h-64"
              />
            ))}
          </div>

          {/* Images: 2-col mobile, 3-col desktop, lightbox on click */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {GALLERY_IMAGES.map((img, i) => (
              <motion.div
                key={img}
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.05 }}
                className="overflow-hidden rounded-xl cursor-pointer group"
                onClick={() => setLightboxSrc(asset(img))}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset(img)}
                  alt=""
                  className="w-full h-40 md:h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center p-4"
            onClick={() => setLightboxSrc(null)}
          >
            <button
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
              onClick={() => setLightboxSrc(null)}
              aria-label="Close lightbox"
            >
              <X className="w-8 h-8" />
            </button>
            <motion.img
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.92 }}
              src={lightboxSrc}
              alt=""
              className="max-w-full max-h-[90vh] rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
