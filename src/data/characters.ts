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
      "A scentless teen on her first day at a beauty-obsessed high school. She feels invisible until she learns her gift is not fragrance but presence—the ability to awaken hidden light in others.",
    personalityTraits: ["Quiet resolve", "Empathic", "Self-doubting", "Then luminous"],
    image: "/characters/rose.png",
    songIds: ["see-it-my-way", "red-magic", "flower-finale"],
  },
  {
    id: "lemon",
    name: "Lemon",
    role: "Love interest / catalyst",
    description:
      "An older student and playful outsider who sees Rose clearly. His belief in her anchors the love story until manipulation makes Rose doubt everything—including him.",
    personalityTraits: ["Warm", "Teasing", "Loyal", "Wounded then restored"],
    image: "/characters/lemon.png",
    songIds: ["squeeze-the-day", "see-it-my-way", "flower-finale"],
  },
  {
    id: "daisy",
    name: "Daisy",
    role: "Best friend / moral pivot",
    description:
      "Kind but steeped in the school’s conformity. She learns to risk truth over approval—and delivers the revelation that breaks the lie.",
    personalityTraits: ["Gentle", "Conflict-avoidant", "Brave when it counts"],
    image: "/characters/daisy.png",
    songIds: ["just-fit-in"],
  },
  {
    id: "narcissa",
    name: "Narcissa",
    role: "Social ideal / contrast",
    description:
      "The face of perfect bloom at Flower High. The Bloom Ceremony is her stage—performance as proof of worth—until the story cracks the polish.",
    personalityTraits: ["Precise", "Image-driven", "Secretly pressured"],
    image: "/characters/narcicissa.png",
    songIds: ["look-at-me"],
  },
  {
    id: "nettles",
    name: "Nettles",
    role: "Enforcer of the system",
    description:
      "Intimidating hall presence who reinforces scent and status. Insecurity hides under dominance until the world loosens.",
    personalityTraits: ["Sharp", "Territorial", "Uncertain underneath"],
    image: "/characters/nettles.png",
    songIds: [],
  },
  {
    id: "goldenrod",
    name: "Goldenrod",
    role: "Villain (control)",
    description:
      "Believes beauty and power must be structured, ranked, and owned. The antagonist of presence—the one who insists radiance needs a gatekeeper.",
    personalityTraits: ["Commanding", "Persuasive", "Afraid of chaos"],
    image: "/characters/goldenrod.png",
    songIds: ["own-the-light"],
  },
  {
    id: "iris",
    name: "Iris (Spin Doctor)",
    role: "Villain (manipulation)",
    description:
      "Twists truth into believable stories until Rose trusts the lie more than love. People remember narratives, not facts—until the truth returns.",
    personalityTraits: ["Charming", "Surgical", "Detached"],
    image: "/characters/iris.png",
    songIds: ["own-the-light"],
  },
];
