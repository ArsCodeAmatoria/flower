"use client";

import { Users, BookOpen, Mic2, Star, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { label: "About", icon: Info, slideIndex: 1 },
  { label: "Characters", icon: Users, slideIndex: 2 },
  { label: "Script", icon: BookOpen, slideIndex: 3 },
  { label: "Lyrics", icon: Mic2, slideIndex: 4 },
  { label: "Credits", icon: Star, slideIndex: 5 },
];

interface FloatingLinksProps {
  goToSlide: (index: number) => void;
  currentSlide: number;
}

export function FloatingLinks({ goToSlide, currentSlide }: FloatingLinksProps) {
  return (
    <div
      className="fixed left-1/2 z-[1001] flex max-w-[calc(100vw-1rem)] -translate-x-1/2 items-center gap-1 rounded-full border border-white/10 bg-black/70 px-2 py-1.5 backdrop-blur-md"
      style={{ bottom: "max(1.25rem, calc(env(safe-area-inset-bottom, 0px) + 4.25rem))" }}
    >
      {links.map(({ label, icon: Icon, slideIndex }) => (
        <button
          key={slideIndex}
          type="button"
          onClick={() => goToSlide(slideIndex)}
          className={cn(
            "flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-wider transition-all duration-200",
            currentSlide === slideIndex
              ? "bg-white/15 text-white"
              : "text-white/50 hover:text-white/80"
          )}
          style={{ fontFamily: "var(--font-cinematic)" }}
        >
          <Icon className="size-3 shrink-0" aria-hidden />
          {label}
        </button>
      ))}
    </div>
  );
}
