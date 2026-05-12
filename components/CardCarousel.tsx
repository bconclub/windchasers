"use client";

import { useEffect, useRef, useState, type ReactNode, Children } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CardCarouselProps {
  children: ReactNode;
  cardWidthClass?: string;
  variant?: "stitch" | "legacy";
}

export default function CardCarousel({
  children,
  cardWidthClass = "w-[78%] sm:w-[60%] md:w-[42%] lg:w-[31%]",
  variant = "stitch",
}: CardCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateNavState = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateNavState();
    el.addEventListener("scroll", updateNavState, { passive: true });
    window.addEventListener("resize", updateNavState);
    return () => {
      el.removeEventListener("scroll", updateNavState);
      window.removeEventListener("resize", updateNavState);
    };
  }, []);

  const scrollByCards = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-carousel-card]");
    const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    const target = Math.max(
      0,
      Math.min(el.scrollWidth - el.clientWidth, el.scrollLeft + dir * step)
    );
    el.scrollTo({ left: target, behavior: "smooth" });
    setTimeout(() => {
      setCanPrev(target > 8);
      setCanNext(target + el.clientWidth < el.scrollWidth - 8);
    }, 0);
  };

  const isStitch = variant === "stitch";
  const navBtnClass = isStitch
    ? "bg-primary text-on-primary hover:bg-primary-container ring-2 ring-primary/30 ring-offset-4 ring-offset-background shadow-lg shadow-black/40 active:scale-95"
    : "bg-gold text-dark hover:bg-gold/90 ring-2 ring-gold/30 ring-offset-4 ring-offset-dark shadow-lg shadow-black/40 active:scale-95";

  return (
    <div>
      <div className="hidden md:flex justify-end gap-3 mb-6">
        <button
          type="button"
          onClick={() => scrollByCards(-1)}
          disabled={!canPrev}
          aria-label="Previous"
          className={`flex w-12 h-12 rounded-full items-center justify-center transition-all ${navBtnClass} ${
            canPrev ? "opacity-100" : "opacity-30 cursor-not-allowed"
          }`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          type="button"
          onClick={() => scrollByCards(1)}
          disabled={!canNext}
          aria-label="Next"
          className={`flex w-12 h-12 rounded-full items-center justify-center transition-all ${navBtnClass} ${
            canNext ? "opacity-100" : "opacity-30 cursor-not-allowed"
          }`}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div
        ref={scrollerRef}
        className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-proximity pb-4 -mx-6 px-6 md:mx-0 md:px-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {Children.map(children, (child) => (
          <div
            data-carousel-card
            className={`shrink-0 ${cardWidthClass} snap-start`}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
