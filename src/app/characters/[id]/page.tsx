import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { characters } from "@/data/characters";
import { getResolvedCharacterDossier } from "@/data/character-dossiers";
import { songs } from "@/data/songs";
import { CharacterPublicProfile } from "@/sections/characters/CharacterPublicProfile";
import { cn } from "@/lib/utils";

const mono = "var(--font-industrial)";

export function generateStaticParams() {
  return characters.map((c) => ({ id: c.id }));
}

function fileRef(characterId: string, fileIndex: number) {
  return `FLW-${String(fileIndex + 1).padStart(3, "0")}-${characterId.toUpperCase().replace(/-/g, "").slice(0, 8)}`;
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
  const ref = fileRef(character.id, index);

  return (
    <div
      className={cn(
        "character-file-shell relative flex h-[100dvh] min-h-[100dvh] w-screen flex-col overflow-hidden text-white md:flex-row",
      )}
    >
      <div className="pointer-events-none absolute inset-0 character-file-scanlines opacity-[0.35]" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" aria-hidden />

      {/* Left — full viewport height portrait */}
      <div className="relative h-[100dvh] min-h-0 w-[32%] min-w-[140px] max-w-[min(42vw,520px)] shrink-0 border-r border-white/15 bg-[#050505]">
        <div className="absolute left-2 top-2 z-10 text-[8px] uppercase tracking-[0.22em] text-[#8eb9a8]/75 sm:left-3 sm:top-3 sm:text-[9px]" style={{ fontFamily: mono }}>
          Fig. 1 — visual ref
        </div>
        <div className="absolute inset-0">
          <Image
            src={character.image}
            alt={character.name}
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 35vw, 42vw"
            priority
          />
        </div>
        {/* Registration corners */}
        {(
          [
            "left-2 top-7 h-5 w-5 border-l border-t sm:top-9 sm:h-6 sm:w-6",
            "right-2 top-7 h-5 w-5 border-r border-t sm:top-9 sm:h-6 sm:w-6",
            "bottom-6 left-2 h-5 w-5 border-b border-l sm:bottom-8 sm:h-6 sm:w-6",
            "bottom-6 right-2 h-5 w-5 border-b border-r sm:bottom-8 sm:h-6 sm:w-6",
          ] as const
        ).map((spec, i) => (
          <div
            key={i}
            className={cn("pointer-events-none absolute border-white/35", spec)}
            aria-hidden
          />
        ))}
        <p
          className="absolute bottom-3 left-4 right-4 truncate text-[8px] uppercase tracking-[0.2em] text-white/30"
          style={{ fontFamily: mono }}
        >
          hash · {ref.slice(0, 16)}…
        </p>
      </div>

      {/* Center — fixed height, no scroll */}
      <div className="relative flex h-[100dvh] min-h-0 min-w-0 flex-1 flex-col overflow-hidden border-white/10 md:border-r">
        <header className="shrink-0 border-b border-white/12 px-3 py-2.5 sm:px-5 sm:py-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0 space-y-0.5">
              <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-white/50 sm:text-[10px] sm:tracking-[0.28em]" style={{ fontFamily: mono }}>
                Flower productions // personnel file
              </p>
              <p className="hidden text-[8px] uppercase tracking-[0.15em] text-[#8eb9a8]/65 sm:block sm:text-[9px]" style={{ fontFamily: mono }}>
                session · synthetic display · not for distribution
              </p>
            </div>
            <Link
              href="/"
              className="shrink-0 border border-white/20 bg-black/50 px-2 py-1.5 text-[9px] uppercase tracking-[0.18em] text-white/60 transition-colors hover:border-white/40 hover:text-white sm:px-3 sm:text-[10px]"
              style={{ fontFamily: mono }}
            >
              ← exit
            </Link>
          </div>
          <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t border-white/[0.07] pt-2 sm:mt-3 sm:gap-x-6 sm:pt-3">
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-white/35" style={{ fontFamily: mono }}>
                file ref
              </p>
              <p className="mt-0.5 text-[11px] text-[#8eb9a8]" style={{ fontFamily: mono }}>
                {ref}
              </p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-white/35" style={{ fontFamily: mono }}>
                index
              </p>
              <p className="mt-0.5 tabular-nums text-[11px] text-white/70" style={{ fontFamily: mono }}>
                {String(index + 1).padStart(2, "0")} / {String(characters.length).padStart(2, "0")}
              </p>
            </div>
            <div className="min-w-0 flex-1 sm:min-w-48">
              <p className="text-[8px] uppercase tracking-[0.2em] text-white/35 sm:text-[9px]" style={{ fontFamily: mono }}>
                designation
              </p>
              <p className="mt-0.5 text-[9px] uppercase leading-snug tracking-[0.1em] text-white/50 sm:text-[10px] sm:tracking-[0.12em]" style={{ fontFamily: mono }}>
                {character.role}
              </p>
            </div>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-3 pb-2 pt-2 sm:px-5 sm:pt-3">
          <h1
            className="mb-1 text-[clamp(1.25rem,3.5vw,2.25rem)] font-semibold uppercase leading-none tracking-[0.08em] text-white sm:mb-2"
            style={{ fontFamily: mono }}
          >
            {character.name}
          </h1>
          <blockquote
            className="mb-2 line-clamp-2 max-w-2xl border-l-2 border-[#8eb9a8]/45 pl-2.5 text-[10px] italic leading-snug text-white/50 sm:mb-3 sm:pl-3 sm:text-[11px]"
            style={{ fontFamily: "var(--font-screenplay)" }}
          >
            {dossier.identityOneLiner}
          </blockquote>

          <div className="min-h-0 flex-1 overflow-hidden">
            <CharacterPublicProfile
            description={character.description}
            traits={character.personalityTraits}
            dossier={dossier}
            characterSongs={characterSongs}
              profileVariant="industrial"
            />
          </div>
        </div>

        <nav
          className="flex shrink-0 items-center justify-between gap-2 border-t border-white/12 px-3 py-2 sm:gap-3 sm:px-5 sm:py-2.5"
          aria-label="Previous and next subject"
        >
          <div className="min-w-0 flex-1">
            {prev ? (
              <Link
                href={`/characters/${prev.id}`}
                className="group flex max-w-sm items-center gap-3 border border-white/15 bg-black/30 py-2 pl-2 pr-3 transition-colors hover:border-white/30"
                style={{ fontFamily: mono }}
              >
                <div className="relative h-10 w-10 shrink-0 overflow-hidden border border-white/10">
                  <Image src={prev.image} alt="" fill className="object-cover object-center" sizes="40px" />
                </div>
                <div className="min-w-0 text-left">
                  <p className="text-[8px] uppercase tracking-[0.2em] text-[#8eb9a8]/70">prev_subject</p>
                  <p className="truncate text-[11px] uppercase tracking-[0.08em] text-white/80 group-hover:text-white">
                    {prev.name}
                  </p>
                </div>
              </Link>
            ) : null}
          </div>
          <div className="min-w-0 flex-1 text-right">
            {next ? (
              <Link
                href={`/characters/${next.id}`}
                className="group ml-auto flex max-w-sm items-center justify-end gap-3 border border-white/15 bg-black/30 py-2 pl-3 pr-2 transition-colors hover:border-white/30"
                style={{ fontFamily: mono }}
              >
                <div className="min-w-0 text-right">
                  <p className="text-[8px] uppercase tracking-[0.2em] text-[#8eb9a8]/70">next_subject</p>
                  <p className="truncate text-[11px] uppercase tracking-[0.08em] text-white/80 group-hover:text-white">
                    {next.name}
                  </p>
                </div>
                <div className="relative h-10 w-10 shrink-0 overflow-hidden border border-white/10">
                  <Image src={next.image} alt="" fill className="object-cover object-center" sizes="40px" />
                </div>
              </Link>
            ) : null}
          </div>
        </nav>

        <p
          className="shrink-0 border-t border-white/10 px-3 py-1 text-center text-[7px] uppercase tracking-[0.3em] text-white/25 sm:px-5 sm:text-[8px] sm:tracking-[0.35em]"
          style={{ fontFamily: mono }}
        >
          // end excerpt · flower high continuity
        </p>
      </div>

      {/* Right — manifest */}
      <aside className="flex h-[100dvh] w-48 shrink-0 flex-col overflow-hidden border-l border-white/10 bg-black/40 sm:w-52 xl:w-56">
        <div className="shrink-0 border-b border-white/10 px-3 py-2.5 pt-10 sm:px-4 sm:pt-12">
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-white/50" style={{ fontFamily: mono }}>
            active manifest
          </p>
          <p className="mt-1 text-[9px] uppercase tracking-[0.15em] text-[#8eb9a8]/60" style={{ fontFamily: mono }}>
            roster · ordered
          </p>
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-px overflow-y-auto overflow-x-hidden" style={{ scrollbarWidth: "none" }}>
          {characters.map((c, i) => {
            const active = c.id === character.id;
            return (
              <Link
                key={c.id}
                href={`/characters/${c.id}`}
                className={cn(
                  "group flex items-center gap-3 px-4 py-2.5 transition-colors",
                  active
                    ? "bg-[#8eb9a8]/10 text-white"
                    : "text-white/65 hover:bg-white/[0.04] hover:text-white",
                )}
                style={{ fontFamily: mono }}
              >
                <span className="w-7 shrink-0 tabular-nums text-[10px] text-[#8eb9a8]/55">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="relative h-9 w-9 shrink-0 overflow-hidden border border-white/15">
                  <Image
                    src={c.image}
                    alt=""
                    fill
                    className="object-cover object-center opacity-90 grayscale transition-all group-hover:opacity-100 group-hover:grayscale-0"
                    sizes="36px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={cn("truncate text-[11px] uppercase tracking-[0.06em]", active && "text-white")}>
                    {c.name}
                  </p>
                  <p className="mt-0.5 truncate text-[9px] uppercase tracking-[0.06em] text-white/40">{c.role}</p>
                </div>
                {active ? <span className="h-1.5 w-1.5 shrink-0 bg-[#8eb9a8]" aria-hidden /> : null}
              </Link>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
