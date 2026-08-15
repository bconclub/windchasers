"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { getBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDialog, Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/Table";
import { useToast } from "@/components/ui/Toast";
import { cn, errorMessage, slugCode } from "@/lib/utils";
import type { Subject, Topic } from "@/lib/types";

type DragKind = "subject" | "topic";

interface SubjectDraft {
  id: string | null;
  name: string;
  code: string;
}

interface TopicDraft {
  id: string | null;
  subject_id: string;
  name: string;
}

export function SubjectsPanel({
  subjects,
  topics,
  subjectCounts,
  topicCounts,
}: {
  subjects: Subject[];
  topics: Topic[];
  subjectCounts: Record<string, number>;
  topicCounts: Record<string, number>;
}) {
  const router = useRouter();
  const supabase = useMemo(() => getBrowserClient(), []);
  const toast = useToast();

  const [orderedSubjects, setOrderedSubjects] = useState<Subject[]>(subjects);
  const [orderedTopics, setOrderedTopics] = useState<Topic[]>(topics);
  const [dragging, setDragging] = useState<{ kind: DragKind; id: string } | null>(null);

  const [subjectDraft, setSubjectDraft] = useState<SubjectDraft | null>(null);
  const [topicDraft, setTopicDraft] = useState<TopicDraft | null>(null);
  const [deleting, setDeleting] = useState<{ kind: DragKind; id: string; name: string } | null>(
    null
  );
  const [saving, setSaving] = useState(false);

  async function persistOrder(kind: DragKind, list: Array<Subject | Topic>): Promise<void> {
    try {
      const table = kind === "subject" ? "subjects" : "topics";
      await Promise.all(
        list.map((entry, index) =>
          supabase.from(table).update({ order_index: index }).eq("id", entry.id)
        )
      );
      router.refresh();
    } catch (caught) {
      toast.error(errorMessage(caught, "Could not save the new order"));
    }
  }

  function onDropSubject(targetId: string): void {
    if (!dragging || dragging.kind !== "subject" || dragging.id === targetId) return;
    const from = orderedSubjects.findIndex((entry) => entry.id === dragging.id);
    const to = orderedSubjects.findIndex((entry) => entry.id === targetId);
    if (from < 0 || to < 0) return;

    const next = [...orderedSubjects];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setOrderedSubjects(next);
    setDragging(null);
    void persistOrder("subject", next);
  }

  function onDropTopic(targetId: string, subjectId: string): void {
    if (!dragging || dragging.kind !== "topic" || dragging.id === targetId) return;
    const scoped = orderedTopics.filter((topic) => topic.subject_id === subjectId);
    const from = scoped.findIndex((entry) => entry.id === dragging.id);
    const to = scoped.findIndex((entry) => entry.id === targetId);
    if (from < 0 || to < 0) return;

    const reordered = [...scoped];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);

    const others = orderedTopics.filter((topic) => topic.subject_id !== subjectId);
    setOrderedTopics([...others, ...reordered]);
    setDragging(null);
    void persistOrder("topic", reordered);
  }

  async function saveSubject(): Promise<void> {
    if (!subjectDraft) return;
    if (!subjectDraft.name.trim()) {
      toast.error("The subject needs a name");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: subjectDraft.name.trim(),
        code: (subjectDraft.code.trim() || slugCode(subjectDraft.name)).toUpperCase(),
      };
      if (subjectDraft.id) {
        const { error } = await supabase.from("subjects").update(payload).eq("id", subjectDraft.id);
        if (error) throw error;
        toast.success("Subject updated");
      } else {
        const { error } = await supabase
          .from("subjects")
          .insert({ ...payload, order_index: orderedSubjects.length });
        if (error) throw error;
        toast.success("Subject created");
      }
      setSubjectDraft(null);
      router.refresh();
    } catch (caught) {
      toast.error(errorMessage(caught, "Could not save the subject"));
    } finally {
      setSaving(false);
    }
  }

  async function saveTopic(): Promise<void> {
    if (!topicDraft) return;
    if (!topicDraft.name.trim()) {
      toast.error("The topic needs a name");
      return;
    }
    setSaving(true);
    try {
      if (topicDraft.id) {
        const { error } = await supabase
          .from("topics")
          .update({ name: topicDraft.name.trim() })
          .eq("id", topicDraft.id);
        if (error) throw error;
        toast.success("Topic updated");
      } else {
        const siblings = orderedTopics.filter(
          (topic) => topic.subject_id === topicDraft.subject_id
        );
        const { error } = await supabase.from("topics").insert({
          subject_id: topicDraft.subject_id,
          name: topicDraft.name.trim(),
          order_index: siblings.length,
        });
        if (error) throw error;
        toast.success("Topic created");
      }
      setTopicDraft(null);
      router.refresh();
    } catch (caught) {
      toast.error(errorMessage(caught, "Could not save the topic"));
    } finally {
      setSaving(false);
    }
  }

  async function remove(): Promise<void> {
    if (!deleting) return;
    setSaving(true);
    try {
      const table = deleting.kind === "subject" ? "subjects" : "topics";
      const { error } = await supabase.from(table).delete().eq("id", deleting.id);
      if (error) throw error;
      toast.success(`${deleting.kind === "subject" ? "Subject" : "Topic"} deleted`);
      setDeleting(null);
      router.refresh();
    } catch (caught) {
      toast.error(errorMessage(caught, "Could not delete"));
    } finally {
      setSaving(false);
    }
  }

  if (orderedSubjects.length === 0) {
    return (
      <EmptyState
        icon={<BookOpen className="h-8 w-8" />}
        title="No subjects yet"
        message="The migration seeds the six DGCA subjects. Add more here if you need them."
        action={
          <Button onClick={() => setSubjectDraft({ id: null, name: "", code: "" })}>
            <Plus className="h-4 w-4" />
            New subject
          </Button>
        }
      />
    );
  }

  return (
    <>
      <div className="mb-4">
        <Button onClick={() => setSubjectDraft({ id: null, name: "", code: "" })}>
          <Plus className="h-4 w-4" />
          New subject
        </Button>
      </div>

      <div className="space-y-4">
        {orderedSubjects.map((subject) => {
          const subjectTopics = orderedTopics
            .filter((topic) => topic.subject_id === subject.id)
            .sort((a, b) => a.order_index - b.order_index);

          return (
            <Card
              key={subject.id}
              className={cn(
                "transition-colors",
                dragging?.kind === "subject" && dragging.id === subject.id && "opacity-50"
              )}
            >
              <div
                draggable
                onDragStart={() => setDragging({ kind: "subject", id: subject.id })}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => onDropSubject(subject.id)}
                className="flex items-center gap-3"
              >
                <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-dark-300" />
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-dark">{subject.name}</h3>
                  <p className="text-xs text-dark-400">
                    {subject.code} - {subjectCounts[subject.id] ?? 0} active questions
                  </p>
                </div>
                <Badge tone="neutral">{subjectTopics.length} topics</Badge>
                <button
                  type="button"
                  onClick={() =>
                    setSubjectDraft({ id: subject.id, name: subject.name, code: subject.code })
                  }
                  className="rounded p-1 text-dark-400 hover:bg-dark-50 hover:text-dark"
                  aria-label="Edit subject"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setDeleting({ kind: "subject", id: subject.id, name: subject.name })
                  }
                  className="rounded p-1 text-dark-400 hover:bg-dark-50 hover:text-danger"
                  aria-label="Delete subject"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 space-y-1.5 border-l border-dark-100 pl-4">
                {subjectTopics.map((topic) => (
                  <div
                    key={topic.id}
                    draggable
                    onDragStart={() => setDragging({ kind: "topic", id: topic.id })}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => onDropTopic(topic.id, subject.id)}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-dark-50",
                      dragging?.kind === "topic" && dragging.id === topic.id && "opacity-50"
                    )}
                  >
                    <GripVertical className="h-3.5 w-3.5 shrink-0 cursor-grab text-dark-300" />
                    <span className="flex-1 text-dark">{topic.name}</span>
                    <span className="text-xs text-dark-400">
                      {topicCounts[topic.id] ?? 0} questions
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setTopicDraft({
                          id: topic.id,
                          subject_id: subject.id,
                          name: topic.name,
                        })
                      }
                      className="rounded p-1 text-dark-400 hover:text-dark"
                      aria-label="Edit topic"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleting({ kind: "topic", id: topic.id, name: topic.name })}
                      className="rounded p-1 text-dark-400 hover:text-danger"
                      aria-label="Delete topic"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => setTopicDraft({ id: null, subject_id: subject.id, name: "" })}
                  className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-dark-400 hover:bg-dark-50 hover:text-dark"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add topic
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal
        open={subjectDraft !== null}
        onClose={() => setSubjectDraft(null)}
        title={subjectDraft?.id ? "Edit subject" : "New subject"}
        footer={
          <>
            <Button variant="ghost" onClick={() => setSubjectDraft(null)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={saveSubject} loading={saving}>
              Save
            </Button>
          </>
        }
      >
        {subjectDraft ? (
          <div className="space-y-4">
            <Input
              label="Name"
              value={subjectDraft.name}
              onChange={(event) => setSubjectDraft({ ...subjectDraft, name: event.target.value })}
              placeholder="Air Navigation"
            />
            <Input
              label="Code"
              value={subjectDraft.code}
              onChange={(event) => setSubjectDraft({ ...subjectDraft, code: event.target.value })}
              placeholder="NAV"
              hint="Left empty, a code is derived from the name"
            />
          </div>
        ) : null}
      </Modal>

      <Modal
        open={topicDraft !== null}
        onClose={() => setTopicDraft(null)}
        title={topicDraft?.id ? "Edit topic" : "New topic"}
        footer={
          <>
            <Button variant="ghost" onClick={() => setTopicDraft(null)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={saveTopic} loading={saving}>
              Save
            </Button>
          </>
        }
      >
        {topicDraft ? (
          <Input
            label="Topic name"
            value={topicDraft.name}
            onChange={(event) => setTopicDraft({ ...topicDraft, name: event.target.value })}
            placeholder="Great Circle and Rhumb Line"
          />
        ) : null}
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        title={deleting?.kind === "subject" ? "Delete subject" : "Delete topic"}
        message={
          deleting?.kind === "subject"
            ? `Deleting ${deleting.name} also deletes its topics. Subjects that still have questions cannot be deleted.`
            : `Deleting ${deleting?.name ?? "this topic"} clears the topic on its questions. The questions themselves stay.`
        }
        confirmLabel="Delete"
        destructive
        loading={saving}
        onConfirm={() => void remove()}
        onCancel={() => setDeleting(null)}
      />
    </>
  );
}
