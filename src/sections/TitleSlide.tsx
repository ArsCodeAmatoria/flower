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
      className="relative h-full min-h-0 w-screen shrink-0 overflow-hidden bg-black"
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

      {/* Readability: grade over photo */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_72%_65%_at_50%_45%,rgba(0,0,0,0.22)_0%,rgba(0,0,0,0.5)_45%,rgba(0,0,0,0.88)_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-black/25 to-black/70"
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
            className="order-1 text-center text-[10px] uppercase tracking-[0.38em] text-white/82 lg:col-span-3 lg:mb-1 sm:text-xs sm:tracking-[0.45em]"
            style={{
              fontFamily: "var(--font-cinematic)",
              animation: "fadeIn 1.4s ease both",
              animationDelay: "0.25s",
              textShadow: "0 1px 14px rgba(0,0,0,0.85)",
            }}
          >
            To flower is to become
          </p>

          <p
            className="order-3 max-w-md justify-self-center px-2 text-center text-[12px] leading-relaxed text-white/88 sm:text-[13px] lg:order-none lg:col-start-1 lg:row-start-2 lg:max-w-sm lg:justify-self-end lg:self-center lg:pr-4 lg:text-right xl:pr-6"
            style={{
              fontFamily: "var(--font-screenplay)",
              animation: "fadeIn 1.5s ease both",
              animationDelay: "0.55s",
              textShadow: "0 1px 14px rgba(0,0,0,0.88)",
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
                  className="object-contain drop-shadow-[0_6px_48px_rgba(0,0,0,0.85)]"
                  sizes="(max-width: 1024px) 88vw, 22rem"
                  onError={() => setLogoFailed(true)}
                />
              </div>
            ) : (
              <h1
                className="select-none text-center leading-[0.92] text-white"
                style={{
                  fontFamily: "var(--font-title)",
                  fontSize: "clamp(3.75rem, 16vw, 11rem)",
                  fontWeight: 400,
                  letterSpacing: "0.02em",
                  textShadow:
                    "0 0 100px rgba(255,255,255,0.14), 0 3px 0 rgba(255,255,255,0.12), 0 8px 36px rgba(0,0,0,0.65), 0 18px 52px rgba(0,0,0,0.55)",
                  WebkitTextStroke: "0.35px rgba(255,255,255,0.35)",
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
              textShadow: "0 1px 12px rgba(0,0,0,0.85)",
            }}
          >
            <p
              className="text-[10px] uppercase tracking-[0.28em] text-white/58 sm:text-[11px] sm:tracking-[0.3em]"
              style={{ fontFamily: "var(--font-cinematic)" }}
            >
              {creator.name}
            </p>
            <p
              className="text-[9px] uppercase tracking-[0.22em] text-white/48 sm:text-[10px] sm:tracking-[0.25em]"
              style={{ fontFamily: "var(--font-cinematic)" }}
            >
              {creator.role}
            </p>
            {coWriter && (
              <>
                <p
                  className="mt-2 text-[8px] uppercase tracking-[0.24em] text-white/42 sm:mt-2.5 sm:text-[9px] sm:tracking-[0.28em]"
                  style={{ fontFamily: "var(--font-cinematic)" }}
                >
                  Co-written by {coWriter.name}
                </p>
                <p
                  className="mt-1 text-[8px] uppercase tracking-[0.2em] text-white/36 sm:text-[9px]"
                  style={{ fontFamily: "var(--font-cinematic)" }}
                >
                  Songs by {coWriter.name}
                </p>
              </>
            )}
          </div>

        <div
          className="order-5 justify-self-center lg:col-span-3 lg:row-start-3 mt-1 flex max-w-[min(100%,24rem)] items-center gap-3 rounded-2xl border border-white/18 bg-black/35 px-4 py-3 backdrop-blur-md sm:gap-4 sm:px-5"
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
                  playing ? "bg-white/60" : "bg-white/22"
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
              className="truncate text-[11px] font-semibold text-white/90 sm:text-xs"
              style={{ fontFamily: "var(--font-cinematic)" }}
            >
              {heroSong.title}
            </p>
            <p
              className="text-[9px] text-white/50 sm:text-[10px]"
              style={{ fontFamily: "var(--font-screenplay)" }}
            >
              {heroSong.singers}
            </p>
          </div>

          <button
            type="button"
            onClick={replay}
            aria-label="Replay"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/55 transition-all hover:border-white/35 hover:bg-white/15 hover:text-white"
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
                ? "border-white/50 bg-white text-black"
                : "border-white/35 bg-white/15 text-white hover:border-white/55 hover:bg-white/25"
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
              "pointer-events-none absolute z-[5] h-7 w-7 opacity-25 sm:h-8 sm:w-8",
              pos,
            )}
            style={{
              borderTop: i < 2 ? "1px solid white" : "none",
              borderBottom: i >= 2 ? "1px solid white" : "none",
              borderLeft: i % 2 === 0 ? "1px solid white" : "none",
              borderRight: i % 2 === 1 ? "1px solid white" : "none",
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
