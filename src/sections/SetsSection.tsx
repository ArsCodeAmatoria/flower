"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ArrowUpRight, Maximize2 } from "lucide-react";
import { SetImageLightbox } from "@/components/SetImageLightbox";
import { sets } from "@/data/sets";
import { cn } from "@/lib/utils";

export function SetsSection() {
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const total = sets.length;
  const set = sets[index];

  const switchSet = useCallback((i: number) => {
    setIndex(i);
  }, []);

  useEffect(() => {
    setLightboxOpen(false);
  }, [index]);

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
      {/* Hero: full-bleed image with minimal copy on a bottom scrim */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="relative flex min-h-0 flex-1 flex-col px-3 pb-[max(0.75rem,var(--floating-nav-clearance))] pt-3 sm:px-5 sm:pt-5">
          <div className="relative min-h-0 w-full flex-1">
            <div className="group absolute inset-0 overflow-hidden rounded-2xl bg-zinc-100 ring-1 ring-zinc-200/90 shadow-sm [animation:fadeIn_0.4s_ease-out_both]">
              <Image
                key={set.id}
                src={set.image}
                alt={set.name}
                fill
                className="object-cover object-center transition-[filter] duration-300 group-hover:brightness-[1.02]"
                sizes="(min-width: 768px) calc(100vw - 13rem - 2.5rem), calc(100vw - 11rem - 1.5rem)"
                priority={index === 0}
              />
              <button
                type="button"
                className="absolute inset-0 z-10 cursor-zoom-in rounded-2xl border-0 bg-transparent p-0"
                aria-label="Open full image"
                onClick={() => setLightboxOpen(true)}
              />
              <div className="pointer-events-none absolute right-3 top-3 z-[15] sm:right-4 sm:top-4 md:opacity-0 md:transition-opacity md:group-hover:opacity-100">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-black/35 text-white shadow-sm backdrop-blur-sm">
                  <Maximize2 className="size-4" aria-hidden />
                </span>
              </div>
              {/* On-image caption */}
              <div
                key={`overlay-${set.id}`}
                className="pointer-events-none absolute inset-x-0 bottom-0 z-[12] bg-linear-to-t from-black/78 via-black/35 to-transparent px-4 pb-4 pt-16 sm:px-5 sm:pb-5 sm:pt-20"
                style={{ animation: "fadeIn 0.35s ease-out both" }}
              >
                <div className="flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <p
                      className="text-[8px] uppercase tracking-[0.32em] text-red-300/95"
                      style={{ fontFamily: "var(--font-cinematic)" }}
                    >
                      Location · {String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
                    </p>
                    <h2
                      className="mt-1 text-xl font-normal leading-[1.1] tracking-[0.02em] text-white sm:text-2xl"
                      style={{ fontFamily: "var(--font-title)" }}
                    >
                      {set.name}
                    </h2>
                  </div>
                  <Link
                    href={`/sets/${set.id}`}
                    className="pointer-events-auto inline-flex shrink-0 items-center gap-1 rounded-full border border-white/35 bg-white/15 px-2.5 py-1.5 text-[9px] uppercase tracking-[0.18em] text-white backdrop-blur-sm transition-colors hover:bg-white/25"
                    style={{ fontFamily: "var(--font-cinematic)" }}
                  >
                    Details
                    <ArrowUpRight className="size-3 opacity-90" aria-hidden />
                  </Link>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={prev}
              disabled={index === 0}
              aria-label="Previous location"
              className={cn(
                "absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-black/40 text-white shadow-md backdrop-blur-sm transition-all hover:bg-black/55",
                "disabled:pointer-events-none disabled:opacity-0",
              )}
            >
              <ChevronLeft className="size-5 stroke-[1.5]" />
            </button>
          </div>
        </div>
      </div>

      <SetImageLightbox
        src={set.image}
        alt={set.name}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />

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
