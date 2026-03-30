import { isSlugline } from "./detectSluglines";
import { isMetadataLine } from "./extractMetadata";
import { TRANSITION_RE } from "./constants";

export type ScreenplayLineKind =
  | "slugline"
  | "action"
  | "character"
  | "parenthetical"
  | "dialogue"
  | "transition"
  | "fade"
  | "metadata"
  | "blank";

const FADE_RE = /^FADE\s+(IN|OUT|TO)\b/i;

function nextNonBlankIndex(lines: string[], from: number, end: number): number {
  for (let k = from; k <= end; k++) {
    if (lines[k].trim() !== "") return k;
  }
  return -1;
}

function isCharacterCueCandidate(line: string): boolean {
  const t = line.trim();
  if (
    t.length === 0 ||
    t.length > 52 ||
    t !== t.toUpperCase() ||
    !/[A-Z]/.test(t) ||
    isSlugline(t) ||
    TRANSITION_RE.test(t) ||
    FADE_RE.test(t)
  ) {
    return false;
  }
  const parts = t.split(/\s+/).filter(Boolean);
  const stage = new Set(["THE", "A", "AN", "AND", "SHOT", "ANGLE", "CLOSE", "WIDE", "BACK", "ON", "MUSIC"]);
  if (parts[0] && stage.has(parts[0])) return false;
  return true;
}

/**
 * Classify lines [startIdx..endIdx] inclusive (0-based). First line should be slugline.
 */
export function classifyScreenplayLines(
  lines: string[],
  startIdx: number,
  endIdx: number
): ScreenplayLineKind[] {
  const kinds: ScreenplayLineKind[] = [];
  let expectingDialogue = false;

  for (let i = startIdx; i <= endIdx; i++) {
    const line = lines[i];
    const t = line.trim();

    if (t === "") {
      kinds.push("blank");
      expectingDialogue = false;
      continue;
    }

    if (isMetadataLine(t)) {
      kinds.push("metadata");
      expectingDialogue = false;
      continue;
    }

    if (i === startIdx && isSlugline(t)) {
      kinds.push("slugline");
      expectingDialogue = false;
      continue;
    }

    if (FADE_RE.test(t)) {
      kinds.push("fade");
      expectingDialogue = false;
      continue;
    }

    if (TRANSITION_RE.test(t)) {
      kinds.push("transition");
      expectingDialogue = false;
      continue;
    }

    if (t.startsWith("(")) {
      kinds.push("parenthetical");
      expectingDialogue = true;
      continue;
    }

    if (expectingDialogue) {
      kinds.push("dialogue");
      expectingDialogue = false;
      continue;
    }

    if (isCharacterCueCandidate(t)) {
      const nb = nextNonBlankIndex(lines, i + 1, endIdx);
      if (nb === -1) {
        kinds.push("action");
        continue;
      }
      const next = lines[nb].trim();
      const safeNext =
        !isSlugline(next) && !TRANSITION_RE.test(next) && !FADE_RE.test(next) && !isMetadataLine(next);
      const nextIsParen = next.startsWith("(");
      const nextLooksLikeDialogue = /[a-z]/.test(next) || next.includes("—") || next.includes("'");
      if (safeNext && (nextIsParen || nextLooksLikeDialogue)) {
        kinds.push("character");
        expectingDialogue = true;
        continue;
      }
    }

    kinds.push("action");
  }

  return kinds;
}
