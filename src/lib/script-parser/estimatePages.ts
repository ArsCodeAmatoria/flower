import { classifyScreenplayLines } from "./classifyScreenplayLine";
import { LINE_WEIGHTS } from "./constants";
import type { ParsedScene } from "./types";
import type { ScreenplayLineKind } from "./classifyScreenplayLine";

function weightFor(kind: ScreenplayLineKind): number {
  return LINE_WEIGHTS[kind] ?? LINE_WEIGHTS.action;
}

const LINES_PER_PAGE = 55;

function kindToAcc(kind: ScreenplayLineKind, acc: number): number {
  return acc + weightFor(kind);
}

/**
 * Assign cumulative screenplay page estimates (1-based) to scenes.
 */
export function estimatePagesForScenes(lines: string[], scenes: ParsedScene[]): void {
  let cumulativeWeighted = 0;

  for (const scene of scenes) {
    const startIdx = scene.contentStartLine - 1;
    const endIdx = scene.contentEndLine - 1;
    const hi = Math.min(endIdx, lines.length - 1);
    const lo = Math.max(0, startIdx);

    const kinds = classifyScreenplayLines(lines, lo, hi);
    let sceneWeight = 0;
    for (const k of kinds) sceneWeight = kindToAcc(k, sceneWeight);

    scene.lineCount = hi - lo + 1;

    const startPage = cumulativeWeighted / LINES_PER_PAGE + 1;
    cumulativeWeighted += sceneWeight;
    const endPage = cumulativeWeighted / LINES_PER_PAGE + 1;

    scene.estimatedPageStart = Math.floor(startPage * 100) / 100;
    scene.estimatedPageEnd = Math.floor(endPage * 100) / 100;
    scene.estimatedPageLength = Math.max(0.01, Math.floor((endPage - startPage) * 100) / 100);
  }
}

export function totalEstimatedPages(scenes: ParsedScene[]): number {
  if (scenes.length === 0) return 0;
  const last = scenes[scenes.length - 1];
  return Math.ceil(last.estimatedPageEnd);
}
