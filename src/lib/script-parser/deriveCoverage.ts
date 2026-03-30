import type { ParsedScene, SceneCoverage } from "./types";

export function deriveSceneCoverage(scene: ParsedScene): SceneCoverage {
  const hasGoal = !!(scene.goal?.trim());
  const hasObstacle = !!(scene.obstacle?.trim());
  const hasTurn = !!(scene.turn?.trim());
  const hasOutcome = !!(scene.outcome?.trim());
  const structurallyComplete = hasGoal && hasObstacle && hasTurn && hasOutcome;

  const hasCharacters = scene.characters.length > 0;
  const hasDialogueSubtext = !!(scene.dialogue.subtext?.trim());
  const hasDialogueConflict = !!(scene.dialogue.conflict?.trim());
  const hasDialogueTurn = !!(scene.dialogue.turn?.trim());
  const hasObjective = Object.keys(scene.dialogue.objectives).length > 0;
  const hasVerbal = Object.keys(scene.dialogue.verbalActions).length > 0;

  let dialogueCoverageLevel: SceneCoverage["dialogueCoverageLevel"] = "weak";
  const strong =
    hasDialogueSubtext &&
    hasDialogueConflict &&
    hasDialogueTurn &&
    hasObjective &&
    hasVerbal;

  if (strong) dialogueCoverageLevel = "strong";
  else {
    const score = [
      hasDialogueSubtext,
      hasDialogueConflict,
      hasDialogueTurn,
      hasObjective,
      hasVerbal,
    ].filter(Boolean).length;
    if (score >= 2) dialogueCoverageLevel = "partial";
  }

  if (scene.dialogue.coverage === "weak" || scene.dialogue.coverage === "partial" || scene.dialogue.coverage === "strong") {
    dialogueCoverageLevel = scene.dialogue.coverage;
  }

  return {
    hasGoal,
    hasObstacle,
    hasTurn,
    hasOutcome,
    structurallyComplete,
    hasCharacters,
    hasDialogueSubtext,
    hasDialogueConflict,
    hasDialogueTurn,
    dialogueCoverageLevel,
  };
}
