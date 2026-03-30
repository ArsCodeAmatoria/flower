"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import type { ScriptPage } from "@/data/script-core";
import { getScriptPageStarts, getTotalScreenplayPages } from "@/data/script";
import { getPageTitle, ScriptLine, ScreenplayLetterhead } from "@/sections/script/ScriptPanelShared";
import { getScriptHourForPage } from "@/sections/script/ScriptMoonWidget";
import { cn } from "@/lib/utils";
import { buildScriptMetadataIndex, getSceneMetaForPageIndex } from "@/lib/script-metadata";
import { WritingRulesSidebar } from "@/sections/script/WritingRulesSidebar";
import { ProgressSidebar } from "@/sections/script/ProgressSidebar";

export function ScriptDraft2Cockpit({
  pages,
  labels,
}: {
  pages: ScriptPage[];
  labels: Record<string, string>;
}) {
  const [page, setPage] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scriptPageStarts = useMemo(() => getScriptPageStarts(pages), [pages]);
  const totalScreenplayPages = useMemo(() => getTotalScreenplayPages(pages), [pages]);
  const total = pages.length;
  const current = pages[page];
  const currentScreenplayPage = scriptPageStarts[Math.min(page, scriptPageStarts.length - 1)] ?? 1;
  const scriptTime = getScriptHourForPage(pages, page);
  const sceneTitle = useMemo(() => {
    const sc = current?.elements.find((e) => e.type === "scene");
    return sc?.text ?? getPageTitle(current, labels);
  }, [current, labels]);

  const metaIndex = useMemo(() => buildScriptMetadataIndex(pages), [pages]);
  const currentSceneMeta = useMemo(
    () => getSceneMetaForPageIndex(metaIndex, page) ?? {},
    [metaIndex, page]
  );
  const scriptAnchors = useMemo(
    () => ({
      actId: currentSceneMeta["act.id"],
      beatId: currentSceneMeta["beat.id"],
      threadId: currentSceneMeta["thread.id"],
      themeCore: metaIndex.preamble["theme.core"],
      sceneTitle: currentSceneMeta["scene.title"]?.trim()
        ? currentSceneMeta["scene.title"]
        : undefined,
    }),
    [currentSceneMeta, metaIndex.preamble]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let topmostIdx = -1;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = pageRefs.current.findIndex((r) => r === entry.target);
            if (idx !== -1 && (topmostIdx === -1 || idx < topmostIdx)) topmostIdx = idx;
          }
        });
        if (topmostIdx !== -1) setPage(topmostIdx);
      },
      { root: scrollRef.current, threshold: 0.4 }
    );
    pageRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    return () => observer.disconnect();
  }, [pages]);

  return (
    <div className="flex min-h-0 w-full flex-1 overflow-hidden">
      <WritingRulesSidebar scriptAnchors={scriptAnchors} />
      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="shrink-0 border-b border-white/10 bg-black/50 px-4 py-2">
          <div className="mx-auto flex max-w-xl flex-wrap items-center gap-x-4 gap-y-1 text-[9px] text-white/55" style={{ fontFamily: "var(--font-screenplay)" }}>
            <span>
              <span className="text-white/35">Scene </span>
              <span className="tabular-nums text-white/80">{String(page + 1).padStart(2, "0")}</span>
              <span className="text-white/35"> / {String(total).padStart(2, "0")}</span>
            </span>
            <span className="text-white/25">|</span>
            <span>
              <span className="text-white/35">p. </span>
              <span className="tabular-nums text-white/80">{String(currentScreenplayPage).padStart(2, "0")}</span>
              <span className="text-white/35"> / ~{String(totalScreenplayPages).padStart(2, "0")}</span>
            </span>
            {scriptTime && (
              <>
                <span className="text-white/25">|</span>
                <span className="text-amber-200/60">{scriptTime.label}</span>
              </>
            )}
          </div>
          <p className="mx-auto mt-1 max-w-xl line-clamp-2 text-[10px] leading-snug text-white/70" style={{ fontFamily: "var(--font-cinematic)" }}>
            {sceneTitle}
          </p>
        </div>
        <div
          ref={scrollRef}
          className="relative flex-1 overflow-y-auto pb-24"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="pointer-events-none absolute left-[calc(50%-20rem)] top-0 bottom-0 w-px bg-white/8" />
          <div className="mx-auto max-w-xl px-4 py-6 pb-16">
            <ScreenplayLetterhead draftLabel="Draft 2" />
            {pages.map((p, idx) => (
              <div
                key={p.id}
                ref={(el) => {
                  pageRefs.current[idx] = el;
                }}
                className="mb-1"
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="h-px flex-1 bg-white/10" />
                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-0.5 text-[10px] tabular-nums",
                      p.isBible
                        ? "border-white/20 bg-white/10 text-white/70"
                        : "border-white/15 bg-white/6 text-white/55"
                    )}
                    style={{ fontFamily: "var(--font-screenplay)" }}
                  >
                    {p.isBible ? p.id.replace("bible-", "§") : String(scriptPageStarts[idx] ?? idx + 1)}
                  </span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>
                {p.isBible ? (
                  <div className="mb-12 space-y-4 rounded-2xl border border-white/8 bg-white/3 px-8 py-8">
                    {p.elements
                      .filter((el) => el.type !== "metadata")
                      .map((el, i) => {
                      if (el.type === "scene")
                        return (
                          <p
                            key={i}
                            className="pt-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white/55"
                            style={{ fontFamily: "var(--font-cinematic)" }}
                          >
                            {el.text}
                          </p>
                        );
                      if (el.type === "fade") return <div key={i} className="my-2 h-px w-full bg-white/8" />;
                      if (el.type === "character")
                        return (
                          <p
                            key={i}
                            className="mt-4 text-xs font-semibold uppercase tracking-widest text-white/80"
                            style={{ fontFamily: "var(--font-cinematic)" }}
                          >
                            {el.text}
                          </p>
                        );
                      if (el.type === "dialogue")
                        return (
                          <p
                            key={i}
                            className="ml-6 text-sm italic leading-relaxed text-white/70"
                            style={{ fontFamily: "var(--font-screenplay)" }}
                          >
                            &ldquo;{el.text}&rdquo;
                          </p>
                        );
                      return (
                        <p key={i} className="text-sm leading-relaxed text-white/60" style={{ fontFamily: "var(--font-screenplay)" }}>
                          {el.text}
                        </p>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-2 pb-12">
                    {p.elements
                      .filter((el) => el.type !== "metadata")
                      .map((el, i) => (
                      <div key={i} className="flex items-baseline gap-3">
                        <span
                          className="w-8 shrink-0 select-none text-right text-[10px] tabular-nums text-white/25"
                          title={`${p.id} visible line ${i + 1}`}
                        >
                          {i + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <ScriptLine type={el.type} text={el.text} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <ProgressSidebar pages={pages} metaIndex={metaIndex} activePageIndex={page} />
    </div>
  );
}
