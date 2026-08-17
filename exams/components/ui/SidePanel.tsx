"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Right hand editing surface.
 *
 * Editing happens beside the list rather than on another page, so the filters,
 * scroll position and selection you built up are still there when you close it.
 * That matters most on the question bank, where finding the row is the slow
 * part and losing the filter to a full page navigation is the real cost.
 *
 * Escape closes, focus moves in on open and returns to the trigger on close,
 * and the body is locked so the list behind does not scroll away underneath.
 */
export function SidePanel({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = "max-w-xl",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocusTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    returnFocusTo.current = document.activeElement as HTMLElement | null;

    const onKey = (event: KeyboardEvent): void => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // First field in the panel, so typing starts where the work is.
    const focusable = panelRef.current?.querySelector<HTMLElement>(
      "input, textarea, select, button:not([data-panel-close])"
    );
    focusable?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      returnFocusTo.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label={title}>
      <button
        type="button"
        aria-label="Close panel"
        onClick={onClose}
        className="absolute inset-0 bg-dark/40"
      />

      <div
        ref={panelRef}
        className={cn(
          "relative flex h-full w-full flex-col bg-canvas shadow-lift",
          "animate-rise",
          width
        )}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-line bg-surface px-6 py-4">
          <div className="min-w-0">
            <h2 className="truncate text-[0.9375rem] font-semibold text-dark">{title}</h2>
            {subtitle ? (
              <p className="mt-0.5 truncate text-[0.8125rem] text-dark-400">{subtitle}</p>
            ) : null}
          </div>
          <button
            type="button"
            data-panel-close
            onClick={onClose}
            aria-label="Close panel"
            className="-mr-1.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg text-dark-400 transition-colors duration-feedback ease-out hover:bg-dark-50 hover:text-dark"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {footer ? (
          <div className="flex shrink-0 items-center justify-end gap-2 border-t border-line bg-surface px-6 py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
