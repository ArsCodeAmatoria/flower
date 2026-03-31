"use client";

import { useRef, useState, useCallback } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { songs } from "@/data/songs";
import { crew } from "@/data/crew";
import { cn } from "@/lib/utils";

const heroSong = songs.find((s) => s.id === "see-it-my-way")!;
const creator = crew[0];
const coWriter = crew.find((m) => m.id === "leigh-akin");

const FLOWER_LOGLINE =
  "A scentless flower girl in a world of hue and perfume finds her difference isn’t tragic, but magic.";

export function TitleSlide() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

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
      className="relative flex h-full min-h-0 w-screen shrink-0 flex-col items-center justify-center overflow-y-auto overflow-x-hidden bg-black"
    >
      {/* Radial vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.85)_100%)]" />

      {/* Subtle horizon glow */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1/3 bg-linear-to-t from-[rgba(0,30,60,0.4)] to-transparent" />

      {/* FLOWER */}
      <h1
        className="relative z-10 select-none leading-none text-white"
        style={{
          fontFamily: "var(--font-title)",
          fontSize: "clamp(4rem, 18vw, 12rem)",
          animation: "titleReveal 1.2s cubic-bezier(0.16,1,0.3,1) both",
          textShadow:
            "0 0 80px rgba(255,255,255,0.12), 0 8px 40px rgba(0,0,0,0.9)",
          letterSpacing: "0.02em",
        }}
      >
        Flower
      </h1>

      {/* Tagline */}
      <p
        className="relative z-10 mt-6 text-xs uppercase tracking-[0.45em] text-white/40"
        style={{
          fontFamily: "var(--font-cinematic)",
          animation: "fadeIn 1.8s ease both",
          animationDelay: "0.8s",
        }}
      >
        To flower is to become
      </p>

      <p
        className="relative z-10 mx-auto mt-8 max-w-md px-6 text-center text-[13px] leading-relaxed text-white/62"
        style={{
          fontFamily: "var(--font-screenplay)",
          animation: "fadeIn 1.8s ease both",
          animationDelay: "1s",
        }}
      >
        {FLOWER_LOGLINE}
      </p>

      {/* Credits line */}
      <div
        className="relative z-10 mt-10 flex flex-col items-center gap-1"
        style={{
          animation: "fadeIn 1.8s ease both",
          animationDelay: "1.35s",
        }}
      >
        <p
          className="text-[11px] uppercase tracking-[0.3em] text-white/35"
          style={{ fontFamily: "var(--font-cinematic)" }}
        >
          {creator.name}
        </p>
        <p
          className="text-[10px] uppercase tracking-[0.25em] text-white/22"
          style={{ fontFamily: "var(--font-cinematic)" }}
        >
          {creator.role}
        </p>
        {coWriter && (
          <>
            <p
              className="mt-3 text-[9px] uppercase tracking-[0.28em] text-white/25"
              style={{ fontFamily: "var(--font-cinematic)" }}
            >
              Co-written by {coWriter.name}
            </p>
            <p
              className="mt-1.5 text-[9px] uppercase tracking-[0.22em] text-white/22"
              style={{ fontFamily: "var(--font-cinematic)" }}
            >
              Songs by {coWriter.name}
            </p>
          </>
        )}
      </div>

      {/* Mini player */}
      <div
        className="relative z-10 mt-10 flex items-center gap-3 rounded-2xl border border-white/12 bg-white/5 px-5 py-3 backdrop-blur-md"
        style={{
          animation: "fadeIn 1.8s ease both",
          animationDelay: "1.65s",
        }}
      >
        {/* Waveform bars */}
        <div className="flex items-end gap-px" style={{ height: "18px", width: "32px" }}>
          {Array.from({ length: 8 }, (_, b) => (
            <div
              key={b}
              className={cn(
                "flex-1 rounded-sm transition-colors duration-300",
                playing ? "bg-white/60" : "bg-white/20"
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

        {/* Song info */}
        <div className="min-w-0">
          <p
            className="text-xs font-semibold text-white/80"
            style={{ fontFamily: "var(--font-cinematic)" }}
          >
            {heroSong.title}
          </p>
          <p
            className="text-[10px] text-white/40"
            style={{ fontFamily: "var(--font-screenplay)" }}
          >
            {heroSong.singers}
          </p>
        </div>

        {/* Replay */}
        <button
          type="button"
          onClick={replay}
          aria-label="Replay"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/45 transition-all hover:border-white/30 hover:bg-white/10 hover:text-white"
        >
          <RotateCcw className="size-3" />
        </button>

        {/* Play / Pause */}
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? "Pause" : "Play"}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200",
            playing
              ? "border-white/50 bg-white text-black"
              : "border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/50"
          )}
        >
          {playing
            ? <Pause className="size-3.5 fill-current" />
            : <Play className="ml-0.5 size-3.5 fill-current" />
          }
        </button>
      </div>

      {/* Corner frame marks */}
      {["top-6 left-6", "top-6 right-6", "bottom-6 left-6", "bottom-6 right-6"].map(
        (pos, i) => (
          <div
            key={i}
            className={`pointer-events-none absolute ${pos} h-8 w-8 opacity-20`}
            style={{
              borderTop: i < 2 ? "1px solid white" : "none",
              borderBottom: i >= 2 ? "1px solid white" : "none",
              borderLeft: i % 2 === 0 ? "1px solid white" : "none",
              borderRight: i % 2 === 1 ? "1px solid white" : "none",
            }}
          />
        )
      )}

      <style>{`
        @keyframes waveBar {
          from { transform: scaleY(0.25); }
          to   { transform: scaleY(1); }
        }
      `}</style>
    </section>
  );
}
