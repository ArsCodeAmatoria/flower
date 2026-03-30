"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SlideshowArrowsProps {
  onPrev: () => void;
  onNext: () => void;
  current: number;
  total: number;
}

export function SlideshowArrows({
  onPrev,
  onNext,
  current,
  total,
}: SlideshowArrowsProps) {
  const canPrev = current > 0;
  const canNext = current < total - 1;

  return (
    <>
      <button
        type="button"
        onClick={onPrev}
        disabled={!canPrev}
        aria-label="Previous slide"
        className={cn(
          "fixed left-5 top-1/2 z-[1001] -translate-y-1/2 rounded-full transition-all duration-200",
          "flex h-12 w-12 items-center justify-center",
          "border border-white/15 bg-black/60 text-white backdrop-blur-md",
          "hover:border-white/40 hover:bg-white/12",
          "disabled:pointer-events-none disabled:opacity-20"
        )}
      >
        <ChevronLeft className="size-6 stroke-[1.5]" />
      </button>

      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        aria-label="Next slide"
        className={cn(
          "fixed right-5 top-1/2 z-[1001] -translate-y-1/2 rounded-full transition-all duration-200",
          "flex h-12 w-12 items-center justify-center",
          "border border-white/15 bg-black/60 text-white backdrop-blur-md",
          "hover:border-white/40 hover:bg-white/12",
          "disabled:pointer-events-none disabled:opacity-20"
        )}
      >
        <ChevronRight className="size-6 stroke-[1.5]" />
      </button>

      {/* Slide counter */}
      <div
        className="fixed bottom-8 right-8 z-[1001] text-[11px] text-white/30"
        style={{ fontFamily: "var(--font-screenplay)" }}
      >
        {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>
    </>
  );
}
