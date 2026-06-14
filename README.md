# ☭ IS635 StudyComrade

A dark-themed, interactive study companion for **SMU IS635 — Low Code Application Development** (OutSystems).

**Live site:** [chuatzeyee.github.io/IS635](https://chuatzeyee.github.io/IS635/)

## What's Inside

| Section | Count | Description |
|---------|-------|-------------|
| **Topics** | 70 topics across 8 sessions | Key concepts with expandable sections and session-colored borders |
| **Definitions** | 81 terms | Searchable glossary with highlighted matches |
| **Guides** | 21 guides | Step-by-step how-to walkthroughs for common OutSystems tasks |
| **Practice** | 297 questions | Multiple-choice quiz with progress bar, accuracy tracking, and streak counter |
| **Build Guide** | 8 phases, 40+ sections | Comprehensive CareConnect backend build reference for OutSystems novices (includes OpenAI wrapper, consumer guide, and Product & Party UI integration) |

## Sessions Covered

1. Introduction to LCAP
2. Architecture Best Practices
3. Data Layer
4. Logic Layer
5. Interface Layer
6. Processes Layer
8. Exploring Forge
10. Advanced Topics (Multitenancy & Concurrency)

## Tech Stack

- **React 19** + **TypeScript 6**
- **Vite 8** (build + dev server)
- **Tailwind CSS 4** with custom design tokens
- **Outfit** + **JetBrains Mono** fonts
- Deployed to **GitHub Pages** via `gh-pages`

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:5173/IS635/](http://localhost:5173/IS635/)

## Build & Deploy

```bash
npm run build
npx gh-pages -d dist
```

## Design

Vintage terminal aesthetic — dark grey surfaces with green accent. Floating bottom pill navigation, staggered fade-in animations, animated expand/collapse panels, and search highlighting.

Design tokens are defined in `src/index.css` under `@theme`. Full design system documentation lives in `.interface-design/system.md`.
