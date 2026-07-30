"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

/**
 * Shared modal shell for the Wings page's "read more" panels (full agenda,
 * scholarship detail). Keeps the page itself skimmable: the long content
 * lives behind a click rather than stretching the scroll.
 *
 * Matches OfflineEventRegisterModal's visual language (dark card, gold
 * hairline, corner brackets) but scrolls its own body, since this content is
 * long-form rather than a short form.
 */
export default function WingsModal({
  open,
  onClose,
  eyebrow,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-black/85 p-4 backdrop-blur-md sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={title}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="relative my-auto w-full max-w-3xl rounded-[20px] border border-[#C5A572]/25 bg-[#131315] shadow-[0_30px_80px_rgba(0,0,0,0.75)]"
          >
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-[2px] rounded-t-[20px] bg-gradient-to-r from-transparent via-[#C5A572] to-transparent"
            />

            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 rounded-t-[20px] border-b border-white/10 bg-[#131315]/95 px-6 py-5 backdrop-blur sm:px-8">
              <div>
                {eyebrow && (
                  <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[#E7D5B3]">
                    {eyebrow}
                  </p>
                )}
                <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">{title}</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="shrink-0 rounded-full border border-white/12 bg-white/[0.04] p-2 text-white/60 transition-colors hover:border-[#C5A572]/50 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-6 py-6 sm:px-8 sm:py-7">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
