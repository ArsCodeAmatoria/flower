/** Set stills in `public/sets/` — every board file is listed here. */
export const SET_IMAGE_DIMENSIONS = { width: 1232, height: 928 } as const;

export interface Set {
  id: string;
  name: string;
  slug: "EXT." | "INT." | "EXT./INT.";
  description: string;
  image: string;
}

const NEIGHBOURHOOD =
  "Street-level views around Flower High and the district — façades, routes, and the atmosphere of a world scored by bloom.";
const BIRDSEYE =
  "Overhead read on the neighbourhood — scale, layout, and how the school sits inside the larger bloom.";
const GREATHALL_BASE =
  "The main hall — lockers like display cases, circulation, and the social machine visible in every glance.";
const CLASSROOM =
  "Classroom beat — instruction, side-eye, and the ordinary pressure to perform in ranked light.";
const PATH =
  "Paths beyond the hallways — approach, threshold, and the world outside immediate rank.";

export const sets: Set[] = [
  { id: "neighbourhood", name: "Neighbourhood", slug: "EXT.", description: NEIGHBOURHOOD, image: "/sets/neighbourhood.png" },
  { id: "neighbourhood-1", name: "Neighbourhood — 1", slug: "EXT.", description: NEIGHBOURHOOD, image: "/sets/neighbourhood1.png" },
  { id: "neighbourhood-2", name: "Neighbourhood — 2", slug: "EXT.", description: NEIGHBOURHOOD, image: "/sets/neighbourhood2.png" },
  { id: "neighbourhood-3", name: "Neighbourhood — 3", slug: "EXT.", description: NEIGHBOURHOOD, image: "/sets/neighbourhood3.png" },
  { id: "neighbourhood-4", name: "Neighbourhood — 4", slug: "EXT.", description: NEIGHBOURHOOD, image: "/sets/neighbourhood4.png" },
  { id: "neighbourhood-5", name: "Neighbourhood — 5", slug: "EXT.", description: NEIGHBOURHOOD, image: "/sets/neighbourhood5.png" },
  { id: "neighbourhood-6", name: "Neighbourhood — 6", slug: "EXT.", description: NEIGHBOURHOOD, image: "/sets/neighbourhood6.png" },
  {
    id: "birdseyeneighbourhood",
    name: "Bird's eye — Neighbourhood",
    slug: "EXT.",
    description: BIRDSEYE,
    image: "/sets/birdseyeneighbourhood.png",
  },
  {
    id: "birdseyeneighbourhood-1",
    name: "Bird's eye — Neighbourhood — 1",
    slug: "EXT.",
    description: BIRDSEYE,
    image: "/sets/birdseyeneighbourhood.1.png",
  },
  {
    id: "birdseyeneighbourhood-2",
    name: "Bird's eye — Neighbourhood — 2",
    slug: "EXT.",
    description: BIRDSEYE,
    image: "/sets/birdseyeneighbourhood.2.png",
  },
  {
    id: "birdseyeneighbourhood-3",
    name: "Bird's eye — Neighbourhood — 3",
    slug: "EXT.",
    description: BIRDSEYE,
    image: "/sets/birdseyeneighbourhood.3.png",
  },
  {
    id: "birdseyeneighbourhood-4",
    name: "Bird's eye — Neighbourhood — 4",
    slug: "EXT.",
    description: BIRDSEYE,
    image: "/sets/birdseyeneighbourhood.4.png",
  },
  {
    id: "birdseyeneighbourhood-5",
    name: "Bird's eye — Neighbourhood — 5",
    slug: "EXT.",
    description: BIRDSEYE,
    image: "/sets/birdseyeneighbourhood.5.png",
  },
  { id: "greathall", name: "Great hall", slug: "INT.", description: GREATHALL_BASE, image: "/sets/greathall.png" },
  { id: "greathall-1", name: "Great hall — 1", slug: "INT.", description: GREATHALL_BASE, image: "/sets/greathall1.png" },
  { id: "greathall-2", name: "Great hall — 2", slug: "INT.", description: GREATHALL_BASE, image: "/sets/greathall2.png" },
  { id: "classroom", name: "Classroom", slug: "INT.", description: CLASSROOM, image: "/sets/classroom.png" },
  { id: "classroom-1", name: "Classroom — 1", slug: "INT.", description: CLASSROOM, image: "/sets/classroom1.png" },
  { id: "classroom-2", name: "Classroom — 2", slug: "INT.", description: CLASSROOM, image: "/sets/classroom2.png" },
  { id: "classroom-3", name: "Classroom — 3", slug: "INT.", description: CLASSROOM, image: "/sets/classroom3.png" },
  { id: "classroom-4", name: "Classroom — 4", slug: "INT.", description: CLASSROOM, image: "/sets/classroom4.png" },
  { id: "classroom-5", name: "Classroom — 5", slug: "INT.", description: CLASSROOM, image: "/sets/classroom5.png" },
  { id: "classroom-6", name: "Classroom — 6", slug: "INT.", description: CLASSROOM, image: "/sets/classroom6.png" },
  { id: "classroom-7", name: "Classroom — 7", slug: "INT.", description: CLASSROOM, image: "/sets/classroom7.png" },
  { id: "classroom-8", name: "Classroom — 8", slug: "INT.", description: CLASSROOM, image: "/sets/classroom8.png" },
  { id: "classroom-9", name: "Classroom — 9", slug: "INT.", description: CLASSROOM, image: "/sets/classroom9.png" },
  { id: "classroom-10", name: "Classroom — 10", slug: "INT.", description: CLASSROOM, image: "/sets/classroom10.png" },
  { id: "classroom-11", name: "Classroom — 11", slug: "INT.", description: CLASSROOM, image: "/sets/classroom11.png" },
  {
    id: "scienceclass",
    name: "Science classroom",
    slug: "INT.",
    description: "Lab energy — glass, charts, and the promise that bloom can be measured and compared.",
    image: "/sets/scienceclass.png",
  },
  {
    id: "scienceclass-2",
    name: "Science classroom — 2",
    slug: "INT.",
    description: "Alternate pass in the science wing — procedure, light, and quiet competition.",
    image: "/sets/scienceclass2.png",
  },
  {
    id: "library",
    name: "Library",
    slug: "INT.",
    description: "Stacks and quiet — where stories are borrowed and narratives about who ‘belongs’ harden into habit.",
    image: "/sets/library.png",
  },
  {
    id: "bloomfestival",
    name: "Bloom festival",
    slug: "INT.",
    description: "Public bloom as spectacle — lights, crowd, and the score made visible under ceremony.",
    image: "/sets/bloomfestival.png",
  },
  {
    id: "goldenrodmansion",
    name: "Goldenrod mansion",
    slug: "INT.",
    description: "Power dressed as care — order, upholstery, and metrics that read as concern from above.",
    image: "/sets/goldenrodmansion.png",
  },
  {
    id: "kingdom",
    name: "Kingdom vista",
    slug: "EXT.",
    description: "A wider-world glimpse — realm, rule, and the scale of the story beyond the school fence.",
    image: "/sets/kingdom.png",
  },
  { id: "path", name: "Path", slug: "EXT.", description: PATH, image: "/sets/path.png" },
  { id: "path-1", name: "Path — 1", slug: "EXT.", description: PATH, image: "/sets/path1.png" },
  { id: "path-2", name: "Path — 2", slug: "EXT.", description: PATH, image: "/sets/path2.png" },
  { id: "path-3", name: "Path — 3", slug: "EXT.", description: PATH, image: "/sets/path3.png" },
  {
    id: "rosehome",
    name: "Rose's home",
    slug: "INT.",
    description: "Private life before and beside performance — the rooms where scentless doesn’t need an audience.",
    image: "/sets/rosehome.png",
  },
  {
    id: "stream",
    name: "Stream",
    slug: "EXT.",
    description: "Moving water and still choices — smaller scale than the falls, same invitation to drop the mask.",
    image: "/sets/stream.png",
  },
  {
    id: "waterfallday",
    name: "Waterfall — day",
    slug: "EXT.",
    description: "Discovery and return in daylight — mist, clarity, and the loud quiet of transformation.",
    image: "/sets/waterfallday.png",
  },
  {
    id: "waterfallnight",
    name: "Waterfall — night",
    slug: "EXT.",
    description: "The same threshold under stars — intimacy with the lie stripped to skin and sound.",
    image: "/sets/waterfallnight.png",
  },
];
