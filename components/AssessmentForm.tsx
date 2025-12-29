"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Question {
  id: number;
  question: string;
  options: string[];
}

const questions: Question[] = [
  {
    id: 1,
    question: "How comfortable are you with making quick decisions under pressure?",
    options: ["Very comfortable", "Comfortable", "Somewhat comfortable", "Not comfortable"],
  },
  {
    id: 2,
    question: "How would you rate your spatial awareness and 3D visualization skills?",
    options: ["Excellent", "Good", "Average", "Below average"],
  },
  {
    id: 3,
    question: "How well do you handle multi-tasking in complex situations?",
    options: ["Very well", "Well", "Moderately", "Struggle with it"],
  },
  {
    id: 4,
    question: "Are you comfortable with mathematics and physics concepts?",
    options: ["Very comfortable", "Comfortable", "Somewhat comfortable", "Not comfortable"],
  },
  {
    id: 5,
    question: "How do you perform in high-stress situations?",
    options: ["Excel under pressure", "Perform well", "Manage okay", "Get overwhelmed"],
  },
  {
    id: 6,
    question: "How good is your hand-eye coordination?",
    options: ["Excellent", "Good", "Average", "Below average"],
  },
  {
    id: 7,
    question: "Can you remain focused on tasks for extended periods?",
    options: ["Yes, easily", "Yes, usually", "Sometimes", "Rarely"],
  },
  {
    id: 8,
    question: "How well do you work independently without supervision?",
    options: ["Very well", "Well", "Need some guidance", "Prefer close supervision"],
  },
  {
    id: 9,
    question: "How comfortable are you with technology and instruments?",
    options: ["Very comfortable", "Comfortable", "Somewhat comfortable", "Not comfortable"],
  },
  {
    id: 10,
    question: "How good is your memory retention for procedures?",
    options: ["Excellent", "Good", "Average", "Below average"],
  },
  {
    id: 11,
    question: "Can you quickly adapt to changing conditions?",
    options: ["Very quickly", "Quickly", "Takes time", "Struggle with change"],
  },
  {
    id: 12,
    question: "How disciplined are you with following procedures?",
    options: ["Very disciplined", "Disciplined", "Moderately", "Not very disciplined"],
  },
  {
    id: 13,
    question: "How well do you communicate in critical situations?",
    options: ["Very clearly", "Clearly", "Adequately", "Struggle to communicate"],
  },
  {
    id: 14,
    question: "Are you comfortable with heights and motion?",
    options: ["Very comfortable", "Comfortable", "Somewhat comfortable", "Not comfortable"],
  },
  {
    id: 15,
    question: "How would you rate your problem-solving abilities?",
    options: ["Excellent", "Good", "Average", "Below average"],
  },
  {
    id: 16,
    question: "Can you maintain composure in emergency situations?",
    options: ["Always", "Usually", "Sometimes", "Rarely"],
  },
  {
    id: 17,
    question: "How well do you prioritize multiple tasks?",
    options: ["Very well", "Well", "Moderately", "Struggle with it"],
  },
  {
    id: 18,
    question: "Are you detail-oriented in your work?",
    options: ["Very much", "Mostly", "Somewhat", "Not really"],
  },
  {
    id: 19,
    question: "How committed are you to continuous learning?",
    options: ["Highly committed", "Committed", "Moderately committed", "Not very committed"],
  },
  {
    id: 20,
    question: "Can you accept and learn from constructive criticism?",
    options: ["Yes, always", "Yes, usually", "Sometimes", "Rarely"],
  },
];

export default function AssessmentForm() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: "", email: "" });
  const [showUserForm, setShowUserForm] = useState(false);

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    } else {
      setShowUserForm(true);
    }
  };

  const calculateScore = () => {
    const total = answers.reduce((sum, answer) => sum + (3 - answer), 0);
    const percentage = (total / (questions.length * 3)) * 100;
    return Math.round(percentage);
  };

  const getScoreTier = (score: number) => {
    if (score >= 80) return { tier: "Excellent", color: "text-green-400", description: "You have strong aptitude for pilot training. Excellent foundation to begin your aviation career." };
    if (score >= 60) return { tier: "Good", color: "text-gold", description: "You show good potential for pilot training. With dedication, you can excel in aviation." };
    if (score >= 40) return { tier: "Fair", color: "text-yellow-400", description: "You have basic aptitude. Additional preparation and focus on weak areas will help you succeed." };
    return { tier: "Needs Improvement", color: "text-red-400", description: "Consider additional preparation before starting training. We can guide you on areas to develop." };
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const score = calculateScore();

    try {
      await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...userInfo,
          score,
          answers,
        }),
      });
    } catch (error) {
      console.error("Failed to save assessment:", error);
    }

    setIsSubmitting(false);
    setShowResults(true);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const score = calculateScore();
  const scoreTier = getScoreTier(score);

  if (showUserForm && !showResults) {
    return (
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">Almost Done</h2>
        <p className="text-white/70 text-center mb-8">
          Enter your details to see your results
        </p>
        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              required
              value={userInfo.name}
              onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
              className="w-full px-4 py-3 bg-accent-dark border border-white/20 rounded-lg focus:border-gold focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              value={userInfo.email}
              onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
              className="w-full px-4 py-3 bg-accent-dark border border-white/20 rounded-lg focus:border-gold focus:outline-none transition-colors"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={!userInfo.name || !userInfo.email || isSubmitting}
            className="w-full bg-gold text-dark py-4 rounded-lg font-semibold hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "View Results"}
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Your Results</h2>
          <div className={`text-7xl font-bold mb-4 ${scoreTier.color}`}>{score}%</div>
          <div className="text-2xl font-bold mb-2">{scoreTier.tier}</div>
          <p className="text-white/70 max-w-2xl mx-auto">{scoreTier.description}</p>
        </motion.div>

        <div className="bg-accent-dark p-8 rounded-lg mb-8">
          <h3 className="text-2xl font-bold mb-6">Next Steps</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <a
              href="/demo"
              className="bg-gold text-dark px-8 py-4 rounded-lg font-semibold hover:bg-gold/90 transition-colors block"
            >
              Book Free Demo
            </a>
            <a
              href="/"
              className="bg-white/10 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/20 block"
            >
              Explore Courses
            </a>
          </div>
        </div>

        <p className="text-sm text-white/50">
          Results sent to {userInfo.email}. Our team will contact you with personalized guidance.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
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

      {/* Question */}
      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="mb-8"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-8">
          {questions[currentQuestion].question}
        </h2>

        <div className="space-y-4">
          {questions[currentQuestion].options.map((option, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAnswer(index)}
              className={`w-full p-6 text-left rounded-lg border-2 transition-all ${
                answers[currentQuestion] === index
                  ? "border-gold bg-gold/10"
                  : "border-white/20 hover:border-white/40 bg-accent-dark"
              }`}
            >
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                  answers[currentQuestion] === index ? "border-gold" : "border-white/40"
                }`}>
                  {answers[currentQuestion] === index && (
                    <div className="w-3 h-3 rounded-full bg-gold" />
                  )}
                </div>
                <span className="font-medium">{option}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          className="px-6 py-3 text-white/60 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
          disabled={currentQuestion === questions.length - 1 || answers[currentQuestion] === -1}
          className="px-6 py-3 bg-gold/20 text-gold hover:bg-gold/30 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}
