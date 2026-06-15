"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Plane,
  User,
  Target,
  MessageCircle,
  ClipboardList,
  RotateCcw,
  BarChart3,
  Star,
  Users,
  BookOpen,
  CheckCircle,
  LucideIcon,
} from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  image: string;
}

const features: Feature[] = [
  {
    icon: Plane,
    title: "Airline Pilots Teaching",
    description: "Learn from experienced active airline pilots with real-world expertise.",
    image: "/why-windchasers/instructors.webp",
  },
  {
    icon: User,
    title: "Individual Learning Approach",
    description: "Personalized attention tailored to your learning style and pace.",
    image: "/facility/Sumaiya Ali.webp",
  },
  {
    icon: Target,
    title: "Skills Focus, Not Just Exam Passing",
    description: "We build practical aviation knowledge, not just exam-cracking techniques.",
    image: "/why-windchasers/Build Around your goals.webp",
  },
  {
    icon: MessageCircle,
    title: "1:1 Doubt Clearing",
    description: "Personal doubt clearing sessions with instructors whenever you need.",
    image: "/facility/DSC_0549.JPG.webp",
  },
  {
    icon: ClipboardList,
    title: "Weekly Mocks + Past Papers",
    description: "Regular practice with weekly mock tests and comprehensive past paper analysis.",
    image: "/facility/WC2.webp",
  },
  {
    icon: RotateCcw,
    title: "Free Unlimited Revision",
    description: "Access to all course materials and revision sessions at no extra cost.",
    image: "/facility/WC4.webp",
  },
  {
    icon: BarChart3,
    title: "Performance Tracking",
    description: "Detailed analytics and progress tracking to identify strengths and areas for improvement.",
    image: "/facility/DSC_0492.JPG.webp",
  },
  {
    icon: Star,
    title: "95% Pass Rate",
    description: "Proven track record with 95% of students successfully clearing DGCA exams.",
    image: "/why-windchasers/DGCA Approved.webp",
  },
  {
    icon: Users,
    title: "Guest Lectures by Captains",
    description: "Special sessions with airline captains sharing industry insights and experiences.",
    image: "/facility/5U2A0673.JPG.webp",
  },
  {
    icon: BookOpen,
    title: "Comprehensive Study Material",
    description: "Well-structured notes, reference books, and digital resources included.",
    image: "/facility/5U2A0679.JPG.webp",
  },
  {
    icon: CheckCircle,
    title: "Exam Registration Support",
    description: "Complete assistance with DGCA exam registration and documentation.",
    image: "/facility/DSC_0481.JPG.webp",
  },
];

/**
 * "Why Choose Us", responsive card grid (image + icon + title + copy).
 * Replaces the old drag-stack which stranded a single card in dead space on
 * desktop. Clean grid on all viewports, no overflow artifacts.
 */
export default function WhyChooseUsCarousel() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
      {features.map((feature, i) => {
        const Icon = feature.icon;
        return (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: Math.min(i * 0.05, 0.3) }}
            className="group relative overflow-hidden rounded-2xl border-t-2 border-[#C5A572] bg-accent-dark min-h-[320px] flex flex-col justify-end hover:-translate-y-1 transition-transform duration-300"
          >
            <Image
              src={feature.image}
              alt={feature.title}
              fill
              sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/75 to-transparent" />
            <div className="relative z-10 p-6 md:p-7">
              <div className="w-12 h-12 rounded-xl bg-[#C5A572]/15 border border-[#C5A572]/30 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-[#C5A572]" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 text-white">{feature.title}</h3>
              <p className="text-white/70 text-sm leading-relaxed">{feature.description}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
