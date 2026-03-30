export interface LyricLine {
  type: "label" | "line" | "blank";
  text: string;
}

export interface SongLyrics {
  songId: string;
  lines: LyricLine[];
}

const v = (text: string): LyricLine => ({ type: "line", text });
const label = (text: string): LyricLine => ({ type: "label", text });
const blank: LyricLine = { type: "blank", text: "" };

function stubVerse(title: string): LyricLine[] {
  return [
    label(`[${title} — draft]`),
    v("Lyrics to be written."),
    v("Placement and character voices are locked in the song list."),
    blank,
    v("(Style and rhyme scheme with composer — lyrics by Leigh Akin.)"),
  ];
}

export const allLyrics: SongLyrics[] = [
  { songId: "just-fit-in", lines: stubVerse("Just Fit In") },
  { songId: "squeeze-the-day", lines: stubVerse("Squeeze the Day") },
  { songId: "see-it-my-way", lines: stubVerse("See It My Way") },
  { songId: "look-at-me", lines: stubVerse("Look At Me") },
  { songId: "own-the-light", lines: stubVerse("Own the Light") },
  { songId: "red-magic", lines: stubVerse("Red Magic") },
  { songId: "flower-finale", lines: stubVerse("Flower — finale") },
];
