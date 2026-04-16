"use client";

import { motion } from "framer-motion";
import { useState, useRef, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Plane,
  Monitor,
  Cpu,
  Printer,
  Ticket,
  Gift,
  CheckCircle,
  Shield,
  Users,
  MapPin,
  Calendar,
  Clock,
  ChevronDown,
  Phone,
  Mail,
  User,
  Sparkles,
  Award,
  Star,
} from "lucide-react";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

// Types
interface FormData {
  parentName: string;
  phone: string;
  email: string;
  childAge: string;
  interest: string;
  batchPreference: string;
}

// Day cards data
const dayCards = [
  {
    day: "Day 1",
    title: "Drone Mastery",
    description: "Take off, navigate, land. Each student gets hands-on real drone flying time.",
    icon: Plane,
    image: "/junior aviators/001.webp",
  },
  {
    day: "Day 2",
    title: "Flight Simulator Training",
    description: "Pilot certified simulators with aviation professionals. Cockpit familiarization.",
    icon: Monitor,
    image: "/junior aviators/002.webp",
  },
  {
    day: "Day 3",
    title: "Robotics & Aerospace STEM",
    description: "Build and program robots. Understand sensors, motors, and automation.",
    icon: Cpu,
    image: "/junior aviators/003.webp",
  },
  {
    day: "Day 4",
    title: "Aeromodelling & 3D Printing",
    description: "Design, print, and assemble model aircraft. Learn aircraft parts and concepts.",
    icon: Printer,
    image: "/junior aviators/004.webp",
  },
  {
    day: "Day 5",
    title: "The Big Day - Aircraft Visit",
    description: "Real aircraft exploration, cockpit visit, interaction with pilots and engineers.",
    icon: Ticket,
    image: "/junior aviators/005.webp",
  },
  {
    day: "Take Home",
    title: "What They Take Home",
    description: "STEM Kit, Young Aviators Certificate, Aircraft Visit Certificate, Camp T-shirt, Badge.",
    icon: Gift,
    image: "/junior aviators/006.webp",
  },
];

// Camp includes items
const campIncludes = [
  "Complete STEM Kit & Learning Materials",
  "Hands-on Drone Flying Sessions (real outdoor flying)",
  "Flight Simulator Training Hours",
  "Books, Exercises & Take-home Resources",
  "Daily Snacks & Refreshments",
  "Professional Photo Session",
  "Aircraft Visit Experience",
  "Official Camp T-shirt & Completion Badge",
  "Transportation (if applicable)",
];

// FAQ items
const faqItems = [
  {
    question: "What should my child bring?",
    answer: "Just water bottle and enthusiasm. We provide all materials, STEM kit, snacks, and safety gear.",
  },
  {
    question: "Is prior drone experience needed?",
    answer: "No. We teach from basics to flying. Each student gets individual practice time.",
  },
  {
    question: "What about lunch?",
    answer: "Snacks and refreshments included. Lunch not included (send packed lunch or money for cafeteria).",
  },
  {
    question: "Safety protocols?",
    answer: "Safety briefing Day 1, professional supervision always, controlled flying zones, first-aid on site.",
  },
  {
    question: "Can I visit the facility first?",
    answer: "Yes. Call +91 95910 04043 to schedule a campus tour before enrolling.",
  },
];

const INTEREST_LABELS: Record<string, string> = {
  drones: "Flying drones",
  simulators: "Flight simulators",
  robots: "Robotics",
  aircraft: "Aircraft visit",
  all: "All of the above",
};

const AGE_LABELS: Record<string, string> = {
  "8-9": "8–9 years",
  "10-11": "10–11 years",
  "12-13": "12–13 years",
  "14-15": "14–15 years",
};

export default function SummerCampPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    parentName: "",
    phone: "",
    email: "",
    childAge: "",
    interest: "",
    batchPreference: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/summercamp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parentName: formData.parentName.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          childAge: formData.childAge,
          interest: formData.interest,
          batchPreference: formData.batchPreference,
        }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok || payload.success === false) {
        throw new Error(
          typeof payload.error === "string" ? payload.error : "Registration failed. Please try again."
        );
      }

      const thankYouData = {
        program: "Summer Camp",
        parentName: formData.parentName.trim(),
        childAge: AGE_LABELS[formData.childAge] || formData.childAge,
        interest: INTEREST_LABELS[formData.interest] || formData.interest,
        batch: formData.batchPreference,
      };
      router.push(
        `/thank-you?type=summercamp&data=${encodeURIComponent(JSON.stringify(thankYouData))}`
      );
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong. Please try again or call us."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark">
      {/* Section 1: Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/facility/WC1.webp"
            alt="Summer Camp Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/80 via-dark/90 to-dark" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-4 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-gold/20 border border-gold/40 rounded-full px-4 py-2 mb-8"
            >
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-gold text-sm font-medium">Summer 2026 Enrollment Open</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white">
              Turn Screen Time Into{" "}
              <span className="text-gold">Sky Time</span> This Summer
            </h1>

            <p className="text-lg md:text-xl text-white/70 mb-10 max-w-3xl mx-auto">
              5 days where your child flies real drones, pilots certified simulators, 
              builds robots, and explores a real aircraft. Ages 8-15.
            </p>

            {/* Event Details Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10 max-w-4xl mx-auto"
            >
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
                <Users className="w-6 h-6 text-gold mx-auto mb-2" />
                <div className="text-white font-semibold text-sm">Ages 8-15</div>
                <div className="text-white/50 text-xs">Years</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
                <Clock className="w-6 h-6 text-gold mx-auto mb-2" />
                <div className="text-white font-semibold text-sm">10 AM - 5 PM</div>
                <div className="text-white/50 text-xs">Mon - Fri</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
                <MapPin className="w-6 h-6 text-gold mx-auto mb-2" />
                <div className="text-white font-semibold text-sm">Bangalore</div>
                <div className="text-white/50 text-xs">WindChasers Campus</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
                <Gift className="w-6 h-6 text-gold mx-auto mb-2" />
                <div className="text-white font-semibold text-sm">STEM Kit</div>
                <div className="text-white/50 text-xs">2 Certificates</div>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              onClick={scrollToForm}
              className="bg-gold text-dark px-10 py-4 rounded-xl font-bold text-lg hover:bg-gold/90 transition-all duration-300 hover:scale-105 shadow-lg shadow-gold/20"
            >
              Reserve Their Spot
            </motion.button>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-12 flex flex-wrap justify-center gap-6 text-white/50 text-sm"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-gold" />
                <span>Certified Instructors</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-gold" />
                <span>500+ Young Aviators Trained</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-gold" />
                <span>DGCA Recognized</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-gold rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Section 2: The 5-Day Journey */}
      <section className="py-20 px-6 lg:px-8 bg-accent-dark">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              The <span className="text-gold">5-Day</span> Journey
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Each day brings new adventures, hands-on learning, and unforgettable experiences
            </p>
          </motion.div>

          <motion.div
            {...staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {dayCards.map((card, index) => (
              <motion.div
                key={card.day}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-dark border border-white/10 rounded-2xl overflow-hidden hover:border-gold/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gold/10"
              >
                {/* Image */}
                {card.image && (
                  <div className="relative h-40 w-full overflow-hidden">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent" />
                  </div>
                )}

                {/* Day Badge */}
                <div className={`absolute bg-gold text-dark text-xs font-bold px-3 py-1 rounded-full ${card.image ? 'top-32 left-4' : '-top-3 left-6'}`}>
                  {card.day}
                </div>

                {/* Content */}
                <div className="p-6 pt-8">
                  {/* Icon */}
                  <div className="w-12 h-12 mb-4 flex items-center justify-center rounded-xl bg-gold/10 group-hover:bg-gold/20 transition-colors border border-gold/20">
                    <card.icon className="w-6 h-6 text-gold" />
                  </div>

                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-gold transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-white/60 leading-relaxed text-sm">
                    {card.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Section 3: Registration Form */}
      <section ref={formRef} className="py-20 px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Reserve Their <span className="text-gold">Spot</span>
            </h2>
            <p className="text-white/60 text-lg">
              Limited to 20 students per batch for personalized attention
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            {...scaleIn}
            className="bg-dark border border-white/10 rounded-2xl p-4 sm:p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Parent&apos;s Name */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Parent&apos;s Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="text"
                      required
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      className="w-full min-h-[56px] bg-white/5 border border-white/20 rounded-xl py-3 pl-12 pr-4 text-base text-white placeholder:text-white/40 focus:border-gold focus:outline-none transition-colors"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                {/* Phone & Email */}
                <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full min-h-[56px] bg-white/5 border border-white/20 rounded-xl py-3 pl-12 pr-4 text-base text-white placeholder:text-white/40 focus:border-gold focus:outline-none transition-colors"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <p className="text-white/40 text-xs mt-1">We&apos;ll send camp details and reminders</p>
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full min-h-[56px] bg-white/5 border border-white/20 rounded-xl py-3 pl-12 pr-4 text-base text-white placeholder:text-white/40 focus:border-gold focus:outline-none transition-colors"
                        placeholder="parent@email.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Child&apos;s Age & Interest */}
                <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Child&apos;s Age
                    </label>
                    <div className="relative">
                      <select
                        required
                        value={formData.childAge}
                        onChange={(e) => setFormData({ ...formData, childAge: e.target.value })}
                        className="w-full min-h-[56px] bg-white/5 border border-white/20 rounded-xl py-3 px-4 text-base text-white appearance-none focus:border-gold focus:outline-none transition-colors cursor-pointer"
                      >
                        <option value="" disabled>Select age group</option>
                        <option value="8-9">8-9 years</option>
                        <option value="10-11">10-11 years</option>
                        <option value="12-13">12-13 years</option>
                        <option value="14-15">14-15 years</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-white/40 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">
                      What excites your child most?
                    </label>
                    <div className="relative">
                      <select
                        required
                        value={formData.interest}
                        onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                        className="w-full min-h-[56px] bg-white/5 border border-white/20 rounded-xl py-3 px-4 text-base text-white appearance-none focus:border-gold focus:outline-none transition-colors cursor-pointer"
                      >
                        <option value="" disabled>Select interest</option>
                        <option value="drones">Flying drones</option>
                        <option value="simulators">Flight simulators</option>
                        <option value="robots">Building robots</option>
                        <option value="aircraft">Aircraft visit</option>
                        <option value="all">All of it</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-white/40 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Batch Preference */}
                <div>
                  <label className="block text-white font-medium mb-3">
                    Batch Preference
                  </label>
                  <div className="flex flex-col sm:grid sm:grid-cols-3 gap-3">
                    {["April 6-10", "April 20-24", "Either works"].map((batch) => (
                      <label
                        key={batch}
                        className={`flex items-center justify-center gap-2 min-h-[56px] px-4 rounded-xl border cursor-pointer transition-all ${
                          formData.batchPreference === batch
                            ? "border-gold bg-gold/10"
                            : "border-white/20 bg-white/5 hover:border-white/40"
                        }`}
                      >
                        <input
                          type="radio"
                          name="batch"
                          value={batch}
                          checked={formData.batchPreference === batch}
                          onChange={(e) => setFormData({ ...formData, batchPreference: e.target.value })}
                          className="sr-only"
                        />
                        <Calendar className={`w-4 h-4 flex-shrink-0 ${formData.batchPreference === batch ? "text-gold" : "text-white/40"}`} />
                        <span className={`text-sm sm:text-base font-medium whitespace-nowrap ${formData.batchPreference === batch ? "text-gold" : "text-white/80"}`}>
                          {batch}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                {submitError ? (
                  <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {submitError}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full min-h-[56px] mt-6 bg-gold text-dark py-4 rounded-xl font-bold text-lg hover:bg-gold/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-dark/30 border-t-dark rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Complete Registration"
                  )}
                </button>

                <p className="text-center text-white/40 text-sm">
                  Limited seats available. Registration confirmation and payment link will be sent via WhatsApp.
                </p>
              </form>
          </motion.div>
        </div>
      </section>

      {/* Section 4: Camp Includes */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Everything <span className="text-gold">Included</span>
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              No hidden costs. Everything your child needs for an amazing week.
            </p>
          </motion.div>

          <motion.div
            {...staggerContainer}
            className="grid md:grid-cols-3 gap-4"
          >
            {campIncludes.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors"
              >
                <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-gold/20">
                  <CheckCircle className="w-5 h-5 text-gold" />
                </div>
                <span className="text-white/90 font-medium text-sm">{item}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Section 5: Safety & Supervision */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Safety <span className="text-gold">&</span> Supervision
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Your child&apos;s safety is our top priority. Professional care at every step.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Safety First */}
            <motion.div
              {...scaleIn}
              className="bg-accent-dark border border-white/10 rounded-2xl p-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-gold/10 border border-gold/20">
                  <Shield className="w-7 h-7 text-gold" />
                </div>
                <h3 className="text-2xl font-bold text-white">Safety First</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Training supervised by aviation professionals (not college students)",
                  "Safe drone flying environment with controlled zones",
                  "Controlled simulator training with instructor oversight",
                  "Student safety briefing on Day 1 mandatory",
                  "First-aid trained staff on campus",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <span className="text-white/70">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* The Environment */}
            <motion.div
              {...scaleIn}
              transition={{ delay: 0.2 }}
              className="bg-accent-dark border border-white/10 rounded-2xl p-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-gold/10 border border-gold/20">
                  <Users className="w-7 h-7 text-gold" />
                </div>
                <h3 className="text-2xl font-bold text-white">The Environment</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "10 AM - 5 PM structured schedule (no loose time)",
                  "Professional instructors only",
                  "Small batch sizes for personalized attention",
                  "WindChasers certified training facility",
                  "DGCA recognized training infrastructure",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <span className="text-white/70">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 6: Who Should Attend */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Who Should <span className="text-gold">Attend</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* For Curious Kids */}
            <motion.div
              {...scaleIn}
              className="group bg-gradient-to-br from-dark to-accent-dark border border-white/10 rounded-2xl p-8 hover:border-gold/30 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-gold/10 group-hover:bg-gold/20 transition-colors border border-gold/20">
                  <Sparkles className="w-8 h-8 text-gold" />
                </div>
                <div>
                  <div className="text-gold text-sm font-medium mb-1">Ages 8-15</div>
                  <h3 className="text-2xl font-bold text-white">For Curious Kids</h3>
                </div>
              </div>
              <p className="text-white/70 mb-6 leading-relaxed">
                Perfect for kids obsessed with drones, video games, robotics, or anything that flies. 
                No prior experience needed. Just curiosity and excitement.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Loves technology", "Enjoys hands-on activities", "Asks 'how does this work'"].map((trait) => (
                  <span key={trait} className="bg-white/10 text-white/80 text-xs px-3 py-1.5 rounded-full">
                    {trait}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* For Proactive Parents */}
            <motion.div
              {...scaleIn}
              transition={{ delay: 0.2 }}
              className="group bg-gradient-to-br from-dark to-accent-dark border border-white/10 rounded-2xl p-8 hover:border-gold/30 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-gold/10 group-hover:bg-gold/20 transition-colors border border-gold/20">
                  <Award className="w-8 h-8 text-gold" />
                </div>
                <div>
                  <div className="text-gold text-sm font-medium mb-1">Parents</div>
                  <h3 className="text-2xl font-bold text-white">Who Want More Than Daycare</h3>
                </div>
              </div>
              <p className="text-white/70 mb-6 leading-relaxed">
                You want a summer experience that builds real skills, boosts confidence, and creates memories. 
                Not just screen time or generic activities.
              </p>
              <div className="flex flex-wrap gap-2">
                {["STEM learning", "Professional supervision", "Career exposure", "Physical activity"].map((benefit) => (
                  <span key={benefit} className="bg-white/10 text-white/80 text-xs px-3 py-1.5 rounded-full">
                    {benefit}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      <section className="py-20 px-6 lg:px-8 bg-accent-dark">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Frequently Asked <span className="text-gold">Questions</span>
            </h2>
          </motion.div>

          <motion.div {...staggerContainer} className="space-y-4">
            {faqItems.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-dark border border-white/10 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="text-white font-medium pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gold flex-shrink-0 transition-transform duration-300 ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === index ? "max-h-40" : "max-h-0"
                  }`}
                >
                  <p className="px-5 pb-5 text-white/60">{faq.answer}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 text-center"
          >
            <p className="text-white/60 mb-4">Still have questions?</p>
            <a
              href="tel:+919591004043"
              className="inline-flex items-center gap-2 bg-white/5 border border-white/20 rounded-full px-6 py-3 text-white hover:bg-white/10 transition-colors"
            >
              <Phone className="w-5 h-5 text-gold" />
              <span>Call +91 95910 04043</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30 rounded-3xl p-10 md:p-16"
          >
            <Star className="w-12 h-12 text-gold mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Give Your Child the Gift of Flight
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Join 500+ young aviators who have discovered their passion for aviation at WindChasers. 
              Limited spots available for Summer 2025.
            </p>
            <button
              onClick={scrollToForm}
              className="bg-gold text-dark px-10 py-4 rounded-xl font-bold text-lg hover:bg-gold/90 transition-all duration-300 hover:scale-105 shadow-lg shadow-gold/20"
            >
              Reserve Their Spot Now
            </button>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
