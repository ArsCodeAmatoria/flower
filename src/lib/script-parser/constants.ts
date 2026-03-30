import type { BeatId } from "./types";

export const BEAT_LABELS: Record<BeatId, string> = {
  opening_image: "Opening Image",
  theme_stated: "Theme Stated",
  setup: "Setup",
  catalyst: "Catalyst",
  debate: "Debate",
  break_into_two: "Break into Two",
  b_story: "B Story",
  fun_and_games: "Fun and Games",
  midpoint: "Midpoint",
  bad_guys_close_in: "Bad Guys Close In",
  all_is_lost: "All Is Lost",
  dark_night_of_the_soul: "Dark Night of the Soul",
  break_into_three: "Break into Three",
  finale: "Finale",
  final_image: "Final Image",
};

export const ALL_BEAT_IDS = Object.keys(BEAT_LABELS) as BeatId[];

export const DEFAULT_BEAT_PAGE_RANGES: Record<BeatId, [number, number]> = {
  opening_image: [1, 1],
  theme_stated: [5, 10],
  setup: [1, 10],
  catalyst: [10, 12],
  debate: [12, 25],
  break_into_two: [25, 25],
  b_story: [30, 30],
  fun_and_games: [30, 55],
  midpoint: [50, 60],
  bad_guys_close_in: [55, 75],
  all_is_lost: [75, 75],
  dark_night_of_the_soul: [75, 85],
  break_into_three: [85, 85],
  finale: [85, 110],
  final_image: [110, 110],
};

export const STATUS_RANK: Record<string, number> = {
  not_started: 0,
  in_progress: 1,
  drafted: 2,
  needs_revision: 3,
  complete: 4,
};

export const LINE_WEIGHTS: Record<string, number> = {
  slugline: 0.8,
  action: 1.2,
  character: 0.35,
  parenthetical: 0.5,
  dialogue: 1.0,
  transition: 0.5,
  fade: 0.5,
  metadata: 0,
  blank: 0,
};

/** Allowed dialogue.verbal_action values for validation. */
export const VALID_VERBAL_ACTIONS = new Set([
  "persuade",
  "attack",
  "defend",
  "seduce",
  "deflect",
  "provoke",
  "confess",
  "conceal",
  "comfort",
  "threaten",
  "test",
  "manipulate",
  "humiliate",
  "challenge",
]);

export const METADATA_LINE_RE =
  /^\[\[([a-z0-9_.]+):\s*(.*?)\]\]$/;

/** Spec slugline MVP (1-based index into lines array uses trim only for test). */
export const SLUGLINE_RE =
  /^(INT\.|EXT\.|INT\/EXT\.|EXT\/INT\.)\s+.+$/;

/** Forgiving: trim line before tests in parser. */
export const SLUGLINE_RE_TRIMMED =
  /^(INT\.|EXT\.|INT\/EXT\.|EXT\/INT\.)\s+.+$/;

export const TRANSITION_RE = /^[A-Z0-9][A-Z0-9\s]+TO:\s*$/;

export const CHARACTER_SCENE_FIELD_RE =
  /^character\.([a-z0-9_]+)\.(scene_objective|emotion_start|emotion_end|hidden_agenda|arc_move)$/;

export const DIALOGUE_OBJECTIVE_RE = /^dialogue\.objective\.([a-z0-9_]+)$/;

export const DIALOGUE_VERBAL_RE = /^dialogue\.verbal_action\.([a-z0-9_]+)$/;
