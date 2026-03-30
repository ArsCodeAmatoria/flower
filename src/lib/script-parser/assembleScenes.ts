import { isMetadataLine } from "./extractMetadata";
import { detectSluglineLineNumbers } from "./detectSluglines";
import type { MetadataEntry } from "./types";

export type RawSceneChunk = {
  slugline: string;
  slugLineNumber: number;
  contentEndLine: number;
  rawMetadata: MetadataEntry[];
  metadataStartLine: number;
  metadataEndLine: number;
};

/**
 * Stage 4 — scene runs + metadata immediately above slug (skip blanks between meta block and slug).
 */
export function assembleRawScenes(lines: string[], allMetadata: MetadataEntry[]): RawSceneChunk[] {
  const slugNums = detectSluglineLineNumbers(lines);
  if (slugNums.length === 0) return [];

  const metaByLine = new Map<number, MetadataEntry>();
  for (const m of allMetadata) metaByLine.set(m.lineNumber, m);

  const chunks: RawSceneChunk[] = [];

  for (let i = 0; i < slugNums.length; i++) {
    const slugLineNumber = slugNums[i];
    const nextSlug = slugNums[i + 1];
    const contentEndLine = nextSlug != null ? nextSlug - 1 : lines.length;
    const slugIdx = slugLineNumber - 1;
    const slugline = lines[slugIdx].trim();

    const collected: MetadataEntry[] = [];
    let j = slugIdx - 1;
    while (j >= 0 && lines[j].trim() === "") j--;
    while (j >= 0 && isMetadataLine(lines[j])) {
      const entry = metaByLine.get(j + 1);
      if (entry) collected.unshift(entry);
      j--;
    }

    const metaLines = collected.map((c) => c.lineNumber);
    const metadataStartLine =
      collected.length > 0 ? Math.min(...metaLines) : slugLineNumber;
    const metadataEndLine =
      collected.length > 0 ? Math.max(...metaLines) : slugLineNumber - 1;

    chunks.push({
      slugline,
      slugLineNumber,
      contentEndLine,
      rawMetadata: collected,
      metadataStartLine,
      metadataEndLine,
    });
  }

  return chunks;
}

/** Global = metadata before first slug, excluding scene-1’s attached block. */
export function getGlobalMetadataEntries(
  lines: string[],
  allMetadata: MetadataEntry[],
  firstChunk: RawSceneChunk | undefined
): MetadataEntry[] {
  const slugNums = detectSluglineLineNumbers(lines);
  if (slugNums.length === 0) return [...allMetadata];

  const scene1Meta = new Set(firstChunk?.rawMetadata.map((m) => m.lineNumber) ?? []);
  const firstSlugLine = slugNums[0];
  return allMetadata.filter((m) => m.lineNumber < firstSlugLine && !scene1Meta.has(m.lineNumber));
}
