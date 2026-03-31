export interface Character {
  id: string;
  name: string;
  role: string;
  description: string;
  personalityTraits: string[];
  image: string;
  songIds: string[];
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
  },
];
