"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ArrowUpRight } from "lucide-react";
import { sets } from "@/data/sets";
import { cn } from "@/lib/utils";

export function SetsSection() {
  const [index, setIndex] = useState(0);
  const total = sets.length;
  const set = sets[index];

  const switchSet = useCallback((i: number) => {
    setIndex(i);
  }, []);

  const prev = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      switchSet(Math.max(0, index - 1));
    },
    [index, switchSet],
  );

  return (
    <section
      id="sets"
      className="relative flex h-[100dvh] min-h-[100dvh] w-screen shrink-0 overflow-hidden bg-white"
    >
      {/* Hero column: large framed image + caption on white */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="relative flex min-h-0 flex-1 flex-col px-3 pt-3 sm:px-5 sm:pt-5">
          <div className="relative min-h-0 w-full flex-1">
            <Link
              href={`/sets/${set.id}`}
              className="group absolute inset-0 block overflow-hidden rounded-2xl bg-zinc-100 ring-1 ring-zinc-200/90 shadow-sm [animation:fadeIn_0.4s_ease-out_both]"
            >
              <Image
                key={set.id}
                src={set.image}
                alt={set.name}
                fill
                className="object-cover object-center transition-[filter] duration-300 group-hover:brightness-[1.02]"
                sizes="(min-width: 768px) calc(100vw - 13rem - 2.5rem), calc(100vw - 11rem - 1.5rem)"
                priority={index === 0}
              />
              <div className="pointer-events-none absolute right-3 top-3 sm:right-4 sm:top-4 md:opacity-0 md:transition-opacity md:group-hover:opacity-100">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200/90 bg-white/95 text-zinc-700 shadow-sm backdrop-blur-sm">
                  <ArrowUpRight className="size-4" />
                </span>
              </div>
            </Link>
            <button
              type="button"
              onClick={prev}
              disabled={index === 0}
              aria-label="Previous location"
              className={cn(
                "absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200/90 bg-white/95 text-zinc-800 shadow-md backdrop-blur-sm transition-all hover:bg-white hover:shadow-lg",
                "disabled:pointer-events-none disabled:opacity-0",
              )}
            >
              <ChevronLeft className="size-5 stroke-[1.5]" />
            </button>
          </div>
        </div>

        <div
          key={`cap-${set.id}`}
          className="shrink-0 border-t border-zinc-100 bg-white px-4 py-3 sm:px-6 sm:py-4 pb-[var(--floating-nav-clearance)]"
          style={{ animation: "fadeIn 0.35s ease-out both" }}
        >
          <p
            className="text-[10px] tabular-nums text-zinc-400"
            style={{ fontFamily: "var(--font-screenplay)" }}
          >
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </p>
          <p
            className="text-[8px] uppercase tracking-[0.32em] text-red-800/85"
            style={{ fontFamily: "var(--font-cinematic)" }}
          >
            Location
          </p>
          <h2
            className="mt-1 text-lg font-normal leading-snug tracking-[0.02em] text-zinc-900 sm:text-xl"
            style={{ fontFamily: "var(--font-title)" }}
          >
            {set.name}
          </h2>
          <p
            className="mt-1 text-[9px] uppercase tracking-[0.18em] text-zinc-500"
            style={{ fontFamily: "var(--font-cinematic)" }}
          >
            {set.slug}
          </p>
          <p
            className="mt-2 max-w-2xl text-[11px] leading-snug text-zinc-600 line-clamp-2 sm:line-clamp-3 sm:text-[12px]"
            style={{ fontFamily: "var(--font-screenplay)" }}
          >
            {set.description}
          </p>
          <Link
            href={`/sets/${set.id}`}
            className="group/link mt-3 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-red-800/90 transition-colors hover:text-red-950"
            style={{ fontFamily: "var(--font-cinematic)" }}
          >
            Full view
            <ArrowUpRight className="size-3 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
          </Link>
        </div>
      </div>

      <div className="flex w-[11rem] shrink-0 flex-col overflow-hidden border-l border-zinc-200 bg-white pb-[var(--floating-nav-clearance)] sm:w-48">
        <div className="shrink-0 px-3 pb-2 pt-20 sm:pt-16">
          <p
            className="text-[9px] uppercase tracking-[0.3em] text-zinc-500"
            style={{ fontFamily: "var(--font-cinematic)" }}
          >
            Sets
          </p>
        </div>
        <div
          className="flex flex-1 flex-col gap-0.5 overflow-y-auto pb-4 pl-2 pr-2"
          style={{ scrollbarWidth: "none" }}
        >
          {sets.map((s, i) => {
            const active = i === index;
            return (
              <button
                type="button"
                key={s.id}
                onClick={() => switchSet(i)}
                className={cn(
                  "group flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-all duration-200",
                  active
                    ? "bg-red-50 text-zinc-900 ring-1 ring-red-200/80"
                    : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900",
                )}
              >
                <span
                  className="w-4 shrink-0 tabular-nums text-[9px] text-zinc-400"
                  style={{ fontFamily: "var(--font-screenplay)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-md ring-1 ring-zinc-200/90">
                  <Image
                    src={s.image}
                    alt=""
                    fill
                    className="object-cover object-center"
                    sizes="32px"
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
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
