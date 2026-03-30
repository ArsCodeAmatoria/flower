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

/** ~55 lines per page (industry standard). Estimates formatted screenplay lines per element. */
function estLines(el: ScriptElement): number {
  const len = el.text.length;
  switch (el.type) {
    case "scene":
      return 2;
    case "action":
      return Math.max(1, Math.ceil(len / 58));
    case "dialogue":
      return Math.max(1, Math.ceil(len / 38));
    case "character":
    case "parenthetical":
      return 1;
    case "metadata":
    case "fade":
    case "transition":
    default:
      return 1;
  }
}

/** Cumulative screenplay page where each beat starts (1-based). [0]=1, [1]=start of beat 2, etc. */
export function getScriptPageStarts(pages: ScriptPage[]): number[] {
  const LINES_PER_PAGE = 55;
  const starts: number[] = [];
  let acc = 0;
  for (const p of pages) {
    starts.push(Math.floor(acc / LINES_PER_PAGE) + 1);
    if (!p.isBible) {
      for (const el of p.elements) acc += estLines(el);
    }
  }
  starts.push(Math.floor(acc / LINES_PER_PAGE) + 1); // end sentinel
  return starts;
}

/** Total estimated screenplay pages (industry format). */
export function getTotalScreenplayPages(pages: ScriptPage[]): number {
  const LINES_PER_PAGE = 55;
  let acc = 0;
  for (const p of pages) {
    if (p.isBible) continue;
    for (const el of p.elements) acc += estLines(el);
  }
  return Math.max(1, Math.ceil(acc / LINES_PER_PAGE));
}
