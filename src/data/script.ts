/**
 * Screenplay + shared types/utilities.
 *
 * Active pages: `script-beat-pages.ts` (15 beats). Full draft replaces scaffold data.
 * Beat spine: `flower-beats-final.ts` (shown under Script → Structure).
 *
 * Run `npm run script-index` to regenerate SCRIPT_INDEX.md.
 */

export type { ScriptElement, ScriptElementType, ScriptPage } from "./script-core";
export {
  countElementScreenplayLines,
  getSceneCountStats,
  getScriptPageStarts,
  getTotalScreenplayLineCount,
  getTotalScreenplayPages,
  LINES_PER_SCREENPLAY_PAGE,
} from "./script-core";

export type { ScriptMetadataIndex, SceneMetaBlock } from "@/lib/script-metadata";
export {
  SCRIPT_METADATA_LINE_RE,
  parseMetadataLine,
  buildScriptMetadataIndex,
  getSceneMetaForPageIndex,
  sceneStructurallyComplete,
  dialogueCoverageStrong,
} from "@/lib/script-metadata";

export {
  parseScript,
  scriptPagesToScreenplayText,
  type ParseScriptResult,
  type ParsedScript,
  type ParsedScene,
  type LeftSidebarModel,
  type RightSidebarModel,
  type CurrentContext,
} from "@/lib/script-parser";

import { pageLabelsBeatScaffold, scriptPagesBeatScaffold } from "./script-beat-pages";

/** One block per beat; lines counted at 55/page incl. spacing (see script-core). */
export const scriptPages = scriptPagesBeatScaffold;
export const pageLabels = pageLabelsBeatScaffold;
