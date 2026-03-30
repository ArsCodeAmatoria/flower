import type { GlobalMetadata, MetadataEntry } from "./types";

const FORMATS = new Set(["feature", "pilot", "short", "play"]);

export function foldGlobalMetadata(entries: MetadataEntry[]): GlobalMetadata {
  const g: GlobalMetadata = {
    project: {},
    theme: {},
  };

  for (const e of entries) {
    switch (e.key) {
      case "project.title":
        g.project.title = e.value;
        break;
      case "project.format":
        if (FORMATS.has(e.value)) g.project.format = e.value as GlobalMetadata["project"]["format"];
        else g.project.format = undefined;
        break;
      case "project.target_pages": {
        const n = parseInt(e.value, 10);
        if (!Number.isNaN(n)) g.project.targetPages = n;
        break;
      }
      case "project.genre":
        g.project.genre = e.value;
        break;
      case "theme.core":
        g.theme.core = e.value;
        break;
      case "theme.lie":
        g.theme.lie = e.value;
        break;
      case "theme.truth":
        g.theme.truth = e.value;
        break;
      case "theme.moral_argument":
        g.theme.moralArgument = e.value;
        break;
      default:
        break;
    }
  }
  return g;
}
