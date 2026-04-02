import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { CharacterPortraitCard } from "@/components/CharacterPortraitCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { characters } from "@/data/characters";
import { getResolvedCharacterDossier } from "@/data/character-dossiers";
import { songs } from "@/data/songs";
import { CharacterPublicProfile } from "@/sections/characters/CharacterPublicProfile";
import { CharacterIdentityHeader } from "@/sections/characters/CharacterIdentityChrome";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return characters.map((c) => ({ id: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const character = characters.find((c) => c.id === id);
  return { title: character ? `${character.name} — FLOWER` : "FLOWER" };
}

export default async function CharacterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const character = characters.find((c) => c.id === id);
  if (!character) notFound();

  const dossier = getResolvedCharacterDossier(character);
  const index = characters.indexOf(character);
  const prev = index > 0 ? characters[index - 1] : null;
  const next = index < characters.length - 1 ? characters[index + 1] : null;
  const characterSongs = songs.filter((s) => character.songIds.includes(s.id));

  return (
    <div className="relative flex h-[100dvh] min-h-[100dvh] w-screen shrink-0 overflow-hidden bg-zinc-50/80 text-zinc-900">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="z-30 flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-zinc-200/90 bg-white/95 px-4 py-3 backdrop-blur-md sm:px-6">
          <Button variant="outline" size="sm" className="h-9 rounded-full border-zinc-200 bg-white shadow-sm" asChild>
            <Link href="/" className="gap-2">
              <ArrowLeft className="size-3 opacity-70" aria-hidden />
              <span
                className="text-[9px] uppercase tracking-[0.28em]"
                style={{ fontFamily: "var(--font-cinematic)" }}
              >
                Home
              </span>
            </Link>
          </Button>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 rounded-full shadow-sm" asChild>
              <Link
                href="/#characters"
                className="text-[9px] uppercase tracking-[0.18em]"
                style={{ fontFamily: "var(--font-cinematic)" }}
              >
                Slideshow
              </Link>
            </Button>
            <Button variant="secondary" size="sm" className="h-9 rounded-full shadow-sm" asChild>
              <Link
                href="/"
                className="text-[9px] uppercase tracking-[0.18em]"
                style={{ fontFamily: "var(--font-cinematic)" }}
              >
                Flower
              </Link>
            </Button>
          </div>
        </header>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-6 overflow-hidden p-4 md:p-6 lg:flex-row lg:items-stretch lg:gap-8 lg:pl-8 lg:pr-4 lg:py-6">
          <CharacterPortraitCard
            src={character.image}
            alt={character.name}
            priority
          />

          <Card className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden border-zinc-200/90 shadow-md">
            <CardHeader className="flex shrink-0 flex-row flex-wrap items-center gap-2 space-y-0 border-b border-zinc-100 pb-3 pt-4">
              {prev ? (
                <Button variant="outline" size="icon" className="rounded-full shadow-sm" asChild>
                  <Link href={`/characters/${prev.id}`} aria-label={`Previous: ${prev.name}`}>
                    <ChevronLeft className="size-5 stroke-[1.5]" />
                  </Link>
                </Button>
              ) : (
                <span className="inline-flex h-10 w-10" aria-hidden />
              )}
              {next ? (
                <Button variant="outline" size="icon" className="rounded-full shadow-sm" asChild>
                  <Link href={`/characters/${next.id}`} aria-label={`Next: ${next.name}`}>
                    <ChevronRight className="size-5 stroke-[1.5]" />
                  </Link>
                </Button>
              ) : (
                <span className="inline-flex h-10 w-10" aria-hidden />
              )}
              <div className="ml-auto flex items-center gap-2">
                <Badge variant="outline" className="font-normal tracking-wider">
                  {String(index + 1).padStart(2, "0")} / {String(characters.length).padStart(2, "0")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden px-5 pb-4 pt-4 sm:px-7 sm:pb-5 sm:pt-5">
              <CharacterIdentityHeader
                name={character.name}
                role={character.role}
                dossier={dossier}
                heading="h1"
                uppercaseTitle={false}
                showCharactersLabel={false}
                compact
              />
              <Separator className="shrink-0" />
              <CharacterPublicProfile
                description={character.description}
                traits={character.personalityTraits}
                dossier={dossier}
                characterSongs={characterSongs}
                profileVariant="feature"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="flex w-[11.5rem] shrink-0 flex-col overflow-hidden rounded-none border-y-0 border-l border-r-0 border-zinc-200/90 bg-white py-0 shadow-none sm:w-52">
        <div
          className="shrink-0 border-b border-zinc-100 px-3 pb-3 pt-4 sm:pt-5"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom, 0px))" }}
        >
          <p
            className="text-[9px] uppercase tracking-[0.3em] text-zinc-500"
            style={{ fontFamily: "var(--font-cinematic)" }}
          >
            Cast
          </p>
        </div>
        <div
          className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-2"
          style={{ scrollbarWidth: "none", paddingBottom: "max(1rem, env(safe-area-inset-bottom, 0px))" }}
        >
          {characters.map((c, i) => {
            const active = c.id === character.id;
            return (
              <Button
                key={c.id}
                variant={active ? "secondary" : "ghost"}
                className={cn(
                  "h-auto w-full justify-start gap-2 rounded-lg px-2 py-2 font-normal",
                  active && "ring-1 ring-red-200/80",
                )}
                asChild
              >
                <Link href={`/characters/${c.id}`}>
                  <span
                    className="w-5 shrink-0 tabular-nums text-[9px] text-zinc-400"
                    style={{ fontFamily: "var(--font-screenplay)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md ring-1 ring-zinc-200/90">
                    <Image src={c.image} alt="" fill className="object-cover object-top" sizes="36px" />
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
                  {active ? <ArrowUpRight className="size-3 shrink-0 text-red-700 opacity-80" aria-hidden /> : null}
                </Link>
              </Button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
