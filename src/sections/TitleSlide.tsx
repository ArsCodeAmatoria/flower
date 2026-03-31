"use client";

import Image from "next/image";
import { useRef, useState, useCallback } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { songs } from "@/data/songs";
import { crew } from "@/data/crew";
import { cn } from "@/lib/utils";

const heroSong = songs.find((s) => s.id === "see-it-my-way")!;
const creator = crew[0];
const coWriter = crew.find((m) => m.id === "leigh-akin");

const HOME_HEADER_SRC = "/images/header1.png";

/** Add `public/images/logo.png` (or .svg via img) for the lockup; falls back to type if missing. */
const HOME_LOGO_SRC = "/images/logo.png";

const FLOWER_LOGLINE =
  "A scentless flower girl in a world of hue and perfume finds her difference isn’t tragic, but magic.";

export function TitleSlide() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  const togglePlay = useCallback(() => {
    if (playing) {
      audioRef.current?.pause();
      setPlaying(false);
    } else {
      if (!audioRef.current) {
        const audio = new Audio(heroSong.audioSrc);
        audio.addEventListener("ended", () => setPlaying(false));
        audioRef.current = audio;
      }
      audioRef.current.play().catch(() => {});
      setPlaying(true);
    }
  }, [playing]);

  const replay = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    } else {
      const audio = new Audio(heroSong.audioSrc);
      audio.addEventListener("ended", () => setPlaying(false));
      audioRef.current = audio;
    }
    audioRef.current!.play().catch(() => {});
    setPlaying(true);
  }, []);

  return (
    <section
      id="title"
      className="relative h-full min-h-0 w-screen shrink-0 overflow-hidden bg-zinc-50"
    >
      {/* Full-screen key art */}
      <div className="absolute inset-0">
        <Image
          src={HOME_HEADER_SRC}
          alt="Flower — key art"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      {/* Light scrim — balance: art still reads, type a bit clearer (not a full wash) */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_82%_75%_at_50%_45%,rgba(255,255,255,0.38)_0%,rgba(255,255,255,0.14)_42%,rgba(255,255,255,0.52)_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/22 via-white/8 to-white/58"
        aria-hidden
      />

      {/* Logo center, copy around (grid on large screens) */}
      <div
        className="relative z-10 flex h-full min-h-0 flex-col justify-center px-4 sm:px-6"
        style={{
          paddingTop: "max(1.25rem, env(safe-area-inset-top, 0px))",
          paddingBottom: "calc(var(--floating-nav-clearance) + 0.75rem)",
        }}
      >
        <div className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 content-center gap-5 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(14rem,24rem)_minmax(0,1fr)] lg:gap-x-10 lg:gap-y-5 xl:gap-x-14">
          <p
            className="order-1 text-center text-[10px] uppercase tracking-[0.38em] text-neutral-950 lg:col-span-3 lg:mb-1 sm:text-xs sm:tracking-[0.45em]"
            style={{
              fontFamily: "var(--font-cinematic)",
              animation: "fadeIn 1.4s ease both",
              animationDelay: "0.25s",
              textShadow:
                "0 0 16px rgba(255,255,255,0.9), 0 1px 2px rgba(0,0,0,0.18)",
            }}
          >
            To flower is to become
          </p>

          <p
            className="order-3 max-w-md justify-self-center px-2 text-center text-[12px] font-medium leading-relaxed text-neutral-950 sm:text-[13px] lg:order-none lg:col-start-1 lg:row-start-2 lg:max-w-sm lg:justify-self-end lg:self-center lg:pr-4 lg:text-right xl:pr-6"
            style={{
              fontFamily: "var(--font-screenplay)",
              animation: "fadeIn 1.5s ease both",
              animationDelay: "0.55s",
              textShadow:
                "0 0 14px rgba(255,255,255,0.88), 0 1px 2px rgba(0,0,0,0.2)",
            }}
          >
            {FLOWER_LOGLINE}
          </p>

          <div
            className="order-2 flex justify-center px-5 py-6 sm:px-8 sm:py-8 lg:order-none lg:col-start-2 lg:row-start-2 lg:px-10 lg:py-10 xl:px-14 xl:py-12"
            style={{ animation: "titleReveal 1.1s cubic-bezier(0.16,1,0.3,1) both" }}
          >
            {!logoFailed ? (
              <div className="relative aspect-[5/3] w-[min(82vw,18rem)] shrink-0 sm:w-[min(76vw,22rem)] lg:w-full lg:max-w-[min(34vw,21rem)]">
                <Image
                  src={HOME_LOGO_SRC}
                  alt="Flower"
                  fill
                  priority
                  className="object-contain drop-shadow-[0_8px_40px_rgba(0,0,0,0.12)]"
                  sizes="(max-width: 1024px) 88vw, 22rem"
                  onError={() => setLogoFailed(true)}
                />
              </div>
            ) : (
              <h1
                className="select-none text-center leading-[0.92] text-neutral-950"
                style={{
                  fontFamily: "var(--font-logo-script)",
                  fontSize: "clamp(3.75rem, 16vw, 11rem)",
                  fontWeight: 700,
                  letterSpacing: "0.01em",
                  textShadow:
                    "0 0 20px rgba(255,255,255,0.85), 0 2px 8px rgba(0,0,0,0.12)",
                  WebkitTextStroke: "0.5px rgba(255,255,255,0.35)",
                }}
              >
                Flower
              </h1>
            )}
          </div>

          <div
            className="order-4 flex max-w-md flex-col items-center gap-1 justify-self-center px-2 text-center lg:col-start-3 lg:row-start-2 lg:max-w-[16.5rem] lg:items-start lg:justify-self-start lg:self-center lg:pl-4 lg:text-left xl:pl-6"
            style={{
              animation: "fadeIn 1.6s ease both",
              animationDelay: "0.75s",
              textShadow: "0 0 12px rgba(255,255,255,0.85), 0 1px 2px rgba(0,0,0,0.12)",
            }}
          >
            <p
              className="text-[10px] uppercase tracking-[0.28em] text-neutral-950 sm:text-[11px] sm:tracking-[0.3em]"
              style={{ fontFamily: "var(--font-cinematic)" }}
            >
              {creator.name}
            </p>
            <p
              className="text-[9px] uppercase tracking-[0.22em] text-neutral-900 sm:text-[10px] sm:tracking-[0.25em]"
              style={{ fontFamily: "var(--font-cinematic)" }}
            >
              {creator.role}
            </p>
            {coWriter && (
              <>
                <p
                  className="mt-2 text-[8px] uppercase tracking-[0.24em] text-neutral-900 sm:mt-2.5 sm:text-[9px] sm:tracking-[0.28em]"
                  style={{ fontFamily: "var(--font-cinematic)" }}
                >
                  Co-written by {coWriter.name}
                </p>
                <p
                  className="mt-1 text-[8px] uppercase tracking-[0.2em] text-neutral-800 sm:text-[9px]"
                  style={{ fontFamily: "var(--font-cinematic)" }}
                >
                  Songs by {coWriter.name}
                </p>
              </>
            )}
          </div>

        <div
          className="order-5 justify-self-center lg:col-span-3 lg:row-start-3 mt-1 flex max-w-[min(100%,24rem)] items-center gap-3 rounded-2xl border border-zinc-200/90 bg-white/85 px-4 py-3 shadow-md shadow-zinc-900/5 backdrop-blur-md sm:gap-4 sm:px-5"
          style={{
            animation: "fadeIn 1.6s ease both",
            animationDelay: "1.25s",
          }}
        >
          <div className="flex items-end gap-px" style={{ height: "18px", width: "32px" }}>
            {Array.from({ length: 8 }, (_, b) => (
              <div
                key={b}
                className={cn(
                  "flex-1 rounded-sm transition-colors duration-300",
                  playing ? "bg-red-600" : "bg-zinc-300"
                )}
                style={{
                  height: `${30 + Math.round(Math.abs(Math.sin(b * 0.7)) * 70)}%`,
                  animation: playing
                    ? `waveBar 0.7s ease-in-out ${b * 0.09}s infinite alternate`
                    : "none",
                }}
              />
            ))}
          </div>

          <div className="min-w-0 flex-1 text-left">
            <p
              className="truncate text-[11px] font-semibold text-neutral-950 sm:text-xs"
              style={{ fontFamily: "var(--font-cinematic)" }}
            >
              {heroSong.title}
            </p>
            <p
              className="text-[9px] text-neutral-900 sm:text-[10px]"
              style={{ fontFamily: "var(--font-screenplay)" }}
            >
              {heroSong.singers}
            </p>
          </div>

          <button
            type="button"
            onClick={replay}
            aria-label="Replay"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-zinc-600 transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-800"
          >
            <RotateCcw className="size-3" />
          </button>

          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? "Pause" : "Play"}
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-200",
              playing
                ? "border-red-700 bg-red-700 text-white"
                : "border-red-500/50 bg-red-50 text-red-800 hover:border-red-500 hover:bg-red-100"
            )}
          >
            {playing ? (
              <Pause className="size-3.5 fill-current" />
            ) : (
              <Play className="ml-0.5 size-3.5 fill-current" />
            )}
          </button>
        </div>
        </div>

        {(
          [
            "top-5 left-5",
            "top-5 right-5",
            "bottom-[calc(var(--floating-nav-clearance)+0.75rem)] left-5 sm:left-6",
            "bottom-[calc(var(--floating-nav-clearance)+0.75rem)] right-5 sm:right-6",
          ] as const
        ).map((pos, i) => (
          <div
            key={i}
            className={cn(
              "pointer-events-none absolute z-[5] h-7 w-7 opacity-35 sm:h-8 sm:w-8",
              pos,
            )}
            style={{
              borderTop: i < 2 ? "1px solid rgba(24,24,27,0.2)" : "none",
              borderBottom: i >= 2 ? "1px solid rgba(24,24,27,0.2)" : "none",
              borderLeft: i % 2 === 0 ? "1px solid rgba(24,24,27,0.2)" : "none",
              borderRight: i % 2 === 1 ? "1px solid rgba(24,24,27,0.2)" : "none",
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes waveBar {
          from { transform: scaleY(0.25); }
          to   { transform: scaleY(1); }
        }
      `}</style>
    </section>
  );
}
