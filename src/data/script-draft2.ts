import type { ScriptElement, ScriptPage } from "./script-core";
import { pageLabelsDraft1, scriptPagesDraft1 } from "./script-draft1";

function clone<T>(x: T): T {
  return JSON.parse(JSON.stringify(x)) as T;
}

const DRAFT2_PREAMBLE_METADATA: ScriptElement[] = [
  { type: "metadata", text: "[[project.title: FISH]]" },
  { type: "metadata", text: "[[project.format: feature]]" },
  { type: "metadata", text: "[[project.target_pages: 100]]" },
  { type: "metadata", text: "[[project.genre: animated musical drama]]" },
  { type: "metadata", text: "[[theme.core: voice vs silence]]" },
  { type: "metadata", text: "[[theme.lie: staying invisible keeps the wound closed]]" },
  { type: "metadata", text: "[[theme.truth: the river answers when you sing anyway]]" },
  {
    type: "metadata",
    text: "[[theme.moral_argument: hiding from your own voice may feel safe for a beat, but only honesty moves the people you love]]",
  },
  { type: "metadata", text: "[[character.id: char_zuri]]" },
  { type: "metadata", text: "[[character.name: Zuri]]" },
  { type: "metadata", text: "[[character.role: protagonist]]" },
  { type: "metadata", text: "[[character.want: claim her voice and defend the river]]" },
  { type: "metadata", text: "[[character.lie: staying small keeps grief manageable]]" },
  { type: "metadata", text: "[[character.truth: love requires showing up whole]]" },
  {
    type: "metadata",
    text: "[[character.voice: rhythmic, dry humor when guarded; lyrical when alone]]",
  },
  { type: "metadata", text: "[[character.mask: cool competence]]" },
  { type: "metadata", text: "[[character.id: char_ade]]" },
  { type: "metadata", text: "[[character.name: Ade]]" },
  { type: "metadata", text: "[[character.role: ally]]" },
  { type: "metadata", text: "[[character.want: keep his daughter safe]]" },
  { type: "metadata", text: "[[character.lie: shutting down music protects her]]" },
  { type: "metadata", text: "[[character.truth: she needs to sing]]" },
  { type: "metadata", text: "[[character.voice: few words, heavy weight]]" },
  { type: "metadata", text: "[[character.mask: disciplined calm]]" },
  { type: "metadata", text: "[[character.id: char_marcus]]" },
  { type: "metadata", text: "[[character.name: Marcus Vale]]" },
  { type: "metadata", text: "[[character.role: foil]]" },
  { type: "metadata", text: "[[character.want: deliver the deal without naming the cost]]" },
  { type: "metadata", text: "[[character.lie: distance is professional neutrality]]" },
  { type: "metadata", text: "[[character.truth: home still asks something of him]]" },
  { type: "metadata", text: "[[character.voice: controlled, cordial, modern]]" },
  { type: "metadata", text: "[[character.mask: CEO composure]]" },
  { type: "metadata", text: "[[character.id: char_victor]]" },
  { type: "metadata", text: "[[character.name: Victor Kane]]" },
  { type: "metadata", text: "[[character.role: antagonist]]" },
  { type: "metadata", text: "[[character.want: finish the build]]" },
  { type: "metadata", text: "[[character.lie: the town is just terrain on a spreadsheet]]" },
  { type: "metadata", text: "[[character.truth: profit eats conscience if you let it]]" },
  { type: "metadata", text: "[[character.voice: crisp, entitled, surgical]]" },
  { type: "metadata", text: "[[character.mask: professionalism]]" },
];

const SCENE_001_METADATA: ScriptElement[] = [
  { type: "metadata", text: "[[scene.id: scene_001]]" },
  { type: "metadata", text: "[[scene.title: River Z — the promise in the music]]" },
  { type: "metadata", text: "[[act.id: act_1]]" },
  { type: "metadata", text: "[[beat.id: opening_image]]" },
  { type: "metadata", text: "[[thread.id: a_story]]" },
  { type: "metadata", text: "[[scene.status: drafted]]" },
  { type: "metadata", text: "[[scene.complete: false]]" },
  { type: "metadata", text: "[[scene.function: setup]]" },
  {
    type: "metadata",
    text: "[[scene.goal: Establish River Z, the town, and the title song’s cinematic promise]]",
  },
  {
    type: "metadata",
    text: "[[scene.obstacle: Scale and beauty risk staying abstract — nothing human to attach to yet]]",
  },
  {
    type: "metadata",
    text: "[[scene.turn: The camera commits to descent — the world narrows toward story]]",
  },
  {
    type: "metadata",
    text: "[[scene.outcome: Audience is oriented; the human thread is about to land]]",
  },
  { type: "metadata", text: "[[scene.characters: ]]" },
  {
    type: "metadata",
    text: "[[scene.summary: Aerial river → town; “FISH” as score; lantern light as thesis]]",
  },
  { type: "metadata", text: "[[scene.theme: place as music — belonging before dialogue]]" },
  {
    type: "metadata",
    text: "[[dialogue.subtext: The score sells belonging before anyone speaks; the river is already a character]]",
  },
  {
    type: "metadata",
    text: "[[dialogue.conflict: Human order (town, lamps) vs untamed water (river, weather)]]",
  },
  {
    type: "metadata",
    text: "[[dialogue.turn: Wonder holds wide — then descent insists we come down to people]]",
  },
  { type: "metadata", text: "[[dialogue.exposition_risk: low]]" },
  { type: "metadata", text: "[[dialogue.on_the_nose_risk: low]]" },
  { type: "metadata", text: "[[dialogue.coverage: partial]]" },
  { type: "metadata", text: "[[beat.status: drafted]]" },
  { type: "metadata", text: "[[beat.complete: false]]" },
  { type: "metadata", text: "[[scene.promise_of_premise: true]]" },
  { type: "metadata", text: "[[scene.value_shift: distance to curiosity]]" },
  { type: "metadata", text: "[[scene.emotional_turn: awe to anticipation]]" },
];

function injectDraft2Metadata(pages: ScriptPage[]): ScriptPage[] {
  if (pages.length === 0) return pages;
  const out = clone(pages);
  const first = out[0];
  const fadeIdx = first.elements.findIndex((e) => e.type === "fade");
  if (fadeIdx === -1) {
    first.elements = [...DRAFT2_PREAMBLE_METADATA, ...first.elements];
  } else {
    first.elements = [...DRAFT2_PREAMBLE_METADATA, ...first.elements.slice(fadeIdx)];
  }
  const sceneIdx = first.elements.findIndex((e) => e.type === "scene");
  if (sceneIdx !== -1) {
    first.elements = [
      ...first.elements.slice(0, sceneIdx),
      ...SCENE_001_METADATA,
      ...first.elements.slice(sceneIdx),
    ];
  }
  return out;
}

/**
 * Draft 2 — working script (deep copy of Draft 1 + embedded [[metadata]] layer).
 * When this file contains full literal `scriptPages` again, point `scripts/script-index.js` here for SCRIPT_INDEX.md.
 */
export const scriptPagesDraft2: ScriptPage[] = injectDraft2Metadata(clone(scriptPagesDraft1));

export const pageLabelsDraft2: Record<string, string> = clone(pageLabelsDraft1);
