"use client";

import { useRef, useState, useEffect, useCallback, useSyncExternalStore, type ReactNode } from "react";
import Image from "next/image";
import { Play, Pause, RotateCcw } from "lucide-react";
import { songs } from "@/data/songs";
import { crew } from "@/data/crew";
import { scriptPages } from "@/data/script";
import { characters } from "@/data/characters";
import type { Character } from "@/data/characters";
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

/**
 * One chunk at a time: fade in, hold, fade out within its slice of the track.
 * Chunks do not overlap the next — brief black between slices.
 */
const CHUNK_FADE_FRAC = 0.2; // fraction of each chunk's window for fade-in / fade-out

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

function CreditCardLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-5 flex w-full flex-col items-center">
      <div className="mb-3 flex w-full max-w-xs items-center justify-center gap-3">
        <span className="h-px min-w-[2rem] flex-1 bg-linear-to-l from-red-400/45 to-transparent" aria-hidden />
        <span
          className="shrink-0 px-1 text-[10px] leading-none tracking-[0.4em] text-red-800"
          style={{ fontFamily: "var(--font-credits-ornate)" }}
          aria-hidden
        >
          ···
        </span>
        <span className="h-px min-w-[2rem] flex-1 bg-linear-to-r from-red-400/45 to-transparent" aria-hidden />
      </div>
      <p className="text-center text-[9px] uppercase tracking-[0.38em] text-red-700" style={{ fontFamily: "var(--font-cinematic)" }}>
        {children}
      </p>
    </div>
  );
}

function CastPair({ c }: { c: Character }) {
  return (
    <div className="min-w-[42%] text-center">
      <p
        className="text-xl uppercase tracking-[0.14em] text-zinc-900 sm:text-2xl"
        style={{ fontFamily: "var(--font-credits-ornate)" }}
      >
        {c.name}
      </p>
      <p
        className="mt-3 text-[13px] italic leading-snug text-zinc-600 sm:text-sm"
        style={{ fontFamily: "var(--font-credits)" }}
      >
        {c.role}
      </p>
    </div>
  );
}

function FilmCorners({ className }: { className?: string }) {
  const line = "1px solid rgba(14, 116, 144, 0.35)";
  const corners = ["top-4 left-4", "top-4 right-4", "bottom-4 left-4", "bottom-4 right-4"] as const;
  return (
    <>
      {corners.map((pos, i) => (
        <div
          key={i}
          className={cn("pointer-events-none absolute z-[1] h-5 w-5", pos, className)}
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

function CreatorPortrait({
  label,
  name,
  imageSrc,
}: {
  label: string;
  name: string;
  imageSrc: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <p className="text-[7px] uppercase leading-tight tracking-[0.32em] text-red-700 md:text-[8px] md:tracking-[0.38em]" style={{ fontFamily: "var(--font-cinematic)" }}>
        {label}
      </p>
      <div className="relative mt-1.5 h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-zinc-200 shadow-md md:h-10 md:w-10">
        <Image src={imageSrc} alt="" fill className="object-cover object-top" sizes="40px" />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-zinc-900/35 via-transparent to-zinc-50/10" />
      </div>
      <p
        className="mt-1.5 max-w-[9rem] text-center text-[9px] uppercase leading-snug tracking-[0.14em] text-zinc-900 md:text-[10px] md:tracking-[0.16em]"
        style={{ fontFamily: "var(--font-credits-ornate)" }}
      >
        {name}
      </p>
    </div>
  );
}

const CARD_COUNT = 10;

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

  const midSong = Math.ceil(songs.length / 2);
  const songsA = songs.slice(0, midSong);
  const songsB = songs.slice(midSong);

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

  const renderMovieCard = (i: number) => {
    switch (i) {
      case 0:
        return (
          <div className="flex flex-col items-center justify-center text-center">
            <p className="text-4xl text-zinc-900 sm:text-5xl md:text-6xl" style={{ fontFamily: "var(--font-title)", letterSpacing: "0.02em" }}>
              Flower
            </p>
            <p
              className="mt-5 text-[15px] font-medium italic leading-relaxed text-zinc-600 sm:text-base"
              style={{ fontFamily: "var(--font-credits)" }}
            >
              An animated musical feature
            </p>
            <div className="mt-10 flex flex-col items-center">
              <p className="text-[9px] uppercase tracking-[0.36em] text-red-700" style={{ fontFamily: "var(--font-cinematic)" }}>
                Created by
              </p>
              <p className="mt-3 text-lg uppercase tracking-[0.2em] text-zinc-900 sm:text-xl" style={{ fontFamily: "var(--font-credits-ornate)" }}>
                {creator.name}
              </p>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="mx-auto flex max-w-md flex-col items-center px-2 text-center">
            <CreditCardLabel>Screen story</CreditCardLabel>
            <p
              className="text-[16px] font-normal leading-[1.8] text-zinc-800 sm:text-lg"
              style={{ fontFamily: "var(--font-credits)" }}
            >
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
                <CreditCardLabel>Writing &amp; music</CreditCardLabel>
                <p className="text-[15px] leading-relaxed text-zinc-800" style={{ fontFamily: "var(--font-credits)" }}>
                  <span className="block text-[10px] uppercase tracking-[0.28em] text-red-700" style={{ fontFamily: "var(--font-cinematic)" }}>
                    Co-written by
                  </span>
                  <span className="mt-2 block text-lg uppercase tracking-[0.16em] text-zinc-900" style={{ fontFamily: "var(--font-credits-ornate)" }}>
                    {leigh.name}
                  </span>
                </p>
                <p className="mt-8 text-[15px] leading-relaxed text-zinc-800" style={{ fontFamily: "var(--font-credits)" }}>
                  <span className="block text-[10px] uppercase tracking-[0.28em] text-red-700" style={{ fontFamily: "var(--font-cinematic)" }}>
                    Original songs by
                  </span>
                  <span className="mt-2 block text-lg uppercase tracking-[0.16em] text-zinc-900" style={{ fontFamily: "var(--font-credits-ornate)" }}>
                    {leigh.name}
                  </span>
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
            <CreditCardLabel>Cast of characters</CreditCardLabel>
            <div className={cn("flex flex-wrap justify-center gap-x-8 gap-y-10", group.length === 3 && "gap-y-8")}>
              {group.map((c) => (
                <CastPair key={c.id} c={c} />
              ))}
            </div>
          </div>
        );
      }
      case 6:
        return (
          <div className="mx-auto max-w-md px-2 text-center">
            <CreditCardLabel>Where it happens</CreditCardLabel>
            <p
              className="text-[16px] font-normal leading-[1.75] text-zinc-800 sm:text-lg"
              style={{ fontFamily: "var(--font-credits)" }}
            >
              Flower High — where flowers are identity, scent is status, and beauty is scored and displayed until the
              story cracks the illusion.
            </p>
          </div>
        );
      case 7:
        return (
          <div className="mx-auto w-full max-w-md px-2">
            <CreditCardLabel>Music in the story</CreditCardLabel>
            <ul className="space-y-5">
              {songsA.map((s) => (
                <li key={s.id} className="text-center">
                  <p className="text-base uppercase tracking-[0.12em] text-zinc-900 sm:text-lg" style={{ fontFamily: "var(--font-credits-ornate)" }}>
                    {s.title}
                  </p>
                  <p className="mt-1.5 text-[13px] italic text-zinc-600" style={{ fontFamily: "var(--font-credits)" }}>
                    {s.singers}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        );
      case 8:
        return (
          <div className="mx-auto w-full max-w-md px-2">
            <CreditCardLabel>Music in the story</CreditCardLabel>
            <ul className="space-y-5">
              {songsB.map((s) => (
                <li key={s.id} className="text-center">
                  <p className="text-base uppercase tracking-[0.12em] text-zinc-900 sm:text-lg" style={{ fontFamily: "var(--font-credits-ornate)" }}>
                    {s.title}
                  </p>
                  <p className="mt-1.5 text-[13px] italic text-zinc-600" style={{ fontFamily: "var(--font-credits)" }}>
                    {s.singers}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        );
      case 9:
        return (
          <div className="mx-auto flex max-w-md flex-col items-center px-2 text-center">
            <CreditCardLabel>Thank you</CreditCardLabel>
            <p
              className="mt-2 text-[16px] font-normal leading-[1.75] text-zinc-700 sm:text-lg"
              style={{ fontFamily: "var(--font-credits)" }}
            >
              To everyone who read early drafts, listened to demos, and helped this world take shape.
            </p>
            <p
              className="mt-12 text-xs uppercase tracking-[0.32em] text-red-700"
              style={{ fontFamily: "var(--font-credits-ornate)" }}
            >
              FLOWER
            </p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.28em] text-zinc-400" style={{ fontFamily: "var(--font-cinematic)" }}>
              All rights reserved
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section
      id="credits"
      className="relative flex w-screen shrink-0 flex-col overflow-hidden bg-zinc-50 pt-10 sm:pt-11 md:pt-12"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_42%,rgba(239,68,68,0.08)_0%,transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(244,244,245,0.95)_100%)]" />

      <div className="relative shrink-0 px-4 sm:px-6 lg:px-8">
        <p className="text-[9px] uppercase tracking-[0.45em] text-red-800" style={{ fontFamily: "var(--font-cinematic)" }}>
          End credits
        </p>
        <h1 className="section-heading mt-0.5 text-2xl sm:text-3xl">Credits</h1>
        <p
          className="mt-1.5 text-[10px] text-zinc-500 md:hidden"
          style={{ fontFamily: "var(--font-screenplay)" }}
        >
          {creator.name}
          {leigh && ` · ${leigh.name}`}
        </p>
        <p className="mt-1 max-w-xl text-[11px] leading-relaxed text-zinc-500 md:mt-1" style={{ fontFamily: "var(--font-screenplay)" }}>
          In time with <span className="font-medium text-red-800">{creditsSong.title}</span>
          {creditsSong.writtenBy ? ` · ${creditsSong.writtenBy}` : ""}.
        </p>
      </div>

      <div className="relative flex min-h-0 flex-1 gap-3 px-3 pt-1.5 sm:gap-5 sm:px-4 sm:pt-2 lg:gap-6 lg:px-6">
        <aside className="hidden min-h-0 w-[9.25rem] shrink-0 flex-col items-center gap-5 overflow-y-auto border-r border-zinc-200 pr-3 pt-0 md:flex lg:w-40 lg:gap-6">
          <CreatorPortrait label="Created by" name={creator.name} imageSrc={creator.image} />
          {leigh && <CreatorPortrait label="Co-written · Songs" name={leigh.name} imageSrc={leigh.image} />}
        </aside>

        {/* Center — sequential fade stage (flex-1 must shrink: min-w-0) */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          {!reduceMotion ? (
            <div
              className="relative min-h-0 flex-1 overflow-hidden rounded-sm border border-zinc-200 bg-[#fefdfb] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_8px_40px_rgba(0,0,0,0.06)]"
              role="region"
              aria-label="Credits sequence"
              aria-live="polite"
            >
              <FilmCorners />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.9)_0%,transparent_60%)]" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[12%] bg-linear-to-b from-zinc-100/90 via-transparent to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[14%] bg-linear-to-t from-zinc-100/90 via-transparent to-transparent" />
              <div className="relative flex h-full min-h-0 items-center justify-center px-2 py-4 sm:px-8 sm:py-6 md:px-10 md:py-8">
                {Array.from({ length: CARD_COUNT }, (_, i) => {
                  const op = chunkOpacity(i, currentTime, duration, CARD_COUNT, idleAtStart, audioEnded);
                  if (op < 0.003) return null;
                  return (
                    <div
                      key={i}
                      className="absolute inset-0 flex items-center justify-center overflow-hidden px-1 sm:px-2"
                      style={{ opacity: op, pointerEvents: "none" }}
                    >
                      <div className="max-h-full w-full overflow-hidden [overflow-wrap:anywhere]">
                        {renderMovieCard(i)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div
              className="min-h-[36vh] flex-1 overflow-y-auto rounded-sm border border-zinc-200 bg-[#fefdfb] px-4 py-5 sm:px-6"
              style={{ scrollbarWidth: "none" }}
            >
              <p className="mb-6 text-[11px] text-zinc-500" style={{ fontFamily: "var(--font-screenplay)" }}>
                Reduced motion: static list. Play below for {creditsSong.title}.
              </p>
              <div className="space-y-16">
                {Array.from({ length: CARD_COUNT }, (_, i) => (
                  <div key={i} className="border-b border-zinc-200/90 pb-12 last:border-0">
                    {renderMovieCard(i)}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div
            className="mt-2 mb-2 flex shrink-0 flex-wrap items-center justify-center gap-x-4 gap-y-1 px-2 text-center text-[10px] tabular-nums tracking-[0.12em] text-red-600 sm:gap-x-5 sm:mb-2 md:gap-x-6"
            style={{ fontFamily: "var(--font-screenplay)" }}
          >
            <span className="whitespace-nowrap">
              Reel {visibleIndex + 1} / {CARD_COUNT}
            </span>
            <span className="hidden h-3 w-px shrink-0 bg-zinc-200 sm:block" aria-hidden />
            <span className="whitespace-nowrap text-zinc-500">
              {fmt(currentTime)} / {fmt(duration || 0)}
            </span>
          </div>
        </div>

        <aside className="hidden min-h-0 w-[11.5rem] shrink-0 flex-col gap-3 overflow-y-auto border-l border-zinc-200 pl-4 pt-0 md:flex lg:w-52 lg:gap-3.5 lg:pl-5">
          <div className="rounded-sm border border-zinc-200 bg-white p-3 shadow-sm backdrop-blur-[2px]">
            <p className="mb-2 text-[8px] uppercase tracking-[0.32em] text-red-700" style={{ fontFamily: "var(--font-cinematic)" }}>
              Playback
            </p>
            <p className="text-[10px] leading-relaxed text-zinc-600" style={{ fontFamily: "var(--font-screenplay)" }}>
              Play syncs each title card to {creditsSong.title}: fade in, hold, fade out to black. Pause holds picture and
              sound. Restart from frame one.
            </p>
          </div>
          <div className="rounded-sm border border-zinc-200 bg-white p-3 shadow-sm backdrop-blur-[2px]">
            <p className="mb-2 text-[8px] uppercase tracking-[0.32em] text-red-700" style={{ fontFamily: "var(--font-cinematic)" }}>
              Picture bible
            </p>
            <dl className="space-y-2.5 text-[10px]">
              <div>
                <dt className="text-zinc-500" style={{ fontFamily: "var(--font-screenplay)" }}>
                  Format
                </dt>
                <dd className="text-zinc-800" style={{ fontFamily: "var(--font-cinematic)" }}>
                  Animated musical (in development)
                </dd>
              </div>
              <div>
                <dt className="text-zinc-500" style={{ fontFamily: "var(--font-screenplay)" }}>
                  Scenes in draft
                </dt>
                <dd className="text-zinc-800" style={{ fontFamily: "var(--font-cinematic)" }}>
                  {scriptPages.length}
                </dd>
              </div>
              <div>
                <dt className="text-zinc-500" style={{ fontFamily: "var(--font-screenplay)" }}>
                  Songs
                </dt>
                <dd className="text-zinc-800" style={{ fontFamily: "var(--font-cinematic)" }}>
                  {songs.length}
                </dd>
              </div>
              <div>
                <dt className="text-zinc-500" style={{ fontFamily: "var(--font-screenplay)" }}>
                  Story roles
                </dt>
                <dd className="text-zinc-800" style={{ fontFamily: "var(--font-cinematic)" }}>
                  {characters.length}
                </dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>

      {/* Player above #credits bottom padding (globals); modest top gap keeps reel from crowding transport */}
      <div className="relative shrink-0 px-4 pt-3 pb-1.5 sm:px-6 sm:pt-4 sm:pb-2 lg:px-8">
        <div className="mx-auto flex max-w-4xl items-center gap-3 rounded-sm border border-zinc-200 bg-white px-4 py-3 sm:gap-4 sm:px-5 shadow-lg shadow-zinc-900/10 backdrop-blur-md">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-sm ring-1 ring-zinc-200">
            <Image src={creditsSong.image} alt="" fill className="object-cover object-top" sizes="44px" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold uppercase tracking-[0.12em] text-zinc-900" style={{ fontFamily: "var(--font-cinematic)" }}>
              {creditsSong.title}
            </p>
            <p className="mt-0.5 truncate text-[10px] text-zinc-600" style={{ fontFamily: "var(--font-screenplay)" }}>
              {creditsSong.singers}
              {creditsSong.writtenBy && ` · ${creditsSong.writtenBy}`}
            </p>
            <div className="mt-2 h-px w-full overflow-hidden bg-zinc-100">
              <div
                className="h-full bg-linear-to-r from-red-500 to-red-400 transition-none"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <span className="shrink-0 text-[10px] tabular-nums tracking-wider text-red-800" style={{ fontFamily: "var(--font-screenplay)" }}>
            {fmt(currentTime)} / {fmt(duration || 0)}
          </span>
          <button
            type="button"
            onClick={replay}
            aria-label="Restart song and credits"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-zinc-700 transition-all hover:border-red-400 hover:bg-red-50 hover:text-red-900"
          >
            <RotateCcw className="size-4" />
          </button>
          <button
            type="button"
            onClick={togglePlay}
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all",
              playing
                ? "border-red-600 bg-red-600 text-white shadow-md"
                : "border-zinc-200 bg-white text-red-800 hover:border-red-400 hover:bg-red-50"
            )}
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? <Pause className="size-4 fill-current" /> : <Play className="ml-0.5 size-4 fill-current" />}
          </button>
        </div>
      </div>
    </section>
  );
}
