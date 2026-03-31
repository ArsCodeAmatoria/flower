import { FLOWER_BEATS_ACTS } from "./flower-beats-final";
import type { ScriptElement, ScriptPage } from "./script-core";

const PROJECT_PREAMBLE: ScriptElement[] = [
  { type: "metadata", text: "[[project.title: FLOWER]]" },
  { type: "metadata", text: "[[project.format: animated musical feature]]" },
  { type: "metadata", text: "[[theme.core: presence, truth vs performed worth]]" },
];

function beatElements(actLabel: string, beatNum: number, beatTitle: string): ScriptElement[] {
  return [
    { type: "metadata", text: `[[beat.num: ${beatNum}]]` },
    { type: "metadata", text: `[[act.label: ${actLabel}]]` },
    { type: "metadata", text: `[[beat.title: ${beatTitle}]]` },
  ];
}

/**
 * One ScriptPage per Save-the-Cat beat — scaffold action lines from the final beat doc.
 * First page: project preamble → fade ends metadata preamble, then beat meta + scene + beats.
 */
export function buildFlowerBeatScriptPages(): ScriptPage[] {
  const pages: ScriptPage[] = [];
  let isFirst = true;

  for (const act of FLOWER_BEATS_ACTS) {
    for (const beat of act.beats) {
      const slug = `INT. FLOWER HIGH — ${beat.title.toUpperCase()}`;
      const beatMeta = beatElements(act.label, beat.num, beat.title);
      const actions: ScriptElement[] = beat.paragraphs.map((p) => ({ type: "action" as const, text: p }));

      const head: ScriptElement[] = isFirst
        ? [...PROJECT_PREAMBLE, { type: "fade" as const, text: "" }, ...beatMeta]
        : [...beatMeta];

      pages.push({
        id: `beat-${String(beat.num).padStart(2, "0")}`,
        elements: [...head, { type: "scene", text: slug }, ...actions],
      });
      isFirst = false;
    }
  }

  return pages;
}

export const scriptPagesBeatScaffold = buildFlowerBeatScriptPages();

export const pageLabelsBeatScaffold: Record<string, string> = Object.fromEntries(
  scriptPagesBeatScaffold.map((p) => {
    const scene = p.elements.find((e) => e.type === "scene");
    const title = scene?.text.replace(/^INT\.\s*FLOWER\s*HIGH\s*—\s*/i, "") ?? p.id;
    return [p.id, title];
  }),
);
