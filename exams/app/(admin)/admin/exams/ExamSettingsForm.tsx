"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { getBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Checkbox, Input, Select, Textarea } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { errorMessage } from "@/lib/utils";
import type { Exam, ExamType } from "@/lib/types";

interface SettingsState {
  title: string;
  description: string;
  type: ExamType;
  duration_minutes: number;
  marks_per_question: number;
  negative_marks: number;
  max_attempts: number;
  shuffle_questions: boolean;
  shuffle_options: boolean;
  show_result_immediately: boolean;
  allow_review: boolean;
  show_leaderboard: boolean;
  opens_at: string;
  closes_at: string;
}

/** Postgres timestamptz to the value shape a datetime-local input wants. */
function toLocalInput(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function fromLocalInput(value: string): string | null {
  return value ? new Date(value).toISOString() : null;
}

export function ExamSettingsForm({ exam }: { exam: Exam | null }) {
  const router = useRouter();
  const supabase = useMemo(() => getBrowserClient(), []);
  const toast = useToast();

  const [form, setForm] = useState<SettingsState>({
    title: exam?.title ?? "",
    description: exam?.description ?? "",
    type: exam?.type ?? "mock",
    duration_minutes: exam?.duration_minutes ?? 60,
    marks_per_question: exam?.marks_per_question ?? 1,
    negative_marks: exam?.negative_marks ?? 0,
    max_attempts: exam?.max_attempts ?? 1,
    shuffle_questions: exam?.shuffle_questions ?? true,
    shuffle_options: exam?.shuffle_options ?? false,
    show_result_immediately: exam?.show_result_immediately ?? true,
    allow_review: exam?.allow_review ?? true,
    show_leaderboard: exam?.show_leaderboard ?? true,
    opens_at: toLocalInput(exam?.opens_at ?? null),
    closes_at: toLocalInput(exam?.closes_at ?? null),
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof SettingsState>(key: K, value: SettingsState[K]): void {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function save(): Promise<void> {
    if (!form.title.trim()) {
      setError("Give the exam a title");
      return;
    }
    if (form.opens_at && form.closes_at && new Date(form.opens_at) >= new Date(form.closes_at)) {
      setError("The close time must be after the open time");
      return;
    }
    setError(null);
    setSaving(true);

    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      type: form.type,
      duration_minutes: form.duration_minutes,
      marks_per_question: form.marks_per_question,
      negative_marks: form.negative_marks,
      max_attempts: form.max_attempts,
      shuffle_questions: form.shuffle_questions,
      shuffle_options: form.shuffle_options,
      show_result_immediately: form.show_result_immediately,
      allow_review: form.allow_review,
      show_leaderboard: form.show_leaderboard,
      opens_at: fromLocalInput(form.opens_at),
      closes_at: fromLocalInput(form.closes_at),
    };

    try {
      if (exam) {
        const { error: updateError } = await supabase
          .from("exams")
          .update(payload)
          .eq("id", exam.id);
        if (updateError) throw updateError;
        toast.success("Settings saved");
        router.refresh();
      } else {
        const { data: userData } = await supabase.auth.getUser();
        const { data: created, error: insertError } = await supabase
          .from("exams")
          .insert({ ...payload, status: "draft", created_by: userData.user?.id ?? null })
          .select("id")
          .single<{ id: string }>();
        if (insertError) throw insertError;
        toast.success("Exam created. Now add questions.");
        router.push(`/admin/exams/${created.id}`);
        router.refresh();
      }
    } catch (caught) {
      setError(errorMessage(caught, "Could not save the exam"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader title="Exam settings" />

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <Input
            label="Title"
            value={form.title}
            onChange={(event) => set("title", event.target.value)}
            placeholder="Air Navigation Mock Test 1"
          />
        </div>

        <div className="lg:col-span-2">
          <Textarea
            label="Description"
            value={form.description}
            onChange={(event) => set("description", event.target.value)}
            placeholder="Shown to students on the instructions screen"
            rows={2}
          />
        </div>

        <Select
          label="Type"
          value={form.type}
          onChange={(event) => set("type", event.target.value as ExamType)}
        >
          <option value="mock">Mock</option>
          <option value="assignment">Assignment</option>
          <option value="practice">Practice</option>
        </Select>

        <Input
          label="Duration (minutes)"
          type="number"
          min={1}
          value={form.duration_minutes}
          onChange={(event) => set("duration_minutes", Number(event.target.value))}
        />

        <Input
          label="Marks per question"
          type="number"
          min={0}
          step="0.25"
          value={form.marks_per_question}
          onChange={(event) => set("marks_per_question", Number(event.target.value))}
        />

        <Input
          label="Negative marks per wrong answer"
          type="number"
          min={0}
          step="0.25"
          value={form.negative_marks}
          onChange={(event) => set("negative_marks", Number(event.target.value))}
          hint="Set 0 for no negative marking"
        />

        <Input
          label="Maximum attempts"
          type="number"
          min={1}
          value={form.max_attempts}
          onChange={(event) => set("max_attempts", Number(event.target.value))}
        />

        <div />

        <Input
          label="Opens at"
          type="datetime-local"
          value={form.opens_at}
          onChange={(event) => set("opens_at", event.target.value)}
          hint="Leave empty to open as soon as it is published"
        />

        <Input
          label="Closes at"
          type="datetime-local"
          value={form.closes_at}
          onChange={(event) => set("closes_at", event.target.value)}
          hint="Leave empty for no close time"
        />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Checkbox
          label="Shuffle questions"
          description="Each student sees a different question order"
          checked={form.shuffle_questions}
          onChange={(event) => set("shuffle_questions", event.target.checked)}
        />
        <Checkbox
          label="Shuffle options"
          description="Option order varies per student, scoring is unaffected"
          checked={form.shuffle_options}
          onChange={(event) => set("shuffle_options", event.target.checked)}
        />
        <Checkbox
          label="Show result immediately"
          description="Send the student to their result page on submit"
          checked={form.show_result_immediately}
          onChange={(event) => set("show_result_immediately", event.target.checked)}
        />
        <Checkbox
          label="Allow review"
          description="Students can see correct answers and explanations after submitting"
          checked={form.allow_review}
          onChange={(event) => set("allow_review", event.target.checked)}
        />
        <Checkbox
          label="Show batch leaderboard"
          description="Students see how their batch scored on this exam"
          checked={form.show_leaderboard}
          onChange={(event) => set("show_leaderboard", event.target.checked)}
        />
      </div>

      {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}

      <div className="mt-5">
        <Button onClick={save} loading={saving}>
          <Save className="h-4 w-4" />
          {exam ? "Save settings" : "Create exam"}
        </Button>
      </div>
    </Card>
  );
}
