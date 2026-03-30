import type { BeatState, ParsedScene, SceneCoverage, ScriptSummary } from "./types";

export function deriveScriptSummary(
  scenes: ParsedScene[],
  coverageBySceneId: Record<string, SceneCoverage>,
  beats: BeatState[],
  totalEstimatedPages: number
): ScriptSummary {
  const summary: ScriptSummary = {
    totalScenes: scenes.length,
    completedScenes: 0,
    draftedScenes: 0,
    inProgressScenes: 0,
    revisionScenes: 0,
    totalEstimatedPages,
    beatCounts: {
      complete: 0,
      drafted: 0,
      inProgress: 0,
      notStarted: 0,
      needsRevision: 0,
    },
    dialogueCoverage: {
      strongScenes: 0,
      partialScenes: 0,
      weakScenes: 0,
    },
    structuralCoverage: {
      completeScenes: 0,
      incompleteScenes: 0,
    },
  };

  for (const s of scenes) {
    switch (s.status) {
      case "complete":
        summary.completedScenes++;
        break;
      case "drafted":
        summary.draftedScenes++;
        break;
      case "in_progress":
        summary.inProgressScenes++;
        break;
      case "needs_revision":
        summary.revisionScenes++;
        break;
      default:
        break;
    }
  }

  for (const b of beats) {
    switch (b.status) {
      case "complete":
        summary.beatCounts.complete++;
        break;
      case "drafted":
        summary.beatCounts.drafted++;
        break;
      case "in_progress":
        summary.beatCounts.inProgress++;
        break;
      case "not_started":
        summary.beatCounts.notStarted++;
        break;
      case "needs_revision":
        summary.beatCounts.needsRevision++;
        break;
      default:
        break;
    }
  }

  for (let i = 0; i < scenes.length; i++) {
    const s = scenes[i];
    const key = s.id ?? `scene-line-${s.contentStartLine}`;
    const cov = coverageBySceneId[key];
    if (!cov) continue;
    if (cov.structurallyComplete) summary.structuralCoverage.completeScenes++;
    else summary.structuralCoverage.incompleteScenes++;
    switch (cov.dialogueCoverageLevel) {
      case "strong":
        summary.dialogueCoverage.strongScenes++;
        break;
      case "partial":
        summary.dialogueCoverage.partialScenes++;
        break;
      case "weak":
        summary.dialogueCoverage.weakScenes++;
        break;
    }
  }

  return summary;
}
