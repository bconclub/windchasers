// PAT scoring - single source of truth.
//
// This module is imported by BOTH the client (for an optional preview) and the
// server (for the authoritative score that gets written to Sheets and PROXe).
// The server NEVER trusts client-computed scores. Always re-run scoreAnswers()
// on the raw answers payload before persisting.
//
// IMPORTANT: keep this module Node + browser safe (no next-only imports).

import { PAT_QUESTIONS, PAT_QUESTION_COUNT, type PATQuestion } from "./pat-questions";

export type PATTier = "premium" | "strong" | "moderate" | "not-ready";

export interface PATAnswerInput {
  questionId: number;
  // Radio answers arrive as the chosen option index (number or numeric string).
  // Text answers (Q1 age) arrive as a string.
  answer: string | number | null | undefined;
}

export interface PATSubScores {
  qualification: number;
  aptitude: number;
  readiness: number;
}

export interface PATScoreResult {
  subScores: PATSubScores;
  total: number;
  tier: PATTier;
  // Number of questions answered (non-empty). Useful for QA + Sheets visibility.
  answered: number;
  // Number of questions in the bank, for percentage calculations.
  expected: number;
}

const TIER_THRESHOLDS: { tier: PATTier; minTotal: number }[] = [
  { tier: "premium", minTotal: 140 },
  { tier: "strong", minTotal: 120 },
  { tier: "moderate", minTotal: 90 },
  { tier: "not-ready", minTotal: 0 },
];

function pointsForQuestion(q: PATQuestion, answer: PATAnswerInput["answer"]): number {
  if (answer === "" || answer === null || answer === undefined) return 0;

  if (q.scoring.kind === "ageRange") {
    const ageNum = typeof answer === "number" ? answer : parseInt(String(answer), 10);
    if (Number.isFinite(ageNum) && ageNum >= q.scoring.min && ageNum <= q.scoring.max) {
      return q.scoring.inRangePoints;
    }
    return q.scoring.outOfRangePoints;
  }

  // lookup
  const key = String(answer);
  return q.scoring.map[key] ?? 0;
}

export function scoreAnswers(answers: PATAnswerInput[]): PATScoreResult {
  const byId = new Map(PAT_QUESTIONS.map((q) => [q.id, q]));

  let qualification = 0;
  let aptitude = 0;
  let readiness = 0;
  let answered = 0;

  for (const a of answers ?? []) {
    const q = byId.get(a.questionId);
    if (!q) continue; // unknown id - silently ignore so old payloads do not crash
    if (a.answer === "" || a.answer === null || a.answer === undefined) continue;

    answered += 1;
    const pts = pointsForQuestion(q, a.answer);

    if (q.section === "qualification") qualification += pts;
    else if (q.section === "aptitude") aptitude += pts;
    else if (q.section === "readiness") readiness += pts;
  }

  const subScores: PATSubScores = {
    qualification: Math.round(qualification),
    aptitude: Math.round(aptitude),
    readiness: Math.round(readiness),
  };
  const total = subScores.qualification + subScores.aptitude + subScores.readiness;

  return {
    subScores,
    total,
    tier: tierForTotal(total),
    answered,
    expected: PAT_QUESTION_COUNT,
  };
}

export function tierForTotal(total: number): PATTier {
  for (const row of TIER_THRESHOLDS) {
    if (total >= row.minTotal) return row.tier;
  }
  return "not-ready";
}

export interface PATTierCopy {
  label: string;
  headline: string;
  subhead: string;
  description: string;
  rankPercentile: number;
  // Tailwind classes pulled from the canonical brand vocabulary so the
  // result tile stays on-system everywhere it is rendered.
  color: string;
  bgColor: string;
  borderColor: string;
  ctaText: string;
  ctaLink: string;
  nextSteps: string[];
}

const TIER_COPY: Record<PATTier, PATTierCopy> = {
  premium: {
    label: "Premium Tier",
    headline: "You are flight ready.",
    subhead:
      "Your score qualifies you for immediate enrollment. Book your consultation now.",
    description:
      "Premium tier: you are in the top 15% of applicants. Let us map your fastest path to the cockpit.",
    rankPercentile: 15,
    color: "text-gold",
    bgColor: "bg-gold/20",
    borderColor: "border-gold",
    ctaText: "Book a Demo",
    ctaLink: "/demo",
    nextSteps: [
      "Detailed breakdown sent to your email",
      "Our team calls within 24 hours",
    ],
  },
  strong: {
    label: "Strong Tier",
    headline: "You are qualified.",
    subhead:
      "Your score shows strong potential. Let us discuss the right training path for you.",
    description: "",
    rankPercentile: 30,
    color: "text-green-400",
    bgColor: "bg-green-400/20",
    borderColor: "border-green-400",
    ctaText: "Book a Demo",
    ctaLink: "/demo",
    nextSteps: [
      "Email breakdown sent",
      "Consultation call within 48 hours",
    ],
  },
  moderate: {
    label: "Moderate Tier",
    headline: "You have potential.",
    subhead:
      "Your score shows gaps we can address. Book a consultation to explore your options.",
    description: "",
    rankPercentile: 50,
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/20",
    borderColor: "border-yellow-400",
    ctaText: "Book a Demo",
    ctaLink: "/demo",
    nextSteps: [
      "Email analysis sent",
      "Team reaches out within 72 hours",
    ],
  },
  "not-ready": {
    label: "Not Ready Yet",
    headline: "Build your foundation.",
    subhead:
      "Let us work together to strengthen your foundation and prepare you for pilot training.",
    description:
      "Building a strong foundation first will set you up for success. We can help guide you.",
    rankPercentile: 70,
    color: "text-red-400",
    bgColor: "bg-red-400/20",
    borderColor: "border-red-400",
    ctaText: "Book a Demo",
    ctaLink: "/demo",
    nextSteps: [
      "Email analysis sent",
      "Team reaches out within 72 hours",
    ],
  },
};

export function getTierCopy(tier: PATTier): PATTierCopy {
  return TIER_COPY[tier] ?? TIER_COPY.moderate;
}

export const PAT_MAX_TOTAL = 150;
