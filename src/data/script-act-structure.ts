/** Act / scene navigation indices for Draft 1 (metadata sidebar) — update if beat count changes */

type ActSection = { label: string; start: number; end: number };

export const SCRIPT_ACT_NAV: Array<{
  label: string;
  start: number;
  end: number;
  sections?: ActSection[];
}> = [
  {
    label: "ACT I",
    start: 0,
    end: 34,
    sections: [
      { label: "Opening", start: 0, end: 7 },
      { label: "The Gang Meeting", start: 8, end: 11 },
      { label: "Heists & Delivery", start: 12, end: 16 },
      { label: "Kane & the Poster", start: 17, end: 23 },
      { label: "Rowboat & Uptown", start: 24, end: 27 },
      { label: "Donut, Victor", start: 28, end: 31 },
      { label: "Sea Can, Sabine, Upstream", start: 32, end: 34 },
    ],
  },
  {
    label: "ACT IIa",
    start: 35,
    end: 45,
    sections: [
      { label: "Trio Wake & Coffee", start: 35, end: 37 },
      { label: "Victor & Market", start: 38, end: 41 },
      { label: "Town Hall & Stage", start: 42, end: 45 },
    ],
  },
  {
    label: "ACT IIb",
    start: 46,
    end: 59,
    sections: [
      { label: "Councilor & Ban", start: 46, end: 48 },
      { label: "Downriver & Marsh", start: 49, end: 50 },
      { label: "Polaroid & Rope", start: 51, end: 55 },
      { label: "Porcelain & Hotel", start: 56, end: 58 },
      { label: "Chaos", start: 59, end: 59 },
    ],
  },
  {
    label: "ACT III",
    start: 60,
    end: 69,
    sections: [
      { label: "Victor Takes Marcus", start: 60, end: 60 },
      { label: "Bus & Old Lady", start: 61, end: 61 },
      { label: "MU Building & Elevator", start: 62, end: 63 },
      { label: "Penthouse & Secretary", start: 64, end: 65 },
      { label: "Square & Car", start: 66, end: 67 },
      { label: "Stars & THE END", start: 68, end: 69 },
    ],
  },
];
