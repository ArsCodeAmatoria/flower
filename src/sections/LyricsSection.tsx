"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Play, Pause, Music2, Mic2, Users } from "lucide-react";
import { songs } from "@/data/songs";
import { characters } from "@/data/characters";
import { crew } from "@/data/crew";
import { allLyrics } from "@/data/lyrics";
import { cn } from "@/lib/utils";

interface Props { openCharacter: (id: string) => void; }

export function LyricsSection({ openCharacter }: Props) {
  const [selectedId, setSelectedId] = useState(songs[0].id);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const song = songs.find((s) => s.id === selectedId)!;
  const lyrics = allLyrics.find((l) => l.songId === selectedId);
  const singers = characters.filter((c) => c.songIds.includes(selectedId));

  const selectSong = useCallback(
    (id: string) => {
      if (id === selectedId) return;
      audioRef.current?.pause();
      setPlayingId(null);
      setSelectedId(id);
    },
    [selectedId]
  );

  const togglePlay = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (playingId === song.id) {
        audioRef.current?.pause();
        setPlayingId(null);
      } else {
        audioRef.current?.pause();
        const audio = new Audio(song.audioSrc);
        audio.addEventListener("ended", () => setPlayingId(null));
        audio.play().catch(() => {});
        audioRef.current = audio;
        setPlayingId(song.id);
      }
    },
    [playingId, song]
  );

  const isPlaying = playingId === song.id;

  return (
    <section
      id="lyrics"
      className="relative flex h-screen w-screen shrink-0 flex-col overflow-hidden bg-black pt-14 pb-20"
    >
      {/* ── Header ───────────────────────────────────────────── */}
      <div className="mb-5 flex shrink-0 items-center justify-between px-8">
        <h1
          className="section-heading flex-1 text-2xl"
          style={{ fontFamily: "var(--font-cinematic)" }}
        >
          Lyrics
        </h1>
        <span
          className="text-[11px] text-white/25"
          style={{ fontFamily: "var(--font-screenplay)" }}
        >
          {String(songs.findIndex((s) => s.id === selectedId) + 1).padStart(2, "0")} /{" "}
          {String(songs.length).padStart(2, "0")}
        </span>
      </div>

      {/* ── Three-column body ─────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Left: Song list ──────────────────────────────────── */}
        <div
          className="w-52 shrink-0 overflow-y-auto pl-8 pr-3 pb-20"
          style={{ scrollbarWidth: "none" }}
        >
          <p
            className="mb-3 text-[9px] uppercase tracking-[0.3em] text-white/50"
            style={{ fontFamily: "var(--font-cinematic)" }}
          >
            <Music2 className="mb-0.5 mr-1 inline size-2.5" />
            Songs
          </p>
          <div className="flex flex-col gap-1">
            {songs.map((s) => {
              const active = s.id === selectedId;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => selectSong(s.id)}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-all duration-200",
                    active
                      ? "bg-white/10 text-white"
                      : "text-white/70 hover:bg-white/5 hover:text-white/90"
                  )}
                >
                  <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={s.image}
                      alt={s.title}
                      fill
                      className="object-cover object-top"
                      sizes="36px"
                    />
                    {active && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <span className="flex items-end gap-px" style={{ height: "10px" }}>
                          {[0, 1, 2].map((b) => (
                            <span
                              key={b}
                              className="w-px rounded-sm bg-white"
                              style={{
                                height: "60%",
                                display: "block",
                                animation: isPlaying
                                  ? `waveBar 0.6s ease-in-out ${b * 0.12}s infinite alternate`
                                  : "none",
                                transform: isPlaying ? undefined : "scaleY(0.3)",
                              }}
                            />
                          ))}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className="truncate text-[11px] font-medium leading-tight"
                      style={{ fontFamily: "var(--font-cinematic)" }}
                    >
                      {s.title}
                    </p>
                    <p
                      className="mt-0.5 truncate text-[9px] text-white/60"
                      style={{ fontFamily: "var(--font-screenplay)" }}
                    >
                      {s.singers}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Center: Lyrics display ────────────────────────────── */}
        <div className="relative flex flex-1 flex-col overflow-hidden">
          {/* Song header */}
          <div
            key={`header-${song.id}`}
            className="mb-6 flex shrink-0 items-center justify-between pr-6"
            style={{ animation: "fadeIn 0.3s ease-out both" }}
          >
            <div className="flex items-center gap-5">
              {/* Album art */}
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl shadow-lg shadow-black/60">
                <Image
                  src={song.image}
                  alt={song.title}
                  fill
                  className="object-cover object-top"
                  sizes="64px"
                />
              </div>
              <div>
                <h2
                  className="text-3xl font-extrabold uppercase leading-none text-white"
                  style={{ fontFamily: "var(--font-cinematic)" }}
                >
                  {song.title}
                </h2>
                <p
                  className="mt-1.5 flex items-center gap-1.5 text-xs text-white/65"
                  style={{ fontFamily: "var(--font-screenplay)" }}
                >
                  <Mic2 className="size-3" />
                  {song.singers}
                </p>
                {song.writtenBy && (
                  <p
                    className="mt-0.5 text-[10px] text-white/35"
                    style={{ fontFamily: "var(--font-screenplay)" }}
                  >
                    Written by {song.writtenBy}
                  </p>
                )}
              </div>
            </div>

            {/* Play / Pause button */}
            <button
              type="button"
              onClick={togglePlay}
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-200",
                isPlaying
                  ? "border-white/40 bg-white/15 text-white"
                  : "border-white/20 bg-white/5 text-white/60 hover:border-white/35 hover:bg-white/12 hover:text-white"
              )}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="size-4 fill-current" />
              ) : (
                <Play className="size-4 fill-current" />
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="mb-6 h-px w-full shrink-0 bg-white/10 pr-6" />

          {/* Lyrics scroll area */}
          <div
            key={`lyrics-${song.id}`}
            className="flex-1 overflow-y-auto pr-6 pb-24"
            style={{
              scrollbarWidth: "none",
              animation: "fadeIn 0.35s ease-out both",
            }}
          >
            {lyrics ? (
              <div className="space-y-1 text-center">
                {lyrics.lines.map((line, i) => {
                  if (line.type === "blank")
                    return <div key={i} className="h-5" />;
                  if (line.type === "label")
                    return (
                      <p
                        key={i}
                        className="mb-2 mt-5 text-[10px] uppercase tracking-[0.3em] text-white/40"
                        style={{ fontFamily: "var(--font-cinematic)" }}
                      >
                        {line.text.replace(/^\[|\]$/g, "")}
                      </p>
                    );
                  return (
                    <p
                      key={i}
                      className="text-[15px] leading-relaxed text-white/90"
                      style={{ fontFamily: "var(--font-screenplay)" }}
                    >
                      {line.text}
                    </p>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm italic text-white/30" style={{ fontFamily: "var(--font-screenplay)" }}>
                {song.description === "Instrumental." ? "Instrumental" : "Lyrics not available."}
              </p>
            )}
          </div>
        </div>

        {/* ── Right: Singer / cast sidebar ─────────────────────── */}
        <div
          className="mr-8 flex w-52 shrink-0 flex-col gap-5 overflow-y-auto rounded-2xl border border-white/8 p-4 pb-20"
          style={{ background: "rgba(255,255,255,0.03)", scrollbarWidth: "none" }}
        >
          {/* Singers */}
          <div>
            <p
              className="mb-3 flex items-center gap-1.5 text-[9px] uppercase tracking-[0.28em] text-white/55"
              style={{ fontFamily: "var(--font-cinematic)" }}
            >
              <Users className="size-2.5" />
              Cast
            </p>
            {singers.length > 0 ? (
              <div className="flex flex-col gap-2.5">
                {singers.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => openCharacter(c.id)}
                    className="group flex items-center gap-2.5 rounded-xl p-1.5 text-left transition-colors hover:bg-white/6"
                  >
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={c.image}
                        alt={c.name}
                        fill
                        className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                        sizes="36px"
                      />
                    </div>
                    <div className="min-w-0">
                      <p
                        className="truncate text-[11px] font-medium text-white/85 group-hover:text-white"
                        style={{ fontFamily: "var(--font-cinematic)" }}
                      >
                        {c.name}
                      </p>
                      <p
                        className="mt-0.5 truncate text-[9px] text-white/60"
                        style={{ fontFamily: "var(--font-screenplay)" }}
                      >
                        {c.role}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p
                className="text-[10px] text-white/55"
                style={{ fontFamily: "var(--font-screenplay)" }}
              >
                Full ensemble
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-white/8" />

          {/* Other songs by same singers */}
          {(() => {
            const related = songs.filter(
              (s) =>
                s.id !== song.id &&
                singers.some((c) => c.songIds.includes(s.id))
            );
            if (related.length === 0) return null;
            return (
              <div>
                <p
                  className="mb-3 flex items-center gap-1.5 text-[9px] uppercase tracking-[0.28em] text-white/55"
                  style={{ fontFamily: "var(--font-cinematic)" }}
                >
                  <Music2 className="size-2.5" />
                  Also Sings
                </p>
                <div className="flex flex-col gap-2">
                  {related.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => selectSong(s.id)}
                      className="group flex items-center gap-2.5 rounded-xl p-1.5 text-left transition-colors hover:bg-white/6"
                    >
                      <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={s.image}
                          alt={s.title}
                          fill
                          className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                          sizes="32px"
                        />
                      </div>
                      <div className="min-w-0">
                        <p
                          className="truncate text-[10px] font-medium text-white/80 group-hover:text-white"
                          style={{ fontFamily: "var(--font-cinematic)" }}
                        >
                          {s.title}
                        </p>
                        <p
                          className="mt-0.5 truncate text-[9px] text-white/55"
                          style={{ fontFamily: "var(--font-screenplay)" }}
                        >
                          {s.singers}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Written by */}
          {song.writtenBy && (() => {
            const writer = crew.find((m) => m.name === song.writtenBy);
            return (
              <div>
                <div className="h-px w-full bg-white/8 mb-5" />
                <p
                  className="mb-3 text-[9px] uppercase tracking-[0.28em] text-white/55"
                  style={{ fontFamily: "var(--font-cinematic)" }}
                >
                  Written By
                </p>
                <div className="flex items-center gap-2.5 rounded-xl p-1.5">
                  {writer && (
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-white/20">
                      <Image src={writer.image} alt={writer.name} fill className="object-cover object-top" sizes="36px" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-medium text-white/85" style={{ fontFamily: "var(--font-cinematic)" }}>
                      {song.writtenBy}
                    </p>
                    {writer && (
                      <p className="mt-0.5 truncate text-[9px] text-white/50" style={{ fontFamily: "var(--font-screenplay)" }}>
                        {writer.role}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      <style>{`
        @keyframes waveBar {
          from { transform: scaleY(0.2); }
          to   { transform: scaleY(1);   }
        }
      `}</style>
    </section>
  );
}
