import { VALID_VERBAL_ACTIONS } from "./constants";
import type {
  CharacterMaster,
  GlobalMetadata,
  MetadataEntry,
  ParsedScene,
  ValidationIssue,
} from "./types";

const FORMATS = new Set(["feature", "pilot", "short", "play"]);
const SCENE_STATUS = new Set([
  "not_started",
  "in_progress",
  "drafted",
  "needs_revision",
  "complete",
]);
const COVERAGE = new Set(["weak", "partial", "strong"]);
const RISK = new Set(["low", "medium", "high"]);

function masterShortToFullId(masters: CharacterMaster[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const m of masters) {
    if (m.id.startsWith("char_")) map.set(m.id.slice(5), m.id);
    else map.set(m.id, m.id);
  }
  return map;
}

export function validateScript(
  global: GlobalMetadata,
  globalEntries: MetadataEntry[],
  characters: CharacterMaster[],
  scenes: ParsedScene[],
  sceneDuplicateWarnings: ValidationIssue[]
): ValidationIssue[] {
  const issues: ValidationIssue[] = [...sceneDuplicateWarnings];

  if (!global.project.title?.trim()) {
    issues.push({ severity: "warning", key: "project.title", message: "Missing project.title in global metadata." });
  }

  const formatEntry = globalEntries.find((e) => e.key === "project.format");
  if (formatEntry && !FORMATS.has(formatEntry.value.trim())) {
    issues.push({
      severity: "error",
      lineNumber: formatEntry.lineNumber,
      key: "project.format",
      message: `Invalid project.format "${formatEntry.value}".`,
    });
  } else if (!global.project.format) {
    issues.push({
      severity: "warning",
      key: "project.format",
      message: "Missing or invalid project.format.",
    });
  }

  const tp = globalEntries.find((e) => e.key === "project.target_pages");
  if (tp) {
    const n = parseInt(tp.value, 10);
    if (Number.isNaN(n) || n < 1) {
      issues.push({
        severity: "error",
        lineNumber: tp.lineNumber,
        key: "project.target_pages",
        message: `Invalid project.target_pages "${tp.value}" (expect positive integer).`,
      });
    }
  }

  const charIdsSeen = new Map<string, number>();
  for (const c of characters) {
    const prev = charIdsSeen.get(c.id);
    if (prev !== undefined) {
      issues.push({
        severity: "error",
        key: "character.id",
        message: `Duplicate character.id "${c.id}".`,
      });
    }
    charIdsSeen.set(c.id, 1);
    if (!c.name?.trim()) {
      issues.push({
        severity: "warning",
        key: "character.name",
        message: `Character ${c.id} missing character.name.`,
      });
    }
  }

  const masterMap = masterShortToFullId(characters);
  const bySceneId = new Map<string, ParsedScene>();

  for (const scene of scenes) {
    if (scene.id) {
      const o = bySceneId.get(scene.id);
      if (o) {
        issues.push({
          severity: "error",
          key: "scene.id",
          sceneId: scene.id,
          message: `Duplicate scene.id "${scene.id}".`,
        });
      }
      bySceneId.set(scene.id, scene);
    }

    const sid = scene.id ?? `at-line-${scene.contentStartLine}`;

    if (!scene.id?.trim()) {
      issues.push({
        severity: "warning",
        sceneId: sid,
        key: "scene.id",
        message: "Missing scene.id.",
      });
    }
    if (!scene.title?.trim()) {
      issues.push({
        severity: "warning",
        sceneId: sid,
        key: "scene.title",
        message: "Missing scene.title.",
      });
    }

    const act = scene.rawMetadata.find((e) => e.key === "act.id");
    if (!scene.actId && act) {
      issues.push({
        severity: "error",
        lineNumber: act.lineNumber,
        sceneId: sid,
        key: "act.id",
        message: `Invalid act.id "${act.value}".`,
      });
    } else if (!scene.actId) {
      issues.push({
        severity: "warning",
        sceneId: sid,
        key: "act.id",
        message: "Missing or invalid act.id.",
      });
    }

    const beat = scene.rawMetadata.find((e) => e.key === "beat.id");
    if (!scene.beatId && beat?.value.trim()) {
      issues.push({
        severity: "error",
        lineNumber: beat.lineNumber,
        sceneId: sid,
        key: "beat.id",
        message: `Invalid beat.id "${beat.value}".`,
      });
    } else if (!scene.beatId) {
      issues.push({
        severity: "warning",
        sceneId: sid,
        key: "beat.id",
        message: "Missing or invalid beat.id.",
      });
    }

    const th = scene.rawMetadata.find((e) => e.key === "thread.id");
    if (!scene.threadId && th) {
      issues.push({
        severity: "error",
        lineNumber: th.lineNumber,
        sceneId: sid,
        key: "thread.id",
        message: `Invalid thread.id "${th.value}".`,
      });
    } else if (!scene.threadId) {
      issues.push({
        severity: "warning",
        sceneId: sid,
        key: "thread.id",
        message: "Missing or invalid thread.id.",
      });
    }

    const st = scene.rawMetadata.find((e) => e.key === "scene.status");
    if (st && !SCENE_STATUS.has(st.value.trim())) {
      issues.push({
        severity: "error",
        lineNumber: st.lineNumber,
        sceneId: sid,
        key: "scene.status",
        message: `Invalid scene.status "${st.value}".`,
      });
    }

    const sc = scene.rawMetadata.find((e) => e.key === "scene.complete");
    if (sc && !/^(true|false)$/i.test(sc.value.trim())) {
      issues.push({
        severity: "error",
        lineNumber: sc.lineNumber,
        sceneId: sid,
        key: "scene.complete",
        message: `Invalid scene.complete "${sc.value}" (use true or false).`,
      });
    }

    for (const id of scene.characters) {
      const trimmed = id.trim();
      if (!trimmed) continue;
      const exists = characters.some((c) => c.id === trimmed);
      if (!exists) {
        issues.push({
          severity: "warning",
          sceneId: sid,
          key: "scene.characters",
          message: `scene.characters references unknown id "${trimmed}".`,
        });
      }
    }

    for (const short of Object.keys(scene.characterSceneData)) {
      if (!masterMap.has(short)) {
        issues.push({
          severity: "warning",
          sceneId: sid,
          key: `character.${short}`,
          message: `character.${short}.* metadata but no matching character master (expect char_${short}).`,
        });
      }
    }

    for (const [, v] of Object.entries(scene.dialogue.verbalActions)) {
      if (!VALID_VERBAL_ACTIONS.has(v.trim())) {
        issues.push({
          severity: "warning",
          sceneId: sid,
          key: "dialogue.verbal_action",
          message: `Unknown dialogue.verbal_action value "${v}".`,
        });
      }
    }

    const cov = scene.rawMetadata.find((e) => e.key === "dialogue.coverage");
    if (cov && !COVERAGE.has(cov.value.trim())) {
      issues.push({
        severity: "error",
        lineNumber: cov.lineNumber,
        sceneId: sid,
        key: "dialogue.coverage",
        message: `Invalid dialogue.coverage "${cov.value}".`,
      });
    }

    for (const key of ["dialogue.exposition_risk", "dialogue.on_the_nose_risk"] as const) {
      const e = scene.rawMetadata.find((x) => x.key === key);
      if (e && !RISK.has(e.value.trim())) {
        issues.push({
          severity: "error",
          lineNumber: e.lineNumber,
          sceneId: sid,
          key,
          message: `Invalid ${key} "${e.value}".`,
        });
      }
    }

    if (scene.beatComplete === true && scene.complete !== true) {
      issues.push({
        severity: "warning",
        sceneId: sid,
        key: "beat.complete",
        message: "beat.complete is true but scene.complete is not — check consistency.",
      });
    }
  }

  return issues;
}
