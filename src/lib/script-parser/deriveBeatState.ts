import { ALL_BEAT_IDS, BEAT_LABELS, DEFAULT_BEAT_PAGE_RANGES, STATUS_RANK } from "./constants";
import type { BeatId, BeatState, ParsedScene } from "./types";

function scaleRange(
  range: [number, number],
  target: number | undefined,
  base: number
): [number, number] {
  if (!target || target === base) return range;
  const f = target / base;
  return [Math.round(range[0] * f * 10) / 10, Math.round(range[1] * f * 10) / 10];
}

export function deriveBeatStates(
  scenes: ParsedScene[],
  targetPages?: number
): BeatState[] {
  const base = 110;
  const states: BeatState[] = [];

  for (const id of ALL_BEAT_IDS) {
    const withBeat = scenes.filter((s) => s.beatId === id);
    const sceneIds = [...new Set(withBeat.map((s) => s.id).filter(Boolean) as string[])];

    let status: BeatState["status"] = "not_started";
    let complete = false;
    let bestRank = -1;

    for (const s of withBeat) {
      if (s.complete) complete = true;
      const st = s.status ?? "not_started";
      const r = STATUS_RANK[st] ?? 0;
      if (r > bestRank) {
        bestRank = r;
        status = st;
      }
      const bs = s.beatStatus;
      if (bs) {
        const br = STATUS_RANK[bs] ?? 0;
        if (br > bestRank) {
          bestRank = br;
          status = bs;
        }
      }
    }

    if (sceneIds.length === 0) {
      status = "not_started";
      complete = false;
    }

    let actualPage: number | undefined;
    const starts = withBeat
      .map((s) => s.estimatedPageStart)
      .filter((n) => typeof n === "number" && !Number.isNaN(n));
    if (starts.length > 0) actualPage = Math.min(...starts);

    const targetRange = scaleRange(DEFAULT_BEAT_PAGE_RANGES[id], targetPages, base);

    states.push({
      id,
      label: BEAT_LABELS[id],
      targetPageRange: targetRange,
      sceneIds,
      status,
      complete,
      actualPage,
    });
  }

  return states;
}
