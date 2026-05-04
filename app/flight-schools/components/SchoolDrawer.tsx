"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUpRight, PlaneTakeoff } from "lucide-react";
import { FlightSchool } from "@/types/flight-school";

interface Props {
  school: FlightSchool | null;
  onClose: () => void;
  onConsult: () => void;
  onFlyover?: () => void;
}

export default function SchoolDrawer({ school, onClose, onConsult, onFlyover }: Props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Drag-to-scroll gallery
  const galleryRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ dragging: false, startX: 0, scrollLeft: 0 });

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const el = galleryRef.current;
    if (!el) return;
    dragState.current = { dragging: true, startX: e.pageX - el.offsetLeft, scrollLeft: el.scrollLeft };
    el.style.cursor = "grabbing";
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragState.current.dragging || !galleryRef.current) return;
    e.preventDefault();
    const x = e.pageX - galleryRef.current.offsetLeft;
    galleryRef.current.scrollLeft = dragState.current.scrollLeft - (x - dragState.current.startX);
  }, []);

  const stopDrag = useCallback(() => {
    dragState.current.dragging = false;
    if (galleryRef.current) galleryRef.current.style.cursor = "grab";
  }, []);

  // Desktop: slides in from the LEFT
  const desktopClass =
    "fixed left-0 top-[80px] w-[360px] h-[calc(100vh-80px)] bg-[#0f0f0f] border-r border-white/10 overflow-y-auto z-[800] shadow-2xl";
  // Mobile: slides up from bottom
  const mobileClass =
    "fixed bottom-0 left-0 right-0 h-[78vh] bg-[#111] border-t border-white/10 rounded-t-2xl overflow-y-auto z-[800]";

  const desktopVariants = {
    initial: { x: -400 },
    animate: { x: 0 },
    exit: { x: -400 },
  };
  const mobileVariants = {
    initial: { y: "100%" },
    animate: { y: 0 },
    exit: { y: "100%" },
  };

  const variants = isMobile ? mobileVariants : desktopVariants;

  return (
    <>
      {/* Backdrop — transparent on desktop (just catches outside clicks), dim on mobile */}
      <AnimatePresence>
        {school && (
          <motion.div
            key="drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className={`fixed inset-0 z-[700] ${isMobile ? "bg-black/50" : "bg-transparent"}`}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {school && (
          <motion.div
            key={school.id}
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.exit}
            transition={{ type: "tween", duration: 0.28 }}
            className={isMobile ? mobileClass : desktopClass}
          >
            {/* Mobile drag handle */}
            {isMobile && (
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 bg-white/20 rounded-full" />
              </div>
            )}

            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 pr-4">
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {school.isPartner && (
                      <span className="px-2 py-0.5 bg-[#C5A572] text-black text-xs font-semibold rounded">
                        WC Partner
                      </span>
                    )}
                    {school.dgcaConvertible && (
                      <span className="px-2 py-0.5 bg-[#C5A572]/15 text-[#C5A572] text-xs rounded border border-[#C5A572]/30">
                        DGCA Convertible
                      </span>
                    )}
                  </div>
                    <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white leading-tight">
                      {school.name}
                    </h2>
                    {school.website && (
                      <a
                        href={school.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Visit Website"
                        className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full border border-white/20 text-white/40 hover:text-[#C5A572] hover:border-[#C5A572]/50 transition-colors"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                  <p className="text-white/50 text-sm mt-0.5">
                    {school.city}, {school.country}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors flex-shrink-0 mt-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Photo gallery */}
              {school.images && school.images.length > 0 && (
                <div
                  ref={galleryRef}
                  className="flex gap-2 overflow-x-auto pb-1 mb-5 -mx-6 px-6 scrollbar-hide select-none"
                  style={{ cursor: "grab" }}
                  onMouseDown={onMouseDown}
                  onMouseMove={onMouseMove}
                  onMouseUp={stopDrag}
                  onMouseLeave={stopDrag}
                >
                  {school.images.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt=""
                      draggable={false}
                      loading="lazy"
                      className="flex-shrink-0 w-[190px] h-[115px] rounded-lg object-cover pointer-events-none"
                      onError={(e) => {
                        const el = e.currentTarget;
                        el.style.display = "none";
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Certifications */}
              {school.certifications.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {school.certifications.map((cert) => (
                    <span
                      key={cert}
                      className="px-2.5 py-0.5 bg-white/10 text-white/70 text-xs rounded border border-white/20"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              )}

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                {school.fleetSize !== null && (
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-white/40 text-xs mb-1">Fleet</p>
                    <p className="text-white font-semibold text-sm">
                      {school.fleetSize} aircraft
                    </p>
                  </div>
                )}
                {school.approxCostUSD !== null && (
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-white/40 text-xs mb-1">Approx. Cost</p>
                    <p className="text-white font-semibold text-sm">
                      ${school.approxCostUSD.toLocaleString()}
                    </p>
                  </div>
                )}
                {school.durationMonths !== null && (
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-white/40 text-xs mb-1">Duration</p>
                    <p className="text-white font-semibold text-sm">
                      {school.durationMonths} months
                    </p>
                  </div>
                )}
                {school.rating !== null && (
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-white/40 text-xs mb-1">Rating</p>
                    <p className="text-white font-semibold text-sm">
                      {school.rating} / 5
                    </p>
                  </div>
                )}
              </div>

              {/* Notes */}
              {school.notes && (
                <p className="text-white/60 text-sm leading-relaxed mb-6">
                  {school.notes}
                </p>
              )}

              {/* Fly Here CTA */}
              {onFlyover && (
                <button
                  onClick={onFlyover}
                  className="w-full py-3 mb-2 flex items-center justify-center gap-2 bg-transparent border border-[#C5A572]/40 text-[#C5A572] text-sm font-semibold rounded hover:bg-[#C5A572]/10 hover:border-[#C5A572]/70 transition-colors"
                >
                  <PlaneTakeoff className="w-4 h-4" />
                  Fly Here
                </button>
              )}

              {/* CTA */}
              <button
                onClick={onConsult}
                className="w-full py-3 bg-[#C5A572] text-black text-sm font-semibold rounded hover:bg-[#C5A572]/90 transition-colors"
              >
                Get More Details
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
