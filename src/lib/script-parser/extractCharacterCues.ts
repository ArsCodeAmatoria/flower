import { classifyScreenplayLines } from "./classifyScreenplayLine";

/** Unique cues (uppercase as in script) from classified character lines. */
export function extractCharacterCues(
  lines: string[],
  slugLineNumber: number,
  contentEndLine: number
): string[] {
  const startIdx = slugLineNumber - 1;
  const endIdx = contentEndLine - 1;
  if (startIdx < 0 || endIdx < startIdx || startIdx >= lines.length) return [];

  const kinds = classifyScreenplayLines(lines, startIdx, Math.min(endIdx, lines.length - 1));
  const seen = new Set<string>();
  const out: string[] = [];

  for (let i = 0; i < kinds.length; i++) {
    if (kinds[i] !== "character") continue;
    const text = lines[startIdx + i].trim();
    if (!seen.has(text)) {
      seen.add(text);
      out.push(text);
    }
  }

  return out;
}
