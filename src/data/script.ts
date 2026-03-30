/**
 * Screenplay + shared types/utilities.
 *
 * - `script-draft1.ts` — canonical page data (source for Draft 2 after metadata injection).
 * - Draft 1 is not edit-tracked in git here; the in-app “archived draft” tab was removed so this file
 *   stays the single screenplay source. Keep an offline snapshot of any archive you need.
 *
 * Run `npm run script-index` to regenerate SCRIPT_INDEX.md (update the script if needed).
 */

export type { ScriptElement, ScriptElementType, ScriptPage } from "./script-core";
export { getScriptPageStarts, getTotalScreenplayPages } from "./script-core";

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

import { pageLabelsDraft2, scriptPagesDraft2 } from "./script-draft2";

/** Low-level screenplay pages (no Draft 2 `[[metadata]]` preamble). Used by `script-draft2`. */
export { pageLabelsDraft1, scriptPagesDraft1 } from "./script-draft1";
export { pageLabelsDraft2, scriptPagesDraft2 } from "./script-draft2";

/** Default: working script with metadata (Characters, Sets, Credits, About, Script UI). */
export const scriptPages = scriptPagesDraft2;
export const pageLabels = pageLabelsDraft2;
