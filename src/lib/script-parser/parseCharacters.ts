import type { CharacterMaster, MetadataEntry } from "./types";

/**
 * Every `character.id` starts a block; following `character.*` keys belong until next `character.id`.
 */
export function parseCharacterMasters(entries: MetadataEntry[]): CharacterMaster[] {
  const masters: CharacterMaster[] = [];
  let current: CharacterMaster | null = null;

  const flush = () => {
    if (current?.id) masters.push(current);
    current = null;
  };

  for (const e of entries) {
    if (e.key === "character.id") {
      flush();
      current = { id: e.value.trim() };
      continue;
    }

    if (!e.key.startsWith("character.")) continue;
    if (!current) continue;

    const sub = e.key.slice("character.".length);
    switch (sub) {
      case "name":
        current.name = e.value;
        break;
      case "role":
        current.role = e.value;
        break;
      case "want":
        current.want = e.value;
        break;
      case "lie":
        current.lie = e.value;
        break;
      case "truth":
        current.truth = e.value;
        break;
      case "voice":
        current.voice = e.value;
        break;
      case "mask":
        current.mask = e.value;
        break;
      default:
        break;
    }
  }
  flush();
  return masters;
}
