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
        <span className="h-px min-w-[2rem] flex-1 bg-linear-to-l from-amber-200/35 to-transparent" aria-hidden />
        <span
          className="shrink-0 px-1 text-[10px] leading-none tracking-[0.4em] text-amber-200/45"
          style={{ fontFamily: "var(--font-credits-ornate)" }}
          aria-hidden
        >
          ···
        </span>
        <span className="h-px min-w-[2rem] flex-1 bg-linear-to-r from-amber-200/35 to-transparent" aria-hidden />
      </div>
      <p className="text-center text-[9px] uppercase tracking-[0.38em] text-amber-200/60" style={{ fontFamily: "var(--font-cinematic)" }}>
        {children}
      </p>
    </div>
  );
}

function CastPair({ c }: { c: Character }) {
  return (
    <div className="min-w-[42%] text-center">
      <p
        className="text-xl uppercase tracking-[0.14em] text-white drop-shadow-[0_0_20px_rgba(253,230,138,0.12)] sm:text-2xl"
        style={{ fontFamily: "var(--font-credits-ornate)" }}
      >
        {c.name}
      </p>
      <p
        className="mt-3 text-[13px] italic leading-snug text-amber-200/65 sm:text-sm"
        style={{ fontFamily: "var(--font-credits)" }}
      >
        {c.role}
      </p>
    </div>
  );
}

function FilmCorners({ className }: { className?: string }) {
  const line = "1px solid rgba(253, 230, 138, 0.28)";
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
      <p className="text-[7px] uppercase leading-tight tracking-[0.32em] text-amber-200/50 md:text-[8px] md:tracking-[0.38em]" style={{ fontFamily: "var(--font-cinematic)" }}>
        {label}
      </p>
      <div className="relative mt-1.5 h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-amber-200/28 shadow-[0_6px_20px_rgba(0,0,0,0.55)] md:h-10 md:w-10">
        <Image src={imageSrc} alt="" fill className="object-cover object-top" sizes="40px" />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-black/10" />
      </div>
      <p
        className="mt-1.5 max-w-[9rem] text-center text-[9px] uppercase leading-snug tracking-[0.14em] text-white/95 md:text-[10px] md:tracking-[0.16em]"
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
            <p className="text-4xl text-white sm:text-5xl md:text-6xl" style={{ fontFamily: "var(--font-title)", letterSpacing: "0.02em" }}>
              Flower
            </p>
            <p
              className="mt-5 text-[15px] font-medium italic leading-relaxed text-amber-100/55 sm:text-base"
              style={{ fontFamily: "var(--font-credits)" }}
            >
              An animated musical feature
            </p>
            <div className="mt-10 flex flex-col items-center">
              <p className="text-[9px] uppercase tracking-[0.36em] text-amber-200/50" style={{ fontFamily: "var(--font-cinematic)" }}>
                Created by
              </p>
              <p className="mt-3 text-lg uppercase tracking-[0.2em] text-white sm:text-xl" style={{ fontFamily: "var(--font-credits-ornate)" }}>
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
              className="text-[16px] font-normal leading-[1.8] text-white/82 sm:text-lg"
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
                <p className="text-[15px] leading-relaxed text-white/80" style={{ fontFamily: "var(--font-credits)" }}>
                  <span className="block text-[10px] uppercase tracking-[0.28em] text-amber-200/50" style={{ fontFamily: "var(--font-cinematic)" }}>
                    Co-written by
                  </span>
                  <span className="mt-2 block text-lg uppercase tracking-[0.16em] text-white" style={{ fontFamily: "var(--font-credits-ornate)" }}>
                    {leigh.name}
                  </span>
                </p>
                <p className="mt-8 text-[15px] leading-relaxed text-white/80" style={{ fontFamily: "var(--font-credits)" }}>
                  <span className="block text-[10px] uppercase tracking-[0.28em] text-amber-200/50" style={{ fontFamily: "var(--font-cinematic)" }}>
                    Original songs by
                  </span>
                  <span className="mt-2 block text-lg uppercase tracking-[0.16em] text-white" style={{ fontFamily: "var(--font-credits-ornate)" }}>
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
              className="text-[16px] font-normal leading-[1.75] text-white/82 sm:text-lg"
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
                  <p className="text-base uppercase tracking-[0.12em] text-white/92 sm:text-lg" style={{ fontFamily: "var(--font-credits-ornate)" }}>
                    {s.title}
                  </p>
                  <p className="mt-1.5 text-[13px] italic text-amber-200/58" style={{ fontFamily: "var(--font-credits)" }}>
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
                  <p className="text-base uppercase tracking-[0.12em] text-white/92 sm:text-lg" style={{ fontFamily: "var(--font-credits-ornate)" }}>
                    {s.title}
                  </p>
                  <p className="mt-1.5 text-[13px] italic text-amber-200/58" style={{ fontFamily: "var(--font-credits)" }}>
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
              className="mt-2 text-[16px] font-normal leading-[1.75] text-white/72 sm:text-lg"
              style={{ fontFamily: "var(--font-credits)" }}
            >
              To everyone who read early drafts, listened to demos, and helped this world take shape.
            </p>
            <p
              className="mt-12 text-xs uppercase tracking-[0.32em] text-amber-200/40"
              style={{ fontFamily: "var(--font-credits-ornate)" }}
            >
              FLOWER
            </p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.28em] text-white/35" style={{ fontFamily: "var(--font-cinematic)" }}>
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
      className="relative flex h-screen w-screen shrink-0 flex-col overflow-hidden bg-[#030304] pt-14 pb-0"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_42%,rgba(180,140,70,0.07)_0%,transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.88)_100%)]" />

      <div className="relative shrink-0 px-4 sm:px-6 lg:px-8">
        <p className="text-[9px] uppercase tracking-[0.45em] text-amber-200/45" style={{ fontFamily: "var(--font-cinematic)" }}>
          End credits
        </p>
        <h1 className="section-heading mt-1 text-3xl text-white">Credits</h1>
        <p
          className="mt-2 text-[10px] text-white/40 md:hidden"
          style={{ fontFamily: "var(--font-screenplay)" }}
        >
          {creator.name}
          {leigh && ` · ${leigh.name}`}
        </p>
        <p className="mt-1 max-w-xl text-[11px] leading-relaxed text-white/40 md:mt-1" style={{ fontFamily: "var(--font-screenplay)" }}>
          In time with <span className="text-amber-200/80">{creditsSong.title}</span>
          {creditsSong.writtenBy ? ` · ${creditsSong.writtenBy}` : ""}.
        </p>
      </div>

      <div className="relative flex min-h-0 flex-1 gap-3 px-3 pt-3 sm:gap-5 sm:px-4 lg:px-6">
        <aside className="hidden min-h-0 w-[9.25rem] shrink-0 flex-col items-center gap-6 overflow-y-auto border-r border-white/[0.07] pr-3 pt-1 md:flex lg:w-40 lg:gap-7">
          <CreatorPortrait label="Created by" name={creator.name} imageSrc={creator.image} />
          {leigh && <CreatorPortrait label="Co-written · Songs" name={leigh.name} imageSrc={leigh.image} />}
        </aside>

        {/* Center — sequential fade stage (flex-1 must shrink: min-w-0) */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          {!reduceMotion ? (
            <div
              className="relative min-h-[40vh] flex-1 overflow-hidden rounded-sm border border-amber-200/15 bg-[#050608] shadow-[inset_0_0_100px_rgba(0,0,0,0.85)]"
              role="region"
              aria-label="Credits sequence"
              aria-live="polite"
            >
              <FilmCorners />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,252,245,0.04)_0%,transparent_55%)]" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[12%] bg-linear-to-b from-black via-black/80 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[14%] bg-linear-to-t from-black via-black/75 to-transparent" />
              <div className="relative flex h-full min-h-[36vh] items-center justify-center px-3 py-8 sm:px-12 sm:py-12">
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
              className="min-h-[36vh] flex-1 overflow-y-auto rounded-sm border border-amber-200/12 bg-[#050608] px-4 py-5 sm:px-6"
              style={{ scrollbarWidth: "none" }}
            >
              <p className="mb-6 text-[11px] text-white/50" style={{ fontFamily: "var(--font-screenplay)" }}>
                Reduced motion: static list. Play below for {creditsSong.title}.
              </p>
              <div className="space-y-16">
                {Array.from({ length: CARD_COUNT }, (_, i) => (
                  <div key={i} className="border-b border-white/8 pb-12 last:border-0">
                    {renderMovieCard(i)}
                  </div>
                ))}
              </div>
            </div>
          )}

          <p
            className="mt-2 shrink-0 text-center text-[10px] tabular-nums tracking-[0.12em] text-amber-200/35"
            style={{ fontFamily: "var(--font-screenplay)" }}
          >
            Reel {visibleIndex + 1} / {CARD_COUNT} · {fmt(currentTime)} / {fmt(duration || 0)}
          </p>
        </div>

        <aside className="hidden min-h-0 w-[11.5rem] shrink-0 flex-col gap-4 overflow-y-auto border-l border-white/[0.07] pl-4 pt-1 md:flex lg:w-52">
          <div className="rounded-sm border border-amber-200/12 bg-black/50 p-3 backdrop-blur-[2px]">
            <p className="mb-2 text-[8px] uppercase tracking-[0.32em] text-amber-200/50" style={{ fontFamily: "var(--font-cinematic)" }}>
              Playback
            </p>
            <p className="text-[10px] leading-relaxed text-white/42" style={{ fontFamily: "var(--font-screenplay)" }}>
              Play syncs each title card to {creditsSong.title}: fade in, hold, fade out to black. Pause holds picture and
              sound. Restart from frame one.
            </p>
          </div>
          <div className="rounded-sm border border-amber-200/12 bg-black/50 p-3 backdrop-blur-[2px]">
            <p className="mb-2 text-[8px] uppercase tracking-[0.32em] text-amber-200/50" style={{ fontFamily: "var(--font-cinematic)" }}>
              Picture bible
            </p>
            <dl className="space-y-2.5 text-[10px]">
              <div>
                <dt className="text-white/40" style={{ fontFamily: "var(--font-screenplay)" }}>
                  Format
                </dt>
                <dd className="text-white/75" style={{ fontFamily: "var(--font-cinematic)" }}>
                  Animated musical (in development)
                </dd>
              </div>
              <div>
                <dt className="text-white/40" style={{ fontFamily: "var(--font-screenplay)" }}>
                  Scenes in draft
                </dt>
                <dd className="text-white/75" style={{ fontFamily: "var(--font-cinematic)" }}>
                  {scriptPages.length}
                </dd>
              </div>
              <div>
                <dt className="text-white/40" style={{ fontFamily: "var(--font-screenplay)" }}>
                  Songs
                </dt>
                <dd className="text-white/75" style={{ fontFamily: "var(--font-cinematic)" }}>
                  {songs.length}
                </dd>
              </div>
              <div>
                <dt className="text-white/40" style={{ fontFamily: "var(--font-screenplay)" }}>
                  Story roles
                </dt>
                <dd className="text-white/75" style={{ fontFamily: "var(--font-cinematic)" }}>
                  {characters.length}
                </dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>

      {/* Pad below player by floating nav offset + pill height so controls stay clear of the bar */}
      <div
        className="relative shrink-0 px-4 pt-3 sm:px-6 lg:px-8"
        style={{
          paddingBottom:
            "calc(max(1.25rem, env(safe-area-inset-bottom, 0px) + 4.25rem) + 4.5rem + 0.5rem)",
        }}
      >
        <div className="mx-auto flex max-w-4xl items-center gap-4 rounded-sm border border-amber-200/18 bg-black/70 px-5 py-3.5 shadow-[0_8px_40px_rgba(0,0,0,0.55)] backdrop-blur-md">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-sm ring-1 ring-amber-200/25">
            <Image src={creditsSong.image} alt="" fill className="object-cover object-top" sizes="44px" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold uppercase tracking-[0.12em] text-white/95" style={{ fontFamily: "var(--font-cinematic)" }}>
              {creditsSong.title}
            </p>
            <p className="mt-0.5 truncate text-[10px] text-white/48" style={{ fontFamily: "var(--font-screenplay)" }}>
              {creditsSong.singers}
              {creditsSong.writtenBy && ` · ${creditsSong.writtenBy}`}
            </p>
            <div className="mt-2 h-px w-full overflow-hidden bg-white/10">
              <div
                className="h-full bg-linear-to-r from-amber-200/70 to-amber-400/50 transition-none"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <span className="shrink-0 text-[10px] tabular-nums tracking-wider text-amber-200/45" style={{ fontFamily: "var(--font-screenplay)" }}>
            {fmt(currentTime)} / {fmt(duration || 0)}
          </span>
          <button
            type="button"
            onClick={replay}
            aria-label="Restart song and credits"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-amber-200/25 bg-white/5 text-amber-200/70 transition-all hover:border-amber-200/45 hover:bg-amber-200/10 hover:text-amber-100"
          >
            <RotateCcw className="size-4" />
          </button>
          <button
            type="button"
            onClick={togglePlay}
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all",
              playing
                ? "border-amber-200/50 bg-amber-200/15 text-amber-50 shadow-[0_0_24px_rgba(234,179,8,0.2)]"
                : "border-amber-200/25 bg-white/5 text-amber-200/80 hover:border-amber-200/40 hover:bg-amber-200/8"
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
