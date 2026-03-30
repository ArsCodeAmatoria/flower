import type { Character } from "./characters";
import { CHARACTER_MCKEE_COUNT, CHARACTER_STC_COUNT } from "./character-theory-templates";

export interface CharacterDossier {
  identityOneLiner: string;
  coreIdentity: {
    want: string;
    lie: string;
    truth: string;
    mask: string;
    voice: string;
    contradiction: string;
  };
  arcSummary: { start: string; middle: string; end: string };
  stcApplied: string[][];
  mckeeApplied: string[][];
  operatingSystem: {
    alwaysDoes: string[];
    neverDoes: string[];
    handlesConflict: string[];
    whatBreaksThem: string[];
    whatChangesThem: string[];
  };
  dialogueIdentity: {
    speechPattern: string[];
    verbalActions: string[];
    subtextStyle: string[];
    exampleLines: string[];
  };
  arcTracker: { start: string; middle: string; end: string };
}

function emptyStc(): string[][] {
  return Array.from({ length: CHARACTER_STC_COUNT }, () => []);
}

function emptyMckee(): string[][] {
  return Array.from({ length: CHARACTER_MCKEE_COUNT }, () => []);
}

function fallbackDossier(c: Character): CharacterDossier {
  const t = c.personalityTraits;
  return {
    identityOneLiner:
      c.description.length > 160 ? `${c.description.slice(0, 157)}…` : c.description,
    coreIdentity: {
      want: "Define a concrete scene want that drives Flower High sequences.",
      lie: "Define the belief that keeps this character performing the system.",
      truth: "Define what the finale proves instead.",
      mask: t[0] ?? "Public face — draft.",
      voice: "Rhythm, diction, musical tie-ins when they sing — draft.",
      contradiction:
        t.length >= 2 ? `${t[0]} vs ${t[1]}` : "Opposing truths under pressure — draft.",
    },
    arcSummary: {
      start: "Opening self in the beauty hierarchy — draft.",
      middle: "Pressure from Goldenrod, Iris, and ceremony — draft.",
      end: "Post-finale self — draft.",
    },
    stcApplied: emptyStc().map(() => [
      "Fill per Save the Cat beat during scene breakdown.",
    ]),
    mckeeApplied: emptyMckee().map(() => [
      "Apply when drafting dialogue turns and value shifts.",
    ]),
    operatingSystem: {
      alwaysDoes: ["Behavior under hallway pressure — draft."],
      neverDoes: ["Lines they won’t cross yet — draft."],
      handlesConflict: ["Default tactics — draft."],
      whatBreaksThem: ["Public shame, lies about Lemon, stripped scent/presence — draft."],
      whatChangesThem: ["Truth from Daisy, waterfall return, Rose’s presence — draft."],
    },
    dialogueIdentity: {
      speechPattern: ["How they speak in hall vs woods — draft."],
      verbalActions: ["Sooth, jab, conceal, perform — draft."],
      subtextStyle: ["What they won’t say about rank and fear — draft."],
      exampleLines: ["Pull from screenplay when scenes lock."],
    },
    arcTracker: {
      start: "Ranked world",
      middle: "Split by spin",
      end: "Awakened world",
    },
  };
}

/** Optional deep dives per id — otherwise fall back from `Character` */
const DOSSIERS: Partial<Record<string, CharacterDossier>> = {
  rose: {
    identityOneLiner:
      "Scentless in a school that ranks bloom—she learns worth is presence, not performance.",
    coreIdentity: {
      want: "Belong without faking a scent she doesn’t have.",
      lie: "If she isn’t like them, she’s nothing.",
      truth: "She doesn’t give power; she reveals what was already there.",
      mask: "Small, agreeable, trying not to be noticed.",
      voice: "Soft until the waterfall; then clear and sure.",
      contradiction: "Longs to be seen; fears being seen wrong.",
    },
    arcSummary: {
      start: "Invisible, ashamed.",
      middle: "Loved, then betrayed by a story.",
      end: "Transforms; restores Lemon and the world’s light.",
    },
    stcApplied: emptyStc().map(() => ["Map to FLOWER beat outline in revision."]),
    mckeeApplied: emptyMckee().map(() => ["Track value ± on Rose scenes (presence vs performance)."]),
    operatingSystem: {
      alwaysDoes: ["Notices who is dimming", "Pulls back when ridiculed"],
      neverDoes: ["Boasts about power early"],
      handlesConflict: ["Withdraw; then confront with presence"],
      whatBreaksThem: ["Believing Lemon feared her"],
      whatChangesThem: ["Daisy’s truth; second waterfall"],
    },
    dialogueIdentity: {
      speechPattern: ["Sparse early", "Image-led when honest"],
      verbalActions: ["Soften", "deflect", "later: name truth"],
      subtextStyle: ["Fear of being a burden"],
      exampleLines: ["I don’t smell like anything. (beat) I’m still here."],
    },
    arcTracker: {
      start: "Hidden",
      middle: "Lit, then dark",
      end: "Dawn for everyone",
    },
  },
};

export function getResolvedCharacterDossier(character: Character): CharacterDossier {
  const d = DOSSIERS[character.id];
  if (d) return d;
  return fallbackDossier(character);
}
