"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ImagePlus, Save, Trash2, X } from "lucide-react";
import { getBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { Card, CardHeader } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { errorMessage } from "@/lib/utils";
import {
  OPTION_LETTERS,
  type OptionLetter,
  type Question,
  type QuestionDifficulty,
  type QuestionStatus,
  type Subject,
  type Topic,
} from "@/lib/types";

interface FormState {
  subject_id: string;
  topic_id: string;
  stem: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: OptionLetter;
  explanation: string;
  difficulty: QuestionDifficulty;
  image_url: string;
  source: string;
  status: QuestionStatus;
}

function initialState(question: Question | null, subjects: Subject[]): FormState {
  return {
    subject_id: question?.subject_id ?? subjects[0]?.id ?? "",
    topic_id: question?.topic_id ?? "",
    stem: question?.stem ?? "",
    option_a: question?.option_a ?? "",
    option_b: question?.option_b ?? "",
    option_c: question?.option_c ?? "",
    option_d: question?.option_d ?? "",
    correct_option: question?.correct_option ?? "A",
    explanation: question?.explanation ?? "",
    difficulty: question?.difficulty ?? "medium",
    image_url: question?.image_url ?? "",
    source: question?.source ?? "",
    status: question?.status ?? "active",
  };
}

export function QuestionForm({
  question,
  subjects,
  topics,
}: {
  question: Question | null;
  subjects: Subject[];
  topics: Topic[];
}) {
  const router = useRouter();
  const supabase = useMemo(() => getBrowserClient(), []);
  const toast = useToast();

  const [form, setForm] = useState<FormState>(() => initialState(question, subjects));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const subjectTopics = topics.filter((topic) => topic.subject_id === form.subject_id);

  function set<K extends keyof FormState>(key: K, value: FormState[K]): void {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!form.subject_id) next.subject_id = "Pick a subject";
    if (!form.stem.trim()) next.stem = "The question text is required";
    for (const letter of OPTION_LETTERS) {
      const key = `option_${letter.toLowerCase()}` as keyof FormState;
      if (!String(form[key]).trim()) next[key] = `Option ${letter} is required`;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleUpload(file: File): Promise<void> {
    setUploading(true);
    try {
      const extension = file.name.split(".").pop() ?? "png";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;
      const { error: uploadError } = await supabase.storage
        .from("question-images")
        .upload(path, file, { cacheControl: "31536000", upsert: false });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("question-images").getPublicUrl(path);
      set("image_url", data.publicUrl);
      toast.success("Image uploaded");
    } catch (caught) {
      toast.error(errorMessage(caught, "Upload failed"));
    } finally {
      setUploading(false);
    }
  }

  async function handleSave(): Promise<void> {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        subject_id: form.subject_id,
        topic_id: form.topic_id || null,
        stem: form.stem,
        option_a: form.option_a,
        option_b: form.option_b,
        option_c: form.option_c,
        option_d: form.option_d,
        correct_option: form.correct_option,
        explanation: form.explanation || null,
        difficulty: form.difficulty,
        image_url: form.image_url || null,
        source: form.source || null,
        status: form.status,
      };

      if (question) {
        const { error } = await supabase.from("questions").update(payload).eq("id", question.id);
        if (error) throw error;
        toast.success("Question saved");
      } else {
        const { data: userData } = await supabase.auth.getUser();
        const { error } = await supabase
          .from("questions")
          .insert({ ...payload, created_by: userData.user?.id ?? null });
        if (error) throw error;
        toast.success("Question created");
      }
      router.push("/admin/questions");
      router.refresh();
    } catch (caught) {
      toast.error(errorMessage(caught, "Could not save the question"));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(): Promise<void> {
    if (!question) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("questions").delete().eq("id", question.id);
      if (error) throw error;
      toast.success("Question deleted");
      router.push("/admin/questions");
      router.refresh();
    } catch (caught) {
      toast.error(errorMessage(caught, "Could not delete the question"));
      setSaving(false);
      setConfirmDelete(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader title="Question" />
          <RichTextEditor
            value={form.stem}
            onChange={(html) => set("stem", html)}
            placeholder="Type the question stem"
            error={errors.stem}
            minHeight="10rem"
          />

          <div className="mt-5 space-y-3">
            {OPTION_LETTERS.map((letter) => {
              const key = `option_${letter.toLowerCase()}` as keyof FormState;
              return (
                <div key={letter} className="flex items-start gap-3">
                  <label className="mt-2 flex shrink-0 items-center gap-2">
                    <input
                      type="radio"
                      name="correct_option"
                      checked={form.correct_option === letter}
                      onChange={() => set("correct_option", letter)}
                      className="h-4 w-4 border-dark-200 text-gold focus:ring-gold"
                      aria-label={`Option ${letter} is correct`}
                    />
                    <span className="w-4 text-sm font-semibold text-dark">{letter}</span>
                  </label>
                  <div className="flex-1">
                    <Input
                      value={String(form[key])}
                      onChange={(event) => set(key, event.target.value as FormState[typeof key])}
                      placeholder={`Option ${letter}`}
                      error={errors[key]}
                    />
                  </div>
                </div>
              );
            })}
            <p className="text-xs text-dark-400">
              Select the radio next to the correct option. Students never see this field.
            </p>
          </div>
        </Card>

        <Card>
          <CardHeader title="Explanation" subtitle="Shown in review when the exam allows it" />
          <Textarea
            value={form.explanation}
            onChange={(event) => set("explanation", event.target.value)}
            placeholder="Why the correct option is correct"
            rows={5}
          />
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader title="Classification" />
          <div className="space-y-4">
            <Select
              label="Subject"
              value={form.subject_id}
              onChange={(event) => {
                set("subject_id", event.target.value);
                set("topic_id", "");
              }}
              error={errors.subject_id}
            >
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </Select>

            <Select
              label="Topic"
              value={form.topic_id}
              onChange={(event) => set("topic_id", event.target.value)}
              hint="Optional, but needed for topic wise analytics"
            >
              <option value="">No topic</option>
              {subjectTopics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </Select>

            <Select
              label="Difficulty"
              value={form.difficulty}
              onChange={(event) => set("difficulty", event.target.value as QuestionDifficulty)}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </Select>

            <Select
              label="Status"
              value={form.status}
              onChange={(event) => set("status", event.target.value as QuestionStatus)}
              hint="Only active questions are picked for exams"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </Select>

            <Input
              label="Source"
              value={form.source}
              onChange={(event) => set("source", event.target.value)}
              placeholder="DGCA 2023 paper, textbook chapter"
            />
          </div>
        </Card>

        <Card>
          <CardHeader title="Figure" subtitle="Optional diagram or chart" />
          {form.image_url ? (
            <div className="space-y-3">
              <div className="relative h-40 w-full rounded border border-line">
                <Image
                  src={form.image_url}
                  alt="Question figure"
                  fill
                  className="object-contain p-2"
                  unoptimized
                />
              </div>
              <Button variant="ghost" size="sm" onClick={() => set("image_url", "")}>
                <X className="h-4 w-4" />
                Remove image
              </Button>
            </div>
          ) : (
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-dark-100 px-4 py-8 text-center hover:bg-dark-50">
              <ImagePlus className="mb-2 h-6 w-6 text-dark-300" />
              <span className="text-sm text-dark">
                {uploading ? "Uploading" : "Click to upload an image"}
              </span>
              <span className="mt-1 text-xs text-dark-400">PNG or JPG</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void handleUpload(file);
                }}
              />
            </label>
          )}
        </Card>

        <div className="flex flex-wrap gap-2">
          <Button onClick={handleSave} loading={saving} className="flex-1">
            <Save className="h-4 w-4" />
            {question ? "Save changes" : "Create question"}
          </Button>
          {question ? (
            <Button variant="danger" onClick={() => setConfirmDelete(true)} disabled={saving}>
              <Trash2 className="h-4 w-4" />
            </Button>
          ) : null}
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete this question"
        message="This cannot be undone. Questions already used in an exam cannot be deleted."
        confirmLabel="Delete"
        destructive
        loading={saving}
        onConfirm={() => void handleDelete()}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}
