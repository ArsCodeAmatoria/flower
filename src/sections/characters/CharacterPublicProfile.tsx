"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown, Music, Play, Pause } from "lucide-react";
import type { CharacterDossier } from "@/data/character-dossiers";
import type { Song } from "@/data/songs";
import { CharacterCoreArcBlock } from "@/sections/characters/CharacterIdentityChrome";
import { CharacterDossierCollapsibles } from "@/sections/characters/CharacterDossierCollapsibles";
import { cn } from "@/lib/utils";

export function CharacterPublicProfile({
  description,
  traits,
  dossier,
  characterSongs,
  showWriterDossier = true,
}: {
  description: string;
  traits: string[];
  dossier: CharacterDossier;
  characterSongs: Song[];
  showWriterDossier?: boolean;
}) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const togglePlay = useCallback(
    (e: React.MouseEvent, song: Song) => {
      e.preventDefault();
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
    [playingId]
  );

  return (
    <div className="space-y-8 pb-16 pr-1">
      <div>
        <p
          className="mb-3 text-[9px] uppercase tracking-[0.35em] text-white/40"
          style={{ fontFamily: "var(--font-cinematic)" }}
        >
          About
        </p>
        <p
          className="max-w-xl text-[15px] leading-[1.7] text-white/80"
          style={{ fontFamily: "var(--font-screenplay)" }}
        >
          {description}
        </p>
      </div>

      <div>
        <p
          className="mb-3 text-[9px] uppercase tracking-[0.35em] text-white/40"
          style={{ fontFamily: "var(--font-cinematic)" }}
        >
          Their journey in FLOWER
        </p>
        <p
          className="max-w-xl text-sm leading-relaxed text-white/65"
          style={{ fontFamily: "var(--font-screenplay)" }}
        >
          {dossier.arcSummary.start}
          <span className="mx-2 text-amber-200/35" aria-hidden>
            →
          </span>
          {dossier.arcSummary.middle}
          <span className="mx-2 text-amber-200/35" aria-hidden>
            →
          </span>
          {dossier.arcSummary.end}
        </p>
      </div>

      {traits.length > 0 && (
        <div>
          <p
            className="mb-3 text-[9px] uppercase tracking-[0.35em] text-white/40"
            style={{ fontFamily: "var(--font-cinematic)" }}
          >
            In a phrase
          </p>
          <div className="flex flex-wrap gap-2">
            {traits.map((trait) => (
              <span
                key={trait}
                className="rounded-full border border-white/18 bg-white/[0.04] px-3.5 py-1.5 text-xs text-white/70"
                style={{ fontFamily: "var(--font-cinematic)" }}
              >
                {trait}
              </span>
            ))}
          </div>
        </div>
      )}

      {characterSongs.length > 0 && (
        <div>
          <p
            className="mb-3 flex items-center gap-2 text-[9px] uppercase tracking-[0.35em] text-white/40"
            style={{ fontFamily: "var(--font-cinematic)" }}
          >
            <Music className="size-3 text-white/45" />
            Featured songs
          </p>
          <div className="flex flex-wrap gap-2">
            {characterSongs.map((song) => {
              const isPlaying = playingId === song.id;
              return (
                <button
                  key={song.id}
                  type="button"
                  onClick={(e) => togglePlay(e, song)}
                  className={cn(
                    "group flex items-center gap-2 rounded-full border px-3 py-1.5 transition-all duration-200",
                    isPlaying
                      ? "border-white/40 bg-white/15"
                      : "border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10"
                  )}
                >
                  <div className="relative h-5 w-5 shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={song.image}
                      alt={song.title}
                      fill
                      className="object-cover object-top"
                      sizes="20px"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                      {isPlaying ? (
                        <Pause className="size-2 fill-white text-white" />
                      ) : (
                        <Play className="size-2 fill-white text-white" />
                      )}
                    </div>
                  </div>
                  <span
                    className={cn(
                      "text-xs transition-colors",
                      isPlaying ? "text-white" : "text-white/75"
                    )}
                    style={{ fontFamily: "var(--font-cinematic)" }}
                  >
                    {song.title}
                  </span>
                  {isPlaying && (
                    <span className="flex items-end gap-px" style={{ height: "10px" }}>
                      {[0, 1, 2].map((b) => (
                        <span
                          key={b}
                          className="w-px rounded-sm bg-white/70"
                          style={{
                            height: "60%",
                            animation: `charWaveBar 0.6s ease-in-out ${b * 0.12}s infinite alternate`,
                          }}
                        />
                      ))}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {showWriterDossier && (
        <details className="writer-dossier-details mt-4 rounded-xl border border-white/10 bg-white/[0.02] [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3.5 text-left transition-colors hover:bg-white/[0.04]">
            <span
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50"
              style={{ fontFamily: "var(--font-cinematic)" }}
            >
              Writer&apos;s dossier · STC &amp; McKee notes
            </span>
            <ChevronDown className="writer-dossier-chevron size-4 shrink-0 text-white/40 transition-transform duration-200" />
          </summary>
          <div className="border-t border-white/10 px-4 py-5">
            <CharacterCoreArcBlock dossier={dossier} className="mb-8 border-b border-white/10 pb-8" />
            <CharacterDossierCollapsibles dossier={dossier} />
          </div>
        </details>
      )}

      <style>{`
        @keyframes charWaveBar {
          from { transform: scaleY(0.2); }
          to { transform: scaleY(1); }
        }
        details.writer-dossier-details[open] .writer-dossier-chevron {
          transform: rotate(180deg);
        }
      `}</style>
    </div>
  );
}
