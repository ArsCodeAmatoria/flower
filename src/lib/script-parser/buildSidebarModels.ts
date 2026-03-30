import { ALL_BEAT_IDS, BEAT_LABELS, DEFAULT_BEAT_PAGE_RANGES } from "./constants";
import type {
  CharacterMaster,
  CurrentContext,
  LeftSidebarModel,
  ParsedScript,
  ParsedScene,
  RightSidebarModel,
  SceneCoverage,
} from "./types";

const ACT_ORDER = ["act_1", "act_2a", "act_2b", "act_3"] as const;

function missingSceneFields(scene: ParsedScene, cov: SceneCoverage): string[] {
  const m: string[] = [];
  if (!scene.id?.trim()) m.push("scene.id");
  if (!scene.title?.trim()) m.push("scene.title");
  if (!scene.actId) m.push("act.id");
  if (!scene.beatId) m.push("beat.id");
  if (!scene.threadId) m.push("thread.id");
  if (!cov.hasGoal) m.push("scene.goal");
  if (!cov.hasObstacle) m.push("scene.obstacle");
  if (!cov.hasTurn) m.push("scene.turn");
  if (!cov.hasOutcome) m.push("scene.outcome");
  if (!cov.hasDialogueSubtext) m.push("dialogue.subtext");
  if (!cov.hasDialogueConflict) m.push("dialogue.conflict");
  if (!cov.hasDialogueTurn) m.push("dialogue.turn");
  if (!cov.hasCharacters) m.push("scene.characters");
  return m;
}

function scaleRange(range: [number, number], target: number | undefined, base: number): [number, number] {
  if (!target || target === base) return range;
  const f = target / base;
  return [Math.round(range[0] * f * 10) / 10, Math.round(range[1] * f * 10) / 10];
}

export function buildSidebarModels(
  parsed: ParsedScript,
  currentContext?: CurrentContext
): { left: LeftSidebarModel; right: RightSidebarModel } {
  const { global, characters, scenes, beats, summary, coverageBySceneId, validationIssues } = parsed;
  const base = 110;
  const tp = global.project.targetPages;

  const actsPresent = new Set(scenes.map((s) => s.actId).filter(Boolean) as string[]);
  const acts: LeftSidebarModel["acts"] = ACT_ORDER.filter((id) => actsPresent.has(id)).map((id) => ({
    id,
    active: currentContext?.currentActId === id,
  }));

  const beatsModel: LeftSidebarModel["beats"] = ALL_BEAT_IDS.map((id) => ({
    id,
    label: BEAT_LABELS[id],
    active: currentContext?.currentBeatId === id,
    targetPageRange: scaleRange(DEFAULT_BEAT_PAGE_RANGES[id], tp, base),
  }));

  const left: LeftSidebarModel = {
    projectTitle: global.project.title,
    format: global.project.format,
    targetPages: global.project.targetPages,
    theme: {
      core: global.theme.core,
      lie: global.theme.lie,
      truth: global.theme.truth,
      moralArgument: global.theme.moralArgument,
    },
    acts,
    beats: beatsModel,
    currentScene: currentContext
      ? {
          id: currentContext.currentSceneId,
          title: currentContext.currentSceneTitle,
          estimatedPage: currentContext.currentEstimatedPage,
        }
      : undefined,
  };

  const sceneCoverage: RightSidebarModel["sceneCoverage"] = scenes.map((s) => {
    const key = s.id ?? `scene-line-${s.contentStartLine}`;
    const cov = coverageBySceneId[key] ?? {
      hasGoal: false,
      hasObstacle: false,
      hasTurn: false,
      hasOutcome: false,
      structurallyComplete: false,
      hasCharacters: false,
      hasDialogueSubtext: false,
      hasDialogueConflict: false,
      hasDialogueTurn: false,
      dialogueCoverageLevel: "weak" as const,
    };
    return {
      sceneId: s.id,
      sceneTitle: s.title ?? s.slugline,
      structurallyComplete: cov.structurallyComplete,
      dialogueCoverage: cov.dialogueCoverageLevel,
      missingFields: missingSceneFields(s, cov),
    };
  });

  const charCounts = resolveCharacterSceneCounts(characters, scenes);

  const right: RightSidebarModel = {
    summary,
    beatProgress: beats,
    sceneCoverage,
    characterProgress: charCounts,
    validationIssues,
  };

  return { left, right };
}

function resolveCharacterSceneCounts(characters: CharacterMaster[], scenes: ParsedScene[]) {
  return characters.map((c) => {
    let n = 0;
    for (const s of scenes) {
      if (s.characters.some((id) => id === c.id)) n++;
    }
    return { characterId: c.id, name: c.name, scenesPresent: n };
  });
}
