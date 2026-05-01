// PAT (Pilot Aptitude Test) question bank.
//
// AUDIT NOTE - 21 to 20 question reduction:
//   Marketing copy promised "20 questions" but the original bank held 21.
//   Q15 ("Aviation is a field that ___ precision") was dropped.
//   Reasons:
//     1. Audit flagged a duplicate option in Q15 ("require" listed twice).
//     2. Q15 tested subject-verb agreement, the same skill already covered by Q14
//        ("The pilot and the co-pilot were ready"). The two questions were
//        substantially redundant; Q14 is the cleaner test (compound subject).
//     3. Q16 ("Which sentence shows proper aviation communication") covers the
//        domain-specific communication aptitude that Q15 did not, so dropping
//        Q15 leaves the Communication subsection meaningfully balanced.
//   The 10-point Communication budget that previously split 3.33 / 3.33 / 3.34
//   across Q14 / Q15 / Q16 now splits 5 / 5 across Q14 / Q16. Total scoring
//   weight is preserved (50 aptitude / 50 qualification / 50 readiness = 150).
//
// Question IDs are stable. Q15 is intentionally absent from this list.
// Do not renumber - downstream Sheets / PROXe consumers key off id.

export type QuestionType = "text" | "radio";
export type SectionId = "qualification" | "aptitude" | "readiness";

export type ScoringRule =
  | { kind: "lookup"; map: Record<string, number> }
  | { kind: "ageRange"; inRangePoints: number; outOfRangePoints: number; min: number; max: number };

export interface PATQuestion {
  id: number;
  question: string;
  type: QuestionType;
  options?: string[];
  section: SectionId;
  scoring: ScoringRule;
}

export const PAT_QUESTIONS: PATQuestion[] = [
  // SECTION 1: QUALIFICATION (50 points)
  {
    id: 1,
    question: "Please enter your age",
    type: "text",
    section: "qualification",
    scoring: { kind: "ageRange", inRangePoints: 10, outOfRangePoints: 5, min: 17, max: 30 },
  },
  {
    id: 2,
    question: "What is your current educational status?",
    type: "radio",
    options: [
      "Completed 12th/+2 with Physics, Chemistry, Mathematics",
      "Completed 12th/+2 with Biology, Commerce or Arts",
      "Currently in 12th/+2 with PCM",
      "Below 12th standard",
    ],
    section: "qualification",
    // Note: the eligibility gate blocks "Below 12th" before this question is
    // ever shown. The 0-point row is kept for defensive scoring only.
    scoring: { kind: "lookup", map: { "0": 15, "1": 8, "2": 12, "3": 0 } },
  },
  {
    id: 3,
    question: "What percentage did you score in 12th Physics?",
    type: "radio",
    options: ["Above 60%", "50 to 60%", "Below 50%", "Have not appeared yet"],
    section: "qualification",
    scoring: { kind: "lookup", map: { "0": 12.5, "1": 8, "2": 4, "3": 6 } },
  },
  {
    id: 4,
    question: "What percentage did you score in 12th Mathematics?",
    type: "radio",
    options: ["Above 60%", "50 to 60%", "Below 50%", "Have not appeared yet"],
    section: "qualification",
    scoring: { kind: "lookup", map: { "0": 12.5, "1": 8, "2": 4, "3": 6 } },
  },

  // SECTION 2: APTITUDE (50 points)
  // Aviation IQ subsection (15 pts: 5 Qs at 3 pts each)
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
    scoring: { kind: "lookup", map: { "0": 3, "1": 0, "2": 0, "3": 0 } },
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
    scoring: { kind: "lookup", map: { "0": 3, "1": 0, "2": 0, "3": 0 } },
  },
  {
    id: 7,
    question: "What creates lift in an aircraft?",
    type: "radio",
    options: [
      "The engine pushing the plane forward",
      "Air moving faster over the wing's top surface",
      "The pilot pulling up on controls",
      "Hot air rising from the ground",
    ],
    section: "aptitude",
    scoring: { kind: "lookup", map: { "0": 0, "1": 3, "2": 0, "3": 0 } },
  },
  {
    id: 8,
    question: "Which organization regulates civil aviation in India?",
    type: "radio",
    options: ["ISRO", "DRDO", "DGCA", "AAI"],
    section: "aptitude",
    scoring: { kind: "lookup", map: { "0": 0, "1": 0, "2": 3, "3": 0 } },
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
    scoring: { kind: "lookup", map: { "0": 0, "1": 3, "2": 0, "3": 0 } },
  },

  // Math Aptitude subsection (15 pts: 4 Qs at 3.75 pts each)
  {
    id: 10,
    question: "If an aircraft travels at 600 km per hour, how far will it travel in 2.5 hours?",
    type: "radio",
    options: ["1200 km", "1500 km", "1800 km", "2100 km"],
    section: "aptitude",
    scoring: { kind: "lookup", map: { "0": 0, "1": 3.75, "2": 0, "3": 0 } },
  },
  {
    id: 11,
    question: "What is 15% of 1200?",
    type: "radio",
    options: ["150", "180", "200", "240"],
    section: "aptitude",
    scoring: { kind: "lookup", map: { "0": 0, "1": 3.75, "2": 0, "3": 0 } },
  },
  {
    id: 12,
    question: "Convert 180 minutes into hours",
    type: "radio",
    options: ["2 hours", "2.5 hours", "3 hours", "3.5 hours"],
    section: "aptitude",
    scoring: { kind: "lookup", map: { "0": 0, "1": 0, "2": 3.75, "3": 0 } },
  },
  {
    id: 13,
    question: "A triangle has angles of 70 degrees and 40 degrees. What is the third angle?",
    type: "radio",
    options: ["60 degrees", "70 degrees", "80 degrees", "90 degrees"],
    section: "aptitude",
    scoring: { kind: "lookup", map: { "0": 0, "1": 3.75, "2": 0, "3": 0 } },
  },

  // Communication Skills subsection (10 pts: 2 Qs at 5 pts each)
  // Q15 was dropped (see audit note at top of file). Weights redistributed
  // from 3.33 / 3.33 / 3.34 across three questions to 5 / 5 across two.
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
    scoring: { kind: "lookup", map: { "0": 0, "1": 5, "2": 0, "3": 0 } },
  },
  // (Q15 intentionally removed)
  {
    id: 16,
    question: "Which sentence shows proper aviation communication?",
    type: "radio",
    options: [
      "Hey, we are going to land now",
      "Flight 123 requesting permission to land",
      "Can we land the plane please?",
      "We want to come down now",
    ],
    section: "aptitude",
    scoring: { kind: "lookup", map: { "0": 0, "1": 5, "2": 0, "3": 0 } },
  },

  // Decision Making subsection (10 pts: 2 Qs at 5 pts each)
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
    scoring: { kind: "lookup", map: { "0": 5, "1": 3, "2": 0, "3": 1 } },
  },
  {
    id: 18,
    question: "If you make a mistake during an important task, what do you do?",
    type: "radio",
    options: [
      "Immediately acknowledge and correct it",
      "Try to fix it quietly without telling anyone",
      "Hope nobody notices",
      "Blame external factors",
    ],
    section: "aptitude",
    scoring: { kind: "lookup", map: { "0": 5, "1": 2, "2": 0, "3": 0 } },
  },

  // SECTION 3: READINESS (50 points)
  {
    id: 19,
    question: "Pilot training costs Rs. 60 to 80 lakhs. How prepared are you financially?",
    type: "radio",
    options: [
      "Fully arranged or family can afford",
      "50% arranged, exploring education loans",
      "Starting to research funding options",
      "Not sure about the costs involved",
    ],
    section: "readiness",
    scoring: { kind: "lookup", map: { "0": 20, "1": 15, "2": 10, "3": 5 } },
  },
  {
    id: 20,
    question: "When do you plan to start pilot training?",
    type: "radio",
    options: [
      "Within 3 months",
      "3 to 6 months",
      "6 to 12 months",
      "Just exploring options",
    ],
    section: "readiness",
    scoring: { kind: "lookup", map: { "0": 15, "1": 12, "2": 8, "3": 4 } },
  },
  {
    id: 21,
    question: "How much research have you done about pilot careers?",
    type: "radio",
    options: [
      "Extensively researched requirements and career paths",
      "Good research on the basics",
      "Some research, learning more",
      "This is my first time learning about it",
    ],
    section: "readiness",
    scoring: { kind: "lookup", map: { "0": 15, "1": 12, "2": 8, "3": 4 } },
  },
];

export const PAT_QUESTION_COUNT = PAT_QUESTIONS.length; // 20

// Section header copy shown between groups of questions.
// Keys are the index AFTER which the header should appear.
export const PAT_SECTION_HEADERS: { afterIndex: number; title: string }[] = [
  { afterIndex: 3, title: "Time to show your aviation IQ" },
  { afterIndex: 8, title: "Crunch those numbers like a captain" },
  { afterIndex: 12, title: "Clear communication, safe flights" },
  { afterIndex: 14, title: "Cool under pressure? Prove it" },
  { afterIndex: 16, title: "Ready to fly with your dreams?" },
];
