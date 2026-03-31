"use client";

import { useMemo } from "react";
import { flattenFlowerBeatsForNav } from "@/data/flower-beats-final";
import { getSceneCountStats } from "@/data/script";
import {
  countElementScreenplayLines,
  LINES_PER_SCREENPLAY_PAGE,
  type ScriptPage,
} from "@/data/script-core";

export function SceneDescriptionSidebar({
  pages,
  activePageIndex,
}: {
  pages: ScriptPage[];
  activePageIndex: number;
}) {
  const nav = useMemo(() => flattenFlowerBeatsForNav(), []);
  const current = nav[activePageIndex];

  const lineStats = useMemo(() => {
    const p = pages[activePageIndex];
    if (!p || p.isBible) return { block: 0, scriptPageFraction: "" };
    let block = 0;
    for (const el of p.elements) block += countElementScreenplayLines(el);
    const pagesSpanned = Math.max(1, Math.ceil(block / LINES_PER_SCREENPLAY_PAGE));
    return { block, pagesSpanned, scriptPageFraction: `~${pagesSpanned} p. of ${LINES_PER_SCREENPLAY_PAGE}-line count` };
  }, [pages, activePageIndex]);

  const sceneCount = useMemo(() => getSceneCountStats(pages, activePageIndex), [pages, activePageIndex]);

  if (!current) {
    return (
      <aside className="w-[300px] shrink-0 overflow-y-auto border-l border-white/10 py-2 pl-3 pr-5 pb-24 pt-2">
        <p className="text-[11px] text-white/45" style={{ fontFamily: "var(--font-screenplay)" }}>
          Select a beat.
        </p>
      </aside>
    );
  }

  const slug = pages[activePageIndex]?.elements.find((e) => e.type === "scene")?.text ?? "";

  return (
    <aside className="w-[300px] shrink-0 overflow-y-auto border-l border-white/10 py-2 pl-3 pr-5 pb-24 pt-2">
      <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0">
        <p
          className="text-[9px] uppercase tracking-[0.3em] text-amber-200/55"
          style={{ fontFamily: "var(--font-cinematic)" }}
        >
          Scene description
        </p>
        {sceneCount.total > 0 ? (
          <p className="text-[9px] tabular-nums text-white/40" style={{ fontFamily: "var(--font-screenplay)" }}>
            Scene {String(sceneCount.current).padStart(2, "0")} / {String(sceneCount.total).padStart(2, "0")}
          </p>
        ) : null}
      </div>
      <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-white/40" style={{ fontFamily: "var(--font-cinematic)" }}>
        {current.actLabel}
      </p>
      <h2
        className="mt-1 text-[13px] font-medium leading-snug text-white/92"
        style={{ fontFamily: "var(--font-cinematic)" }}
      >
        Beat {String(current.beat.num).padStart(2, "0")} — {current.beat.title}
      </h2>
      {slug ? (
        <p className="mt-2 text-[10px] leading-relaxed text-white/50" style={{ fontFamily: "var(--font-screenplay)" }}>
          {slug}
        </p>
      ) : null}
      <div
        className="mt-4 space-y-2 border-t border-white/8 pt-4 text-[12px] leading-relaxed text-white/72"
        style={{ fontFamily: "var(--font-screenplay)" }}
      >
        {current.beat.paragraphs.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
      <p className="mt-5 text-[9px] tabular-nums text-white/35" style={{ fontFamily: "var(--font-screenplay)" }}>
        This beat: {lineStats.block} lines counted · {lineStats.scriptPageFraction}
      </p>
    </aside>
  );
}
