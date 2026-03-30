import type { ScriptPage } from "@/data/script-core";

/**
 * Serialize structured script pages to plain screenplay text (one element ≈ one line).
 * Preserves order so `parseScript(scriptPagesToScreenplayText(pages))` round-trips structure.
 */
export function scriptPagesToScreenplayText(pages: ScriptPage[], options?: { skipBible?: boolean }): string {
  const skipBible = options?.skipBible !== false;
  const out: string[] = [];

  for (const p of pages) {
    if (p.isBible && skipBible) continue;
    for (const el of p.elements) {
      out.push(el.text);
    }
    out.push("");
  }

  while (out.length > 0 && out[out.length - 1] === "") out.pop();
  return out.join("\n");
}
