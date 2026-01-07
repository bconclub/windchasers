"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { trackFormSubmission, getStoredUTMParams, getLandingPage, getStoredReferrer, sendTrackingData } from "@/lib/tracking";
import { getUserSessionData, saveUserSessionData, markAssessmentCompleted } from "@/lib/sessionStorage";
import { trackPilotLead } from "@/lib/analytics";

interface Question {
  id: number;
  question: string;
  type: "text" | "radio";
  options?: string[];
  section: string;
  points: { [key: string]: number } | ((value: any) => number);
}

const questions: Question[] = [
  // SECTION 1: QUALIFICATION (50 points)
  {
    id: 1,
    question: "Please Enter Your Age",
    type: "text",
    section: "qualification",
    points: (age: string) => {
      const ageNum = parseInt(age);
      return ageNum >= 17 && ageNum <= 30 ? 10 : 5;
    },
  },
  {
    id: 2,
    question: "What is your current educational status?",
    type: "radio",
    options: [
      "Completed 12th/+2 with Physics, Chemistry, Mathematics",
      "Completed 12th/+2 with Biology/Commerce/Arts",
      "Currently in 12th/+2 with PCM",
      "Below 12th standard",
    ],
    section: "qualification",
    points: { "0": 15, "1": 8, "2": 12, "3": 0 },
  },
  {
    id: 3,
    question: "What percentage did you score in 12th Physics?",
    type: "radio",
    options: ["Above 60%", "50-60%", "Below 50%", "Haven't appeared yet"],
    section: "qualification",
    points: { "0": 12.5, "1": 8, "2": 4, "3": 6 },
  },
  {
    id: 4,
    question: "What percentage did you score in 12th Mathematics?",
    type: "radio",
    options: ["Above 60%", "50-60%", "Below 50%", "Haven't appeared yet"],
    section: "qualification",
    points: { "0": 12.5, "1": 8, "2": 4, "3": 6 },
  },
  // SECTION 2: APTITUDE (50 points)
  // Aviation IQ (15pts)
  {
    id: 5,
    question: "What does ATC stand for?",
    type: "radio",
    options: [
      "Air Traffic Control",
      "Automatic Traffic Control",
      "Aviation Technical Center",
      "Air Transport Commission",
    ],
    section: "aptitude",
    points: { "0": 3, "1": 0, "2": 0, "3": 0 },
  },
  {
    id: 6,
    question: "Which four forces act on an aircraft during flight?",
    type: "radio",
    options: [
      "Lift, Weight, Thrust, Drag",
      "Speed, Height, Wind, Power",
      "Engine, Wings, Fuel, Pilot",
      "Forward, Backward, Up, Down",
    ],
    section: "aptitude",
    points: { "0": 3, "1": 0, "2": 0, "3": 0 },
  },
  {
    id: 7,
    question: "What creates 'lift' in an aircraft?",
    type: "radio",
    options: [
      "The engine pushing the plane forward",
      "Air moving faster over the wing's top surface",
      "The pilot pulling up on controls",
      "Hot air rising from the ground",
    ],
    section: "aptitude",
    points: { "0": 0, "1": 3, "2": 0, "3": 0 },
  },
  {
    id: 8,
    question: "Which organization regulates civil aviation in India?",
    type: "radio",
    options: ["ISRO", "DRDO", "DGCA", "AAI"],
    section: "aptitude",
    points: { "0": 0, "1": 0, "2": 3, "3": 0 },
  },
  {
    id: 9,
    question: "What is the function of an aircraft's ailerons?",
    type: "radio",
    options: [
      "Control up and down movement",
      "Control left and right turning (roll)",
      "Control engine speed",
      "Control landing gear",
    ],
    section: "aptitude",
    points: { "0": 0, "1": 3, "2": 0, "3": 0 },
  },
  // Math Aptitude (15pts)
  {
    id: 10,
    question: "If an aircraft travels at 600 km/h, how far will it travel in 2.5 hours?",
    type: "radio",
    options: ["1200 km", "1500 km", "1800 km", "2100 km"],
    section: "aptitude",
    points: { "0": 0, "1": 3.75, "2": 0, "3": 0 },
  },
  {
    id: 11,
    question: "What is 15% of 1200?",
    type: "radio",
    options: ["150", "180", "200", "240"],
    section: "aptitude",
    points: { "0": 0, "1": 3.75, "2": 0, "3": 0 },
  },
  {
    id: 12,
    question: "Convert 180 minutes into hours",
    type: "radio",
    options: ["2 hours", "2.5 hours", "3 hours", "3.5 hours"],
    section: "aptitude",
    points: { "0": 0, "1": 0, "2": 3.75, "3": 0 },
  },
  {
    id: 13,
    question: "A triangle has angles 70° and 40°. What is the third angle?",
    type: "radio",
    options: ["60°", "70°", "80°", "90°"],
    section: "aptitude",
    points: { "0": 0, "1": 3.75, "2": 0, "3": 0 },
  },
  // Communication Skills (10pts)
  {
    id: 14,
    question: "Choose the correct sentence:",
    type: "radio",
    options: [
      "The pilot and the co-pilot was ready",
      "The pilot and the co-pilot were ready",
      "The pilot and the co-pilot is ready",
      "The pilot and the co-pilot be ready",
    ],
    section: "aptitude",
    points: { "0": 0, "1": 3.33, "2": 0, "3": 0 },
  },
  {
    id: 15,
    question: "Fill in the blank: 'Aviation is a field that ___ precision.'",
    type: "radio",
    options: ["require", "requires", "requiring", "require"],
    section: "aptitude",
    points: { "0": 0, "1": 3.33, "2": 0, "3": 0 },
  },
  {
    id: 16,
    question: "Which sentence shows proper aviation communication?",
    type: "radio",
    options: [
      "Hey, we're going to land now",
      "Flight 123 requesting permission to land",
      "Can we land the plane please?",
      "We want to come down now",
    ],
    section: "aptitude",
    points: { "0": 0, "1": 3.34, "2": 0, "3": 0 },
  },
  // Decision Making (10pts)
  {
    id: 17,
    question: "How do you usually react under pressure?",
    type: "radio",
    options: [
      "Stay calm and focus on the solution",
      "Get anxious but try to manage",
      "Panic and lose control",
      "Avoid the situation",
    ],
    section: "aptitude",
    points: { "0": 5, "1": 3, "2": 0, "3": 1 },
  },
  {
    id: 18,
    question: "If you make a mistake during an important task",
    type: "radio",
    options: [
      "Immediately acknowledge and correct it",
      "Try to fix it quietly without telling anyone",
      "Hope nobody notices",
      "Blame external factors",
    ],
    section: "aptitude",
    points: { "0": 5, "1": 2, "2": 0, "3": 0 },
  },
  // SECTION 3: READINESS (50 points)
  {
    id: 19,
    question: "Pilot training costs ₹45-70 lakhs. How prepared are you financially?",
    type: "radio",
    options: [
      "Fully arranged/family can afford",
      "50% arranged, exploring education loans",
      "Starting to research funding options",
      "Not sure about the costs involved",
    ],
    section: "readiness",
    points: { "0": 20, "1": 15, "2": 10, "3": 5 },
  },
  {
    id: 20,
    question: "When do you plan to start pilot training?",
    type: "radio",
    options: [
      "Within 3 months",
      "3-6 months",
      "6-12 months",
      "Just exploring options",
    ],
    section: "readiness",
    points: { "0": 15, "1": 12, "2": 8, "3": 4 },
  },
  {
    id: 21,
    question: "How much research have you done about pilot careers?",
    type: "radio",
    options: [
      "Extensively researched requirements and career paths",
      "Good research on basics",
      "Some research, learning more",
      "This is my first time learning about it",
    ],
    section: "readiness",
    points: { "0": 15, "1": 12, "2": 8, "3": 4 },
  },
];

const sectionBreaks = [
  { after: 4, title: "Time to Show Your Aviation IQ" },
  { after: 9, title: "Crunch Those Numbers Like a Captain!" },
  { after: 13, title: "Clear Communication = Safe Flights!" },
  { after: 16, title: "Cool Under Pressure? Prove It!" },
  { after: 18, title: "Ready to Fly With Your Dreams?" },
];

export default function AssessmentForm() {
  const searchParams = useSearchParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(string | number)[]>(new Array(questions.length).fill(""));
  const [showContactForm, setShowContactForm] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sourceFrom, setSourceFrom] = useState<string | null>(null);
  const [contactInfo, setContactInfo] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });

  // Read 'from' URL param on mount
  useEffect(() => {
    try {
      const fromParam = searchParams?.get("from");
      if (fromParam) {
        setSourceFrom(fromParam);
      }
    } catch (error) {
      console.error("Error reading search params:", error);
    }
  }, [searchParams]);

  // Load user data from sessionStorage when contact form is shown
  useEffect(() => {
    if (showContactForm) {
      const userData = getUserSessionData();
      if (userData) {
        setContactInfo({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          phone: userData.phone || "",
          email: userData.email || "",
        });
      }
    }
  }, [showContactForm]);

  const handleAnswer = (value: string | number, autoAdvance: boolean = false) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
    
    // Auto-advance to next question if it's a radio button selection
    if (autoAdvance) {
      // Small delay to show the selection before moving
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
        } else {
          setShowContactForm(true);
        }
      }, 300);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowContactForm(true);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScores = () => {
    let qualificationScore = 0;
    let aptitudeScore = 0;
    let readinessScore = 0;

    questions.forEach((q, index) => {
      const answer = answers[index];
      if (answer === "" || answer === null) return;

      let points = 0;
      if (typeof q.points === "function") {
        points = q.points(answer);
      } else {
        points = q.points[String(answer)] || 0;
      }

      if (q.section === "qualification") qualificationScore += points;
      else if (q.section === "aptitude") aptitudeScore += points;
      else if (q.section === "readiness") readinessScore += points;
    });

    const totalScore = qualificationScore + aptitudeScore + readinessScore;

    return {
      qualification: Math.round(qualificationScore),
      aptitude: Math.round(aptitudeScore),
      readiness: Math.round(readinessScore),
      total: Math.round(totalScore),
    };
  };

  const getTier = (totalScore: number) => {
    if (totalScore >= 120) return "premium";
    if (totalScore >= 90) return "strong";
    if (totalScore >= 60) return "potential";
    return "not-ready";
  };

  const getTierInfo = (tier: string) => {
    const tiers = {
      premium: {
        label: "Premium Lead - Ready to Start",
        color: "text-gold",
        bgColor: "bg-gold/20",
        borderColor: "border-gold",
        description: "Excellent! You're well-prepared and ready to begin your pilot training journey. Our team will guide you through the next steps.",
      },
      strong: {
        label: "Strong Candidate - Minor Prep Needed",
        color: "text-green-400",
        bgColor: "bg-green-400/20",
        borderColor: "border-green-400",
        description: "Great foundation! With some minor preparation, you'll be ready to excel in pilot training.",
      },
      potential: {
        label: "Potential Candidate - Preparation Required",
        color: "text-yellow-400",
        bgColor: "bg-yellow-400/20",
        borderColor: "border-yellow-400",
        description: "You have potential! Some focused preparation will help you succeed in pilot training.",
      },
      "not-ready": {
        label: "Not Ready Yet - Build Foundation First",
        color: "text-red-400",
        bgColor: "bg-red-400/20",
        borderColor: "border-red-400",
        description: "Don't worry! Building a strong foundation first will set you up for success. We can help guide you.",
      },
    };
    return tiers[tier as keyof typeof tiers];
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const scores = calculateScores();
    const tier = getTier(scores.total);
    const tierInfo = getTierInfo(tier);

    try {
      // Determine source from URL param (from=dgca/helicopter/abroad)
      const finalSource = sourceFrom || 'unknown';
      
      // Get stored UTM params, landing page, and referrer
      const utmParams = getStoredUTMParams();
      const landingPage = getLandingPage();
      const referrer = getStoredReferrer();

      const response = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: contactInfo.firstName,
          lastName: contactInfo.lastName,
          email: contactInfo.email,
          phone: contactInfo.phone,
          answers: answers.map((ans, idx) => ({
            questionId: questions[idx].id,
            answer: ans,
          })),
          scores,
          tier,
          timestamp: new Date().toISOString(),
          source: finalSource,
          // Include UTM parameters
          utm_source: utmParams.utm_source || "",
          utm_medium: utmParams.utm_medium || "",
          utm_campaign: utmParams.utm_campaign || "",
          utm_term: utmParams.utm_term || "",
          utm_content: utmParams.utm_content || "",
          // Include referrer and landing page
          referrer: referrer || "",
          landing_page: landingPage || "",
        }),
      });

      trackFormSubmission("assessment", {
        name: `${contactInfo.firstName} ${contactInfo.lastName}`,
        email: contactInfo.email,
        phone: contactInfo.phone,
        score: scores.total,
        tier,
      });

      // Track pilot lead
      trackPilotLead(finalSource, 'assessment_completion');
      
      // Send complete tracking data
      await sendTrackingData("/api/assessment", {
        formData: {
          firstName: contactInfo.firstName,
          lastName: contactInfo.lastName,
          email: contactInfo.email,
          phone: contactInfo.phone,
        },
        source: finalSource,
      });

      // Save to sessionStorage: user data, score, tier, and interest
      saveUserSessionData({
        firstName: contactInfo.firstName,
        lastName: contactInfo.lastName,
        email: contactInfo.email,
        phone: contactInfo.phone,
        interest: sourceFrom || undefined,
        assessmentScore: scores.total,
        tier,
      });

      // Mark assessment as completed
      markAssessmentCompleted();

      setIsSubmitting(false);
      
      // Redirect to thank you page with assessment data
      const thankYouData = {
        score: scores.total,
        tier: tier,
        qualificationScore: scores.qualification,
        aptitudeScore: scores.aptitude,
        readinessScore: scores.readiness,
      };
      const dataParam = encodeURIComponent(JSON.stringify(thankYouData));
      window.location.href = `/thank-you?type=assessment&data=${dataParam}`;
    } catch (error) {
      console.error("Failed to submit assessment:", error);
      setIsSubmitting(false);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];
  const canProceed = answers[currentQuestion] !== "" && answers[currentQuestion] !== null;

  // Show section break
  const sectionBreak = sectionBreaks.find((sb) => sb.after === currentQuestion);

  if (showContactForm && !showResults) {
    const scores = calculateScores();
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <h2 className="text-3xl font-bold mb-2 text-center text-gold">
          Enter Your Details
        </h2>
        <p className="text-white/70 text-center mb-8">
          Get your complete PAT score and personalized guidance
        </p>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                First Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                required
                value={contactInfo.firstName}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setContactInfo({ ...contactInfo, firstName: newValue });
                  saveUserSessionData({ firstName: newValue });
                }}
                className="w-full px-4 py-3 bg-accent-dark border border-white/20 rounded-lg focus:border-gold focus:outline-none transition-colors text-white"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                Last Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                required
                value={contactInfo.lastName}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setContactInfo({ ...contactInfo, lastName: newValue });
                  saveUserSessionData({ lastName: newValue });
                }}
                className="w-full px-4 py-3 bg-accent-dark border border-white/20 rounded-lg focus:border-gold focus:outline-none transition-colors text-white"
              />
            </div>
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-2">
              Phone (with country code) <span className="text-red-400">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              required
              placeholder="+91 9876543210"
              value={contactInfo.phone}
              onChange={(e) => {
                const newValue = e.target.value;
                setContactInfo({ ...contactInfo, phone: newValue });
                saveUserSessionData({ phone: newValue });
              }}
              className="w-full px-4 py-3 bg-accent-dark border border-white/20 rounded-lg focus:border-gold focus:outline-none transition-colors text-white"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              id="email"
              required
              value={contactInfo.email}
              onChange={(e) => {
                const newValue = e.target.value;
                setContactInfo({ ...contactInfo, email: newValue });
                saveUserSessionData({ email: newValue });
              }}
              className="w-full px-4 py-3 bg-accent-dark border border-white/20 rounded-lg focus:border-gold focus:outline-none transition-colors text-white"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={
              !contactInfo.firstName ||
              !contactInfo.lastName ||
              !contactInfo.phone ||
              !contactInfo.email ||
              isSubmitting
            }
            className="w-full bg-gold text-dark py-4 rounded-lg font-semibold hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "View Results"}
          </button>
        </div>
      </motion.div>
    );
  }

  if (showResults) {
    const scores = calculateScores();
    const tier = getTier(scores.total);
    const tierInfo = getTierInfo(tier);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Your PAT<br />
            <span className="text-gold">Pilot Aptitude Test</span> Results
          </h2>
          <div className={`text-7xl font-bold mb-4 ${tierInfo.color}`}>
            {scores.total}/150
          </div>
          <div
            className={`inline-block px-6 py-3 rounded-full ${tierInfo.bgColor} ${tierInfo.borderColor} border-2 mb-4`}
          >
            <span className={`text-xl font-bold ${tierInfo.color}`}>
              {tierInfo.label}
            </span>
          </div>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            {tierInfo.description}
          </p>
        </div>

        <div className="bg-accent-dark p-8 rounded-lg border border-white/10 mb-8">
          <h3 className="text-2xl font-bold mb-6 text-gold">Score Breakdown</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-white/60 mb-2">Qualification</div>
              <div className="text-3xl font-bold text-gold">{scores.qualification}/50</div>
            </div>
            <div>
              <div className="text-sm text-white/60 mb-2">Aptitude</div>
              <div className="text-3xl font-bold text-gold">{scores.aptitude}/50</div>
            </div>
            <div>
              <div className="text-sm text-white/60 mb-2">Readiness</div>
              <div className="text-3xl font-bold text-gold">{scores.readiness}/50</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.print()}
            className="bg-gold text-dark px-8 py-4 rounded-lg font-semibold hover:bg-gold/90 transition-colors"
          >
            Download Detailed Report
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Disclaimer - Show only on first question */}
      {currentQuestion === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-gold/20 border-2 border-gold/50 rounded-lg shadow-lg shadow-gold/20"
        >
          <p className="text-sm text-white text-center">
            <span className="font-bold text-gold">Note:</span> This assessment is designed for aspiring pilots who are starting their journey, not for licensed pilots.
          </p>
        </motion.div>
      )}

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-white/60">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="text-sm text-white/60">{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gold"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Section Break */}
      {sectionBreak && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-gold">
            {sectionBreak.title}
          </h3>
        </motion.div>
      )}

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-8">
            {currentQ.question}
          </h2>

          {currentQ.type === "text" ? (
            <input
              type="number"
              value={answers[currentQuestion] || ""}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder="Enter your age"
              className="w-full px-4 py-3 bg-accent-dark border-2 border-white/20 rounded-lg focus:border-gold focus:outline-none transition-colors text-white text-lg"
            />
          ) : (
            <div className="space-y-4">
              {currentQ.options?.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(index, true)}
                  className={`w-full p-6 text-left rounded-lg border-2 transition-all ${
                    answers[currentQuestion] === index
                      ? "border-gold bg-gold/10"
                      : "border-white/20 hover:border-white/40 bg-accent-dark"
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                        answers[currentQuestion] === index
                          ? "border-gold"
                          : "border-white/40"
                      }`}
                    >
                      {answers[currentQuestion] === index && (
                        <div className="w-3 h-3 rounded-full bg-gold" />
                      )}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handleBack}
          disabled={currentQuestion === 0}
          className="px-6 py-3 text-white/60 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← Back
        </button>
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className="px-6 py-3 bg-gold text-dark rounded-lg font-semibold hover:bg-gold/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {currentQuestion === questions.length - 1 ? "Continue" : "Next →"}
        </button>
      </div>
    </div>
  );
}
