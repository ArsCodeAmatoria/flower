import { SLUGLINE_RE_TRIMMED } from "./constants";

/** 1-based line numbers where a scene slug starts. */
export function detectSluglineLineNumbers(lines: string[]): number[] {
  const nums: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (SLUGLINE_RE_TRIMMED.test(lines[i].trim())) nums.push(i + 1);
  }
  return nums;
}

export function isSlugline(line: string): boolean {
  return SLUGLINE_RE_TRIMMED.test(line.trim());
}
