/**
 * Parse [[key: value]] screenplay metadata embedded in script elements.
 * Spec: lowercase dotted keys, one concept per line, regex-friendly.
 */

import type { ScriptPage } from "@/data/script-core";

/** Full-line metadata; value may be empty. Keys: [a-z0-9_.]+ */
export const SCRIPT_METADATA_LINE_RE =
  /^\[\[\s*([a-z0-9_.]+)\s*:\s*(.*?)\s*\]\]\s*$/;

export function parseMetadataLine(raw: string): { key: string; value: string } | null {
  const m = raw.trim().match(SCRIPT_METADATA_LINE_RE);
  if (!m) return null;
  return { key: m[1], value: m[2].trim() };
}

const BODY_ELEMENT_TYPES = new Set([
  "fade",
  "scene",
  "action",
  "character",
  "parenthetical",
  "dialogue",
  "transition",
]);

export interface SceneMetaBlock {
  pageIndex: number;
  pageId: string;
  slug: string;
  meta: Record<string, string>;
}

export interface ScriptMetadataIndex {
  /** project.*, theme.*, character.* master cards (flat, last write wins per key). */
  preamble: Record<string, string>;
  scenes: SceneMetaBlock[];
}

function mergeMeta(into: Record<string, string>, key: string, value: string) {
  into[key] = value;
}

/**
 * Walk screenplay pages: preamble metadata until first body line; then each scene's
 * consecutive metadata lines immediately before its slug.
 */
export function buildScriptMetadataIndex(pages: ScriptPage[]): ScriptMetadataIndex {
  const preamble: Record<string, string> = {};
  const scenes: SceneMetaBlock[] = [];

  let inPreamble = true;
  let queue: Record<string, string> = {};

  for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
    const page = pages[pageIndex];
    if (page.isBible) continue;

    for (const el of page.elements) {
      if (el.type === "metadata") {
        const p = parseMetadataLine(el.text);
        if (!p) continue;
        if (inPreamble) mergeMeta(preamble, p.key, p.value);
        else mergeMeta(queue, p.key, p.value);
        continue;
      }

      if (inPreamble && BODY_ELEMENT_TYPES.has(el.type)) {
        inPreamble = false;
        queue = {};
      }

      if (el.type === "scene") {
        const meta = { ...queue };
        queue = {};
        scenes.push({
          pageIndex,
          pageId: page.id,
          slug: el.text,
          meta,
        });
      }
    }
  }

  return { preamble, scenes };
}

export function getSceneMetaForPageIndex(
  index: ScriptMetadataIndex,
  pageIndex: number
): Record<string, string> | null {
  const onPage = index.scenes.filter((s) => s.pageIndex === pageIndex);
  if (onPage.length === 0) return null;
  return onPage[0].meta;
}

export function sceneStructurallyComplete(meta: Record<string, string>): boolean {
  const need = ["scene.goal", "scene.obstacle", "scene.turn", "scene.outcome"] as const;
  return need.every((k) => (meta[k] ?? "").trim().length > 0);
}

export function dialogueCoverageStrong(meta: Record<string, string>): boolean {
  const base =
    ["dialogue.subtext", "dialogue.conflict", "dialogue.turn"] as const;
  if (!base.every((k) => (meta[k] ?? "").trim().length > 0)) return false;
  const hasObjective = Object.keys(meta).some((k) => k.startsWith("dialogue.objective."));
  const hasVerbal = Object.keys(meta).some((k) => k.startsWith("dialogue.verbal_action."));
  return hasObjective && hasVerbal;
}

export function characterSceneCoverageComplete(
  meta: Record<string, string>,
  shortnames: string[]
): boolean {
  for (const sn of shortnames) {
    const pre = `character.${sn}.`;
    const obj = meta[`${pre}scene_objective`] ?? "";
    const es = meta[`${pre}emotion_start`] ?? "";
    const ee = meta[`${pre}emotion_end`] ?? "";
    if (!obj.trim() || !es.trim() || !ee.trim()) return false;
  }
  return shortnames.length > 0;
}

/** `null` when no `scene.characters` listed (e.g. montage). */
export function characterSceneCoverageForMeta(meta: Record<string, string>): boolean | null {
  const shortnames = parseSceneCharacterIds(meta["scene.characters"] ?? "");
  if (shortnames.length === 0) return null;
  return characterSceneCoverageComplete(meta, shortnames);
}

/** Parse [[scene.characters: char_a, char_b]] → short handles after char_ */
export function parseSceneCharacterIds(raw: string): string[] {
  if (!raw.trim()) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((id) => (id.startsWith("char_") ? id.slice(5) : id));
}

export function aggregateBeatCompletionFromMetadata(index: ScriptMetadataIndex): {
  beatId: string;
  sceneCount: number;
  completeSceneCount: number;
}[] {
  const map = new Map<string, { total: number; complete: number }>();
  for (const s of index.scenes) {
    const b = s.meta["beat.id"];
    if (!b?.trim()) continue;
    const cur = map.get(b) ?? { total: 0, complete: 0 };
    cur.total += 1;
    if ((s.meta["scene.complete"] ?? "").toLowerCase() === "true") cur.complete += 1;
    map.set(b, cur);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([beatId, { total, complete }]) => ({
      beatId,
      sceneCount: total,
      completeSceneCount: complete,
    }));
}
