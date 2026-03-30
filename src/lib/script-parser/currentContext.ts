import type { BeatId, CurrentContext, ParsedScene } from "./types";

export function computeCurrentContext(cursorLine: number, scenes: ParsedScene[]): CurrentContext | undefined {
  for (const s of scenes) {
    const lo = Math.min(s.metadataStartLine, s.contentStartLine);
    const hi = s.contentEndLine;
    if (cursorLine >= lo && cursorLine <= hi) {
      return {
        currentSceneId: s.id,
        currentActId: s.actId,
        currentBeatId: s.beatId as BeatId | undefined,
        currentThreadId: s.threadId,
        currentSceneTitle: s.title ?? s.slugline,
        currentEstimatedPage: Math.floor(s.estimatedPageStart),
      };
    }
  }
  return undefined;
}
