"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  aggregateBeatExpectations,
  expectedScreenplayPagesFromScenes,
  FLOWER_BEATS_ACTS,
  formatPageExpectation,
  formatSceneExpectation,
} from "@/data/flower-beats-final";
import { cn } from "@/lib/utils";

export function BeatNavSidebar({
  activePageIndex,
  onSelectBeat,
}: {
  activePageIndex: number;
  onSelectBeat: (pageIndex: number) => void;
}) {
  const actsWithIndices = useMemo(() => {
    let idx = 0;
    return FLOWER_BEATS_ACTS.map((act) => ({
      act,
      beats: act.beats.map((beat) => ({ beat, pageIndex: idx++ })),
    }));
  }, []);

  const [openActs, setOpenActs] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const { act } of actsWithIndices) init[act.label] = true;
    return init;
  });

  return (
    <nav
      className="flex w-[300px] shrink-0 flex-col overflow-y-auto border-r border-zinc-200 py-2 pl-4 pr-3 pb-24 sm:w-[320px]"
      aria-label="Acts and beats"
    >
      <p
        className="sticky top-0 z-1 mb-3 bg-zinc-50 py-1 text-[10px] uppercase tracking-[0.22em] text-red-800"
        style={{ fontFamily: "var(--font-cinematic)" }}
      >
        Navigate
      </p>

      {actsWithIndices.map(({ act, beats }) => {
        const open = openActs[act.label] ?? true;
        const actBeatObjs = beats.map((b) => b.beat);
        const { scenes: actScenes, pages: actPages } = aggregateBeatExpectations(actBeatObjs);
        return (
          <div key={act.label} className="mb-1 border-b border-zinc-200 pb-2 last:border-0">
            <button
              type="button"
              onClick={() => setOpenActs((s) => ({ ...s, [act.label]: !open }))}
              className="flex w-full items-start gap-2 py-2 pr-0.5 text-left transition-colors hover:text-zinc-900/95"
              style={{ fontFamily: "var(--font-cinematic)" }}
              aria-expanded={open}
            >
              <ChevronDown
                className={cn("mt-1 size-3.5 shrink-0 text-zinc-500 transition-transform", !open && "-rotate-90")}
              />
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-medium uppercase leading-snug tracking-[0.1em] text-zinc-800">
                  {act.label}
                </span>
                <span
                  className="mt-1 block text-[11px] leading-snug text-zinc-600"
                  style={{ fontFamily: "var(--font-screenplay)" }}
                >
                  <span className="block tabular-nums">{formatSceneExpectation(actScenes)}</span>
                  <span className="block tabular-nums text-zinc-500">{formatPageExpectation(actPages)}</span>
                </span>
              </span>
            </button>
            {open && (
              <ul className="mt-1 space-y-1 border-l border-zinc-200 pl-3">
                {beats.map(({ beat, pageIndex }) => {
                  const active = pageIndex === activePageIndex;
                  const beatPages = expectedScreenplayPagesFromScenes(beat.expectedScenes);
                  return (
                    <li key={beat.num}>
                      <button
                        type="button"
                        onClick={() => onSelectBeat(pageIndex)}
                        className={cn(
                          "w-full rounded-md px-2 py-2 text-left transition-colors",
                          active
                            ? "bg-red-100 text-red-950 ring-1 ring-red-300"
                            : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
                        )}
                        style={{ fontFamily: "var(--font-screenplay)" }}
                      >
                        <span className="block text-[12px] leading-snug">
                          <span className="tabular-nums text-zinc-500">{String(beat.num).padStart(2, "0")}</span>{" "}
                          <span className={cn("font-medium", active ? "text-red-950" : "text-zinc-900")}>
                            {beat.title}
                          </span>
                        </span>
                        <span
                          className={cn(
                            "mt-1.5 flex flex-col gap-0.5 text-[10px] tabular-nums leading-normal",
                            active ? "text-red-800" : "text-zinc-500",
                          )}
                        >
                          <span>{formatSceneExpectation(beat.expectedScenes)}</span>
                          <span className={active ? "text-red-700" : "text-zinc-400"}>
                            {formatPageExpectation(beatPages)}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );
}
