"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { cn, formatDuration } from "@/lib/utils";

/**
 * Counts down against the server deadline. clockOffsetMs corrects for a
 * student device whose clock is wrong, so the timer cannot be gamed locally.
 */
export function ExamTimer({
  deadlineMs,
  clockOffsetMs,
  onExpire,
}: {
  deadlineMs: number;
  clockOffsetMs: number;
  onExpire: () => void;
}) {
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, deadlineMs - (Date.now() + clockOffsetMs))
  );

  useEffect(() => {
    let fired = false;
    const tick = (): void => {
      const left = Math.max(0, deadlineMs - (Date.now() + clockOffsetMs));
      setRemaining(left);
      if (left <= 0 && !fired) {
        fired = true;
        onExpire();
      }
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [deadlineMs, clockOffsetMs, onExpire]);

  const seconds = Math.floor(remaining / 1000);
  const critical = seconds <= 60;
  const warning = seconds <= 300 && !critical;

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md border px-3 py-1.5 font-mono text-sm tabular-nums",
        critical
          ? "border-red-200 bg-red-50 text-danger"
          : warning
            ? "border-amber-200 bg-amber-50 text-amber-800"
            : "border-dark-100 bg-surface text-dark"
      )}
      aria-live="off"
    >
      <Clock className="h-4 w-4" />
      {formatDuration(seconds)}
    </div>
  );
}
