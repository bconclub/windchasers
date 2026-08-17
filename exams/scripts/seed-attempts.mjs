// Produces realistic attempt history so the admin analytics, leaderboard and
// batch reporting have something to show in a walkthrough.
//
//   node scripts/seed-attempts.mjs
//
// Every attempt goes through the real RPCs, start_attempt, save_answer and
// submit_attempt, so scores here are computed by the same server side path a
// student hits. Nothing is written directly into attempts or attempt_answers.
//
// One student is deliberately left without an attempt so the exam can be sat
// live during a demo.

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
for (const line of readFileSync(resolve(root, ".env.local"), "utf8").split(/\r?\n/)) {
  const t = line.trim();
  if (!t || t.startsWith("#") || !t.includes("=")) continue;
  const i = t.indexOf("=");
  if (!process.env[t.slice(0, i).trim()]) process.env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const admin = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const PASSWORD = "DemoStudent#2026";
// Ability is the chance of answering a given question correctly. Spread so the
// leaderboard and the score distribution both have shape.
const SITTERS = [
  { email: "isha.demo@windchasers.in", ability: 0.85, skip: 0.05 },
  { email: "kabir.demo@windchasers.in", ability: 0.55, skip: 0.15 },
  { email: "meera.demo@windchasers.in", ability: 0.7, skip: 0.1 },
  { email: "rohan.demo@windchasers.in", ability: 0.4, skip: 0.25 },
];
// aarav is left out on purpose, so the exam can be sat live in front of an audience.

let seed = 20260815;
/** Deterministic pseudo random, so a rerun reproduces the same cohort. */
function rand() {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return seed / 0x7fffffff;
}

const NEXT = { A: "B", B: "C", C: "D", D: "A" };

const { data: exam } = await admin
  .from("exams")
  .select("id, title")
  .eq("title", "DGCA Mock Test 1")
  .single();
if (!exam) {
  console.error("Exam not found. Run seed-demo.mjs first.");
  process.exit(1);
}

const { data: key } = await admin.from("questions").select("id, correct_option");
const answerKey = new Map(key.map((q) => [q.id, q.correct_option]));

console.log(`Seeding attempts for "${exam.title}"\n`);

for (const sitter of SITTERS) {
  const client = createClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });

  const { error: signInError } = await client.auth.signInWithPassword({
    email: sitter.email,
    password: PASSWORD,
  });
  if (signInError) {
    console.error(`  ${sitter.email}: sign in failed, ${signInError.message}`);
    continue;
  }

  const { data: started, error: startError } = await client.rpc("start_attempt", {
    p_exam_id: exam.id,
  });
  if (startError) {
    console.log(`  ${sitter.email}: ${startError.message}`);
    continue;
  }

  let answered = 0;
  for (const question of started.questions) {
    if (rand() < sitter.skip) continue;
    const correct = answerKey.get(question.id);
    const pick = rand() < sitter.ability ? correct : NEXT[correct];
    const { error } = await client.rpc("save_answer", {
      p_attempt_id: started.attempt.id,
      p_question_id: question.id,
      p_selected_option: pick,
      p_marked_for_review: rand() < 0.1,
      p_time_spent_seconds: Math.round(20 + rand() * 70),
    });
    if (error) {
      console.error(`  save_answer failed: ${error.message}`);
      break;
    }
    answered += 1;
  }

  // A couple of the cohort glance away from the tab, which is what the
  // integrity counter is for.
  if (rand() < 0.5) {
    await client.rpc("record_tab_switch", { p_attempt_id: started.attempt.id });
  }

  const { data: result, error: submitError } = await client.rpc("submit_attempt", {
    p_attempt_id: started.attempt.id,
  });
  if (submitError) {
    console.error(`  submit failed: ${submitError.message}`);
    continue;
  }

  console.log(
    `  ${sitter.email.padEnd(30)} score ${String(result.score).padStart(5)}  ` +
      `${result.correct_count} right, ${result.incorrect_count} wrong, ${result.unattempted_count} blank`
  );
}

console.log("\naarav.demo@windchasers.in left without an attempt, for the live walkthrough.");
