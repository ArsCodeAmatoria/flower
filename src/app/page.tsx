"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { TitleSlide } from "@/sections/TitleSlide";
import { CharactersSection } from "@/sections/CharactersSection";
import { SetsSection } from "@/sections/SetsSection";
import { ScriptSection } from "@/sections/ScriptSection";
import { LyricsSection } from "@/sections/LyricsSection";
import { CreditsSection } from "@/sections/CreditsSection";
import { FloatingLinks } from "@/components/FloatingLinks";
import { CharacterModal } from "@/components/CharacterModal";

const SLIDE_COUNT = 6;

function HomeInner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const isScrollingRef = useRef(false);
  const [activeCharacterId, setActiveCharacterId] = useState<string | null>(null);

  const goToSlide = useCallback((index: number) => {
    const i = Math.max(0, Math.min(index, SLIDE_COUNT - 1));
    setCurrentSlide(i);
    isScrollingRef.current = true;
    const el = containerRef.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  }, []);

  const openCharacter = useCallback((id: string) => {
    setActiveCharacterId(id);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleScroll = () => {
      if (!isScrollingRef.current) {
        const index = Math.round(el.scrollLeft / el.clientWidth);
        setCurrentSlide(Math.max(0, Math.min(index, SLIDE_COUNT - 1)));
      }
    };
    const handleScrollEnd = () => {
      isScrollingRef.current = false;
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    el.addEventListener("scrollend", handleScrollEnd);
    return () => {
      el.removeEventListener("scroll", handleScroll);
      el.removeEventListener("scrollend", handleScrollEnd);
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      isScrollingRef.current = false;
    }, 600);
    return () => clearTimeout(t);
  }, [currentSlide]);

  return (
    <div className="relative h-screen overflow-hidden">
      <div
        ref={containerRef}
        className="slideshow-container h-full w-full overflow-x-auto overflow-y-hidden"
        style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
      >
        <TitleSlide />
        <CharactersSection openCharacter={openCharacter} />
        <SetsSection />
        <ScriptSection openCharacter={openCharacter} />
        <LyricsSection openCharacter={openCharacter} />
        <CreditsSection />
      </div>

      {currentSlide !== 0 && (
        <button
          type="button"
          onClick={() => goToSlide(0)}
          className="fixed right-7 top-4 z-[1001] flex select-none items-center gap-2.5 transition-opacity duration-200 hover:opacity-70"
          aria-label="Go to home"
        >
          <div className="text-right">
            <div
              className="leading-none text-zinc-900"
              style={{ fontFamily: "var(--font-title)", fontSize: "1.85rem", letterSpacing: "0.02em" }}
            >
              Flower
            </div>
            <div
              className="mt-0.5 text-zinc-500 uppercase tracking-[0.22em]"
              style={{ fontFamily: "var(--font-cinematic)", fontSize: "0.55rem" }}
            >
              To flower is to become
            </div>
          </div>
        </button>
      )}

      <FloatingLinks goToSlide={goToSlide} currentSlide={currentSlide} />

      {activeCharacterId && (
        <CharacterModal
          characterId={activeCharacterId}
          onOpenCharacter={openCharacter}
          onClose={() => setActiveCharacterId(null)}
        />
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense>
      <HomeInner />
    </Suspense>
  );
}
