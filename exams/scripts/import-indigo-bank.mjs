// Import the IndiGo (JAR ATPL databank) question bank.
//
//   python scripts/parse-indigo-bank.py "INDIGO QUESTION BANK.pdf" indigo-bank.json
//   node scripts/import-indigo-bank.mjs indigo-bank.json            (dry run)
//   node scripts/import-indigo-bank.mjs indigo-bank.json --apply    (writes)
//
// Reads NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from .env.local.
//
// Every row is written with source = 'indigo-jar-qbank', so the set lifts out in
// one statement:
//
//   delete from questions where source = 'indigo-jar-qbank';
//
// The databank keys option (a) on every question. Options are shuffled with a
// seed taken from the question number, so a rerun produces the same letters and
// answers spread across A to D instead of every key being A.
//
// Questions that refer to an annex or figure the PDF does not include are
// imported as draft. They stay out of exams until someone attaches the figure.
// Stems already in the bank (any source) are skipped, as are exact repeats
// inside the databank itself.

import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const SOURCE = "indigo-jar-qbank";

/** JAR subject code to the platform subject it belongs under. */
const SUBJECTS = {
  10: "Air Regulations",
  21: "Technical General",
  22: "Instruments",
  31: "Technical Specific",
  32: "Technical Specific",
  33: "Air Navigation",
  40: "Human Performance",
  50: "Aviation Meteorology",
  61: "Air Navigation",
  62: "Radio Navigation",
  71: "Operational Procedures",
  81: "Technical General",
  91: "Radio Telephony",
  92: "Radio Telephony",
};

/** JAR syllabus area to topic. Existing topic names are reused where they fit. */
const TOPICS = {
  "10.1": "International Agreements and Organisations",
  "10.2": "Airworthiness of Aircraft",
  "10.3": "Nationality and Registration Marks",
  "10.4": "Licensing and documents",
  "10.5": "Rules of the air",
  "10.6": "Instrument Procedures (PANS-OPS)",
  "10.7": "Air Traffic Services",
  "10.8": "Aeronautical Information Service",
  "10.9": "Aerodromes",
  "10.10": "Facilitation",
  "10.11": "Search and Rescue",
  "10.12": "Security",
  "10.13": "Accident Investigation",
  "21.1": "Airframe and systems",
  "21.2": "Electrics",
  "21.3": "Powerplant",
  "21.4": "Emergency Equipment",
  "22.1": "Flight Instruments",
  "22.2": "Autoflight",
  "22.3": "Warnings and Recorders",
  "22.4": "Engine Instruments",
  "31.1": "Mass and balance",
  "31.2": "Mass and balance",
  "31.3": "Mass and balance",
  "32.1": "Performance",
  "32.2": "Performance",
  "32.3": "Performance",
  "33.1": "Flight planning",
  "33.2": "ATS Flight Plan",
  "33.3": "Flight planning",
  "33.4": "Flight planning",
  "33.5": "Flight planning",
  "33.6": "Flight planning",
  "33.7": "Flight planning",
  "40.1": "Human Factors Basics",
  "40.2": "Aviation Physiology",
  "40.3": "Aviation Psychology",
  "50.1": "Atmosphere",
  "50.2": "Winds",
  "50.3": "Humidity",
  "50.4": "Vertical Motion, Clouds",
  "50.5": "Precipitation",
  "50.6": "Air Masses, Fronts and Western Disturbances",
  "50.7": "Winds and pressure systems",
  "50.8": "Climatology",
  "50.9": "Flight Hazards",
  "50.10": "Meteorological Services for Aviation",
  "61.1": "Basics of Navigation",
  "61.2": "Magnetism and compass",
  "61.3": "Charts and projections",
  "61.4": "Dead Reckoning",
  "61.5": "In-flight Navigation",
  "61.6": "INS and IRS",
  "62.1": "Radio Aids",
  "62.2": "Radar Theory",
  "62.5": "RNAV",
  "62.6": "GNSS and GPS",
  "71.1": "General Operating Requirements",
  "71.2": "Special Procedures and Hazards",
  "81.1": "Subsonic Aerodynamics",
  "81.2": "High Speed Aerodynamics",
  "81.3": "High Speed Aerodynamics",
  "81.4": "Stability",
  "81.5": "Flight Controls",
  "81.6": "Limitations",
  "81.7": "Propellers",
  "81.8": "Flight Mechanics",
  "91.1": "VFR Communications",
  "91.2": "VFR Communications",
  "91.3": "VFR Communications",
  "91.4": "VFR Communications",
  "91.5": "Distress and urgency",
  "91.6": "VFR Communications",
  "92.1": "IFR Communications",
  "92.2": "IFR Communications",
  "92.3": "IFR Communications",
  "92.4": "Distress and urgency",
  "92.5": "IFR Communications",
};

const NEW_SUBJECT_CODES = { "Human Performance": "HPL", "Operational Procedures": "OPS" };

const [, , inputPath, flag] = process.argv;
const apply = flag === "--apply";
if (!inputPath) {
  console.error("usage: node scripts/import-indigo-bank.mjs <indigo-bank.json> [--apply]");
  process.exit(1);
}

const env = Object.fromEntries(
  fs
    .readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((line) => line.includes("=") && !line.startsWith("#"))
    .map((line) => [line.slice(0, line.indexOf("=")), line.slice(line.indexOf("=") + 1).replace(/^"|"$/g, "")])
);
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const normalize = (text) =>
  text
    .replace(/<[^>]*>/g, " ")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const escapeHtml = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** mulberry32, seeded per question so the shuffle is stable across runs. */
function shuffled(items, seed) {
  let state = seed >>> 0;
  const random = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

async function fetchAll(table, columns) {
  let rows = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase.from(table).select(columns).range(from, from + 999);
    if (error) throw error;
    rows = rows.concat(data);
    if (data.length < 1000) return rows;
  }
}

const bank = JSON.parse(fs.readFileSync(inputPath, "utf8"));

const unmapped = bank.filter((q) => !SUBJECTS[q.subject] || !TOPICS[q.area]);
if (unmapped.length > 0) {
  console.error("unmapped areas:", [...new Set(unmapped.map((q) => q.area))]);
  process.exit(1);
}

const subjects = await fetchAll("subjects", "id, name, code, order_index");
const topics = await fetchAll("topics", "id, name, subject_id");
const existingStems = new Set((await fetchAll("questions", "stem")).map((q) => normalize(q.stem)));

const subjectByName = new Map(subjects.map((s) => [s.name.toLowerCase(), s]));
const topicByKey = new Map(topics.map((t) => [`${t.subject_id}:${t.name.toLowerCase()}`, t]));

// Subjects
const createdSubjects = [];
let nextOrder = Math.max(0, ...subjects.map((s) => s.order_index)) + 1;
for (const name of new Set(Object.values(SUBJECTS))) {
  if (subjectByName.has(name.toLowerCase())) continue;
  createdSubjects.push(name);
  if (!apply) {
    subjectByName.set(name.toLowerCase(), { id: `new:${name}`, name });
    continue;
  }
  const { data, error } = await supabase
    .from("subjects")
    .insert({ name, code: NEW_SUBJECT_CODES[name], order_index: nextOrder++ })
    .select()
    .single();
  if (error) throw error;
  subjectByName.set(name.toLowerCase(), data);
}

// Topics
const createdTopics = [];
for (const area of new Set(bank.map((q) => q.area))) {
  const subject = subjectByName.get(SUBJECTS[area.split(".")[0]].toLowerCase());
  const name = TOPICS[area];
  const key = `${subject.id}:${name.toLowerCase()}`;
  if (topicByKey.has(key)) continue;
  createdTopics.push(`${subject.name} / ${name}`);
  if (!apply) {
    topicByKey.set(key, { id: `new:${key}` });
    continue;
  }
  const { data, error } = await supabase
    .from("topics")
    .insert({ subject_id: subject.id, name, order_index: 0 })
    .select()
    .single();
  if (error) throw error;
  topicByKey.set(key, data);
}

// Questions
const seen = new Set();
const rows = [];
let duplicateOfBank = 0;
let duplicateInside = 0;
for (const q of bank) {
  const stemKey = normalize(q.stem);
  if (existingStems.has(stemKey)) {
    duplicateOfBank += 1;
    continue;
  }
  const fullKey = `${stemKey}|${q.options.map(normalize).join("|")}`;
  if (seen.has(fullKey)) {
    duplicateInside += 1;
    continue;
  }
  seen.add(fullKey);

  const subject = subjectByName.get(SUBJECTS[q.subject].toLowerCase());
  const topic = topicByKey.get(`${subject.id}:${TOPICS[q.area].toLowerCase()}`);
  const order = shuffled([0, 1, 2, 3], q.number * 2654435761);
  const options = order.map((index) => q.options[index]);

  rows.push({
    subject_id: subject.id,
    topic_id: topic.id,
    stem: `<p>${escapeHtml(q.stem)}</p>`,
    option_a: options[0],
    option_b: options[1],
    option_c: options[2],
    option_d: options[3],
    correct_option: "ABCD"[order.indexOf(q.correct)],
    explanation: null,
    difficulty: "medium",
    status: q.needs_figure ? "draft" : "active",
    source: SOURCE,
    _label: `${SUBJECTS[q.subject]} / ${TOPICS[q.area]}`,
  });
}

const tally = (key) => rows.reduce((acc, row) => ((acc[row[key]] = (acc[row[key]] ?? 0) + 1), acc), {});
console.log(apply ? "APPLY" : "DRY RUN");
console.log("parsed", bank.length);
console.log("skipped, already in bank", duplicateOfBank);
console.log("skipped, repeated inside databank", duplicateInside);
console.log("to insert", rows.length, tally("status"));
console.log("correct letter spread", tally("correct_option"));
console.log("new subjects", createdSubjects);
console.log("new topics", createdTopics.length, createdTopics);
console.log("by subject / topic", tally("_label"));

if (apply) {
  let inserted = 0;
  for (let i = 0; i < rows.length; i += 500) {
    const batch = rows.slice(i, i + 500).map(({ _label, ...row }) => row);
    const { error } = await supabase.from("questions").insert(batch);
    if (error) throw new Error(`batch at ${i}: ${error.message}`);
    inserted += batch.length;
    console.log("inserted", inserted);
  }
}
