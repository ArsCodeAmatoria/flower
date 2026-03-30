# FLOWER

**An animated musical feature** about presence, belonging, and the stories we believe about beauty.

> *To flower is to become.*

---

## Logline

On her first day at a beauty-obsessed high school, a scentless teen discovers she can awaken the hidden light in others—but when a manipulator twists the truth and turns her against the one person who believed in her, she must reclaim that truth to restore a fading world.

**Core idea:** Rose doesn’t bloom—she helps the world remember how.

## Creative team

| | |
| --- | --- |
| **Created by** | Lynne Tapper |
| **Co-written by** | Leigh Akin |
| **Original songs by** | Leigh Akin |

## World

FLOWER is set at **Flower High**, where flowers stand for identity, scent for status, and beauty is scored and performed. Rose’s ability is **Presence**—not fragrance and not decoration, but emotional awakening: she reveals the light already in people when lies and rank get louder than truth.

## This repository

This repo is the **interactive project site**: a horizontal “slide” experience for the film’s bible—about the story, characters, script workspace, lyrics, and synced end credits—built with **Next.js** and **React**.

Sections include:

- **Title** — hero and featured song player  
- **About** — theme, world, structure, craft references (Save the Cat, McKee-style checks)  
- **Characters** — dossiers and arcs  
- **Script** — draft workspace with metadata and writing-rule sidebars  
- **Lyrics** — songs tied to cast  
- **Credits** — film-style title cards timed to *Red Magic*

## Local development

Requirements: **Node.js 20+** (recommended).

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Production build:

```bash
npm run build
npm start
```

### Other scripts

- `npm run lint` — ESLint  
- `npm run script-index` — script indexing helper (`scripts/script-index.js`)

## Tech stack

- [Next.js](https://nextjs.org) (App Router)  
- React 19 · TypeScript · Tailwind CSS v4  
- Fonts: display and screenplay faces via `next/font` (Google Fonts)

## Rights

Story, characters, songs, and *FLOWER* branding are proprietary to their creators. This codebase is for development and presentation of the project; it is not a license to use the IP separately from the team.

---

*FLOWER — animated musical (in development).*
