"use client";

import { ChevronDown } from "lucide-react";
import {
  FLOWER_BEATS_ACTS,
  FLOWER_BEATS_HEADLINE,
  FLOWER_BEATS_SUMMARY,
  FLOWER_BEATS_THROUGHLINE,
  FLOWER_BEATS_THROUGHLINE_TITLE,
  FLOWER_SCENE_ANCHOR_CLUSTERS,
  FLOWER_SCENE_COUNT_HEADLINE,
  FLOWER_SCENE_COUNT_PRINCIPLES,
  FLOWER_SCENE_COUNT_RATIONALE,
  FLOWER_SCENE_COUNT_SUMMARY,
  FLOWER_SCENE_TARGET_SECTIONS,
} from "@/data/flower-beats-final";

export function FlowerBeatsStructure() {
  return (
    <div className="structure-details-view relative flex-1 overflow-y-auto pb-24">
      <div className="pointer-events-none absolute left-[calc(50%-20rem)] top-0 bottom-0 w-px bg-white/8" />
      <article className="mx-auto max-w-xl px-4 py-8 pb-16 sm:px-6 lg:max-w-2xl">
        <header className="mb-10 border-b border-amber-200/15 pb-8">
          <h2
            className="text-center text-[11px] font-medium uppercase leading-relaxed tracking-[0.28em] text-amber-200/70 sm:text-xs"
            style={{ fontFamily: "var(--font-cinematic)" }}
          >
            {FLOWER_BEATS_HEADLINE}
          </h2>
          <p
            className="mx-auto mt-4 max-w-md text-center text-[10px] leading-relaxed text-white/38"
            style={{ fontFamily: "var(--font-screenplay)" }}
          >
            Open an act to list its beats. Open a beat to read the outline.
          </p>
        </header>

        <details className="group mb-8 rounded-xl border border-amber-200/12 bg-white/[0.02]">
          <summary
            className="flex cursor-pointer list-none items-center gap-2 px-4 py-3.5"
            style={{ fontFamily: "var(--font-cinematic)" }}
          >
            <ChevronDown className="size-3.5 shrink-0 text-amber-200/55 transition-transform duration-200 group-open:rotate-180" />
            <span className="text-[10px] uppercase tracking-[0.22em] text-amber-200/70">{FLOWER_SCENE_COUNT_HEADLINE}</span>
          </summary>
          <div className="border-t border-white/8 px-4 pb-5 pt-1">
            <p
              className="mt-3 text-[12px] leading-relaxed text-white/78"
              style={{ fontFamily: "var(--font-screenplay)" }}
            >
              {FLOWER_SCENE_COUNT_SUMMARY}
            </p>
            <ul className="mt-3 list-disc space-y-1.5 pl-4 text-[11px] leading-relaxed text-white/55" style={{ fontFamily: "var(--font-screenplay)" }}>
              {FLOWER_SCENE_COUNT_RATIONALE.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
            <p className="mt-4 text-[9px] uppercase tracking-[0.2em] text-white/40" style={{ fontFamily: "var(--font-cinematic)" }}>
              By section
            </p>
            <div className="mt-2 overflow-x-auto">
              <table className="w-full min-w-[320px] border-collapse text-left text-[11px]" style={{ fontFamily: "var(--font-screenplay)" }}>
                <thead>
                  <tr className="border-b border-white/10 text-white/45">
                    <th className="py-2 pr-3 font-normal uppercase tracking-wider" style={{ fontFamily: "var(--font-cinematic)" }}>
                      Section
                    </th>
                    <th className="w-20 py-2 pr-3 font-normal uppercase tracking-wider" style={{ fontFamily: "var(--font-cinematic)" }}>
                      Scenes
                    </th>
                    <th className="py-2 font-normal uppercase tracking-wider" style={{ fontFamily: "var(--font-cinematic)" }}>
                      Note
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {FLOWER_SCENE_TARGET_SECTIONS.map((row) => (
                    <tr key={row.section} className="border-b border-white/6 text-white/72 last:border-0">
                      <td className="py-2 pr-3 align-top text-white/58">{row.section}</td>
                      <td className="py-2 pr-3 align-top tabular-nums text-amber-200/55">{row.sceneRange}</td>
                      <td className="py-2 align-top text-white/75">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-5 text-[9px] uppercase tracking-[0.2em] text-white/40" style={{ fontFamily: "var(--font-cinematic)" }}>
              Anchor sequences
            </p>
            <ul className="mt-2 space-y-1 text-[11px] text-white/68" style={{ fontFamily: "var(--font-screenplay)" }}>
              {FLOWER_SCENE_ANCHOR_CLUSTERS.map((c) => (
                <li key={c.label}>
                  <span className="tabular-nums text-amber-200/50">{c.sceneRange} scenes — </span>
                  {c.label}
                </li>
              ))}
            </ul>
            <ul className="mt-4 list-disc space-y-1.5 border-t border-white/6 pl-4 pt-4 text-[11px] leading-relaxed text-white/55" style={{ fontFamily: "var(--font-screenplay)" }}>
              {FLOWER_SCENE_COUNT_PRINCIPLES.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
            <p className="mt-4 text-[10px] leading-relaxed text-white/38" style={{ fontFamily: "var(--font-screenplay)" }}>
              Whole script view uses one scene heading per beat for now (15). As the draft grows, scene count in the editor should move toward these targets—not stay at fifteen.
            </p>
          </div>
        </details>

        {FLOWER_BEATS_ACTS.map((act) => (
          <details key={act.label} className="group mb-3 rounded-lg border border-white/10 bg-white/[0.02]">
            <summary
              className="flex cursor-pointer list-none items-center gap-2 px-3 py-3 transition-colors hover:bg-white/[0.04]"
              style={{ fontFamily: "var(--font-cinematic)" }}
            >
              <ChevronDown className="size-3.5 shrink-0 text-amber-200/50 transition-transform duration-200 group-open:rotate-180" />
              <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/80">{act.label}</span>
              <span className="ml-auto text-[9px] tabular-nums text-white/35">
                {act.beats.length} beat{act.beats.length === 1 ? "" : "s"}
              </span>
            </summary>
            <div className="border-t border-white/8 px-2 pb-3 pt-1">
              {act.beats.map((b) => (
                <details key={b.num} className="group/beat mb-2 rounded-md border border-white/[0.06] last:mb-0">
                  <summary
                    className="flex cursor-pointer list-none items-start gap-2 px-2 py-2.5 text-left transition-colors hover:bg-white/[0.03]"
                    style={{ fontFamily: "var(--font-cinematic)" }}
                  >
                    <ChevronDown className="mt-0.5 size-3 shrink-0 text-white/35 transition-transform duration-200 group-open/beat:rotate-180" />
                    <span className="min-w-0 flex-1">
                      <span className="text-[9px] tabular-nums text-amber-200/45">{String(b.num).padStart(2, "0")}</span>
                      <span className="ml-2 text-[13px] font-medium tracking-[0.04em] text-white/92">{b.title}</span>
                    </span>
                  </summary>
                  <div
                    className="space-y-2 border-t border-white/[0.05] px-3 pb-3 pt-2 pl-9 text-[13px] leading-relaxed text-white/72"
                    style={{ fontFamily: "var(--font-screenplay)" }}
                  >
                    {b.paragraphs.map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </details>
        ))}

        <details className="group mb-12 mt-8 rounded-xl border border-white/10 bg-white/[0.03]">
          <summary
            className="flex cursor-pointer list-none items-center gap-2 px-5 py-4"
            style={{ fontFamily: "var(--font-cinematic)" }}
          >
            <ChevronDown className="size-3.5 shrink-0 text-amber-200/55 transition-transform duration-200 group-open:rotate-180" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-amber-200/65">{FLOWER_BEATS_THROUGHLINE_TITLE}</span>
          </summary>
          <div className="border-t border-white/8 px-5 pb-6 pt-2">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[280px] border-collapse text-left text-[12px]" style={{ fontFamily: "var(--font-screenplay)" }}>
                <thead>
                  <tr className="border-b border-white/10 text-white/45">
                    <th className="pb-2 pr-4 font-normal uppercase tracking-wider" style={{ fontFamily: "var(--font-cinematic)" }}>
                      Stage
                    </th>
                    <th className="pb-2 font-normal uppercase tracking-wider" style={{ fontFamily: "var(--font-cinematic)" }}>
                      Rose’s state
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {FLOWER_BEATS_THROUGHLINE.map((row) => (
                    <tr key={row.stage} className="border-b border-white/6 text-white/75 last:border-0">
                      <td className="py-2 pr-4 text-white/55">{row.stage}</td>
                      <td className="py-2 text-white/90">{row.state}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </details>

        <footer className="border-t border-amber-200/15 pt-8">
          <details className="group rounded-lg border border-white/8 bg-white/[0.02]">
            <summary
              className="flex cursor-pointer list-none items-center gap-2 px-3 py-3"
              style={{ fontFamily: "var(--font-cinematic)" }}
            >
              <ChevronDown className="size-3.5 shrink-0 text-amber-200/45 transition-transform duration-200 group-open:rotate-180" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-amber-200/50">Final one-line summary</span>
            </summary>
            <div className="border-t border-white/8 px-3 pb-4 pt-3">
              <p className="text-[14px] leading-relaxed text-amber-100/88" style={{ fontFamily: "var(--font-screenplay)" }}>
                {FLOWER_BEATS_SUMMARY}
              </p>
            </div>
          </details>
        </footer>
      </article>
    </div>
  );
}
