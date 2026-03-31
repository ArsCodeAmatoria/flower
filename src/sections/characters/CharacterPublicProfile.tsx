"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown, Music, Play, Pause } from "lucide-react";
import type { CharacterDossier } from "@/data/character-dossiers";
import type { Song } from "@/data/songs";
import { CharacterCoreArcBlock } from "@/sections/characters/CharacterIdentityChrome";
import { CharacterDossierCollapsibles } from "@/sections/characters/CharacterDossierCollapsibles";
import { cn } from "@/lib/utils";

const sectionLabel =
  "mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-red-800/80";

const mono = "var(--font-industrial)";
const indLabel =
  "mb-1.5 flex items-center gap-2 text-[9px] font-medium uppercase tracking-[0.2em] text-emerald-800 sm:mb-2 sm:text-[10px] sm:tracking-[0.22em]";

export function CharacterPublicProfile({
  description,
  traits,
  dossier,
  characterSongs,
  showWriterDossier = true,
  profileVariant = "inline",
}: {
  description: string;
  traits: string[];
  dossier: CharacterDossier;
  characterSongs: Song[];
  showWriterDossier?: boolean;
  profileVariant?: "inline" | "feature" | "industrial";
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
    [playingId],
  );

  if (profileVariant === "industrial") {
    return (
      <div className="flex h-full min-h-0 flex-col gap-2 overflow-hidden pb-1 sm:gap-2.5" style={{ fontFamily: mono }}>
        <section className="min-h-0 shrink">
          <p className={indLabel}>
            <span className="text-zinc-500">01</span>
            <span className="h-px w-10 bg-emerald-400/50 sm:w-16" aria-hidden />
            synopsis
          </p>
          <p className="max-w-2xl text-[11px] leading-snug text-zinc-800 sm:text-[12px] sm:leading-relaxed">{description}</p>
        </section>

        {traits.length > 0 ? (
          <section className="shrink-0">
            <p className={cn(indLabel, "!mb-1")}>
              <span className="text-zinc-500">02</span>
              <span className="h-px w-10 bg-emerald-400/50 sm:w-16" aria-hidden />
              tags
            </p>
            <p className="text-[10px] uppercase leading-snug tracking-[0.06em] text-zinc-600 sm:text-[11px]">
              {traits.join(" · ")}
            </p>
          </section>
        ) : null}

        {characterSongs.length > 0 ? (
          <section className="min-h-0 shrink-0">
            <p className={cn(indLabel, "!mb-1 items-center")}>
              <span className="text-zinc-500">03</span>
              <Music className="size-2.5 text-emerald-600 sm:size-3" aria-hidden />
              audio
            </p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {characterSongs.map((song) => {
                const isPlaying = playingId === song.id;
                return (
                  <button
                    key={song.id}
                    type="button"
                    onClick={(e) => togglePlay(e, song)}
                    className={cn(
                      "group flex items-center gap-1.5 border px-2 py-1 text-left transition-colors sm:gap-2 sm:px-3 sm:py-1.5",
                      isPlaying
                        ? "border-emerald-400 bg-emerald-50 text-zinc-900"
                        : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50",
                    )}
                    style={{ fontFamily: mono }}
                  >
                    <div className="relative h-5 w-5 shrink-0 overflow-hidden border border-zinc-200 sm:h-6 sm:w-6">
                      <Image
                        src={song.image}
                        alt=""
                        fill
                        className="object-cover object-center"
                        sizes="24px"
                      />
                    </div>
                    <span className="max-w-[10rem] truncate text-[9px] uppercase tracking-[0.05em] sm:max-w-none sm:text-[11px] sm:tracking-[0.06em]">
                      {song.title}
                    </span>
                    {isPlaying ? (
                      <span className="ml-1 flex items-end gap-px" style={{ height: "10px" }}>
                        {[0, 1, 2].map((b) => (
                          <span
                            key={b}
                            className="w-px bg-emerald-600"
                            style={{
                              height: "60%",
                              animation: `charWaveBar 0.6s ease-in-out ${b * 0.12}s infinite alternate`,
                            }}
                          />
                        ))}
                      </span>
                    ) : (
                      <Play className="ml-auto size-3 shrink-0 text-emerald-700 opacity-0 transition-opacity group-hover:opacity-100" />
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        ) : null}

        {showWriterDossier ? (
          <details className="writer-dossier-details mt-auto shrink-0 rounded-lg border border-zinc-200 bg-zinc-50 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-1 px-2 py-2 text-left transition-colors hover:bg-zinc-100 sm:gap-2 sm:px-3 sm:py-2.5">
              <span className="text-[8px] font-medium uppercase tracking-[0.15em] text-emerald-800 sm:text-[9px] sm:tracking-[0.2em]">
                ▶ appendix — writer file
              </span>
              <ChevronDown className="writer-dossier-chevron size-3 shrink-0 text-zinc-400 transition-transform duration-200 sm:size-4" />
            </summary>
            <div className="max-h-[40vh] overflow-y-auto border-t border-zinc-200 px-2 py-3 sm:max-h-[min(50vh,24rem)] sm:px-4 sm:py-4">
              <CharacterCoreArcBlock dossier={dossier} className="mb-6 border-b border-zinc-200 pb-6 sm:mb-8 sm:pb-8" industrial />
              <CharacterDossierCollapsibles dossier={dossier} />
            </div>
          </details>
        ) : null}

        <style>{`
          @keyframes charWaveBar {
            from { transform: scaleY(0.2); }
            to   { transform: scaleY(1); }
          }
          details.writer-dossier-details[open] .writer-dossier-chevron {
            transform: rotate(180deg);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className={cn("space-y-8 pb-16 pr-1", profileVariant === "feature" && "space-y-10")}>
      <div>
        <p
          className="mb-3 text-[9px] uppercase tracking-[0.35em] text-zinc-500"
          style={{ fontFamily: "var(--font-cinematic)" }}
        >
          About
        </p>
        <p
          className={cn(
            profileVariant === "feature"
              ? "max-w-2xl text-[16px] leading-[1.75] text-zinc-800"
              : "max-w-xl text-[15px] leading-[1.7] text-zinc-800",
          )}
          style={{ fontFamily: "var(--font-screenplay)" }}
        >
          {description}
        </p>
      </div>

      <div>
        <p
          className="mb-3 text-[9px] uppercase tracking-[0.35em] text-zinc-500"
          style={{ fontFamily: "var(--font-cinematic)" }}
        >
          Their journey in FLOWER
        </p>
        <p
          className={cn(
            profileVariant === "feature"
              ? "max-w-2xl text-[15px] leading-[1.72] text-zinc-700"
              : "max-w-xl text-sm leading-relaxed text-zinc-700",
          )}
          style={{ fontFamily: "var(--font-screenplay)" }}
        >
          {dossier.arcSummary.start}
          <span className="mx-2 text-red-600/60" aria-hidden>
            →
          </span>
          {dossier.arcSummary.middle}
          <span className="mx-2 text-red-600/60" aria-hidden>
            →
          </span>
          {dossier.arcSummary.end}
        </p>
      </div>

      {traits.length > 0 && (
        <div>
          <p className={sectionLabel} style={{ fontFamily: "var(--font-cinematic)" }}>
            <span className="h-px w-6 bg-red-400/50" aria-hidden />
            In a phrase
          </p>
          <div className="flex flex-wrap gap-2.5">
            {traits.map((trait) => (
              <span
                key={trait}
                className="rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-xs tracking-wide text-zinc-800 shadow-sm"
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
          <p className={cn(sectionLabel, "mb-3")} style={{ fontFamily: "var(--font-cinematic)" }}>
            <Music className="size-3 text-red-700" />
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
                      ? "border-red-500 bg-red-50 ring-1 ring-red-200"
                      : "border-zinc-200 bg-white hover:border-red-300 hover:bg-red-50/80",
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
                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/40 opacity-0 transition-opacity group-hover:opacity-100">
                      {isPlaying ? (
                        <Pause className="size-2 fill-white text-zinc-900" />
                      ) : (
                        <Play className="size-2 fill-white text-zinc-900" />
                      )}
                    </div>
                  </div>
                  <span
                    className={cn("text-xs transition-colors", isPlaying ? "text-red-900" : "text-zinc-800")}
                    style={{ fontFamily: "var(--font-cinematic)" }}
                  >
                    {song.title}
                  </span>
                  {isPlaying && (
                    <span className="flex items-end gap-px" style={{ height: "10px" }}>
                      {[0, 1, 2].map((b) => (
                        <span
                          key={b}
                          className="w-px rounded-sm bg-red-600"
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
        <details className="writer-dossier-details mt-6 rounded-xl border border-zinc-200 bg-gradient-to-br from-zinc-50 to-white [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-4 text-left transition-colors hover:bg-zinc-100/80">
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.22em] text-red-800"
              style={{ fontFamily: "var(--font-cinematic)" }}
            >
              Writer&apos;s dossier · STC &amp; McKee notes
            </span>
            <ChevronDown className="writer-dossier-chevron size-4 shrink-0 text-zinc-400 transition-transform duration-200" />
          </summary>
          <div className="border-t border-zinc-200 px-4 py-5">
            <CharacterCoreArcBlock dossier={dossier} className="mb-8 border-b border-zinc-200 pb-8" />
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
