"use client";

import { useRef, useState, useEffect, useCallback, useSyncExternalStore, type ReactNode } from "react";
import Image from "next/image";
import { Play, Pause, RotateCcw, Sparkles } from "lucide-react";
import { songs } from "@/data/songs";
import { crew } from "@/data/crew";
import { characters } from "@/data/characters";
import type { Character } from "@/data/characters";
import { creditsSidebarLeft, creditsSidebarRight } from "@/data/credits-sidebar-copy";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function subscribeReducedMotion(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function getReducedMotionSnapshot() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, () => false);
}

function smoothstep01(t: number) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

const CHUNK_FADE_FRAC = 0.2;

function chunkOpacity(
  chunkIndex: number,
  currentTime: number,
  duration: number,
  cardCount: number,
  idleAtStart: boolean,
  audioEnded: boolean,
): number {
  if (idleAtStart && chunkIndex === 0) return 1;
  if (duration <= 0) return chunkIndex === 0 ? 1 : 0;
  if (audioEnded) return chunkIndex === cardCount - 1 ? 1 : 0;

  const slice = duration / cardCount;
  const start = chunkIndex * slice;
  const end = (chunkIndex + 1) * slice;
  if (currentTime < start || currentTime >= end) return 0;

  const r = (currentTime - start) / slice;
  const f = Math.min(CHUNK_FADE_FRAC, 0.49);
  if (r < f) return smoothstep01(r / f);
  if (r > 1 - f) return smoothstep01((1 - r) / f);
  return 1;
}

function CreditCardLabel({ children, darkStage }: { children: ReactNode; darkStage?: boolean }) {
  const lineFrom = darkStage ? "from-amber-400/55" : "from-red-400/45";
  const lineTo = darkStage ? "to-transparent" : "to-transparent";
  const dots = darkStage ? "text-amber-300/80" : "text-red-800";
  const label = darkStage ? "text-amber-100/90" : "text-red-700";
  return (
    <div className="mb-5 flex w-full flex-col items-center">
      <div className="mb-3 flex w-full max-w-xs items-center justify-center gap-3">
        <span className={cn("h-px min-w-[2rem] flex-1 bg-linear-to-l", lineFrom, lineTo)} aria-hidden />
        <span
          className={cn("shrink-0 px-1 text-[10px] leading-none tracking-[0.4em]", dots)}
          style={{ fontFamily: "var(--font-credits-ornate)" }}
          aria-hidden
        >
          ···
        </span>
        <span className={cn("h-px min-w-[2rem] flex-1 bg-linear-to-r", lineFrom, lineTo)} aria-hidden />
      </div>
      <p
        className={cn("text-center text-[9px] uppercase tracking-[0.38em]", label)}
        style={{ fontFamily: "var(--font-cinematic)" }}
      >
        {children}
      </p>
    </div>
  );
}

function CastPair({ c, darkStage }: { c: Character; darkStage?: boolean }) {
  return (
    <div className="min-w-[42%] text-center">
      <p
        className={cn(
          "text-xl uppercase tracking-[0.14em] sm:text-2xl",
          darkStage ? "text-white" : "text-zinc-900",
        )}
        style={{ fontFamily: "var(--font-credits-ornate)" }}
      >
        {c.name}
      </p>
      <p
        className={cn(
          "mt-3 text-[13px] italic leading-snug sm:text-sm",
          darkStage ? "text-zinc-400" : "text-zinc-600",
        )}
        style={{ fontFamily: "var(--font-credits)" }}
      >
        {c.role}
      </p>
    </div>
  );
}

/** Fixed positions for SSR-stable “night sky” stars (Disney-style twinkle). */
const CREDITS_STAR_FIELD: { l: number; t: number; r: number; delay: number }[] = [
  { l: 5, t: 12, r: 1.1, delay: 0 },
  { l: 14, t: 28, r: 0.7, delay: 0.4 },
  { l: 22, t: 8, r: 0.9, delay: 0.2 },
  { l: 31, t: 44, r: 0.6, delay: 0.9 },
  { l: 38, t: 18, r: 1.2, delay: 0.1 },
  { l: 48, t: 52, r: 0.55, delay: 0.55 },
  { l: 56, t: 11, r: 0.85, delay: 0.35 },
  { l: 64, t: 36, r: 0.7, delay: 0.75 },
  { l: 72, t: 58, r: 1.0, delay: 0.15 },
  { l: 81, t: 22, r: 0.65, delay: 0.65 },
  { l: 88, t: 41, r: 0.5, delay: 0.45 },
  { l: 93, t: 14, r: 0.95, delay: 0.85 },
  { l: 11, t: 62, r: 0.6, delay: 0.25 },
  { l: 77, t: 68, r: 0.72, delay: 0.5 },
  { l: 42, t: 72, r: 0.58, delay: 0.3 },
  { l: 59, t: 78, r: 0.88, delay: 0.7 },
];

function DisneyCreditsBackdrop({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "linear-gradient(155deg, #0b1020 0%, #1a1040 28%, #2d1b69 52%, #0f172a 78%, #020617 100%)",
          backgroundSize: reducedMotion ? "100% 100%" : "220% 220%",
          animation: reducedMotion ? undefined : "creditsAurora 22s ease-in-out infinite",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 120%, rgba(251, 191, 36, 0.35), transparent 55%), radial-gradient(ellipse 50% 40% at 15% 20%, rgba(147, 197, 253, 0.2), transparent 50%)",
        }}
        aria-hidden
      />
      {CREDITS_STAR_FIELD.map((star, i) => (
        <span
          key={i}
          className="pointer-events-none absolute rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)]"
          style={{
            left: `${star.l}%`,
            top: `${star.t}%`,
            width: `${star.r * 5}px`,
            height: `${star.r * 5}px`,
            opacity: reducedMotion ? 0.55 : undefined,
            animation: reducedMotion
              ? undefined
              : `creditsStarTwinkle ${2.1 + (i % 5) * 0.35}s ease-in-out infinite`,
            animationDelay: reducedMotion ? undefined : `${star.delay}s`,
          }}
          aria-hidden
        />
      ))}
      {!reducedMotion ? (
        <span
          className="pointer-events-none absolute right-[8%] top-[18%] text-2xl opacity-40"
          style={{ animation: "creditsSparkleDrift 4s ease-in-out infinite" }}
          aria-hidden
        >
          ✦
        </span>
      ) : null}
      {!reducedMotion ? (
        <span
          className="pointer-events-none absolute bottom-[22%] left-[10%] text-xl opacity-30"
          style={{ animation: "creditsSparkleDrift 5.2s ease-in-out infinite 0.8s" }}
          aria-hidden
        >
          ✧
        </span>
      ) : null}
    </>
  );
}

function FilmCorners({ darkStage }: { darkStage?: boolean }) {
  const line = darkStage ? "1px solid rgba(234, 179, 8, 0.38)" : "1px solid rgba(14, 116, 144, 0.35)";
  const corners = ["top-4 left-4", "top-4 right-4", "bottom-4 left-4", "bottom-4 right-4"] as const;
  return (
    <>
      {corners.map((pos, i) => (
        <div
          key={i}
          className={cn("pointer-events-none absolute z-[1] h-5 w-5", pos)}
          style={{
            borderTop: i < 2 ? line : "none",
            borderBottom: i >= 2 ? line : "none",
            borderLeft: i % 2 === 0 ? line : "none",
            borderRight: i % 2 === 1 ? line : "none",
          }}
          aria-hidden
        />
      ))}
    </>
  );
}

function CreditsSidebarInk({
  quote,
  thankYou,
  quoteRotate,
  thanksRotate,
  children,
}: {
  quote: string;
  thankYou: string;
  quoteRotate?: string;
  thanksRotate?: string;
  children?: ReactNode;
}) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin]">
      <div className="border-b border-red-200/80 pb-4">
        <p
          className="text-[0.95rem] leading-[1.35] text-zinc-900 sm:text-[1.05rem]"
          style={{
            fontFamily: "var(--font-logo-script)",
            fontWeight: 700,
            transform: quoteRotate,
            textShadow: "0 1px 0 rgba(255,255,255,0.9)",
          }}
        >
          {quote}
        </p>
        <p
          className="mt-2 text-[1.05rem] leading-[1.25] text-red-800/95 sm:text-[1.15rem]"
          style={{
            fontFamily: "var(--font-logo-script)",
            fontWeight: 700,
            transform: thanksRotate,
            letterSpacing: "0.01em",
          }}
        >
          {thankYou}
        </p>
      </div>
      {children}
    </div>
  );
}

/** More title cards = shorter slices per track = snappier credits. */
const CARD_COUNT = 19;

export function CreditsSection() {
  const creditsSong = songs.find((s) => s.id === "flower")!;
  const creator = crew[0];
  const leigh = crew.find((m) => m.id === "leigh-akin");
  const reduceMotion = usePrefersReducedMotion();

  const castTriples: Character[][] = [
    characters.slice(0, 2),
    characters.slice(2, 4),
    characters.slice(4, 7),
  ];

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [audioEnded, setAudioEnded] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = new Audio(creditsSong.audioSrc);
    audioRef.current = audio;
    audio.addEventListener("loadedmetadata", () => setDuration(audio.duration));
    audio.addEventListener("timeupdate", () => setCurrentTime(audio.currentTime));
    audio.addEventListener("ended", () => {
      setPlaying(false);
      setAudioEnded(true);
    });
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [creditsSong.audioSrc]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      setAudioEnded(false);
      audio.play().catch(() => {});
      setPlaying(true);
    }
  }, [playing]);

  const replay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setAudioEnded(false);
    audio.currentTime = 0;
    setCurrentTime(0);
    audio.play().catch(() => {});
    setPlaying(true);
  }, []);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const idleAtStart = !playing && !audioEnded && currentTime < 0.25;

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const slice = duration > 0 ? duration / CARD_COUNT : 0;
  const visibleIndex =
    duration > 0 && !idleAtStart
      ? Math.min(
          CARD_COUNT - 1,
          Math.max(0, Math.floor(audioEnded ? CARD_COUNT - 1 : currentTime / slice)),
        )
      : 0;

  const body = "var(--font-credits)";
  const ornate = "var(--font-credits-ornate)";

  const renderMovieCard = (i: number) => {
    switch (i) {
      case 0:
        return (
          <div className="flex flex-col items-center justify-center px-2 text-center">
            <p
              className="text-5xl text-white drop-shadow-[0_4px_32px_rgba(234,179,8,0.22)] sm:text-6xl md:text-7xl"
              style={{ fontFamily: "var(--font-title)", letterSpacing: "0.02em" }}
            >
              Flower
            </p>
            <p className="mt-6 text-[14px] font-medium italic leading-relaxed text-zinc-300/95 sm:text-[15px]" style={{ fontFamily: body }}>
              An animated musical feature
            </p>
            <div className="mt-10 flex flex-col items-center">
              <p className="text-[9px] uppercase tracking-[0.36em] text-zinc-500" style={{ fontFamily: "var(--font-cinematic)" }}>
                Created by
              </p>
              <p className="mt-3 text-lg uppercase tracking-[0.2em] text-white sm:text-xl" style={{ fontFamily: ornate }}>
                {creator.name}
              </p>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="mx-auto flex max-w-md flex-col items-center px-2 text-center">
            <CreditCardLabel darkStage>Screen story</CreditCardLabel>
            <p className="text-[16px] font-normal leading-[1.8] text-zinc-200 sm:text-lg" style={{ fontFamily: body }}>
              A scentless teen arrives at a beauty-obsessed high school and learns her gift isn&apos;t fragrance—it&apos;s
              presence. Who gets to say what “blooming” means when rank, performance, and lies are louder than truth?
            </p>
          </div>
        );
      case 2:
        return (
          <div className="mx-auto flex max-w-md flex-col items-center px-2 text-center">
            {leigh && (
              <>
                <CreditCardLabel darkStage>Writing &amp; music</CreditCardLabel>
                <p className="text-[15px] leading-relaxed text-zinc-200" style={{ fontFamily: body }}>
                  <span className="block text-[10px] uppercase tracking-[0.28em] text-zinc-500" style={{ fontFamily: "var(--font-cinematic)" }}>
                    Co-written by
                  </span>
                  <span className="mt-2 block text-lg uppercase tracking-[0.16em] text-white" style={{ fontFamily: ornate }}>
                    {leigh.name}
                  </span>
                </p>
                <p className="mt-8 text-[15px] leading-relaxed text-zinc-200" style={{ fontFamily: body }}>
                  <span className="block text-[10px] uppercase tracking-[0.28em] text-zinc-500" style={{ fontFamily: "var(--font-cinematic)" }}>
                    Original songs by
                  </span>
                  <span className="mt-2 block text-lg uppercase tracking-[0.16em] text-white" style={{ fontFamily: ornate }}>
                    {leigh.name}
                  </span>
                </p>
                <p className="mt-8 text-[13px] leading-relaxed text-zinc-400" style={{ fontFamily: body }}>
                  Lyrics &amp; story shaped in draft with the creative team; arrangements and orchestration to follow for
                  production.
                </p>
              </>
            )}
          </div>
        );
      case 3:
      case 4:
      case 5: {
        const group = castTriples[i - 3];
        return (
          <div className="mx-auto w-full max-w-lg px-2">
            <CreditCardLabel darkStage>Cast of characters</CreditCardLabel>
            <div className={cn("flex flex-wrap justify-center gap-x-8 gap-y-10", group.length === 3 && "gap-y-8")}>
              {group.map((c) => (
                <CastPair key={c.id} c={c} darkStage />
              ))}
            </div>
          </div>
        );
      }
      case 6:
        return (
          <div className="mx-auto max-w-md px-2 text-center">
            <CreditCardLabel darkStage>Where it happens</CreditCardLabel>
            <p className="text-[16px] font-normal leading-[1.75] text-zinc-200 sm:text-lg" style={{ fontFamily: body }}>
              Flower High — where flowers are identity, scent is status, and beauty is scored and displayed until the
              story cracks the illusion.
            </p>
            <p className="mt-6 text-[14px] leading-relaxed text-zinc-400" style={{ fontFamily: body }}>
              Additional environments include the glowing woods, the Bloom Ceremony hall, and corridors where hierarchy
              is enforced in whispers and glances.
            </p>
          </div>
        );
      default: {
        const songIdx = i - 7;
        if (songIdx >= 0 && songIdx < songs.length) {
          const s = songs[songIdx];
          return (
            <div className="mx-auto w-full max-w-md px-2">
              <CreditCardLabel darkStage>Music in the story</CreditCardLabel>
              <div className="text-center">
                <p className="text-base uppercase tracking-[0.12em] text-white sm:text-lg" style={{ fontFamily: ornate }}>
                  {s.title}
                </p>
                <p className="mt-1.5 text-[13px] italic text-zinc-400" style={{ fontFamily: body }}>
                  {s.singers}
                </p>
                {s.placement ? (
                  <p className="mt-4 text-[12px] leading-relaxed text-zinc-500" style={{ fontFamily: body }}>
                    {s.placement}
                  </p>
                ) : null}
                {s.writtenBy ? (
                  <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-zinc-500" style={{ fontFamily: "var(--font-cinematic)" }}>
                    Words &amp; music · {s.writtenBy}
                  </p>
                ) : null}
              </div>
            </div>
          );
        }
      }
    }

    switch (i) {
      case 14:
        return (
          <div className="mx-auto max-w-lg px-3 text-center">
            <CreditCardLabel darkStage>Production</CreditCardLabel>
            <ul className="space-y-2.5 text-[13px] leading-snug text-zinc-300 sm:text-[14px]" style={{ fontFamily: body }}>
              <li>Executive Producer — in development</li>
              <li>Producer — in development</li>
              <li>Director — TBD</li>
              <li>Production Designer — TBD</li>
              <li>Editorial &amp; storyboarding — in development</li>
              <li>Animation pipeline — TBD</li>
              <li>Music supervision &amp; vocal production — TBD</li>
              <li>Sound design &amp; re-recording mix — TBD</li>
            </ul>
          </div>
        );
      case 15:
        return (
          <div className="mx-auto max-w-lg px-3 text-center">
            <CreditCardLabel darkStage>Creative contributors</CreditCardLabel>
            <p className="text-[14px] leading-[1.75] text-zinc-300" style={{ fontFamily: body }}>
              Story consultants, development executives, and design collaborators to be named as the feature moves into
              greenlight and crewing. Thank you to everyone who weighed in on tone, clarity, and heart in early reads.
            </p>
            <p className="mt-5 text-[13px] leading-relaxed text-zinc-500" style={{ fontFamily: body }}>
              Special thanks to teachers, classmates, and musicians who offered feedback on drafts, demos, and pitch
              materials.
            </p>
          </div>
        );
      case 16:
        return (
          <div className="mx-auto max-w-lg px-3 text-center">
            <CreditCardLabel darkStage>Development</CreditCardLabel>
            <p className="text-[14px] leading-[1.75] text-zinc-300" style={{ fontFamily: body }}>
              Presented as a proof-of-concept animated musical. Screenplay scaffold, song bible, and character materials
              continue in active revision. Scene count and pacing targets follow a fifteen-beat beat sheet aligned to a
              ~ninety-five to one-hundred-ten page feature.
            </p>
            <p className="mt-5 text-[12px] leading-relaxed text-zinc-500" style={{ fontFamily: body }}>
              This sequence timed to “{creditsSong.title}.” On-screen text and timing are a presentation
              mock-up, not a final master.
            </p>
          </div>
        );
      case 17:
        return (
          <div className="mx-auto max-w-md px-2">
            <CreditCardLabel darkStage>Core team</CreditCardLabel>
            <ul className="space-y-6">
              {crew.map((m) => (
                <li key={m.id} className="text-center">
                  <p className="text-base uppercase tracking-[0.12em] text-white sm:text-lg" style={{ fontFamily: ornate }}>
                    {m.name}
                  </p>
                  <p className="mt-2 text-[13px] text-zinc-400" style={{ fontFamily: body }}>
                    {m.role}
                  </p>
                  <p className="mt-2 text-[12px] leading-relaxed text-zinc-500" style={{ fontFamily: body }}>
                    {m.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        );
      case 18:
        return (
          <div className="mx-auto flex max-w-md flex-col items-center px-2 text-center">
            <CreditCardLabel darkStage>Thank you</CreditCardLabel>
            <p className="mt-2 text-[16px] font-normal leading-[1.75] text-zinc-300 sm:text-lg" style={{ fontFamily: body }}>
              To everyone who read early drafts, listened to demos, shared notes in margins, and helped this world take
              shape—gratitude doesn&apos;t need a scent to linger.
            </p>
            <p className="mt-6 text-[13px] leading-relaxed text-zinc-500" style={{ fontFamily: body }}>
              No association with any school or organization is implied. Names and places are fictitious.
            </p>
            <p className="mt-10 text-xs uppercase tracking-[0.32em] text-zinc-400" style={{ fontFamily: ornate }}>
              F&nbsp;L&nbsp;O&nbsp;W&nbsp;E&nbsp;R
            </p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.28em] text-zinc-600" style={{ fontFamily: "var(--font-cinematic)" }}>
              All rights reserved · {new Date().getFullYear()}
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  const reelChrome = (
    <>
      <FilmCorners darkStage />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[12%] bg-linear-to-b from-black/75 via-black/20 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[14%] bg-linear-to-t from-black/80 via-amber-950/10 to-transparent" />
    </>
  );

  const playerChrome = (
    <div className="relative overflow-hidden border-t border-amber-400/30 bg-gradient-to-b from-[#1a0a2e] via-[#12081c] to-[#07040c] px-3 py-2.5 sm:px-4 sm:py-3">
      {!reduceMotion ? (
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.14]"
          style={{
            background:
              "linear-gradient(105deg, transparent 35%, rgba(253, 230, 138, 0.45) 50%, transparent 65%)",
            backgroundSize: "200% 100%",
            animation: "creditsPlayerShimmer 4s ease-in-out infinite",
          }}
          aria-hidden
        />
      ) : null}
      <div className="relative flex flex-col gap-2">
        <button
          type="button"
          className="group relative h-1.5 w-full cursor-pointer overflow-hidden rounded-full bg-white/12 shadow-inner shadow-black/40"
          onClick={(e) => {
            const audio = audioRef.current;
            if (!audio || duration <= 0) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            audio.currentTime = x * duration;
            setCurrentTime(audio.currentTime);
          }}
          aria-label="Seek credits track"
        >
          <span
            className="pointer-events-none absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-amber-400 via-rose-400 to-amber-300 transition-[width] duration-150 ease-out shadow-[0_0_12px_rgba(251,191,36,0.55)] group-hover:brightness-110"
            style={{ width: `${progress}%` }}
          />
        </button>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl ring-2 ring-amber-400/35 ring-offset-2 ring-offset-[#12081c] sm:h-11 sm:w-11">
            <Image src={creditsSong.image} alt="" fill className="object-cover object-top" sizes="44px" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
              <Sparkles className="size-3 shrink-0 text-amber-300/90 sm:size-3.5" aria-hidden />
              <p
                className="min-w-0 flex-1 truncate text-[9px] font-semibold uppercase tracking-[0.13em] text-amber-100/95 sm:text-[10px]"
                style={{ fontFamily: "var(--font-cinematic)" }}
              >
                {creditsSong.title}
              </p>
              <span
                className="shrink-0 text-[8px] tabular-nums text-zinc-500 sm:text-[9px]"
                style={{ fontFamily: "var(--font-screenplay)" }}
              >
                Reel {visibleIndex + 1}/{CARD_COUNT}
              </span>
            </div>
            <p className="truncate text-[9px] text-zinc-400 sm:text-[10px]" style={{ fontFamily: "var(--font-screenplay)" }}>
              {creditsSong.singers}
              {creditsSong.writtenBy ? ` · ${creditsSong.writtenBy}` : ""}
            </p>
          </div>
          <span
            className="hidden shrink-0 text-[9px] tabular-nums tracking-wide text-amber-200/70 sm:inline"
            style={{ fontFamily: "var(--font-screenplay)" }}
          >
            {fmt(currentTime)} / {fmt(duration || 0)}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 rounded-full text-amber-200/80 hover:bg-white/10 hover:text-amber-50"
            onClick={replay}
            aria-label="Restart song and credits"
          >
            <RotateCcw className="size-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            className={cn(
              "h-9 w-9 shrink-0 rounded-full border-0 shadow-lg shadow-amber-900/40 sm:h-10 sm:w-10",
              playing
                ? "bg-amber-50 text-violet-950 hover:bg-white"
                : "bg-gradient-to-b from-amber-400 to-rose-600 text-white hover:brightness-110",
            )}
            onClick={togglePlay}
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? (
              <Pause className="size-4 fill-current" />
            ) : (
              <Play className="ml-0.5 size-4 fill-current" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <section
      id="credits"
      className="relative flex h-full min-h-0 w-screen shrink-0 flex-col overflow-hidden bg-white text-zinc-900"
    >
      <header className="relative z-10 shrink-0 border-b border-zinc-200/80 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <p
          className="text-[8px] uppercase tracking-[0.42em] text-red-700"
          style={{ fontFamily: "var(--font-cinematic)" }}
        >
          End credits
        </p>
        <h1 className="section-heading mt-1 text-xl sm:text-2xl">Credits</h1>
        <p className="mt-1 max-w-2xl text-[10px] leading-relaxed text-zinc-600 sm:text-[11px]" style={{ fontFamily: "var(--font-screenplay)" }}>
          Roll timed to{" "}
          <span className="font-medium text-red-800">{creditsSong.title}</span>
          {creditsSong.writtenBy ? ` · ${creditsSong.writtenBy}` : ""}.
        </p>
      </header>

      <div className="relative z-10 flex min-h-0 flex-1 overflow-hidden">
        {/* Left rail — quote + thanks in logo script */}
        <aside className="hidden min-h-0 w-44 shrink-0 flex-col border-r border-zinc-200/90 bg-zinc-50/40 px-3 py-4 md:flex md:flex-col lg:w-52">
          <CreditsSidebarInk
            quote={creditsSidebarLeft.quote}
            thankYou={creditsSidebarLeft.thankYou}
            quoteRotate="rotate(-0.65deg)"
            thanksRotate="rotate(0.5deg)"
          />
        </aside>

        {/* Center — 21:9 player + transport; width capped so the stack fits without vertical scroll */}
        <div className="flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-hidden px-3 py-2 sm:px-4 sm:py-3 lg:px-6">
          <div className="mx-auto w-[min(100%,1100px,calc((100dvh-17.5rem)*21/9))] max-w-full shrink-0">
            <div className="overflow-hidden rounded-2xl bg-black shadow-[0_12px_48px_-16px_rgba(234,179,8,0.12)] ring-1 ring-amber-900/40">
              <div className="relative aspect-[21/9] w-full overflow-hidden bg-black">
                <DisneyCreditsBackdrop reducedMotion={reduceMotion} />
                {!reduceMotion ? (
                  <div
                    className="absolute inset-0 z-[1] overflow-hidden"
                    role="region"
                    aria-label="Credits sequence"
                    aria-live="polite"
                  >
                    {reelChrome}
                    <div className="absolute inset-0 z-[2] flex items-center justify-center px-2 py-2 sm:px-5 sm:py-3 md:px-8 md:py-4">
                      {Array.from({ length: CARD_COUNT }, (_, idx) => {
                        const op = chunkOpacity(idx, currentTime, duration, CARD_COUNT, idleAtStart, audioEnded);
                        if (op < 0.003) return null;
                        return (
                          <div
                            key={idx}
                            className="absolute inset-0 flex items-center justify-center overflow-hidden px-1 sm:px-3"
                            style={{ opacity: op, pointerEvents: "none" }}
                          >
                            <div
                              className="max-h-full w-full overflow-y-auto overflow-x-hidden wrap-anywhere"
                              style={{ scrollbarWidth: "none" }}
                            >
                              {renderMovieCard(idx)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div
                    className="absolute inset-0 z-[1] overflow-y-auto px-3 py-4 sm:px-6 sm:py-6"
                    style={{ scrollbarWidth: "none" }}
                  >
                    <p className="mb-5 text-[11px] text-zinc-400" style={{ fontFamily: "var(--font-screenplay)" }}>
                      Reduced motion: static list. Use the player below for {creditsSong.title}.
                    </p>
                    <div className="space-y-14">
                      {Array.from({ length: CARD_COUNT }, (_, idx) => (
                        <div key={idx} className="border-b border-white/10 pb-12 text-white last:border-0">
                          {renderMovieCard(idx)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {playerChrome}
            </div>
          </div>
        </div>

        {/* Right rail — quote + thanks in logo script */}
        <aside className="hidden min-h-0 w-44 shrink-0 flex-col border-l border-zinc-200/90 bg-zinc-50/40 px-3 py-4 md:flex md:flex-col lg:w-52">
          <CreditsSidebarInk
            quote={creditsSidebarRight.quote}
            thankYou={creditsSidebarRight.thankYou}
            quoteRotate="rotate(0.55deg)"
            thanksRotate="rotate(-0.55deg)"
          >
            <p
              className="mt-4 text-[8px] leading-relaxed text-zinc-500"
              style={{ fontFamily: "var(--font-screenplay)" }}
            >
              End-credits roll uses &ldquo;{creditsSong.title}.&rdquo;
            </p>
          </CreditsSidebarInk>
        </aside>
      </div>
    </section>
  );
}