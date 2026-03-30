import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
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
    <div className="relative flex h-screen w-screen overflow-hidden bg-black">
      <div className="relative h-full w-[40%] shrink-0 overflow-hidden">
        <Image
          src={character.image}
          alt={character.name}
          fill
          className="object-cover object-top"
          sizes="40vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden px-12 py-12 xl:px-16">
        <div className="flex shrink-0 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/40 transition-colors hover:text-white"
            style={{ fontFamily: "var(--font-cinematic)" }}
          >
            <ArrowLeft className="size-3.5" />
            Back to FLOWER
          </Link>

          <p className="text-xs text-white/25" style={{ fontFamily: "var(--font-screenplay)" }}>
            {String(index + 1).padStart(2, "0")} / {String(characters.length).padStart(2, "0")}
          </p>
        </div>

        <div className="mt-6 shrink-0 border-b border-white/10 pb-6">
          <CharacterIdentityHeader
            name={character.name}
            role={character.role}
            dossier={dossier}
            heading="h1"
            showCharactersLabel={false}
          />
        </div>

        <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-2" style={{ scrollbarWidth: "none" }}>
          <CharacterPublicProfile
            description={character.description}
            traits={character.personalityTraits}
            dossier={dossier}
            characterSongs={characterSongs}
          />
        </div>

        <div className="mt-4 flex shrink-0 items-center justify-between border-t border-white/10 pt-4">
          <div>
            {prev && (
              <Link
                href={`/characters/${prev.id}`}
                className="group flex items-center gap-3 opacity-50 transition-opacity hover:opacity-100"
              >
                <div className="relative h-9 w-9 overflow-hidden rounded-full ring-1 ring-white/20">
                  <Image src={prev.image} alt={prev.name} fill className="object-cover object-top" sizes="36px" />
                </div>
                <div>
                  <p
                    className="text-[9px] uppercase tracking-widest text-white/40"
                    style={{ fontFamily: "var(--font-cinematic)" }}
                  >
                    Previous
                  </p>
                  <p className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-cinematic)" }}>
                    {prev.name}
                  </p>
                </div>
              </Link>
            )}
          </div>
          <div className="text-right">
            {next && (
              <Link
                href={`/characters/${next.id}`}
                className="group flex items-center gap-3 opacity-50 transition-opacity hover:opacity-100"
              >
                <div>
                  <p
                    className="text-[9px] uppercase tracking-widest text-white/40"
                    style={{ fontFamily: "var(--font-cinematic)" }}
                  >
                    Next
                  </p>
                  <p className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-cinematic)" }}>
                    {next.name}
                  </p>
                </div>
                <div className="relative h-9 w-9 overflow-hidden rounded-full ring-1 ring-white/20">
                  <Image src={next.image} alt={next.name} fill className="object-cover object-top" sizes="36px" />
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="flex w-52 shrink-0 flex-col overflow-hidden border-l border-white/5 bg-black/40 xl:w-56">
        <div className="shrink-0 px-3 pb-3 pr-4 pt-16">
          <p
            className="text-[10px] uppercase tracking-[0.3em] text-white/40"
            style={{ fontFamily: "var(--font-cinematic)" }}
          >
            Cast
          </p>
        </div>
        <div className="flex flex-1 flex-col gap-0.5 overflow-y-auto pb-12 pl-2 pr-3" style={{ scrollbarWidth: "thin" }}>
          {characters.map((c) => {
            const active = c.id === character.id;
            return (
              <Link
                key={c.id}
                href={`/characters/${c.id}`}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200",
                  active
                    ? "bg-white/12 text-white"
                    : "text-white/85 hover:bg-white/6 hover:text-white"
                )}
              >
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
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
                    className="mt-0.5 truncate text-[10px] text-white/70"
                    style={{ fontFamily: "var(--font-screenplay)" }}
                  >
                    {c.role}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {(["top-6 left-6", "top-6 right-6", "bottom-6 left-6", "bottom-6 right-6"] as const).map((pos, i) => (
        <div
          key={i}
          className={`pointer-events-none absolute ${pos} h-6 w-6 opacity-15`}
          style={{
            borderTop: i < 2 ? "1px solid white" : "none",
            borderBottom: i >= 2 ? "1px solid white" : "none",
            borderLeft: i % 2 === 0 ? "1px solid white" : "none",
            borderRight: i % 2 === 1 ? "1px solid white" : "none",
          }}
        />
      ))}
    </div>
  );
}
