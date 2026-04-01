"use client";

import { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { ChevronLeft, ArrowUpRight } from "lucide-react";
import { characters } from "@/data/characters";
import { buildAllyThreadForProfile } from "@/data/character-chats";
import { getResolvedCharacterDossier } from "@/data/character-dossiers";
import { songs } from "@/data/songs";
import { CharacterIdentityHeader } from "@/sections/characters/CharacterIdentityChrome";
import { CharacterPublicProfile } from "@/sections/characters/CharacterPublicProfile";
import { cn } from "@/lib/utils";

interface Props {
  openCharacter: (id: string) => void;
}

export function CharactersSection({ openCharacter }: Props) {
  const [index, setIndex] = useState(0);
  const total = characters.length;
  const character = characters[index];
  const dossier = useMemo(() => getResolvedCharacterDossier(character), [character]);

  const characterSongs = useMemo(
    () => songs.filter((s) => character.songIds.includes(s.id)),
    [character]
  );

  const allyThread = useMemo(() => buildAllyThreadForProfile(character), [character]);

  const switchCharacter = useCallback((i: number) => {
    setIndex(i);
  }, []);

  const prev = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      switchCharacter(Math.max(0, index - 1));
    },
    [index, switchCharacter]
  );

  const next = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      switchCharacter(Math.min(total - 1, index + 1));
    },
    [index, total, switchCharacter]
  );

  return (
    <section
      id="characters"
      className="relative flex h-[100dvh] min-h-[100dvh] w-screen shrink-0 overflow-hidden bg-zinc-50"
    >
      {/* Portrait — left half */}
      <button
        type="button"
        onClick={() => openCharacter(character.id)}
        className="group relative h-full min-h-0 w-[40%] shrink-0 self-stretch overflow-hidden border-r border-zinc-200 bg-zinc-100"
      >
        <Image
          key={character.id}
          src={character.image}
          alt={character.name}
          fill
          className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
          sizes="40vw"
          style={{ animation: "fadeIn 0.4s ease-out both" }}
        />
        {/* No white blend into portrait — hard edge at column boundary */}

        <div className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white/90 opacity-0 shadow-md backdrop-blur-sm transition-opacity group-hover:opacity-100">
          <ArrowUpRight className="size-4 text-red-700" />
        </div>
      </button>

      {/* Details — right: identity fixed, sellable bio scrolls */}
      <div
        key={character.id}
        className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-zinc-50 pb-[var(--floating-nav-clearance)] pl-10 pr-6 pt-10 xl:pl-12 xl:pr-10"
        style={{ animation: "fadeIn 0.35s ease-out both" }}
      >
        <p
          className="mb-4 shrink-0 text-xs text-zinc-400"
          style={{ fontFamily: "var(--font-screenplay)" }}
        >
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>

        <div className="shrink-0 border-b border-zinc-200 pb-5">
          <CharacterIdentityHeader name={character.name} role={character.role} dossier={dossier} heading="h2" />
        </div>

        <div
          className="min-h-0 flex-1 overflow-y-auto pr-2 pb-6 pt-4"
          style={{ scrollbarWidth: "none" }}
        >
          <CharacterPublicProfile
            description={character.description}
            traits={character.personalityTraits}
            dossier={dossier}
            characterSongs={characterSongs}
            allyThread={allyThread}
          />

          <button
            type="button"
            onClick={() => openCharacter(character.id)}
            className="group/link mt-6 inline-flex w-fit items-center gap-2 text-sm text-red-700 transition-colors hover:text-red-900"
            style={{ fontFamily: "var(--font-cinematic)" }}
          >
            <span className="uppercase tracking-widest">Open full profile view</span>
            <ArrowUpRight className="size-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={prev}
        disabled={index === 0}
        aria-label="Previous character"
        className={cn(
          "absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white/90 text-zinc-800 shadow-md backdrop-blur-sm transition-all hover:border-red-300 hover:bg-red-50",
          "disabled:pointer-events-none disabled:opacity-0"
        )}
      >
        <ChevronLeft className="size-5 stroke-[1.5]" />
      </button>

      {/* Cast sidebar — FLOWER roster */}
      <div className="flex w-56 shrink-0 flex-col overflow-hidden border-l border-zinc-200 bg-white/80 pb-[var(--floating-nav-clearance)] backdrop-blur-sm">
        <div className="shrink-0 px-3 pb-3 pl-3 pr-4 pt-20">
          <p
            className="text-[10px] uppercase tracking-[0.3em] text-zinc-500"
            style={{ fontFamily: "var(--font-cinematic)" }}
          >
            Cast
          </p>
        </div>
        <div
          className="flex flex-1 flex-col gap-0.5 overflow-y-auto pb-4 pl-2 pr-4"
          style={{ scrollbarWidth: "none" }}
        >
          {characters.map((c, i) => {
            const active = i === index;
            return (
              <button
                key={c.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  switchCharacter(i);
                }}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200",
                  active
                    ? "bg-red-50 text-zinc-900 ring-1 ring-red-200"
                    : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
                )}
              >
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg ring-1 ring-zinc-200/80">
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    sizes="40px"
                  />
                </div>
                <div className="min-w-0">
                  <p
                    className="truncate text-xs font-medium leading-tight"
                    style={{ fontFamily: "var(--font-cinematic)" }}
                  >
                    {c.name}
                  </p>
                  <p
                    className="mt-0.5 truncate text-[10px] text-zinc-600"
                    style={{ fontFamily: "var(--font-screenplay)" }}
                  >
                    {c.role}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
