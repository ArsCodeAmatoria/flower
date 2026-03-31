"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import Image from "next/image";
import { X, Music, Play, Pause } from "lucide-react";
import { characters } from "@/data/characters";
import { songs } from "@/data/songs";
import { cn } from "@/lib/utils";

interface CharacterModalProps {
  characterId: string;
  onOpenCharacter: (id: string) => void;
  onClose: () => void;
}

export function CharacterModal({ characterId, onOpenCharacter, onClose }: CharacterModalProps) {
  const character = characters.find((c) => c.id === characterId);
  const characterSongs = character
    ? songs.filter((s) => character.songIds.includes(s.id))
    : [];

  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = useCallback((song: typeof songs[0]) => {
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
  }, [playingId]);

  const close = useCallback(() => {
    audioRef.current?.pause();
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [close]);

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  if (!character) return null;

  const index = characters.indexOf(character);

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
        onClick={close}
      />

      {/* Panel — matches Characters page layout */}
      <div
        className="relative z-10 flex h-full w-full max-w-4xl overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 shadow-2xl"
        style={{ animation: "fadeIn 0.2s ease-out both" }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300 bg-white/90 text-zinc-600 backdrop-blur-sm transition-colors hover:border-zinc-400 hover:text-zinc-900"
        >
          <X className="size-4" />
        </button>

        {/* ── Main: detail with circular portrait ─────────────── */}
        <div
          className="flex flex-1 flex-col overflow-y-auto px-12 py-12"
          style={{ scrollbarWidth: "none", animation: "fadeIn 0.35s ease-out both" }}
          key={character.id}
        >
          {/* Large circular portrait */}
          <div className="mb-7 flex items-center gap-7">
            <div className="relative h-36 w-36 shrink-0 overflow-hidden rounded-full ring-2 ring-zinc-300 ring-offset-4 ring-offset-zinc-50">
              <Image
                key={character.id}
                src={character.image}
                alt={character.name}
                fill
                className="object-cover object-top"
                sizes="144px"
                style={{ animation: "fadeIn 0.35s ease-out both" }}
              />
            </div>
            <div>
              {/* Counter */}
              <p
                className="mb-2 text-[10px] text-zinc-400"
                style={{ fontFamily: "var(--font-screenplay)" }}
              >
                {String(index + 1).padStart(2, "0")} / {String(characters.length).padStart(2, "0")}
              </p>
              {/* Role label */}
              <p
                className="mb-2 text-[10px] uppercase tracking-[0.3em] text-zinc-500"
                style={{ fontFamily: "var(--font-cinematic)" }}
              >
                {character.role}
              </p>
              {/* Name */}
              <h2
                className="text-5xl font-extrabold uppercase leading-none text-zinc-900"
                style={{ fontFamily: "var(--font-cinematic)" }}
              >
                {character.name}
              </h2>
            </div>
          </div>

          {/* Divider */}
          <div className="mb-6 h-px w-full bg-zinc-100" />

          {/* Description */}
          <p
            className="mb-8 max-w-md text-sm leading-loose text-zinc-800"
            style={{ fontFamily: "var(--font-screenplay)" }}
          >
            {character.description}
          </p>

          {/* Traits */}
          {character.personalityTraits.length > 0 && (
            <div className="mb-8">
              <p
                className="mb-3 text-[9px] uppercase tracking-[0.3em] text-zinc-400"
                style={{ fontFamily: "var(--font-cinematic)" }}
              >
                Traits
              </p>
              <div className="flex flex-wrap gap-2">
                {character.personalityTraits.map((trait) => (
                  <span
                    key={trait}
                    className="rounded-full border border-zinc-300 bg-zinc-50 px-4 py-1.5 text-xs text-zinc-600"
                    style={{ fontFamily: "var(--font-cinematic)" }}
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Songs */}
          {characterSongs.length > 0 && (
            <div>
              <p
                className="mb-3 flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] text-zinc-400"
                style={{ fontFamily: "var(--font-cinematic)" }}
              >
                <Music className="size-3" /> Songs
              </p>
              <div className="flex flex-col gap-2">
                {characterSongs.map((song) => {
                  const isPlaying = playingId === song.id;
                  return (
                    <button
                      key={song.id}
                      type="button"
                      onClick={() => togglePlay(song)}
                      className={cn(
                        "group flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition-all duration-200",
                        isPlaying
                          ? "border-red-400 bg-red-50"
                          : "border-zinc-200 bg-zinc-50 hover:border-zinc-300 hover:bg-zinc-100"
                      )}
                    >
                      <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg">
                        <Image src={song.image} alt={song.title} fill className="object-cover object-top" sizes="36px" />
                        <div className={cn("absolute inset-0 flex items-center justify-center bg-zinc-100 transition-opacity", isPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100")}>
                          {isPlaying
                            ? <Pause className="size-3 fill-white text-zinc-900" />
                            : <Play className="size-3 fill-white text-zinc-900" />}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn("truncate text-xs font-medium", isPlaying ? "text-zinc-900" : "text-zinc-800")} style={{ fontFamily: "var(--font-cinematic)" }}>
                          {song.title}
                        </p>
                        <div className="flex items-center gap-1.5">
                          <p className="truncate text-[9px] text-zinc-500" style={{ fontFamily: "var(--font-screenplay)" }}>
                            {song.singers}
                          </p>
                          {isPlaying && (
                            <span className="flex items-end gap-px" style={{ height: "8px" }}>
                              {[0, 1, 2].map((b) => (
                                <span key={b} className="w-px rounded-sm bg-zinc-1000" style={{ height: "60%", animation: `waveBar 0.6s ease-in-out ${b * 0.12}s infinite alternate` }} />
                              ))}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all", isPlaying ? "border-red-600 bg-red-600 text-white" : "border-zinc-300 text-zinc-500 group-hover:border-red-400 group-hover:text-red-900")}>
                        {isPlaying ? <Pause className="size-3 fill-current" /> : <Play className="ml-px size-3 fill-current" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div> {/* end main detail */}

        {/* ── Right: character strip ───────────────────────── */}
        <div
          className="flex w-20 shrink-0 flex-col items-center gap-2 overflow-y-auto border-l border-zinc-200/90 py-6 pr-3 pl-2"
          style={{ scrollbarWidth: "none" }}
        >
          {characters.map((c) => {
            const active = c.id === characterId;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onOpenCharacter(c.id)}
                aria-label={c.name}
                className={cn(
                  "group relative w-full shrink-0 overflow-hidden rounded-xl transition-all duration-200",
                  active
                    ? "h-14 ring-2 ring-red-500 ring-offset-2 ring-offset-zinc-50"
                    : "h-11 opacity-40 hover:opacity-75 hover:ring-1 hover:ring-zinc-300 hover:ring-offset-1 hover:ring-offset-zinc-50"
                )}
              >
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  sizes="64px"
                />
              </button>
            );
          })}
        </div>
      </div>
      <style>{`
        @keyframes waveBar {
          from { transform: scaleY(0.2); }
          to   { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}
