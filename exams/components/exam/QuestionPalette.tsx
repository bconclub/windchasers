"use client";

import { cn } from "@/lib/utils";
import type { OptionLetter } from "@/lib/types";

export interface PaletteEntry {
  questionId: string;
  selected: OptionLetter | null;
  marked: boolean;
}

function stateOf(entry: PaletteEntry): "answered-marked" | "marked" | "answered" | "blank" {
  if (entry.marked && entry.selected) return "answered-marked";
  if (entry.marked) return "marked";
  if (entry.selected) return "answered";
  return "blank";
}

const styles: Record<string, string> = {
  "answered-marked": "bg-emerald-600 text-white ring-2 ring-gold",
  marked: "bg-gold text-dark",
  answered: "bg-emerald-600 text-white",
  blank: "bg-surface text-dark-500 border border-line",
};

export function QuestionPalette({
  entries,
  currentIndex,
  onJump,
}: {
  entries: PaletteEntry[];
  currentIndex: number;
  onJump: (index: number) => void;
}) {
  const answered = entries.filter((entry) => entry.selected).length;
  const marked = entries.filter((entry) => entry.marked).length;

  return (
    <div className="rounded-xl border border-line bg-surface p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-dark-400">Questions</p>

      <div className="mt-3 grid grid-cols-6 gap-1.5 sm:grid-cols-8 lg:grid-cols-5">
        {entries.map((entry, index) => (
          <button
            key={entry.questionId}
            type="button"
            onClick={() => onJump(index)}
            aria-label={`Question ${index + 1}`}
            aria-current={index === currentIndex}
            className={cn(
              "h-9 rounded text-sm font-medium transition-colors",
              styles[stateOf(entry)],
              index === currentIndex && "outline outline-2 outline-offset-1 outline-dark"
            )}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <dl className="mt-4 space-y-1.5 text-xs text-dark-500">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-emerald-600" />
          <dt>Answered</dt>
          <dd className="ml-auto font-medium text-dark">{answered}</dd>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-gold" />
          <dt>Marked for review</dt>
          <dd className="ml-auto font-medium text-dark">{marked}</dd>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded border border-line bg-surface" />
          <dt>Not answered</dt>
          <dd className="ml-auto font-medium text-dark">{entries.length - answered}</dd>
        </div>
      </dl>
    </div>
  );
}
