export type ScriptElementType =
  | "fade"
  | "scene"
  | "action"
  | "character"
  | "parenthetical"
  | "dialogue"
  | "transition"
  /** One line: [[key: value]] — screenplay metadata (see `src/lib/script-metadata.ts`) */
  | "metadata";

export interface ScriptElement {
  type: ScriptElementType;
  text: string;
}

export interface ScriptPage {
  id: string;
  elements: ScriptElement[];
  characterIds?: string[];
  songIds?: string[];
  setIds?: string[];
  isBible?: boolean;
}

/** Standard screenplay page = 55 lines, including blank separator lines. */
export const LINES_PER_SCREENPLAY_PAGE = 55;

/**
 * Line budget per element as printed on a script page: one row = one line,
 * including trailing blank lines after blocks (industry spacing).
 * Metadata is not counted (title page / production notes convention).
 */
export function countElementScreenplayLines(el: ScriptElement): number {
  if (el.type === "metadata") return 0;

  const spaceAfterBlock = 1;

  switch (el.type) {
    case "scene":
      return 1 + spaceAfterBlock;
    case "action": {
      const lines = el.text
        .split("\n")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      return Math.max(1, lines.length) + spaceAfterBlock;
    }
    case "character":
      return 1;
    case "parenthetical":
      return 1;
    case "dialogue": {
      const lines = el.text
        .split("\n")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      return Math.max(1, lines.length) + spaceAfterBlock;
    }
    case "fade":
    case "transition":
      return 1 + spaceAfterBlock;
    default:
      return 1 + spaceAfterBlock;
  }
}

/** Cumulative screenplay page where each script block starts (1-based). */
export function getScriptPageStarts(pages: ScriptPage[]): number[] {
  const starts: number[] = [];
  let acc = 0;
  for (const p of pages) {
    starts.push(Math.floor(acc / LINES_PER_SCREENPLAY_PAGE) + 1);
    if (!p.isBible) {
      for (const el of p.elements) acc += countElementScreenplayLines(el);
    }
  }
  starts.push(Math.floor(acc / LINES_PER_SCREENPLAY_PAGE) + 1);
  return starts;
}

/** Total screenplay pages from accumulated line count. */
export function getTotalScreenplayPages(pages: ScriptPage[]): number {
  let acc = 0;
  for (const p of pages) {
    if (p.isBible) continue;
    for (const el of p.elements) acc += countElementScreenplayLines(el);
  }
  return Math.max(1, Math.ceil(acc / LINES_PER_SCREENPLAY_PAGE));
}

/** Total counted lines (e.g. for debug). */
export function getTotalScreenplayLineCount(pages: ScriptPage[]): number {
  let acc = 0;
  for (const p of pages) {
    if (p.isBible) continue;
    for (const el of p.elements) acc += countElementScreenplayLines(el);
  }
  return acc;
}

/**
 * Document-ordered scene numbers: each `type: "scene"` slug is one scene.
 * `current` is the index of the first scene heading on `pages[pageIndex]`;
 * if that page has none, uses the most recent scene from earlier pages.
 */
export function getSceneCountStats(
  pages: ScriptPage[],
  pageIndex: number,
): { current: number; total: number } {
  let total = 0;
  const firstOnPage: number[] = [];
  for (let pi = 0; pi < pages.length; pi++) {
    let first = 0;
    for (const el of pages[pi].elements) {
      if (el.type === "scene") {
        total += 1;
        if (first === 0) first = total;
      }
    }
    firstOnPage[pi] = first;
  }
  let current = firstOnPage[pageIndex] ?? 0;
  if (current === 0) {
    for (let i = pageIndex - 1; i >= 0; i--) {
      if (firstOnPage[i]) {
        current = firstOnPage[i];
        break;
      }
    }
  }
  return {
    current: total === 0 ? 0 : current || 1,
    total,
  };
}
