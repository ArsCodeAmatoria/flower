import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { SetDetailHero } from "@/components/SetDetailHero";
import { sets } from "@/data/sets";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return sets.map((s) => ({ id: s.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const set = sets.find((s) => s.id === id);
  return { title: set ? `${set.name} — FLOWER` : "FLOWER" };
}

export default async function SetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const set = sets.find((s) => s.id === id);
  if (!set) notFound();

  const index = sets.indexOf(set);
  const prev = index > 0 ? sets[index - 1] : null;
  const next = index < sets.length - 1 ? sets[index + 1] : null;

  return (
    <div className="relative flex h-[100dvh] min-h-[100dvh] w-screen shrink-0 overflow-hidden bg-white text-zinc-900">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="z-30 flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-zinc-100 bg-white/95 px-4 py-3 backdrop-blur-md sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-[9px] uppercase tracking-[0.28em] text-zinc-700 shadow-sm transition-colors hover:border-zinc-300 hover:bg-zinc-50"
            style={{ fontFamily: "var(--font-cinematic)" }}
          >
            <ArrowLeft className="size-3 shrink-0 opacity-70" aria-hidden />
            Home
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/#sets"
              className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.18em] text-zinc-700 shadow-sm transition-colors hover:border-zinc-300 hover:bg-zinc-50"
              style={{ fontFamily: "var(--font-cinematic)" }}
            >
              Slideshow
            </Link>
            <Link
              href="/"
              className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.18em] text-zinc-700 shadow-sm transition-colors hover:border-zinc-300 hover:bg-zinc-50"
              style={{ fontFamily: "var(--font-cinematic)" }}
            >
              Flower
            </Link>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col px-4 pb-4 pt-4 sm:px-6 sm:pb-6 sm:pt-5">
          <div className="relative w-full flex-1 min-h-[40dvh] sm:min-h-0">
            <SetDetailHero
              imageSrc={set.image}
              imageAlt={set.name}
              prev={prev ? { id: prev.id, name: prev.name } : null}
              next={next ? { id: next.id, name: next.name } : null}
            />
          </div>

          <div
            className="mt-5 shrink-0 space-y-1 sm:mt-6"
            style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom, 0px))" }}
          >
            <p
              className="text-[10px] tabular-nums tracking-wider text-zinc-400"
              style={{ fontFamily: "var(--font-screenplay)" }}
            >
              {String(index + 1).padStart(2, "0")} / {String(sets.length).padStart(2, "0")}
            </p>
            <h1
              className="max-w-3xl text-xl font-normal leading-tight tracking-[0.02em] text-zinc-900 sm:text-2xl md:text-3xl"
              style={{ fontFamily: "var(--font-title)" }}
            >
              {set.name}
            </h1>
            <p
              className="text-[10px] uppercase tracking-[0.2em] text-zinc-500"
              style={{ fontFamily: "var(--font-cinematic)" }}
            >
              {set.slug} scene
            </p>
            <p
              className="max-w-2xl text-[12px] leading-relaxed text-zinc-600 sm:text-[13px]"
              style={{ fontFamily: "var(--font-screenplay)" }}
            >
              {set.description}
            </p>
          </div>
        </div>
      </div>

      <aside
        className="flex w-[11.5rem] shrink-0 flex-col overflow-hidden border-l border-zinc-200 bg-white sm:w-52"
        style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom, 0px))" }}
      >
        <div className="shrink-0 px-3 pb-2 pt-4 sm:pt-5">
          <p
            className="text-[9px] uppercase tracking-[0.3em] text-zinc-500"
            style={{ fontFamily: "var(--font-cinematic)" }}
          >
            Sets
          </p>
        </div>
        <div
          className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto pb-4 pl-2 pr-2"
          style={{ scrollbarWidth: "none" }}
        >
          {sets.map((s, i) => {
            const active = s.id === set.id;
            return (
              <Link
                key={s.id}
                href={`/sets/${s.id}`}
                className={cn(
                  "group flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left transition-all duration-200",
                  active
                    ? "bg-red-50 text-zinc-900 ring-1 ring-red-200/80"
                    : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900",
                )}
              >
                <span
                  className="w-5 shrink-0 tabular-nums text-[9px] text-zinc-400"
                  style={{ fontFamily: "var(--font-screenplay)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md ring-1 ring-zinc-200/90">
                  <Image
                    src={s.image}
                    alt=""
                    fill
                    className="object-cover object-center"
                    sizes="36px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className="truncate text-[10px] font-medium leading-tight"
                    style={{ fontFamily: "var(--font-cinematic)" }}
                  >
                    {s.name}
                  </p>
                  <p className="truncate text-[9px] text-zinc-500" style={{ fontFamily: "var(--font-screenplay)" }}>
                    {s.slug}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
