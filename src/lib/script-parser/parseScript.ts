import { assembleRawScenes, getGlobalMetadataEntries, type RawSceneChunk } from "./assembleScenes";
import { buildSidebarModels } from "./buildSidebarModels";
import { computeCurrentContext } from "./currentContext";
import { deriveBeatStates } from "./deriveBeatState";
import { deriveSceneCoverage } from "./deriveCoverage";
import { deriveScriptSummary } from "./deriveSummary";
import { estimatePagesForScenes, totalEstimatedPages } from "./estimatePages";
import { extractCharacterCues } from "./extractCharacterCues";
import { extractMetadata } from "./extractMetadata";
import { normalizeText } from "./normalizeText";
import { parseCharacterMasters } from "./parseCharacters";
import { foldGlobalMetadata } from "./parseGlobalMetadata";
import { applySceneMetadata } from "./parseSceneMetadata";
import type { ParseScriptResult, ParsedScene, ParsedScript, ValidationIssue } from "./types";
import { validateScript } from "./validateScript";

function rawChunkToScene(
  lines: string[],
  chunk: RawSceneChunk,
  issues: ValidationIssue[]
): ParsedScene {
  const lo = chunk.slugLineNumber - 1;
  const hi = chunk.contentEndLine - 1;
  const scene: ParsedScene = {
    slugline: chunk.slugline,
    contentStartLine: chunk.slugLineNumber,
    contentEndLine: chunk.contentEndLine,
    metadataStartLine: chunk.metadataStartLine,
    metadataEndLine: chunk.metadataEndLine,
    characters: [],
    characterSceneData: {},
    dialogue: { objectives: {}, verbalActions: {} },
    characterCues: [],
    rawMetadata: chunk.rawMetadata,
    rawText: lines.slice(lo, hi + 1).join("\n"),
    lineCount: 0,
    estimatedPageStart: 0,
    estimatedPageEnd: 0,
    estimatedPageLength: 0,
  };
  applySceneMetadata(scene, chunk.rawMetadata, issues);
  scene.characterCues = extractCharacterCues(lines, chunk.slugLineNumber, chunk.contentEndLine);
  return scene;
}

/**
 * Full pipeline: normalized text → structured model + sidebar contracts.
 * Does not invent story data; missing metadata surfaces as gaps and validation issues.
 */
export function parseScript(rawText: string, cursorLine?: number): ParseScriptResult {
  const { text, lines } = normalizeText(rawText);
  const allMetadata = extractMetadata(lines);
  const chunks = assembleRawScenes(lines, allMetadata);
  const globalEntries = getGlobalMetadataEntries(lines, allMetadata, chunks[0]);
  const global = foldGlobalMetadata(globalEntries);
  const characterEntries = globalEntries.filter((e) => e.key.startsWith("character."));
  const characters = parseCharacterMasters(characterEntries);

  const metaIssues: ValidationIssue[] = [];
  const scenes = chunks.map((ch) => rawChunkToScene(lines, ch, metaIssues));

  estimatePagesForScenes(lines, scenes);

  const coverageBySceneId: ParsedScript["coverageBySceneId"] = {};
  for (const s of scenes) {
    const key = s.id ?? `scene-line-${s.contentStartLine}`;
    coverageBySceneId[key] = deriveSceneCoverage(s);
  }

  const beats = deriveBeatStates(scenes, global.project.targetPages);
  const totalEp = totalEstimatedPages(scenes);
  const summary = deriveScriptSummary(scenes, coverageBySceneId, beats, totalEp);

  const validationIssues = validateScript(global, globalEntries, characters, scenes, metaIssues);

  const parsedScript: ParsedScript = {
    lines,
    rawText: text,
    global,
    characters,
    scenes,
    beats,
    summary,
    coverageBySceneId,
    validationIssues,
  };

  const currentContext =
    cursorLine !== undefined && cursorLine >= 1 ? computeCurrentContext(cursorLine, scenes) : undefined;

  const { left, right } = buildSidebarModels(parsedScript, currentContext);

  return {
    parsedScript,
    leftSidebar: left,
    rightSidebar: right,
    currentContext,
  };
}
