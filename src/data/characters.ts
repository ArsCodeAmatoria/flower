export interface CharacterChatTheme {
  headerBg: string;
  headerText: string;
  headerSub: string;
  /** Full CSS background (gradients + optional patterns). */
  wallpaper: string;
  bubbleSelf: string;
  bubbleSelfText: string;
  bubblePeer: string;
  bubblePeerText: string;
  timestamp: string;
  inputBg: string;
  inputBorder: string;
  accentDot: string;
}

export interface Character {
  id: string;
  name: string;
  role: string;
  description: string;
  personalityTraits: string[];
  image: string;
  songIds: string[];
  /** Characters they trust enough to coordinate with in-thread. */
  allyIds: string[];
}

const CHAT_THEMES: Record<string, CharacterChatTheme> = {
  rose: {
    headerBg: "linear-gradient(135deg, #c76b7e 0%, #a84860 100%)",
    headerText: "#fff8fa",
    headerSub: "rgba(255,248,250,0.72)",
    wallpaper:
      "radial-gradient(circle at 12% 18%, rgba(199,107,126,0.14) 0%, transparent 42%), radial-gradient(circle at 88% 8%, rgba(168,72,96,0.1) 0%, transparent 38%), linear-gradient(165deg, #f7edf0 0%, #efe6e0 55%, #ebe3dc 100%)",
    bubbleSelf: "#fdecef",
    bubbleSelfText: "#4a2a32",
    bubblePeer: "#ffffff",
    bubblePeerText: "#374151",
    timestamp: "rgba(74,42,50,0.45)",
    inputBg: "rgba(255,255,255,0.92)",
    inputBorder: "rgba(199,107,126,0.28)",
    accentDot: "#fda4af",
  },
  lemon: {
    headerBg: "linear-gradient(135deg, #e8a317 0%, #c77f0a 100%)",
    headerText: "#1c1508",
    headerSub: "rgba(28,21,8,0.65)",
    wallpaper:
      "radial-gradient(circle at 20% 30%, rgba(232,163,23,0.18) 0%, transparent 45%), radial-gradient(circle at 80% 70%, rgba(255,214,0,0.12) 0%, transparent 40%), linear-gradient(180deg, #fff8e7 0%, #fff3dc 50%, #fcecc9 100%)",
    bubbleSelf: "#fff3c4",
    bubbleSelfText: "#3a2f0a",
    bubblePeer: "#ffffff",
    bubblePeerText: "#374151",
    timestamp: "rgba(58,47,10,0.45)",
    inputBg: "rgba(255,252,240,0.95)",
    inputBorder: "rgba(199,127,10,0.35)",
    accentDot: "#facc15",
  },
  daisy: {
    headerBg: "linear-gradient(135deg, #6d9f6b 0%, #4a7c59 100%)",
    headerText: "#f4fff2",
    headerSub: "rgba(244,255,242,0.7)",
    wallpaper:
      "radial-gradient(circle at 15% 85%, rgba(109,159,107,0.12) 0%, transparent 35%), radial-gradient(circle at 92% 20%, rgba(74,124,89,0.1) 0%, transparent 42%), linear-gradient(180deg, #f4faf3 0%, #e8f2e8 100%)",
    bubbleSelf: "#e4f6e2",
    bubbleSelfText: "#1f3d24",
    bubblePeer: "#ffffff",
    bubblePeerText: "#374151",
    timestamp: "rgba(31,61,36,0.42)",
    inputBg: "rgba(255,255,255,0.94)",
    inputBorder: "rgba(74,124,89,0.3)",
    accentDot: "#86efac",
  },
  narcissa: {
    headerBg: "linear-gradient(135deg, #7c5aa6 0%, #5b3d86 100%)",
    headerText: "#faf5ff",
    headerSub: "rgba(250,245,255,0.68)",
    wallpaper:
      "radial-gradient(circle at 70% 10%, rgba(167,139,250,0.2) 0%, transparent 36%), radial-gradient(circle at 10% 60%, rgba(91,61,134,0.12) 0%, transparent 45%), linear-gradient(195deg, #f5f0ff 0%, #ede8f7 100%)",
    bubbleSelf: "#ede4ff",
    bubbleSelfText: "#3b2f55",
    bubblePeer: "#ffffff",
    bubblePeerText: "#374151",
    timestamp: "rgba(59,47,85,0.45)",
    inputBg: "rgba(255,253,255,0.96)",
    inputBorder: "rgba(124,90,166,0.32)",
    accentDot: "#c4b5fd",
  },
  nettles: {
    headerBg: "linear-gradient(135deg, #1e4a3e 0%, #0f2d26 100%)",
    headerText: "#e8ffef",
    headerSub: "rgba(232,255,239,0.65)",
    wallpaper:
      "radial-gradient(circle at 25% 40%, rgba(34,197,94,0.08) 0%, transparent 50%), repeating-linear-gradient(0deg, transparent, transparent 11px, rgba(15,45,38,0.04) 11px, rgba(15,45,38,0.04) 12px), linear-gradient(180deg, #dfece4 0%, #d2e3d8 100%)",
    bubbleSelf: "#c8ead4",
    bubbleSelfText: "#0f291f",
    bubblePeer: "#ffffff",
    bubblePeerText: "#374151",
    timestamp: "rgba(15,41,31,0.48)",
    inputBg: "rgba(255,255,255,0.9)",
    inputBorder: "rgba(30,74,62,0.35)",
    accentDot: "#4ade80",
  },
  goldenrod: {
    headerBg: "linear-gradient(135deg, #b8860b 0%, #8b6508 100%)",
    headerText: "#fffbeb",
    headerSub: "rgba(255,251,235,0.7)",
    wallpaper:
      "radial-gradient(circle at 50% 0%, rgba(184,134,11,0.22) 0%, transparent 55%), linear-gradient(180deg, #faf6e8 0%, #f3ead2 100%)",
    bubbleSelf: "#fef3c7",
    bubbleSelfText: "#422006",
    bubblePeer: "#ffffff",
    bubblePeerText: "#374151",
    timestamp: "rgba(66,32,6,0.45)",
    inputBg: "rgba(255,252,240,0.95)",
    inputBorder: "rgba(184,134,11,0.38)",
    accentDot: "#fcd34d",
  },
  iris: {
    headerBg: "linear-gradient(135deg, #312e81 0%, #1e1b4b 100%)",
    headerText: "#e0e7ff",
    headerSub: "rgba(224,231,255,0.62)",
    wallpaper:
      "radial-gradient(circle at 85% 70%, rgba(99,102,241,0.18) 0%, transparent 40%), radial-gradient(circle at 5% 15%, rgba(49,46,129,0.15) 0%, transparent 38%), linear-gradient(180deg, #ebeefe 0%, #e0e4f5 100%)",
    bubbleSelf: "#c7d2fe",
    bubbleSelfText: "#1e1b4b",
    bubblePeer: "#ffffff",
    bubblePeerText: "#374151",
    timestamp: "rgba(30,27,75,0.45)",
    inputBg: "rgba(255,255,255,0.93)",
    inputBorder: "rgba(99,102,241,0.35)",
    accentDot: "#a5b4fc",
  },
};

export function getCharacterChatTheme(characterId: string): CharacterChatTheme {
  return CHAT_THEMES[characterId] ?? CHAT_THEMES.rose;
}

export const characters: Character[] = [
  {
    id: "rose",
    name: "Rose",
    role: "Protagonist",
    description:
      "Scentless new girl at Flower High; her real gift is presence—bringing out light already in others.",
    personalityTraits: ["Quiet resolve", "Empathic", "Self-doubting", "Then luminous"],
    image: "/characters/rose.png",
    songIds: ["see-it-my-way", "red-magic", "flower-finale"],
    allyIds: ["lemon", "daisy"],
  },
  {
    id: "lemon",
    name: "Lemon",
    role: "Love interest / catalyst",
    description:
      "Older outsider who sees Rose; lies wedge them until truth wins.",
    personalityTraits: ["Warm", "Teasing", "Loyal", "Wounded then restored"],
    image: "/characters/lemon.png",
    songIds: ["squeeze-the-day", "see-it-my-way", "flower-finale"],
    allyIds: ["rose", "daisy"],
  },
  {
    id: "daisy",
    name: "Daisy",
    role: "Best friend / moral pivot",
    description:
      "Conformist friend who chooses truth—the one who cracks the lie open.",
    personalityTraits: ["Gentle", "Conflict-avoidant", "Brave when it counts"],
    image: "/characters/daisy1.png",
    songIds: ["just-fit-in"],
    allyIds: ["rose", "lemon"],
  },
  {
    id: "narcissa",
    name: "Narcissa",
    role: "Social ideal / contrast",
    description:
      "Picture of perfect bloom; ceremony is her stage until the polish breaks.",
    personalityTraits: ["Precise", "Image-driven", "Secretly pressured"],
    image: "/characters/narcicissa.png",
    songIds: ["look-at-me"],
    allyIds: ["goldenrod", "iris"],
  },
  {
    id: "nettles",
    name: "Nettles",
    role: "Enforcer of the system",
    description:
      "Hall muscle for scent and rank; tough shell, shaky center.",
    personalityTraits: ["Sharp", "Territorial", "Uncertain underneath"],
    image: "/characters/nettles.png",
    songIds: [],
    allyIds: ["goldenrod", "iris"],
  },
  {
    id: "goldenrod",
    name: "Goldenrod",
    role: "Villain (control)",
    description:
      "Boss of order and rank—presence, to him, needs a gatekeeper.",
    personalityTraits: ["Commanding", "Persuasive", "Afraid of chaos"],
    image: "/characters/goldenrod.png",
    songIds: ["own-the-light"],
    allyIds: ["iris", "narcissa", "nettles"],
  },
  {
    id: "iris",
    name: "Iris (Spin Doctor)",
    role: "Villain (manipulation)",
    description:
      "Spins stories until Rose trusts the lie over love—charming, surgical.",
    personalityTraits: ["Charming", "Surgical", "Detached"],
    image: "/characters/iris.png",
    songIds: ["own-the-light"],
    allyIds: ["goldenrod", "narcissa"],
  },
];
