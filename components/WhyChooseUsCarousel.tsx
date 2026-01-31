



"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  LucideIcon
} from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Plane,
    title: "Airline Pilots Teaching",
    description: "Learn from experienced active airline pilots with real-world expertise.",
  },
  {
    icon: User,
    title: "Individual Learning Approach",
    description: "Personalized attention tailored to your learning style and pace.",
  },
  {
    icon: Target,
    title: "Skills Focus, Not Just Exam Passing",
    description: "We build practical aviation knowledge, not just exam-cracking techniques.",
  },
  {
    icon: MessageCircle,
    title: "1:1 Doubt Clearing",
    description: "Personal doubt clearing sessions with instructors whenever you need.",
  },
  {
    icon: ClipboardList,
    title: "Weekly Mocks + Past Papers",
    description: "Regular practice with weekly mock tests and comprehensive past paper analysis.",
  },
  {
    icon: RotateCcw,
    title: "Free Unlimited Revision",
    description: "Access to all course materials and revision sessions at no extra cost.",
  },
  {
    icon: BarChart3,
    title: "Performance Tracking",
    description: "Detailed analytics and progress tracking to identify strengths and areas for improvement.",
  },
  {
    icon: Star,
    title: "95% Pass Rate",
    description: "Proven track record with 95% of students successfully clearing DGCA exams.",
  },
  {
    icon: Users,
    title: "Guest Lectures by Captains",
    description: "Special sessions with airline captains sharing industry insights and experiences.",
  },
  {
    icon: BookOpen,
    title: "Comprehensive Study Material",
    description: "Well-structured notes, reference books, and digital resources included.",
  },
  {
    icon: CheckCircle,
    title: "Exam Registration Support",
    description: "Complete assistance with DGCA exam registration and documentation.",
  },
];

const CARD_STACK_SIZE = 5; // Number of cards to show in the stack

export default function WhyChooseUsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [showSwipeIndicator, setShowSwipeIndicator] = useState(false);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, features.length - 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const canGoNext = currentIndex < features.length - 1;
  const canGoPrev = currentIndex > 0;

  // Get visible cards (current + next few in stack)
  const getVisibleCards = () => {
    const visible = [];
    for (let i = 0; i < CARD_STACK_SIZE && currentIndex + i < features.length; i++) {
      visible.push({
        index: currentIndex + i,
        feature: features[currentIndex + i],
        stackPosition: i,
      });
    }
    return visible;
  };

  const visibleCards = getVisibleCards();

  // Calculate card transform based on stack position
  const getCardTransform = (stackPosition: number, dragOffset: number = 0) => {
    if (stackPosition === 0) {
      // Front card - can be dragged
      return {
        x: dragOffset,
        y: 0,
        rotate: dragOffset * 0.08,
        rotateY: dragOffset * 0.05,
        scale: 1,
        zIndex: CARD_STACK_SIZE,
      };
    } else {
      // Stacked cards behind - fanned out to the right
      const baseX = stackPosition * 25; // Horizontal offset (fanned right)
      const baseY = stackPosition * -10; // Vertical offset (slightly up)
      const baseRotate = stackPosition * 4; // Rotation angle (tilted right)
      const baseRotateY = stackPosition * 2; // 3D rotation
      const baseScale = 1 - stackPosition * 0.06; // Scale down
      const opacity = 1 - stackPosition * 0.2; // Fade out

      return {
        x: baseX + (dragOffset * 0.25), // Move less than front card
        y: baseY,
        rotate: baseRotate + (dragOffset * 0.03),
        rotateY: baseRotateY + (dragOffset * 0.02),
        scale: baseScale,
        zIndex: CARD_STACK_SIZE - stackPosition,
        opacity: Math.max(0.2, opacity),
      };
    }
  };

  return (
    <section className="min-h-screen py-20 px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-7xl mx-auto w-full">
        <h2 className="text-3xl font-bold mb-6 text-center text-gold">Why Choose Us</h2>
        
        <div className="relative flex items-center justify-center min-h-[400px] md:min-h-[550px]">
        {/* Card Stack Container */}
        <div className="relative w-full max-w-md md:max-w-[28rem] mx-auto perspective-1000">
          <motion.div
            className="relative w-full h-full"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            dragMomentum={false}
            onDragStart={() => {
              setIsDragging(true);
              setShowSwipeIndicator(true);
            }}
            onDrag={(_, info) => {
              setDragX(info.offset.x);
            }}
            onDragEnd={(_, { offset, velocity }) => {
              setIsDragging(false);
              const swipe = offset.x;
              const swipeVelocity = velocity.x;
              const threshold = 50;
              const velocityThreshold = 500;

              if (swipe < -threshold || swipeVelocity < -velocityThreshold) {
                nextSlide();
              } else if (swipe > threshold || swipeVelocity > velocityThreshold) {
                prevSlide();
              }
              setDragX(0);
              
              // Hide swipe indicator after a delay
              setTimeout(() => setShowSwipeIndicator(false), 1000);
            }}
            style={{
              touchAction: "pan-x",
              WebkitUserSelect: "none",
              userSelect: "none",
              cursor: isDragging ? "grabbing" : "grab",
            }}
          >
            <AnimatePresence mode="popLayout">
              {visibleCards.map(({ index, feature, stackPosition }) => {
                const transform = getCardTransform(stackPosition, isDragging ? dragX : 0);
                const rotateY = transform.rotateY || 0;
                
                return (
                  <motion.div
                    key={index}
                    initial={stackPosition === 0 ? false : { 
                      x: transform.x + 100,
                      y: transform.y,
                      rotate: transform.rotate + 10,
                      scale: transform.scale,
                      opacity: 0 
                    }}
                    animate={{
                      x: transform.x,
                      y: transform.y,
                      rotate: transform.rotate,
                      scale: transform.scale,
                      opacity: transform.opacity ?? 1,
                      zIndex: transform.zIndex,
                    }}
                    exit={{
                      x: -200,
                      y: -50,
                      rotate: -15,
                      scale: 0.8,
                      opacity: 0,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                      restDelta: 0.5,
                    }}
                    className="absolute inset-0 w-full"
                    style={{
                      transformStyle: "preserve-3d",
                    }}
                  >
                    <motion.div
                      className="bg-accent-dark p-6 md:p-10 rounded-xl border border-white/10 shadow-lg backdrop-blur-sm"
                      style={{
                        transform: `perspective(1000px) rotateY(${rotateY}deg) rotateZ(${transform.rotate}deg)`,
                        boxShadow: stackPosition === 0 
                          ? "0 20px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(197, 165, 114, 0.1)"
                          : `0 ${10 + stackPosition * 5}px ${20 + stackPosition * 10}px rgba(0, 0, 0, 0.2)`,
                      }}
                      whileHover={stackPosition === 0 ? { 
                        scale: 1.02,
                        transition: { duration: 0.2 }
                      } : {}}
                    >
                      <div className="mb-4">
                        <feature.icon className="w-12 h-12 md:w-16 md:h-16 text-gold" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-lg md:text-2xl font-bold mb-3 text-white">{feature.title}</h3>
                      <p className="text-white/60 text-sm md:text-lg leading-relaxed">{feature.description}</p>
                    </motion.div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Navigation Arrows - Desktop Only */}
        <div className="hidden md:flex absolute inset-0 items-center justify-between pointer-events-none px-8">
          {canGoPrev && (
            <button
              onClick={prevSlide}
              className="pointer-events-auto w-14 h-14 rounded-full bg-gold/20 hover:bg-gold/40 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110"
              aria-label="Previous"
            >
              <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          
          {canGoNext && (
            <button
              onClick={nextSlide}
              className="pointer-events-auto w-14 h-14 rounded-full bg-gold/20 hover:bg-gold/40 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110"
              aria-label="Next"
            >
              <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Mobile Swipe Indicator */}
        <AnimatePresence>
          {showSwipeIndicator && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="md:hidden absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-none"
            >
              <div className="bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <div className="flex items-center gap-2 text-white/80 text-xs">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                  </svg>
                  <span>Swipe</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dots Indicator */}
      {features.length > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {features.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === idx ? "bg-gold w-8" : "bg-white/30 w-2 hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
      </div>
    </section>
  );
}

