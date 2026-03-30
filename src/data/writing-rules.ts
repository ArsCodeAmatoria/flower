/** Left sidebar: blueprint / standards for Draft 2 writing cockpit */

export const STC_BEAT_IDS = [
  "opening_image",
  "theme_stated",
  "setup",
  "catalyst",
  "debate",
  "break_into_two",
  "b_story",
  "fun_and_games",
  "midpoint",
  "bad_guys_close_in",
  "all_is_lost",
  "dark_night_of_the_soul",
  "break_into_three",
  "finale",
  "final_image",
] as const;

export interface SaveTheCatBeat {
  id: (typeof STC_BEAT_IDS)[number];
  label: string;
  targetRange: string;
  purpose: string;
  mustDo: string;
}

export const saveTheCatBeats: SaveTheCatBeat[] = [
  { id: "opening_image", label: "Opening Image", targetRange: "p.1", purpose: "Snapshot of the \"before\" world.", mustDo: "Show tone, genre, hero’s life as-is — a visual thesis." },
  { id: "theme_stated", label: "Theme Stated", targetRange: "p.1–5", purpose: "What the story will argue.", mustDo: "Someone states the theme (hero often rejects it)." },
  { id: "setup", label: "Setup", targetRange: "p.1–10", purpose: "Establish stakes, relationships, flaws, countdown clocks.", mustDo: "Every setup pays off later; load the board." },
  { id: "catalyst", label: "Catalyst", targetRange: "p.10–12", purpose: "Inciting incident — life can’t continue unchanged.", mustDo: "Forces a choice; story problem becomes unavoidable." },
  { id: "debate", label: "Debate", targetRange: "p.12–25", purpose: "Hero resists the journey.", mustDo: "Internal/external reasons; highest stakes for refusing." },
  { id: "break_into_two", label: "Break Into Two", targetRange: "~p.25", purpose: "Hero chooses Act Two world — proactive decision.", mustDo: "Commitment to new world/method; point of no return." },
  { id: "b_story", label: "B Story", targetRange: "Act Two A", purpose: "Relationship/mentor track that carries theme.", mustDo: "B story helps solve A story by the finale." },
  { id: "fun_and_games", label: "Fun and Games", targetRange: "p.30–55", purpose: "Promise of the premise — trailer moments.", mustDo: "Deliver genre pleasures; core conceit played out." },
  { id: "midpoint", label: "Midpoint", targetRange: "p.50–60", purpose: "False victory or false defeat; stakes escalate.", mustDo: "Time clock tightens; game changes." },
  { id: "bad_guys_close_in", label: "Bad Guys Close In", targetRange: "p.55–75", purpose: "External pressure + internal rot.", mustDo: "Forces splinter; tactics fail or victory is hollow." },
  { id: "all_is_lost", label: "All Is Lost", targetRange: "~p.75", purpose: "Apparent defeat; death of old world/identity.", mustDo: "Whiff of death; darkest hour." },
  { id: "dark_night_of_the_soul", label: "Dark Night of the Soul", targetRange: "p.75–80", purpose: "Hero sits in the wreckage.", mustDo: "Process loss; theme/WHY matters surfaces." },
  { id: "break_into_three", label: "Break Into Three", targetRange: "~p.80", purpose: "Synthesis — A + B story insight sparks solution.", mustDo: "Hero knows what to do; charges into finale." },
  { id: "finale", label: "Finale", targetRange: "p.80–110", purpose: "Hero executes plan; theme proved.", mustDo: "Old world vs new skills; villains/antagonists resolved." },
  { id: "final_image", label: "Final Image", targetRange: "p.110+", purpose: "Opposite of opening image — proof of change.", mustDo: "Mirror opening; show transformation visually." },
];

export interface SceneRule {
  id: string;
  headline: string;
  detail: string;
}

export const sceneRules: SceneRule[] = [
  { id: "scene_goal", headline: "Every scene needs a want", detail: "Someone pursues a concrete goal — even if only internal." },
  { id: "scene_obstacle", headline: "Every scene needs resistance", detail: "Opposing force: another character, world, or self." },
  { id: "scene_turn", headline: "Every scene should turn", detail: "Power, emotion, or information shifts by the end." },
  { id: "scene_outcome", headline: "Every scene needs an outcome", detail: "Win, loss, or unclear — but the story moves." },
  { id: "scene_formula", headline: "Core formula", detail: "Goal → obstacle → escalation → turn → outcome. Or: intent → resistance → change." },
];

export interface DialogueRule {
  id: string;
  label: string;
  rule: string;
  test: string;
}

export const dialogueRules: DialogueRule[] = [
  { id: "dialogue_desire", label: "Desire", rule: "Lines pursue objectives — characters want something in the exchange.", test: "What does each person want from this beat?" },
  { id: "dialogue_subtext", label: "Subtext", rule: "Characters should not say exactly what they mean.", test: "What is really being fought over beneath the words?" },
  { id: "dialogue_conflict", label: "Conflict", rule: "Dialogue is verbal action — push/pull.", test: "If they agree, is the scene still pressurized?" },
  { id: "dialogue_exposition", label: "Exposition control", rule: "Reveal only under pressure; dramatize information.", test: "Could the audience learn this without a speech?" },
  { id: "dialogue_voice", label: "Character voice", rule: "Each line could only be spoken by this character.", test: "Cover the names — who’s talking?" },
  { id: "dialogue_compression", label: "Compression", rule: "Cut overlap; pressure language.", test: "Can you say it in half the words?" },
  { id: "dialogue_silence", label: "Silence", rule: "What isn’t said carries weight.", test: "Where could a pause do the work?" },
  { id: "dialogue_turn", label: "Turn", rule: "Lines shift leverage or revelation within the exchange.", test: "Who had power at start vs end?" },
  { id: "dialogue_verbal_action", label: "Verbal action", rule: "Speech does something — seduce, accuse, conceal, test.", test: "What action is each line performing?" },
  { id: "dialogue_emotion", label: "Emotional truth", rule: "Feeling aligns with character psychology.", test: "Does the reaction feel earned?" },
  { id: "dialogue_on_the_nose", label: "Avoid on-the-nose", rule: "Theme stated by characters as thesis feels false.", test: "Would a human say this aloud — here?" },
];

export interface CharacterRule {
  id: string;
  label: string;
  detail: string;
}

export const characterRules: CharacterRule[] = [
  { id: "character_objective", label: "Objective", detail: "Crystal wants — scene-level and story-level." },
  { id: "character_contradiction", label: "Contradiction", detail: "Competing traits create friction and choice." },
  { id: "character_lie", label: "Flaw / lie", detail: "Wrong belief the story challenges." },
  { id: "character_voice", label: "Unique voice", detail: "Syntax, reference world, rhythm." },
  { id: "character_mask", label: "Emotional mask", detail: "Public face vs private need." },
  { id: "character_arc", label: "Change over time", detail: "Same pressure, different response by end." },
];

/** Value shift pairs for scenecraft (greater state → lesser state). */
export const valueShiftExamples: string[] = [
  "invisible → seen",
  "belonging → rejection",
  "trust → betrayal",
  "dim → awakened",
  "hope → fear",
  "performance → authenticity",
];

export interface ThemeRule {
  id: string;
  label: string;
  detail: string;
}

export const themeRules: ThemeRule[] = [
  { id: "theme_core", label: "Theme", detail: "What the story argues — one clear moral question." },
  { id: "theme_lie", label: "Lie", detail: "What the protagonist (or world) believes that isn’t true." },
  { id: "theme_truth", label: "Truth", detail: "What the story proves by the finale." },
  { id: "theme_moral_argument", label: "Moral argument", detail: "Competing values dramatized through conflict." },
  { id: "theme_contrast", label: "Thematic contrast", detail: "Characters and set pieces embody opposing poles." },
];

export interface PacingRule {
  id: string;
  headline: string;
  detail: string;
}

export const pacingRules: PacingRule[] = [
  { id: "page_count_rules", headline: "Feature target: 95–110 pages", detail: "Industry-formatted screenplay; adjust for animation/musical." },
  { id: "beat_timing_rules", headline: "Beat placement", detail: "Catalyst ~p.10–12; Break into Two ~p.25; Midpoint ~p.55; All Is Lost ~p.75." },
  { id: "scene_length_rules", headline: "Scene length", detail: "Typical 1–3 pages; longer scenes need strong turn/escalation." },
  { id: "pacing_escalation_rules", headline: "No sagging middle", detail: "Escalate after midpoint; complications compound." },
];

export const WRITING_RULE_SECTION_IDS = [
  "story_structure_rules",
  "scene_rules",
  "dialogue_rules",
  "character_rules",
  "theme_rules",
  "pacing_rules",
] as const;
