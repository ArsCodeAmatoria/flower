export interface Set {
  id: string;
  name: string;
  slug: "EXT." | "INT." | "EXT./INT.";
  description: string;
  image: string;
}

export const sets: Set[] = [
  {
    id: "flower-high-exterior",
    name: "Flower High — Exterior",
    slug: "EXT.",
    description:
      "The groomed arrival plaza: topiary, ranking boards, scent clouds from vents. First impression of curated perfection.",
    image: "https://picsum.photos/seed/set-fh-ext/900/600",
  },
  {
    id: "flower-high-hall",
    name: "Flower High — Main Hall",
    slug: "INT.",
    description:
      "Lockers like display cases; students compare notes on who “bloomed” last week. The social machine is visible in every glance.",
    image: "https://picsum.photos/seed/set-fh-hall/900/600",
  },
  {
    id: "bloom-ceremony",
    name: "Bloom Ceremony Stage",
    slug: "INT.",
    description:
      "The midpoint arena — lights, judges, Narcissa’s spotlight. Public bloom as proof of worth.",
    image: "https://picsum.photos/seed/set-bloom/900/600",
  },
  {
    id: "glowing-woods",
    name: "Glowing Woods",
    slug: "EXT.",
    description:
      "Fun and Games — bioluminescent petals, paths that respond to honesty. The world outside the ranking system.",
    image: "https://picsum.photos/seed/set-woods/900/600",
  },
  {
    id: "waterfall",
    name: "The Waterfall",
    slug: "EXT.",
    description:
      "Discovery and return — where presence first awakens, and where Rose transforms. Water as mirror and reset.",
    image: "https://picsum.photos/seed/set-waterfall/900/600",
  },
  {
    id: "goldenrod-office",
    name: "Goldenrod’s Office",
    slug: "INT.",
    description:
      "Order made furniture — charts of bloom metrics, scent profiles. Power dressed as care.",
    image: "https://picsum.photos/seed/set-office/900/600",
  },
  {
    id: "iris-studio",
    name: "Iris — Spin Room",
    slug: "INT.",
    description:
      "Monitors, whisper feeds, rumor maps. Truth bent into shareable shapes.",
    image: "https://picsum.photos/seed/set-iris/900/600",
  },
];
