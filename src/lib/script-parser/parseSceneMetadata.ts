import {
  CHARACTER_SCENE_FIELD_RE,
  DIALOGUE_OBJECTIVE_RE,
  DIALOGUE_VERBAL_RE,
} from "./constants";
import type {
  BeatId,
  CharacterSceneData,
  MetadataEntry,
  ParsedScene,
  SceneDialogueData,
  ValidationIssue,
} from "./types";

const ACT_IDS = new Set(["act_1", "act_2a", "act_2b", "act_3"]);
const THREAD_IDS = new Set(["a_story", "b_story", "c_story", "subplot"]);
const SCENE_STATUS = new Set([
  "not_started",
  "in_progress",
  "drafted",
  "needs_revision",
  "complete",
]);
const SCENE_FUNCTIONS = new Set([
  "setup",
  "escalation",
  "payoff",
  "transition",
  "reversal",
  "resolution",
]);
const PRIORITIES = new Set(["low", "medium", "high", "critical"]);
const RISKS = new Set(["low", "medium", "high"]);
const COVERAGE = new Set(["weak", "partial", "strong"]);
const PACING = new Set([
  "short_scene",
  "long_scene",
  "late_beat",
  "early_beat",
  "slow_middle",
  "rushed_payoff",
]);

const ALL_BEATS = new Set<string>([
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
]);

function parseBool(s: string): boolean | undefined {
  const x = s.trim().toLowerCase();
  if (x === "true") return true;
  if (x === "false") return false;
  return undefined;
}

function lastWinWarn(
  key: string,
  lineNumber: number,
  seen: Map<string, number>,
  issues: ValidationIssue[]
) {
  const prev = seen.get(key);
  if (prev !== undefined) {
    issues.push({
      severity: "warning",
      lineNumber,
      key,
      message: `Repeated key "${key}" in scene metadata; last value wins (previous at line ${prev}).`,
    });
  }
  seen.set(key, lineNumber);
}

export function applySceneMetadata(
  scene: ParsedScene,
  entries: MetadataEntry[],
  issues: ValidationIssue[]
): void {
  const seen = new Map<string, number>();
  const dialogue: SceneDialogueData = { objectives: {}, verbalActions: {} };

  for (const e of entries) {
    const { key, value, lineNumber } = e;

    const chNested = key.match(CHARACTER_SCENE_FIELD_RE);
    if (chNested) {
      const short = chNested[1];
      const field = chNested[2];
      const mapKey = `${key}`;
      lastWinWarn(mapKey, lineNumber, seen, issues);
      const block: CharacterSceneData = scene.characterSceneData[short] ?? {};
      switch (field) {
        case "scene_objective":
          block.sceneObjective = value;
          break;
        case "emotion_start":
          block.emotionStart = value;
          break;
        case "emotion_end":
          block.emotionEnd = value;
          break;
        case "hidden_agenda":
          block.hiddenAgenda = value;
          break;
        case "arc_move":
          block.arcMove = value;
          break;
      }
      scene.characterSceneData[short] = block;
      continue;
    }

    const objM = key.match(DIALOGUE_OBJECTIVE_RE);
    if (objM) {
      lastWinWarn(key, lineNumber, seen, issues);
      dialogue.objectives[objM[1]] = value;
      continue;
    }

    const verM = key.match(DIALOGUE_VERBAL_RE);
    if (verM) {
      lastWinWarn(key, lineNumber, seen, issues);
      dialogue.verbalActions[verM[1]] = value;
      continue;
    }

    switch (key) {
      case "scene.id":
        lastWinWarn(key, lineNumber, seen, issues);
        scene.id = value;
        break;
      case "scene.title":
        lastWinWarn(key, lineNumber, seen, issues);
        scene.title = value;
        break;
      case "act.id":
        lastWinWarn(key, lineNumber, seen, issues);
        if (ACT_IDS.has(value)) scene.actId = value as ParsedScene["actId"];
        break;
      case "beat.id":
        lastWinWarn(key, lineNumber, seen, issues);
        if (ALL_BEATS.has(value)) scene.beatId = value as BeatId;
        break;
      case "thread.id":
        lastWinWarn(key, lineNumber, seen, issues);
        if (THREAD_IDS.has(value)) scene.threadId = value as ParsedScene["threadId"];
        break;
      case "scene.status":
        lastWinWarn(key, lineNumber, seen, issues);
        if (SCENE_STATUS.has(value)) scene.status = value as ParsedScene["status"];
        break;
      case "scene.complete": {
        lastWinWarn(key, lineNumber, seen, issues);
        const b = parseBool(value);
        if (b !== undefined) scene.complete = b;
        break;
      }
      case "scene.function":
        lastWinWarn(key, lineNumber, seen, issues);
        if (SCENE_FUNCTIONS.has(value)) scene.function = value as ParsedScene["function"];
        break;
      case "scene.goal":
        lastWinWarn(key, lineNumber, seen, issues);
        scene.goal = value;
        break;
      case "scene.obstacle":
        lastWinWarn(key, lineNumber, seen, issues);
        scene.obstacle = value;
        break;
      case "scene.turn":
        lastWinWarn(key, lineNumber, seen, issues);
        scene.turn = value;
        break;
      case "scene.outcome":
        lastWinWarn(key, lineNumber, seen, issues);
        scene.outcome = value;
        break;
      case "scene.summary":
        lastWinWarn(key, lineNumber, seen, issues);
        scene.summary = value;
        break;
      case "scene.theme":
        lastWinWarn(key, lineNumber, seen, issues);
        scene.theme = value;
        break;
      case "scene.pov":
        lastWinWarn(key, lineNumber, seen, issues);
        scene.pov = value;
        break;
      case "scene.priority":
        lastWinWarn(key, lineNumber, seen, issues);
        if (PRIORITIES.has(value)) scene.priority = value as ParsedScene["priority"];
        break;
      case "scene.notes":
        lastWinWarn(key, lineNumber, seen, issues);
        scene.notes = value;
        break;
      case "scene.characters":
        lastWinWarn(key, lineNumber, seen, issues);
        scene.characters = value
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        break;
      case "scene.promise_of_premise": {
        lastWinWarn(key, lineNumber, seen, issues);
        const b = parseBool(value);
        if (b !== undefined) scene.promiseOfPremise = b;
        break;
      }
      case "scene.value_shift":
        lastWinWarn(key, lineNumber, seen, issues);
        scene.valueShift = value;
        break;
      case "scene.emotional_turn":
        lastWinWarn(key, lineNumber, seen, issues);
        scene.emotionalTurn = value;
        break;
      case "beat.status":
        lastWinWarn(key, lineNumber, seen, issues);
        if (SCENE_STATUS.has(value)) scene.beatStatus = value as ParsedScene["beatStatus"];
        break;
      case "beat.complete": {
        lastWinWarn(key, lineNumber, seen, issues);
        const b = parseBool(value);
        if (b !== undefined) scene.beatComplete = b;
        break;
      }
      case "revision.priority":
        lastWinWarn(key, lineNumber, seen, issues);
        if (PRIORITIES.has(value)) scene.revisionPriority = value as ParsedScene["revisionPriority"];
        break;
      case "revision.reason":
        lastWinWarn(key, lineNumber, seen, issues);
        scene.revisionReason = value;
        break;
      case "pacing.flag":
        lastWinWarn(key, lineNumber, seen, issues);
        if (PACING.has(value)) scene.pacingFlag = value as ParsedScene["pacingFlag"];
        break;
      case "pacing.note":
        lastWinWarn(key, lineNumber, seen, issues);
        scene.pacingNote = value;
        break;
      case "dialogue.subtext":
        lastWinWarn(key, lineNumber, seen, issues);
        dialogue.subtext = value;
        break;
      case "dialogue.conflict":
        lastWinWarn(key, lineNumber, seen, issues);
        dialogue.conflict = value;
        break;
      case "dialogue.turn":
        lastWinWarn(key, lineNumber, seen, issues);
        dialogue.turn = value;
        break;
      case "dialogue.exposition_risk":
        lastWinWarn(key, lineNumber, seen, issues);
        if (RISKS.has(value)) dialogue.expositionRisk = value as SceneDialogueData["expositionRisk"];
        break;
      case "dialogue.on_the_nose_risk":
        lastWinWarn(key, lineNumber, seen, issues);
        if (RISKS.has(value)) dialogue.onTheNoseRisk = value as SceneDialogueData["onTheNoseRisk"];
        break;
      case "dialogue.coverage":
        lastWinWarn(key, lineNumber, seen, issues);
        if (COVERAGE.has(value)) dialogue.coverage = value as SceneDialogueData["coverage"];
        break;
      case "dialogue.silence":
        lastWinWarn(key, lineNumber, seen, issues);
        dialogue.silence = value;
        break;
      case "dialogue.voice_note":
        lastWinWarn(key, lineNumber, seen, issues);
        dialogue.voiceNote = value;
        break;
      default:
        break;
    }
  }

  scene.dialogue = dialogue;
}
