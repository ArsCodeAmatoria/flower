"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, AlertCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ScriptPage } from "@/data/script-core";
import { getScriptPageStarts, getTotalScreenplayPages } from "@/data/script";
import type { ScriptMetadataIndex } from "@/lib/script-metadata";
import {
  aggregateBeatCompletionFromMetadata,
  characterSceneCoverageForMeta,
  dialogueCoverageStrong,
  getSceneMetaForPageIndex,
  sceneStructurallyComplete,
} from "@/lib/script-metadata";
import {
  beatProgressDraft2,
  sceneCoverageDraft2,
  dialogueCoverageDraft2,
  characterArcProgressDraft2,
  themeProgressDraft2,
  draft2SceneList,
  type BeatProgressStatus,
} from "@/data/script-progress-draft2";

function Section({
  id,
  title,
  defaultOpen = true,
  children,
}: {
  id: string;
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-2 rounded-xl border border-white/10 bg-white/[0.03]" data-section={id}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left transition-colors hover:bg-white/5"
      >
        <span
          className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80"
          style={{ fontFamily: "var(--font-cinematic)" }}
        >
          {title}
        </span>
        <ChevronDown className={cn("size-3.5 shrink-0 text-white/45 transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="border-t border-white/8 px-3 pb-3 pt-1">{children}</div>}
    </div>
  );
}

function beatIcon(status: BeatProgressStatus) {
  switch (status) {
    case "complete":
      return <Check className="size-3 text-white/85" />;
    case "needs_revision":
      return <AlertCircle className="size-3 text-amber-400" />;
    case "drafted":
    case "in_progress":
      return <Circle className="size-3 text-white/55" />;
    default:
      return <Circle className="size-3 text-white/25" />;
  }
}

function coverageTone(status: (typeof sceneCoverageDraft2)[0]["status"]) {
  switch (status) {
    case "strong":
      return "text-white/90";
    case "moderate":
      return "text-amber-200/80";
    case "weak":
    case "missing":
      return "text-rose-300/80";
    default:
      return "text-white/60";
  }
}

function metaYesNo(v: boolean | null) {
  if (v === null) return "—";
  return v ? "yes" : "no";
}

export function ProgressSidebar({
  pages,
  metaIndex,
  activePageIndex = 0,
}: {
  pages: ScriptPage[];
  metaIndex?: ScriptMetadataIndex;
  activePageIndex?: number;
}) {
  const screenplayPages = useMemo(() => getTotalScreenplayPages(pages), [pages]);
  const starts = useMemo(() => getScriptPageStarts(pages), [pages]);

  const summary = useMemo(() => {
    const beatsDone = beatProgressDraft2.filter((b) => b.status === "complete").length;
    const beatsProgress = beatProgressDraft2.filter((b) => b.status === "in_progress" || b.status === "drafted").length;
    const scenesFlagged = sceneCoverageDraft2.filter((s) => s.status === "weak" || s.status === "missing").length;
    return { beatsDone, beatsProgress, scenesFlagged };
  }, []);

  const embedded = useMemo(() => {
    if (!metaIndex) return null;
    const block = getSceneMetaForPageIndex(metaIndex, activePageIndex);
    const meta = block ?? {};
    const beatRows = aggregateBeatCompletionFromMetadata(metaIndex);
    return {
      meta,
      hasBlock: !!block,
      structural: sceneStructurallyComplete(meta),
      dialogueStrong: dialogueCoverageStrong(meta),
      charCov: characterSceneCoverageForMeta(meta),
      beatRows,
      scenesWithMeta: metaIndex.scenes.length,
    };
  }, [metaIndex, activePageIndex]);

  return (
    <div
      className="w-[300px] shrink-0 overflow-y-auto border-l border-white/10 pr-6 pl-3 pb-24 pt-2"
      style={{ scrollbarWidth: "none" }}
    >
      <p
        className="mb-3 px-1 text-[9px] uppercase tracking-[0.35em] text-white/70"
        style={{ fontFamily: "var(--font-cinematic)" }}
      >
        Progress / coverage
      </p>

      {embedded && embedded.scenesWithMeta > 0 && (
        <Section id="embedded_metadata" title="Embedded metadata (Draft 2)">
          <p className="mb-2 text-[8px] text-white/40">
            Live read of <span className="text-white/55">[[key: value]]</span> on the visible script page.
          </p>
          {!embedded.hasBlock ? (
            <p className="text-[9px] text-white/50">No scene block on this page’s opening slug.</p>
          ) : (
            <div className="space-y-2 text-[9px]" style={{ fontFamily: "var(--font-screenplay)" }}>
              {(embedded.meta["scene.id"] || embedded.meta["scene.title"]) && (
                <div className="rounded border border-white/8 px-2 py-1">
                  {embedded.meta["scene.id"] && (
                    <p className="text-white/75">
                      <span className="text-white/40">scene.id</span> {embedded.meta["scene.id"]}
                    </p>
                  )}
                  {embedded.meta["scene.title"] && (
                    <p className="text-white/75">
                      <span className="text-white/40">scene.title</span> {embedded.meta["scene.title"]}
                    </p>
                  )}
                </div>
              )}
              <div className="flex justify-between gap-2 text-white/70">
                <span>Structurally complete</span>
                <span className={embedded.structural ? "text-white/90" : "text-amber-200/80"}>
                  {embedded.structural ? "yes" : "no"}
                </span>
              </div>
              <div className="flex justify-between gap-2 text-white/70">
                <span>Dialogue coverage strong</span>
                <span className={embedded.dialogueStrong ? "text-white/90" : "text-amber-200/80"}>
                  {embedded.dialogueStrong ? "yes" : "no"}
                </span>
              </div>
              <div className="flex justify-between gap-2 text-white/70">
                <span>Character scene coverage</span>
                <span className="text-white/80">{metaYesNo(embedded.charCov)}</span>
              </div>
              {embedded.beatRows.length > 0 && (
                <>
                  <p className="pt-1 text-[8px] uppercase tracking-[0.15em] text-white/35">Beats in script</p>
                  <ul className="max-h-28 space-y-1 overflow-y-auto pr-1">
                    {embedded.beatRows.map((r) => (
                      <li
                        key={r.beatId}
                        className="flex justify-between gap-1 rounded border border-white/6 px-1.5 py-0.5 text-[8px]"
                      >
                        <span className="truncate text-white/60">{r.beatId}</span>
                        <span className="shrink-0 text-white/45">
                          {r.completeSceneCount > 0 ? "✓ complete" : "open"} ({r.sceneCount})
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </Section>
      )}

      <Section id="completion_summary" title="Completion summary">
        <div className="space-y-2 text-[9px]" style={{ fontFamily: "var(--font-screenplay)" }}>
          <div className="flex justify-between gap-2 text-white/70">
            <span>Screenplay pages (est.)</span>
            <span className="tabular-nums text-white">{screenplayPages}</span>
          </div>
          <div className="flex justify-between gap-2 text-white/70">
            <span>Script beats / scenes</span>
            <span className="tabular-nums text-white">{pages.length}</span>
          </div>
          <div className="flex justify-between gap-2 text-white/70">
            <span>STC beats complete</span>
            <span className="tabular-nums text-white">
              {summary.beatsDone} / {beatProgressDraft2.length}
            </span>
          </div>
          <div className="flex justify-between gap-2 text-white/70">
            <span>Beats drafted / in motion</span>
            <span className="tabular-nums text-white">{summary.beatsProgress}</span>
          </div>
          <div className="flex justify-between gap-2 text-white/70">
            <span>Scene coverage flags</span>
            <span className="tabular-nums text-amber-200/80">{summary.scenesFlagged}</span>
          </div>
          <p className="pt-1 text-[8px] text-white/35">Targets vs actual: refine in `script-progress-draft2.ts` as Draft 2 evolves.</p>
        </div>
      </Section>

      <Section id="beat_progress" title="Beat progress">
        <div className="flex max-h-[min(38vh,300px)] flex-col gap-1 overflow-y-auto pr-1">
          {beatProgressDraft2.map((b) => (
            <div
              key={b.id}
              className="flex items-start gap-2 rounded-lg border border-white/8 bg-black/25 px-2 py-1.5"
            >
              <span className="mt-0.5">{beatIcon(b.status)}</span>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-white/85">{b.label}</p>
                <p className="text-[8px] uppercase tracking-wider text-white/35">{b.status.replace(/_/g, " ")}</p>
                {b.notes && <p className="mt-0.5 text-[8px] text-white/45">{b.notes}</p>}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="scene_coverage" title="Scene coverage" defaultOpen={false}>
        <p className="mb-2 text-[8px] text-white/40">Dramatic function — update assessments as you rewrite.</p>
        <ul className="space-y-1.5">
          {sceneCoverageDraft2.map((s) => (
            <li key={s.id} className="flex flex-col gap-0.5 rounded border border-white/6 px-2 py-1">
              <span className="text-[9px] text-white/70">{s.label}</span>
              <span className={cn("text-[9px] font-medium capitalize", coverageTone(s.status))}>{s.status}</span>
              {s.note && <span className="text-[8px] text-white/40">{s.note}</span>}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[8px] uppercase tracking-[0.15em] text-white/35">Scene list</p>
        <ul className="mt-1 space-y-1">
          {draft2SceneList.map((s) => (
            <li key={s.name} className="text-[9px] text-white/55">
              <span className="text-white/75">{s.name}</span>{" "}
              <span className="text-white/35">— {s.status.replace(/_/g, " ")}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="dialogue_coverage" title="Dialogue coverage" defaultOpen={false}>
        <ul className="space-y-1.5">
          {dialogueCoverageDraft2.map((d) => (
            <li key={d.id} className="flex flex-col rounded border border-white/6 px-2 py-1">
              <span className="text-[9px] text-white/70">{d.label}</span>
              <span className={cn("text-[9px] capitalize", coverageTone(d.status))}>{d.status}</span>
              {d.note && <span className="text-[8px] text-white/40">{d.note}</span>}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="character_arc_progress" title="Character arc progress" defaultOpen={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-[8px] text-white/60">
            <thead>
              <tr className="text-left text-white/40">
                <th className="pb-1 pr-1">Char</th>
                <th className="px-0.5">I</th>
                <th className="px-0.5">Obj</th>
                <th className="px-0.5">Flaw</th>
                <th className="px-0.5">Press</th>
                <th className="px-0.5">Turn</th>
                <th className="px-0.5">Res</th>
              </tr>
            </thead>
            <tbody>
              {characterArcProgressDraft2.map((row) => (
                <tr key={row.character} className="border-t border-white/8">
                  <td className="py-1 pr-1 text-white/80">{row.character}</td>
                  <td className="text-center">{row.intro ? "✓" : "·"}</td>
                  <td className="text-center">{row.objective ? "✓" : "·"}</td>
                  <td className="text-center">{row.flaw ? "✓" : "·"}</td>
                  <td className="text-center">{row.pressure ? "✓" : "·"}</td>
                  <td className="text-center">{row.turn ? "✓" : "·"}</td>
                  <td className="text-center">{row.resolved ? "✓" : "·"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="theme_progress" title="Theme progress" defaultOpen={false}>
        <ul className="space-y-1">
          {themeProgressDraft2.map((t) => (
            <li key={t.id} className="flex items-center gap-2 text-[9px]">
              {t.done ? <Check className="size-3 text-white/80" /> : <Circle className="size-3 text-white/30" />}
              <span className={t.done ? "text-white/80" : "text-white/45"}>{t.label}</span>
              {t.note && <span className="text-[8px] text-white/35">({t.note})</span>}
            </li>
          ))}
        </ul>
      </Section>

      <p className="mt-4 px-1 text-[8px] text-white/30" style={{ fontFamily: "var(--font-screenplay)" }}>
        First slug page marker in scroll ≈ p.{starts[0] ?? 1}. Refine progress data in `src/data/script-progress-draft2.ts`.
      </p>
    </div>
  );
}
