import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { characters } from "@/data/characters";
import { buildAllyThreadForProfile } from "@/data/character-chats";
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
  const allyThread = buildAllyThreadForProfile(character);

  return (
    <div className="relative flex h-[100dvh] min-h-[100dvh] w-screen shrink-0 overflow-hidden bg-zinc-50 text-zinc-900">
      {/* Portrait — matches Characters slide */}
      <div className="relative h-full min-h-0 w-[40%] shrink-0 self-stretch overflow-hidden border-r border-zinc-200 bg-zinc-100">
        <Image
          src={character.image}
          alt={character.name}
          fill
          className="object-cover object-center"
          sizes="40vw"
          priority
        />
      </div>

      {/* Copy + profile */}
      <div
        className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-zinc-50 pl-8 pr-5 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] md:pl-10 md:pr-6 xl:pl-12 xl:pr-10"
        key={character.id}
      >
        <div className="mb-4 flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-zinc-200 pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-zinc-500 transition-colors hover:text-zinc-900"
            style={{ fontFamily: "var(--font-cinematic)" }}
          >
            <ArrowLeft className="size-3 shrink-0 opacity-70" aria-hidden />
            Home
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/#characters"
              className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-600 transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-900"
              style={{ fontFamily: "var(--font-cinematic)" }}
            >
              Slideshow
            </Link>
            <Link
              href="/"
              className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-600 transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-900"
              style={{ fontFamily: "var(--font-cinematic)" }}
            >
              Flower
            </Link>
          </div>
        </div>

        <p
          className="mb-3 shrink-0 text-xs text-zinc-400"
          style={{ fontFamily: "var(--font-screenplay)" }}
        >
          {String(index + 1).padStart(2, "0")} / {String(characters.length).padStart(2, "0")}
        </p>

        <div className="shrink-0 border-b border-zinc-200 pb-5">
          <CharacterIdentityHeader
            name={character.name}
            role={character.role}
            dossier={dossier}
            heading="h1"
            uppercaseTitle={false}
          />
        </div>

        <div
          className="min-h-0 flex-1 overflow-y-auto pr-2 pt-5"
          style={{ scrollbarWidth: "none" }}
        >
          <CharacterPublicProfile
            description={character.description}
            traits={character.personalityTraits}
            dossier={dossier}
            characterSongs={characterSongs}
            profileVariant="feature"
            allyThread={allyThread}
          />
        </div>

        <nav
          className="mt-3 flex shrink-0 items-stretch gap-2 border-t border-zinc-200 pt-4"
          aria-label="Previous and next character"
        >
          <div className="min-w-0 flex-1">
            {prev ? (
              <Link
                href={`/characters/${prev.id}`}
                className="group flex h-full min-h-[3rem] items-center gap-3 rounded-xl border border-zinc-200 bg-white px-3 py-2 transition-all hover:border-red-300 hover:bg-red-50/80"
                style={{ fontFamily: "var(--font-cinematic)" }}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-zinc-700 transition-colors group-hover:border-red-400 group-hover:text-red-900">
                  <ChevronLeft className="size-4 stroke-[1.5]" aria-hidden />
                </span>
                <div className="min-w-0 text-left">
                  <p className="text-[9px] uppercase tracking-[0.22em] text-red-700">Previous</p>
                  <p className="truncate text-sm font-medium tracking-wide text-zinc-900">{prev.name}</p>
                </div>
              </Link>
            ) : (
              <span className="block min-h-[3rem]" aria-hidden />
            )}
          </div>
          <div className="min-w-0 flex-1">
            {next ? (
              <Link
                href={`/characters/${next.id}`}
                className="group flex h-full min-h-[3rem] items-center justify-end gap-3 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-right transition-all hover:border-red-300 hover:bg-red-50/80"
                style={{ fontFamily: "var(--font-cinematic)" }}
              >
                <div className="min-w-0 text-right">
                  <p className="text-[9px] uppercase tracking-[0.22em] text-red-700">Next</p>
                  <p className="truncate text-sm font-medium tracking-wide text-zinc-900">{next.name}</p>
                </div>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-zinc-700 transition-colors group-hover:border-red-400 group-hover:text-red-900">
                  <ChevronRight className="size-4 stroke-[1.5]" aria-hidden />
                </span>
              </Link>
            ) : null}
          </div>
        </nav>
      </div>

      {/* Cast — same language as home Characters slide */}
      <aside
        className="flex w-52 shrink-0 flex-col overflow-hidden border-l border-zinc-200 bg-white/90 backdrop-blur-sm sm:w-56"
        style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom, 0px))" }}
      >
        <div className="shrink-0 px-3 pb-3 pl-3 pr-4 pt-[max(3.5rem,env(safe-area-inset-top,0px))] sm:pt-20">
          <p
            className="text-[10px] uppercase tracking-[0.3em] text-zinc-500"
            style={{ fontFamily: "var(--font-cinematic)" }}
          >
            Cast
          </p>
        </div>
        <div
          className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto pb-4 pl-2 pr-4"
          style={{ scrollbarWidth: "none" }}
        >
          {characters.map((c, i) => {
            const active = c.id === character.id;
            return (
              <Link
                key={c.id}
                href={`/characters/${c.id}`}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200",
                  active
                    ? "bg-red-50 text-zinc-900 ring-1 ring-red-200"
                    : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900",
                )}
              >
                <span
                  className="w-6 shrink-0 tabular-nums text-[10px] text-zinc-400"
                  style={{ fontFamily: "var(--font-screenplay)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg ring-1 ring-zinc-200">
                  <Image
                    src={c.image}
                    alt=""
                    fill
                    className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    sizes="40px"
                  />
                </div>
                <div className="min-w-0 flex-1">
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
                {active ? (
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-600"
                    aria-hidden
                  />
                ) : null}
              </Link>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
