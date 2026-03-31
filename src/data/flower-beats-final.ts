/** Canonical 15-beat structure for FLOWER — final outline (screenplay stub separate). */

/** Min/max scene slugs when the beat is fully drafted (film total ~45–60). */
export type FlowerExpectedSceneRange = readonly [sceneMin: number, sceneMax: number];

export interface FlowerBeat {
  num: number;
  title: string;
  paragraphs: string[];
  expectedScenes: FlowerExpectedSceneRange;
}

export interface FlowerAct {
  label: string;
  beats: FlowerBeat[];
}

export interface ThroughlineRow {
  stage: string;
  state: string;
}

export const FLOWER_BEATS_HEADLINE = "FLOWER — 15 BEATS (FINAL)";

export const FLOWER_BEATS_ACTS: FlowerAct[] = [
  {
    label: "ACT 1",
    beats: [
      {
        num: 1,
        title: "Opening Image",
        paragraphs: [
          "Rose arrives at Flower High School—perfect, glowing, scent-driven hierarchy.",
          "She has no scent. She doesn’t belong.",
        ],
        expectedScenes: [2, 2],
      },
      {
        num: 2,
        title: "Theme Stated",
        paragraphs: [
          "“Every flower is created equally lovely.”",
          "The world says everyone matters—",
          "but clearly, not equally.",
        ],
        expectedScenes: [2, 2],
      },
      {
        num: 3,
        title: "Set-Up",
        paragraphs: [
          "Rose struggles to fit in",
          "Daisy teaches conformity",
          "Narcissa embodies perfection",
          "Nettles enforces status",
          "The system is clear: perform or disappear",
        ],
        expectedScenes: [3, 3],
      },
      {
        num: 4,
        title: "Catalyst",
        paragraphs: [
          "Rose is publicly humiliated:",
          "“She doesn’t even have a scent.”",
          "Her worst fear becomes visible.",
        ],
        expectedScenes: [2, 3],
      },
      {
        num: 5,
        title: "Debate",
        paragraphs: [
          "Should she:",
          "try harder to fit in",
          "or accept she’s different?",
          "Lemon challenges her worldview.",
        ],
        expectedScenes: [2, 3],
      },
      {
        num: 6,
        title: "Break Into Two",
        paragraphs: ["Rose chooses Lemon.", "She leaves the system path and enters a new world."],
        expectedScenes: [2, 2],
      },
    ],
  },
  {
    label: "ACT 2A — DISCOVERY",
    beats: [
      {
        num: 7,
        title: "B Story",
        paragraphs: ["Rose and Lemon connect.", "He sees her.", "She begins to feel seen."],
        expectedScenes: [4, 5],
      },
      {
        num: 8,
        title: "Fun & Games",
        paragraphs: [
          "Glowing woods and waterfall:",
          "Rose experiences presence for the first time",
          "environment reacts to her",
          "she doesn’t understand it yet",
          "This is the “promise of the premise”.",
        ],
        expectedScenes: [8, 10],
      },
      {
        num: 9,
        title: "Midpoint (False Victory)",
        paragraphs: [
          "Bloom Ceremony:",
          "Narcissa performs perfection",
          "Rose stops performing and feels something real",
          "She “flowers”.",
          "The crowd is moved.",
          "She is accepted.",
          "She thinks she belongs.",
        ],
        expectedScenes: [3, 5],
      },
    ],
  },
  {
    label: "ACT 2B — COLLAPSE",
    beats: [
      {
        num: 10,
        title: "Bad Guys Close In",
        paragraphs: [
          "Goldenrod pushes control",
          "Iris manipulates perception",
          "Lemon’s concern is overheard",
          "The system tightens.",
        ],
        expectedScenes: [4, 4],
      },
      {
        num: 11,
        title: "All Is Lost",
        paragraphs: [
          "Iris tells Rose:",
          "“He said you scared him.”",
          "Rose confronts Lemon.",
          "He responds truthfully—but it sounds like confirmation.",
          "She believes the lie.",
          "Result:",
          "Rose shuts down",
          "rejects Lemon",
          "loses belief",
          "The world dims",
          "Lemon begins to lose his light",
        ],
        expectedScenes: [4, 5],
      },
      {
        num: 12,
        title: "Dark Night of the Soul",
        paragraphs: [
          "Rose returns to the waterfall—alone.",
          "Everything is quieter, dimmer.",
          "Daisy finds her and admits:",
          "“I think he didn’t say what she told you.”",
          "Truth breaks through.",
        ],
        expectedScenes: [2, 3],
      },
      {
        num: 13,
        title: "Break Into Three",
        paragraphs: [
          "Rose understands:",
          "The problem wasn’t Lemon",
          "It wasn’t her power",
          "It was fear",
          "She chooses truth.",
        ],
        expectedScenes: [2, 3],
      },
    ],
  },
  {
    label: "ACT 3 — TRANSFORMATION",
    beats: [
      {
        num: 14,
        title: "Finale",
        paragraphs: [
          "Waterfall Transformation",
          "Rose sings and fully accepts herself.",
          "Her presence stabilizes",
          "Power becomes intentional",
          "Climax",
          "She finds Lemon.",
          "“I know it wasn’t you.”",
          "She touches him.",
          "He lights up.",
          "The Spread",
          "Daisy glows",
          "Narcissa softens",
          "students awaken",
          "Presence spreads through connection",
          "Villain Defeat",
          "Goldenrod fails.",
          "You cannot control what comes from within.",
        ],
        expectedScenes: [7, 8],
      },
      {
        num: 15,
        title: "Final Image",
        paragraphs: [
          "Same school.",
          "No longer perfect—",
          "now expressive, alive, real.",
          "Rose stands confidently.",
          "Not changed.",
          "Flowered.",
        ],
        expectedScenes: [1, 2],
      },
    ],
  },
];

export const FLOWER_BEATS_THROUGHLINE_TITLE = "CORE THROUGHLINE (IMPORTANT)";

export const FLOWER_BEATS_THROUGHLINE: ThroughlineRow[] = [
  { stage: "Act 1", state: "Invisible" },
  { stage: "Act 2A", state: "Curious" },
  { stage: "Midpoint", state: "Accepted (false)" },
  { stage: "Act 2B", state: "Broken" },
  { stage: "Act 3", state: "True" },
];

export const FLOWER_BEATS_SUMMARY =
  "She stops trying to belong—and helps everyone else remember they already do.";

/** Draft targets for full screenplay scene count (slug count), not beat count. */
export const FLOWER_SCENE_COUNT_HEADLINE = "Scene count (draft targets)";

export const FLOWER_SCENE_COUNT_SUMMARY =
  "For a ~100-page animated musical on this Save the Cat spine, aim for about 45–60 scenes; ~52 is a strong working target. Fifteen beats are not fifteen scenes—plan on roughly 3–4 scenes per beat as the draft expands.";

export const FLOWER_SCENE_COUNT_RATIONALE: string[] = [
  "Average near 1–2 pages per scene, with longer runs for songs and set pieces and very short transitions.",
  "Rough guide: ~10–12 major sequences, ~8–9 musical numbers in a feature—but each song often spans 2–4 scenes (lead-in, start, movement or montage, resolution).",
];

export interface FlowerSceneTargetSection {
  section: string;
  sceneRange: string;
  note: string;
}

/** Section targets (midpoint is called out as its own block inside Act 2A). */
export const FLOWER_SCENE_TARGET_SECTIONS: FlowerSceneTargetSection[] = [
  { section: "Act 1", sceneRange: "12–15", note: "Arrival, world/song, Daisy, Narcissa & Nettles, humiliation, Lemon, debate, choice to follow him." },
  { section: "Act 2A", sceneRange: "15–20", note: "Bonding, woods and presence beats, waterfall (often several scenes), duet, return, build to Bloom Ceremony." },
  { section: "Midpoint — Bloom Ceremony", sceneRange: "3–5", note: "Treat as a mini set-piece: setup, Narcissa, Rose, crowd reaction—not one scene." },
  { section: "Act 2B", sceneRange: "12–15", note: "Villain pressure, Iris, overheard moment, rumor, confrontation, collapse, world dimming." },
  { section: "Act 3", sceneRange: "8–10", note: "Waterfall return, Daisy reveal, transformation song, Lemon, climax, spread, resolution, final image." },
];

export interface FlowerSceneAnchorCluster {
  label: string;
  sceneRange: string;
}

export const FLOWER_SCENE_ANCHOR_CLUSTERS: FlowerSceneAnchorCluster[] = [
  { label: "Glowing woods + waterfall (first visit)", sceneRange: "4–6" },
  { label: "Bloom Ceremony", sceneRange: "3–5" },
  { label: "Betrayal sequence", sceneRange: "3–4" },
  { label: "Waterfall return + transformation", sceneRange: "2–3" },
  { label: "Finale", sceneRange: "4–6" },
];

export const FLOWER_SCENE_COUNT_PRINCIPLES: string[] = [
  "McKee: a scene is a change in value (positive ↔ negative), not a change of location. If nothing shifts, it isn’t earning its own scene yet.",
  "Quality beats bloat: more scenes isn’t the goal—clear value turns per scene is.",
];

/** ~1 screenplay page per scene on the low end, ~2 on the high end (musical/set-piece density). */
export function expectedScreenplayPagesFromScenes(
  range: FlowerExpectedSceneRange,
): readonly [number, number] {
  const [sMin, sMax] = range;
  return [sMin, sMax * 2];
}

export function aggregateBeatExpectations(beats: FlowerBeat[]): {
  scenes: FlowerExpectedSceneRange;
  pages: readonly [number, number];
} {
  let sMin = 0;
  let sMax = 0;
  let pMin = 0;
  let pMax = 0;
  for (const b of beats) {
    const [a, c] = b.expectedScenes;
    const [pa, pb] = expectedScreenplayPagesFromScenes(b.expectedScenes);
    sMin += a;
    sMax += c;
    pMin += pa;
    pMax += pb;
  }
  return { scenes: [sMin, sMax] as const, pages: [pMin, pMax] as const };
}

export function formatSceneExpectation(range: FlowerExpectedSceneRange): string {
  const [a, b] = range;
  if (a === b) return `${a} scene${a === 1 ? "" : "s"}`;
  return `${a}–${b} scenes`;
}

export function formatPageExpectation(range: readonly [number, number]): string {
  const [a, b] = range;
  if (a === b) return `~${a} page${a === 1 ? "" : "s"}`;
  return `~${a}–${b} pages`;
}

/** Flat order of beats for script navigation (one screenplay “page” block per beat). */
export function flattenFlowerBeatsForNav(): Array<{ pageIndex: number; actLabel: string; beat: FlowerBeat }> {
  const out: Array<{ pageIndex: number; actLabel: string; beat: FlowerBeat }> = [];
  let pageIndex = 0;
  for (const act of FLOWER_BEATS_ACTS) {
    for (const beat of act.beats) {
      out.push({ pageIndex: pageIndex++, actLabel: act.label, beat });
    }
  }
  return out;
}
