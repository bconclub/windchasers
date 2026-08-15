// Seeds a demo environment: topics, a question bank, a batch, students and a
// published exam ready to sit. Idempotent, safe to run repeatedly.
//
//   node scripts/seed-demo.mjs            seed everything
//   node scripts/seed-demo.mjs --purge    remove demo data first, then seed
//
// Reads .env.local from the app root. Uses the service role key, so it must
// only ever be run locally or on the VPS, never shipped to a browser.

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { BANK } from "./demo-questions.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

for (const line of readFileSync(resolve(root, ".env.local"), "utf8").split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
  const index = trimmed.indexOf("=");
  const key = trimmed.slice(0, index).trim();
  if (!process.env[key]) process.env[key] = trimmed.slice(index + 1).trim();
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const db = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const SOURCE = "demo-seed";
const BATCH_CODE = "DEMO-2026-A";
const LETTERS = ["A", "B", "C", "D"];

const STUDENTS = [
  { name: "Aarav Menon", email: "aarav.demo@windchasers.in" },
  { name: "Isha Rathore", email: "isha.demo@windchasers.in" },
  { name: "Kabir Sethi", email: "kabir.demo@windchasers.in" },
  { name: "Meera Nair", email: "meera.demo@windchasers.in" },
  { name: "Rohan Iyer", email: "rohan.demo@windchasers.in" },
];
const STUDENT_PASSWORD = "DemoStudent#2026";

/** Deterministic shuffle so a rerun produces the same paper. */
function seededShuffle(items, seed) {
  const out = [...items];
  let state = seed;
  for (let i = out.length - 1; i > 0; i -= 1) {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    const j = state % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function fail(step, error) {
  if (!error) return;
  console.error(`\n${step} failed:`, error.message ?? error);
  process.exit(1);
}

async function purge() {
  console.log("Purging previous demo data");
  const { data: exams } = await db.from("exams").select("id").eq("description", SOURCE);
  for (const exam of exams ?? []) await db.from("exams").delete().eq("id", exam.id);
  await db.from("questions").delete().eq("source", SOURCE);
  const { data: batch } = await db.from("batches").select("id").eq("code", BATCH_CODE).maybeSingle();
  if (batch) await db.from("batches").delete().eq("id", batch.id);
  const { data: list } = await db.auth.admin.listUsers({ perPage: 200 });
  for (const user of list?.users ?? []) {
    if (STUDENTS.some((s) => s.email === user.email)) await db.auth.admin.deleteUser(user.id);
  }
  console.log("  purged\n");
}

async function seedTopicsAndQuestions() {
  const { data: subjects, error } = await db.from("subjects").select("id, code, name");
  fail("Loading subjects", error);
  const byCode = new Map(subjects.map((s) => [s.code, s]));

  let topicCount = 0;
  let questionCount = 0;
  let seed = 7;

  for (const [code, topics] of Object.entries(BANK)) {
    const subject = byCode.get(code);
    if (!subject) {
      console.warn(`  subject ${code} not found, skipping`);
      continue;
    }

    let orderIndex = 0;
    for (const [topicName, rows] of Object.entries(topics)) {
      orderIndex += 1;
      const { data: topic, error: topicError } = await db
        .from("topics")
        .upsert(
          { subject_id: subject.id, name: topicName, order_index: orderIndex },
          { onConflict: "subject_id,name" }
        )
        .select("id")
        .single();
      fail(`Upserting topic ${topicName}`, topicError);
      topicCount += 1;

      const payload = rows.map(([stem, difficulty, correct, w1, w2, w3, explanation]) => {
        seed += 1;
        const options = seededShuffle([correct, w1, w2, w3], seed);
        const correctIndex = options.indexOf(correct);
        return {
          subject_id: subject.id,
          topic_id: topic.id,
          stem: `<p>${stem}</p>`,
          option_a: options[0],
          option_b: options[1],
          option_c: options[2],
          option_d: options[3],
          correct_option: LETTERS[correctIndex],
          explanation,
          difficulty,
          status: "active",
          source: SOURCE,
        };
      });

      const { error: insertError } = await db.from("questions").insert(payload);
      // A rerun without --purge hits the stem hash trigger, which is fine.
      if (insertError && !/duplicate|unique/i.test(insertError.message)) {
        fail(`Inserting questions for ${topicName}`, insertError);
      }
      questionCount += payload.length;
    }
  }
  console.log(`  topics: ${topicCount}, questions: ${questionCount}`);
}

async function seedBatchAndStudents() {
  const { data: batch, error } = await db
    .from("batches")
    .upsert(
      {
        name: "Demo Batch 2026 A",
        code: BATCH_CODE,
        start_date: "2026-08-01",
        is_active: true,
      },
      { onConflict: "code" }
    )
    .select("id")
    .single();
  fail("Upserting batch", error);

  const { data: existing } = await db.auth.admin.listUsers({ perPage: 200 });
  const byEmail = new Map((existing?.users ?? []).map((u) => [u.email, u]));

  const ids = [];
  for (const student of STUDENTS) {
    let user = byEmail.get(student.email);
    if (!user) {
      const { data, error: createError } = await db.auth.admin.createUser({
        email: student.email,
        password: STUDENT_PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: student.name },
      });
      fail(`Creating ${student.email}`, createError);
      user = data.user;
    }
    ids.push(user.id);
    await db
      .from("profiles")
      .update({ full_name: student.name, role: "student", is_active: true })
      .eq("id", user.id);
    await db
      .from("batch_enrollments")
      .upsert({ batch_id: batch.id, student_id: user.id }, { onConflict: "batch_id,student_id" });
  }

  console.log(`  batch ${BATCH_CODE} with ${ids.length} students`);
  return { batchId: batch.id, studentIds: ids };
}

async function seedExam(batchId) {
  const { data: subjects } = await db.from("subjects").select("id, code");
  const byCode = new Map(subjects.map((s) => [s.code, s.id]));

  const { data: existing } = await db
    .from("exams")
    .select("id")
    .eq("title", "DGCA Mock Test 1")
    .maybeSingle();
  if (existing) await db.from("exams").delete().eq("id", existing.id);

  const opens = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const closes = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  const { data: exam, error } = await db
    .from("exams")
    .insert({
      title: "DGCA Mock Test 1",
      description: SOURCE,
      type: "mock",
      duration_minutes: 30,
      marks_per_question: 1,
      negative_marks: 0.25,
      total_marks: 20,
      shuffle_questions: true,
      shuffle_options: false,
      show_result_immediately: true,
      allow_review: true,
      show_leaderboard: true,
      max_attempts: 2,
      opens_at: opens,
      closes_at: closes,
      status: "published",
    })
    .select("id")
    .single();
  fail("Creating exam", error);

  const rules = [
    { code: "NAV", count: 6 },
    { code: "MET", count: 6 },
    { code: "REG", count: 4 },
    { code: "RTR", count: 4 },
  ];
  for (const rule of rules) {
    const { error: ruleError } = await db.from("exam_rules").insert({
      exam_id: exam.id,
      subject_id: byCode.get(rule.code),
      question_count: rule.count,
    });
    fail(`Adding rule ${rule.code}`, ruleError);
  }

  const { error: assignError } = await db
    .from("exam_assignments")
    .insert({ exam_id: exam.id, batch_id: batchId });
  fail("Assigning exam", assignError);

  // Draw the paper from the rules. start_attempt refuses an exam with no rows
  // in exam_questions and does not generate them itself, so the draw happens
  // here. Migration 0003 fixes the function to generate on demand.
  let orderIndex = 0;
  for (const rule of rules) {
    const { data: pool, error: poolError } = await db
      .from("questions")
      .select("id")
      .eq("subject_id", byCode.get(rule.code))
      .eq("status", "active");
    fail(`Drawing pool for ${rule.code}`, poolError);

    if (pool.length < rule.count) {
      console.warn(`  rule ${rule.code} wants ${rule.count} but only ${pool.length} available`);
    }
    const picked = seededShuffle(pool, rule.count * 31 + 7).slice(0, rule.count);
    for (const question of picked) {
      orderIndex += 1;
      const { error: linkError } = await db
        .from("exam_questions")
        .insert({ exam_id: exam.id, question_id: question.id, order_index: orderIndex });
      fail(`Linking question for ${rule.code}`, linkError);
    }
  }

  await db.from("exams").update({ total_marks: orderIndex }).eq("id", exam.id);

  console.log(`  exam "DGCA Mock Test 1" published, ${orderIndex} questions drawn, assigned to the batch`);
  return exam.id;
}

const shouldPurge = process.argv.includes("--purge");

console.log("Seeding demo data\n");
if (shouldPurge) await purge();
await seedTopicsAndQuestions();
const { batchId } = await seedBatchAndStudents();
await seedExam(batchId);

console.log("\nDone.");
console.log(`Student logins: ${STUDENTS.map((s) => s.email).join(", ")}`);
console.log(`Student password: ${STUDENT_PASSWORD}`);
