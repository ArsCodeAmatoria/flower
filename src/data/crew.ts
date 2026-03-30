export interface CrewMember {
  id: string;
  name: string;
  role: string;
  description: string;
  image: string;
}

/** Creative credits — order: primary creator first (used on title & credits hero card). */
export const crew: CrewMember[] = [
  {
    id: "lynne-tapper",
    name: "Lynne Tapper",
    role: "Created by",
    description:
      "Creator of FLOWER — an animated musical about presence, belonging, and the stories we believe about beauty.",
    image: "https://picsum.photos/seed/lynne-tapper/400/400",
  },
  {
    id: "leigh-akin",
    name: "Leigh Akin",
    role: "Co-writer & songwriter",
    description: "Co-writer and songwriter for FLOWER.",
    image: "/characters/leighakin.svg.png",
  },
];
