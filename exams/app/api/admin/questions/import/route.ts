import { createHash } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { requireStaff } from "@/lib/api-guard";
import { getServiceClient } from "@/lib/supabase/server";
import { plainTextToHtml, slugCode, stripHtml } from "@/lib/utils";
import type { ImportResult, ImportRow, Subject, Topic } from "@/lib/types";

export const dynamic = "force-dynamic";

interface ImportBody {
  rows: ImportRow[];
}

function normalize(text: string): string {
  return stripHtml(text).toLowerCase().replace(/\s+/g, " ").trim();
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const guard = await requireStaff();
  if (!guard.ok) return guard.response;

  let body: ImportBody;
  try {
    body = (await request.json()) as ImportBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const rows = Array.isArray(body.rows) ? body.rows : [];
  if (rows.length === 0) {
    return NextResponse.json({ error: "No rows supplied" }, { status: 400 });
  }
  if (rows.length > 500) {
    return NextResponse.json({ error: "Send at most 500 rows per request" }, { status: 400 });
  }

  const supabase = getServiceClient();
  const result: ImportResult = {
    inserted: 0,
    skipped: 0,
    createdSubjects: [],
    createdTopics: [],
    duplicates: 0,
  };

  try {
    // Resolve subjects, creating any that are missing
    const { data: existingSubjects } = await supabase.from("subjects").select("*");
    const subjectByName = new Map<string, Subject>();
    for (const subject of (existingSubjects ?? []) as Subject[]) {
      subjectByName.set(subject.name.trim().toLowerCase(), subject);
    }

    const wantedSubjects = new Set(
      rows.map((row) => row.subject.trim()).filter((name) => name.length > 0)
    );
    const usedCodes = new Set(
      ((existingSubjects ?? []) as Subject[]).map((subject) => subject.code)
    );

    for (const name of wantedSubjects) {
      if (subjectByName.has(name.toLowerCase())) continue;
      let code = slugCode(name);
      let suffix = 1;
      while (usedCodes.has(code)) {
        code = `${slugCode(name).slice(0, 4)}${suffix}`;
        suffix += 1;
      }
      usedCodes.add(code);

      const { data: created, error } = await supabase
        .from("subjects")
        .insert({ name, code, order_index: subjectByName.size + 1 })
        .select()
        .single<Subject>();
      if (error) throw error;
      subjectByName.set(name.toLowerCase(), created);
      result.createdSubjects.push(name);
    }

    // Resolve topics per subject, creating any that are missing
    const { data: existingTopics } = await supabase.from("topics").select("*");
    const topicByKey = new Map<string, Topic>();
    for (const topic of (existingTopics ?? []) as Topic[]) {
      topicByKey.set(`${topic.subject_id}:${topic.name.trim().toLowerCase()}`, topic);
    }

    for (const row of rows) {
      const topicName = row.topic.trim();
      if (!topicName) continue;
      const subject = subjectByName.get(row.subject.trim().toLowerCase());
      if (!subject) continue;
      const key = `${subject.id}:${topicName.toLowerCase()}`;
      if (topicByKey.has(key)) continue;

      const { data: created, error } = await supabase
        .from("topics")
        .insert({ subject_id: subject.id, name: topicName, order_index: 0 })
        .select()
        .single<Topic>();
      if (error) throw error;
      topicByKey.set(key, created);
      result.createdTopics.push(topicName);
    }

    // Duplicate detection against the existing bank
    const hashes = rows.map((row) => normalize(row.question));
    const { data: existingHashes } = await supabase
      .from("questions")
      .select("stem_hash")
      .in(
        "stem_hash",
        hashes.map((value) => hashOf(value))
      );
    const knownHashes = new Set(
      ((existingHashes ?? []) as Array<{ stem_hash: string | null }>)
        .map((entry) => entry.stem_hash)
        .filter((value): value is string => Boolean(value))
    );

    const payload = rows
      .map((row, position) => {
        const subject = subjectByName.get(row.subject.trim().toLowerCase());
        if (!subject) {
          result.skipped += 1;
          return null;
        }
        const topic = row.topic.trim()
          ? topicByKey.get(`${subject.id}:${row.topic.trim().toLowerCase()}`)
          : undefined;

        if (knownHashes.has(hashOf(hashes[position]))) result.duplicates += 1;

        const difficulty = ["easy", "medium", "hard"].includes(row.difficulty.toLowerCase())
          ? row.difficulty.toLowerCase()
          : "medium";

        return {
          subject_id: subject.id,
          topic_id: topic?.id ?? null,
          stem: plainTextToHtml(row.question),
          option_a: row.option_a,
          option_b: row.option_b,
          option_c: row.option_c,
          option_d: row.option_d,
          correct_option: row.correct_option.trim().toUpperCase(),
          explanation: row.explanation || null,
          difficulty,
          status: "active",
          source: "import",
          created_by: guard.session.id,
        };
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

    if (payload.length > 0) {
      const { error, count } = await supabase
        .from("questions")
        .insert(payload, { count: "exact" });
      if (error) throw error;
      result.inserted = count ?? payload.length;
    }

    return NextResponse.json(result);
  } catch (caught) {
    const message = caught instanceof Error ? caught.message : "Import failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * Mirrors the md5 of the normalized stem that the questions trigger stores,
 * so duplicates can be matched before insert.
 */
function hashOf(normalized: string): string {
  return createHash("md5").update(normalized).digest("hex");
}
