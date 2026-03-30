/** Read-only Save the Cat + McKee rule text for character dossier sections (no emojis). */

export interface CharacterStcRuleTemplate {
  id: string;
  title: string;
  principle: string;
  craftReminders: string[];
}

export const CHARACTER_SAVE_THE_CAT_RULES: CharacterStcRuleTemplate[] = [
  {
    id: "stc_likable",
    title: "Make the character likable immediately",
    principle: "The audience must connect fast — before you ask for big emotion or long investment.",
    craftReminders: ["Vulnerability", "Skill", "Kindness", "Humor", "Injustice against them"],
  },
  {
    id: "stc_want",
    title: "Give them a clear want",
    principle: "An external (or visible) goal drives plot and scene intent.",
    craftReminders: ["Want should be actionable", "Opposition should block the want", "Scenes test progress on the want"],
  },
  {
    id: "stc_lie",
    title: "Give them a lie (internal flaw)",
    principle: "A wrong belief they treat as protection — the story exists to break or revise it.",
    craftReminders: ["Lie should explain avoidance", "Pressure should make the lie costly", "Truth should hurt before it heals"],
  },
  {
    id: "stc_transformation",
    title: "Transformation is required",
    principle: "They must change — in behavior, not only in self-image — to earn the ending.",
    craftReminders: ["Change is tested under pressure", "Finale proves new choice", "Old self should be tempting to retreat to"],
  },
  {
    id: "stc_active",
    title: "Active, not passive",
    principle: "The character drives story through decisions and actions, not only reaction.",
    craftReminders: ["Choose verbs: confront, pursue, refuse, manipulate", "Waiting scenes need sharpened pressure"],
  },
  {
    id: "stc_stakes",
    title: "Stakes must be personal",
    principle: "Emotional cost must land — not only plot jeopardy.",
    craftReminders: ["What do they lose in themselves if they fail?", "Who do they become if they win wrong?"],
  },
  {
    id: "stc_arc_visible",
    title: "The arc must be visible",
    principle: "Clear shift from opening self to closing self — same pressure, different response.",
    craftReminders: ["Behavior on page 1 vs page last", "Midpoint should tilt how we read them"],
  },
];

export interface CharacterMckeeRuleTemplate {
  id: string;
  title: string;
  principle: string;
}

export const CHARACTER_MCKEE_RULES: CharacterMckeeRuleTemplate[] = [
  {
    id: "mckee_desire_action",
    title: "Character = desire + action",
    principle: "Characters are what they do to get what they want — not what the bible says they are.",
  },
  {
    id: "mckee_pressure",
    title: "True character is revealed under pressure",
    principle: "Pressure reveals truth, not comfort — design scenes to strip the mask.",
  },
  {
    id: "mckee_contradiction",
    title: "Contradiction creates depth",
    principle: "People are inconsistent — opposing truths under the same roof make scenes spark.",
  },
  {
    id: "mckee_subtext",
    title: "Subtext defines character",
    principle: "What they will not say (or how they dodge) defines them as much as declaration.",
  },
  {
    id: "mckee_voice",
    title: "Character voice must be unique",
    principle: "Dialogue rhythm, diction, and tactic should be unmistakable when names are covered.",
  },
  {
    id: "mckee_behavior",
    title: "Behavior beats explanation",
    principle: "Never explain character when you can show choice, tactic, and timing.",
  },
  {
    id: "mckee_emotion",
    title: "Emotional truth over logic",
    principle: "Characters act from feeling first — logic is often post-hoc justification.",
  },
  {
    id: "mckee_gap",
    title: "The gap (expectation vs reality)",
    principle: "Drama lives where expectation meets a result that cracks composure or plan.",
  },
  {
    id: "mckee_strategy",
    title: "Every character has a strategy",
    principle: "They use tactics — silence, charm, threat, misdirection — to pursue scene objectives.",
  },
  {
    id: "mckee_inner_outer",
    title: "Inner life vs outer behavior",
    principle: "Duality between public face and private need fuels every exchange.",
  },
];

export const CHARACTER_STC_COUNT = CHARACTER_SAVE_THE_CAT_RULES.length;
export const CHARACTER_MCKEE_COUNT = CHARACTER_MCKEE_RULES.length;
