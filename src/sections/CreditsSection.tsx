"use client";

import { useRef, useState, useEffect, useCallback, useSyncExternalStore, type ReactNode } from "react";
import Image from "next/image";
import { Play, Pause, RotateCcw } from "lucide-react";
import { songs } from "@/data/songs";
import { crew } from "@/data/crew";
import { characters } from "@/data/characters";
import type { Character } from "@/data/characters";
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
  const lineFrom = darkStage ? "from-white/25" : "from-red-400/45";
  const lineTo = darkStage ? "to-transparent" : "to-transparent";
  const dots = darkStage ? "text-zinc-500" : "text-red-800";
  const label = darkStage ? "text-zinc-400" : "text-red-700";
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

function FilmCorners({ darkStage }: { darkStage?: boolean }) {
  const line = darkStage ? "1px solid rgba(255,255,255,0.22)" : "1px solid rgba(14, 116, 144, 0.35)";
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

function SidebarSectionTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn("mb-2 shrink-0 text-[8px] uppercase tracking-[0.36em] text-red-700", className)}
      style={{ fontFamily: "var(--font-cinematic)" }}
    >
      {children}
    </div>
  );
}

function SidebarBillingRow({
  category,
  name,
  detail,
}: {
  category: string;
  name: string;
  detail?: string;
}) {
  return (
    <div className="border-b border-zinc-200/75 py-2.5 first:pt-0 last:border-b-0">
      <p
        className="text-[7px] uppercase leading-tight tracking-[0.3em] text-zinc-500"
        style={{ fontFamily: "var(--font-cinematic)" }}
      >
        {category}
      </p>
      <p
        className="mt-1 text-[10px] uppercase leading-snug tracking-[0.1em] text-zinc-900"
        style={{ fontFamily: "var(--font-credits-ornate)" }}
      >
        {name}
      </p>
      {detail ? (
        <p
          className="mt-0.5 text-[9px] leading-snug text-zinc-600"
          style={{ fontFamily: "var(--font-screenplay)" }}
        >
          {detail}
        </p>
      ) : null}
    </div>
  );
}

/** More title cards = shorter slices per track = snappier credits. */
const CARD_COUNT = 19;

const PRODUCTION_BILLING = [
  "Executive Producer — in development",
  "Producer — in development",
  "Director — TBD",
  "Production Designer — TBD",
  "Editorial & storyboarding — in development",
  "Animation pipeline — TBD",
  "Music supervision & vocal production — TBD",
  "Sound design & re-recording mix — TBD",
] as const;

export function CreditsSection() {
  const creditsSong = songs.find((s) => s.id === "red-magic")!;
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
          <div className="flex flex-col items-center justify-center text-center">
            <p className="text-4xl text-white sm:text-5xl md:text-6xl" style={{ fontFamily: "var(--font-title)", letterSpacing: "0.02em" }}>
              Flower
            </p>
            <p className="mt-5 text-[15px] font-medium italic leading-relaxed text-zinc-400 sm:text-base" style={{ fontFamily: body }}>
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
              This sequence timed to “{creditsSong.title}.” On-screen text and timing are a presentation mock-up, not a
              final master.
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
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[10%] bg-linear-to-b from-black via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[12%] bg-linear-to-t from-black via-transparent to-transparent" />
    </>
  );

  const playerChrome = (
    <div className="border-t border-white/10 bg-zinc-950 px-3 py-2 sm:px-4 sm:py-2.5">
      <div className="flex flex-col gap-2">
        <button
          type="button"
          className="group relative h-1 w-full cursor-pointer overflow-hidden rounded-full bg-white/15"
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
            className="pointer-events-none absolute inset-y-0 left-0 rounded-full bg-red-600 transition-[width] duration-150 ease-out group-hover:bg-red-500"
            style={{ width: `${progress}%` }}
          />
        </button>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md ring-1 ring-white/10 sm:h-10 sm:w-10">
            <Image src={creditsSong.image} alt="" fill className="object-cover object-top" sizes="40px" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
              <p
                className="truncate text-[10px] font-medium uppercase tracking-[0.14em] text-white sm:text-[11px]"
                style={{ fontFamily: "var(--font-cinematic)" }}
              >
                {creditsSong.title}
              </p>
              <span
                className="text-[8px] tabular-nums text-zinc-500 sm:text-[9px]"
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
            className="hidden shrink-0 text-[9px] tabular-nums tracking-wide text-zinc-400 sm:inline"
            style={{ fontFamily: "var(--font-screenplay)" }}
          >
            {fmt(currentTime)} / {fmt(duration || 0)}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 rounded-full text-zinc-300 hover:bg-white/10 hover:text-white"
            onClick={replay}
            aria-label="Restart song and credits"
          >
            <RotateCcw className="size-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            className={cn(
              "h-9 w-9 shrink-0 rounded-full border-0 shadow-md sm:h-10 sm:w-10",
              playing ? "bg-white text-zinc-900 hover:bg-zinc-100" : "bg-red-600 text-white hover:bg-red-500",
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
          Roll timed to <span className="font-medium text-red-700">{creditsSong.title}</span>
          {creditsSong.writtenBy ? ` · ${creditsSong.writtenBy}` : ""}.
        </p>
      </header>

      <div className="relative z-10 flex min-h-0 flex-1 overflow-hidden">
        {/* Left rail — principal & production billing */}
        <aside className="hidden min-h-0 w-44 shrink-0 flex-col border-r border-zinc-200/90 bg-zinc-50/40 px-3 py-4 md:flex md:flex-col lg:w-52">
          <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin]">
            <SidebarSectionTitle>Principal credits</SidebarSectionTitle>
            <SidebarBillingRow category={creator.role} name={creator.name} />
            {leigh ? (
              <>
                <SidebarBillingRow category={leigh.role} name={leigh.name} />
                <SidebarBillingRow
                  category="Words & music"
                  name="Leigh Akin"
                  detail="Original songs for the feature"
                />
              </>
            ) : null}
            <SidebarSectionTitle className="mt-5">In development</SidebarSectionTitle>
            <ul
              className="mt-1 list-none space-y-1.5 text-[9px] leading-snug text-zinc-600"
              style={{ fontFamily: "var(--font-screenplay)" }}
            >
              {PRODUCTION_BILLING.map((line) => (
                <li key={line} className="border-b border-zinc-200/60 pb-1.5 last:border-0">
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Center — 21:9 player + transport; width capped so the stack fits without vertical scroll */}
        <div className="flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-hidden px-3 py-2 sm:px-4 sm:py-3 lg:px-6">
          <div className="mx-auto w-[min(100%,1100px,calc((100dvh-17.5rem)*21/9))] max-w-full shrink-0">
            <div className="overflow-hidden rounded-2xl bg-black shadow-[0_12px_48px_-16px_rgba(0,0,0,0.4)] ring-1 ring-black/25">
              <div className="relative aspect-[21/9] w-full bg-black">
                {!reduceMotion ? (
                  <div
                    className="absolute inset-0 overflow-hidden"
                    role="region"
                    aria-label="Credits sequence"
                    aria-live="polite"
                  >
                    {reelChrome}
                    <div className="absolute inset-0 flex items-center justify-center px-2 py-2 sm:px-5 sm:py-3 md:px-8 md:py-4">
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
                    className="absolute inset-0 overflow-y-auto px-3 py-4 sm:px-6 sm:py-6"
                    style={{ scrollbarWidth: "none" }}
                  >
                    <p className="mb-5 text-[11px] text-zinc-500" style={{ fontFamily: "var(--font-screenplay)" }}>
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

        {/* Right rail — cast & song billing */}
        <aside className="hidden min-h-0 w-44 shrink-0 flex-col border-l border-zinc-200/90 bg-zinc-50/40 px-3 py-4 md:flex md:flex-col lg:w-52">
          <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin]">
            <SidebarSectionTitle>Cast of characters</SidebarSectionTitle>
            {characters.map((c) => (
              <SidebarBillingRow key={c.id} category={c.role} name={c.name} />
            ))}
            <SidebarSectionTitle className="mt-5">Original songs</SidebarSectionTitle>
            {songs.map((s) => (
              <SidebarBillingRow
                key={s.id}
                category={s.title}
                name={s.singers}
                detail={s.writtenBy ? `Words & music · ${s.writtenBy}` : undefined}
              />
            ))}
            <p
              className="mt-4 text-[8px] leading-relaxed text-zinc-500"
              style={{ fontFamily: "var(--font-screenplay)" }}
            >
              End-credits roll uses &ldquo;{creditsSong.title}.&rdquo;
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}