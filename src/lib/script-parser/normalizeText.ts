/**
 * Stage 1 — preserve order, normalize CRLF, trim trailing whitespace per line only.
 */
export function normalizeText(raw: string): { text: string; lines: string[] } {
  const text = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const lines = text.split("\n").map((line) => line.replace(/\s+$/, ""));
  return { text: lines.join("\n"), lines };
}
