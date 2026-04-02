export interface Song {
  id: string;
  title: string;
  singers: string;
  description: string;
  image: string;
  audioSrc: string;
  writtenBy?: string;
  placement?: string;
  styleNotes?: string;
}

export const songs: Song[] = [
  {
    id: "just-fit-in",
    title: "Just Fit In",
    singers: "Daisy",
    description:
      "Daisy teaches survival through conformity—the polite pressure to bloom the way the hall expects.",
    placement: "Early Act One — conformity pedagogy",
    styleNotes: "Bright, instructional, slightly claustrophobic.",
    image: "/characters/daisy1.png",
    writtenBy: "Leigh Akin",
    audioSrc: "/songs/JUST FIT IN.wav",
  },
  {
    id: "squeeze-the-day",
    title: "Squeeze the Day",
    singers: "Lemon",
    description:
      "Introduces Lemon; reframes Rose’s identity away from scent and toward choice and presence.",
    placement: "Act One turn — Lemon arrives",
    styleNotes: "Playful, rhythmic, sun-in-the-halls energy.",
    image: "/characters/lemon.png",
    writtenBy: "Leigh Akin",
    audioSrc: "/songs/SQUEEZE THE DAY (1).wav",
  },
  {
    id: "see-it-my-way",
    title: "See It My Way",
    singers: "Rose & Lemon",
    description:
      "Waterfall sequence — discovery, duet, emotional opening; two ways of seeing become one.",
    placement: "Act Two A — waterfall",
    styleNotes: "Intimate then expansive; water and light in the arrangement.",
    image: "/characters/rose.png",
    writtenBy: "Leigh Akin",
    audioSrc: "/songs/SEE IT MY WAY (1).wav",
  },
  {
    id: "look-at-me",
    title: "Look At Me",
    singers: "Narcissa",
    description:
      "Bloom Ceremony peak — perfection as performance, the false victory of public bloom.",
    placement: "Midpoint — ceremony",
    styleNotes: "Spotlight pop; precision choreo; hollow gold in the harmony.",
    image: "/characters/narcicissa.png",
    writtenBy: "Leigh Akin",
    audioSrc: "/songs/LOOK AT ME.wav",
  },
  {
    id: "own-the-light",
    title: "Own the Light",
    singers: "Goldenrod & Iris",
    description:
      "Villain ideology duet — control versus truth; beauty as property and narrative as weapon.",
    placement: "Act Two B — antagonist thesis",
    styleNotes: "Sleek, menacing harmony; two voices finishing each other’s threats.",
    image: "/characters/goldenrod.png",
    writtenBy: "Leigh Akin",
    audioSrc: "/songs/OWN THE LIGHT.wav",
  },
  {
    id: "red-magic",
    title: "Red Magic",
    singers: "Rose",
    description:
      "Waterfall return — transformation; Rose claims herself. Solo turn before the finale ensemble.",
    placement: "Break Into Three — solo transformation",
    styleNotes: "Stripped then surging; one voice before the school awakens.",
    image: "/characters/rose.png",
    writtenBy: "Leigh Akin",
    audioSrc: "/songs/RED MAGIC.wav",
  },
  {
    id: "flower",
    title: "Flower",
    singers: "Ensemble",
    description:
      "Finale / curtain — company awakening; motifs return as the school and Rose choose truth over performance.",
    placement: "End credits roll",
    styleNotes: "Full lift; emotional close before the lights come up.",
    image: "/characters/rose.png",
    writtenBy: "Leigh Akin",
    audioSrc: "/songs/Flower (3).wav",
  },
  {
    id: "flower-finale",
    title: "Flower (finale ensemble)",
    singers: "Ensemble",
    description:
      "Climax — Rose restores Lemon; awakening ripples through the school and world.",
    placement: "Finale — chain reaction",
    styleNotes: "Full company; motifs from earlier numbers reconciled.",
    image: "/characters/rose.png",
    writtenBy: "Leigh Akin",
    audioSrc: "/songs/FLOWER POWER.wav",
  },
];
