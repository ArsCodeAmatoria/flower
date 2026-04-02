"use client";

import { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CharacterPortraitCard } from "@/components/CharacterPortraitCard";
import { characters } from "@/data/characters";
import { getResolvedCharacterDossier } from "@/data/character-dossiers";
import { songs } from "@/data/songs";
import { CharacterPublicProfile } from "@/sections/characters/CharacterPublicProfile";
import { CharacterIdentityHeader } from "@/sections/characters/CharacterIdentityChrome";
import { cn } from "@/lib/utils";

export function CharactersSection() {
  const [index, setIndex] = useState(0);
  const total = characters.length;
  const character = characters[index];
  const dossier = useMemo(() => getResolvedCharacterDossier(character), [character]);
  const characterSongs = useMemo(
    () => songs.filter((s) => character.songIds.includes(s.id)),
    [character],
  );

  const switchCharacter = useCallback((i: number) => {
    setIndex(i);
  }, []);

  const prev = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      switchCharacter(Math.max(0, index - 1));
    },
    [index, switchCharacter],
  );

  const next = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      switchCharacter(Math.min(total - 1, index + 1));
    },
    [index, total, switchCharacter],
  );

  return (
    <section
      id="characters"
      className="relative flex h-[100dvh] min-h-[100dvh] w-screen shrink-0 overflow-hidden bg-zinc-50/80"
    >
      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-6 overflow-hidden p-4 md:p-6 lg:flex-row lg:items-stretch lg:gap-8 lg:pl-8 lg:pr-4 lg:py-6">
        <CharacterPortraitCard
          key={character.id}
          src={character.image}
          alt={character.name}
          priority={index === 0}
        />

        <div
          className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-y-auto pb-[var(--floating-nav-clearance)] lg:py-0"
          style={{ animation: "fadeIn 0.35s ease-out both" }}
        >
          <header className="flex shrink-0 flex-wrap items-center gap-2 border-b border-zinc-100 pb-4">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-full shadow-sm"
              disabled={index === 0}
              aria-label="Previous character"
              onClick={prev}
            >
              <ChevronLeft className="size-5 stroke-[1.5]" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-full shadow-sm"
              disabled={index >= total - 1}
              aria-label="Next character"
              onClick={next}
            >
              <ChevronRight className="size-5 stroke-[1.5]" />
            </Button>
            <Badge variant="outline" className="ml-auto font-normal tracking-wider">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </Badge>
          </header>

          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden pt-4">
            <CharacterIdentityHeader
              name={character.name}
              role={character.role}
              dossier={dossier}
              heading="h1"
              uppercaseTitle={false}
              showCharactersLabel={false}
              compact
            />
            <Separator className="shrink-0 bg-zinc-200" />
            <CharacterPublicProfile
              description={character.description}
              traits={character.personalityTraits}
              dossier={dossier}
              characterSongs={characterSongs}
              profileVariant="feature"
            />
          </div>
        </div>
      </div>

      <Card className="flex w-[11rem] shrink-0 flex-col overflow-hidden rounded-none border-y-0 border-l border-r-0 border-zinc-200/90 bg-white py-0 shadow-none sm:w-48">
        <div className="shrink-0 border-b border-zinc-100 px-3 pb-3 pt-20 sm:pt-16">
          <p
            className="text-[9px] uppercase tracking-[0.3em] text-zinc-500"
            style={{ fontFamily: "var(--font-cinematic)" }}
          >
            Cast
          </p>
        </div>
        <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-2 pb-[var(--floating-nav-clearance)]">
          {characters.map((c, i) => {
            const active = i === index;
            return (
              <Button
                key={c.id}
                type="button"
                variant={active ? "secondary" : "ghost"}
                className={cn(
                  "h-auto w-full justify-start gap-2 rounded-lg px-2 py-2 font-normal",
                  active && "ring-1 ring-red-200/80",
                )}
                onClick={() => switchCharacter(i)}
              >
                <span
                  className="w-4 shrink-0 tabular-nums text-[9px] text-zinc-400"
                  style={{ fontFamily: "var(--font-screenplay)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-md ring-1 ring-zinc-200/80">
                  <Image src={c.image} alt="" fill className="object-cover object-top" sizes="32px" />
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <p
                    className="truncate text-[10px] font-medium"
                    style={{ fontFamily: "var(--font-cinematic)" }}
                  >
                    {c.name}
                  </p>
                  <p className="truncate text-[9px] text-zinc-500" style={{ fontFamily: "var(--font-screenplay)" }}>
                    {c.role}
                  </p>
                </div>
              </Button>
            );
          })}
        </div>
      </Card>
    </section>
  );
}
