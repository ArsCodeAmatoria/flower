import { METADATA_LINE_RE } from "./constants";
import type { MetadataEntry } from "./types";

/**
 * Stage 2 — metadata lines; lineNumber is 1-based.
 * Spec: ^\[\[([a-z0-9_.]+):\s*(.*?)\]\]$
 * Forgiving: trim outer whitespace on the line before matching.
 */
export function extractMetadata(lines: string[]): MetadataEntry[] {
  const out: MetadataEntry[] = [];
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    const m = trimmed.match(METADATA_LINE_RE);
    if (m) {
      out.push({
        key: m[1],
        value: m[2].trim(),
        lineNumber: i + 1,
      });
    }
  }
  return out;
}

export function isMetadataLine(line: string): boolean {
  return METADATA_LINE_RE.test(line.trim());
}
