# IS635 Cheat Sheet — Design System

## Direction
Dark developer-tool aesthetic. Terminal energy — electric cyan accent on deep navy surfaces. Feels like a polished internal tool, not a textbook.

## Intent
SMU student studying low-code app dev. Scanning topics, quizzing themselves, looking up definitions. Should feel efficient, focused, slightly cool.

## Depth Strategy
Borders-only. No shadows. Low-opacity rgba borders that disappear when you're not looking.

## Surface Elevation (5 levels)
| Token     | Hex       | Use                        |
|-----------|-----------|----------------------------|
| `void`    | `#0a0e17` | Page background            |
| `base`    | `#0f1520` | Sidebar, major containers  |
| `surface` | `#151d2c` | Cards, panels              |
| `raised`  | `#1a2435` | Hover states, inputs       |
| `overlay` | `#1f2b3e` | Dropdowns, modals          |

## Text Hierarchy (4 levels)
| Token          | Hex       | Use                    |
|----------------|-----------|------------------------|
| `ink`          | `#e2e8f0` | Primary text           |
| `ink-secondary`| `#94a3b8` | Supporting text        |
| `ink-muted`    | `#64748b` | Metadata, placeholders |
| `ink-faint`    | `#475569` | Disabled, counters     |

## Borders (2 levels)
| Token        | Hex       | Use                    |
|--------------|-----------|------------------------|
| `edge`       | `#1e2a3d` | Standard separation    |
| `edge-bright`| `#2a3a52` | Emphasis, hover        |

## Accent
| Token        | Hex       | Use                    |
|--------------|-----------|------------------------|
| `glow`       | `#38bdf8` | Active states, links   |
| `glow-dim`   | `#0c4a6e` | Active backgrounds     |
| `glow-hover` | `#7dd3fc` | Hover on accent        |

## Semantic
| Token         | Hex       | Use                  |
|---------------|-----------|----------------------|
| `correct`     | `#34d399` | Correct answer       |
| `correct-dim` | `#064e3b` | Correct background   |
| `wrong`       | `#fb7185` | Wrong answer         |
| `wrong-dim`   | `#4c0519` | Wrong background     |

## Session Colors
| Token | Hex       | Session                |
|-------|-----------|------------------------|
| `s1`  | `#38bdf8` | Session 1 (cyan)       |
| `s2`  | `#a78bfa` | Session 2 (purple)     |
| `s3`  | `#34d399` | Session 3 (green)      |
| `s4`  | `#fbbf24` | Session 4 (amber)      |
| `s5`  | `#fb923c` | Session 5 (orange)     |

## Typography
- Headings: system sans-serif, `tracking-tight`, bold
- Body: system sans-serif, regular weight
- Data/counts: `font-mono` for numbers, labels, term names
- Definition terms: `font-mono` + `text-glow` for terminal-variable feel

## Spacing
- Base unit: 4px (Tailwind default)
- Cards: `p-5` or `p-6`
- Sections: `space-y-3` between cards
- Page padding: `px-6 py-10`

## Patterns

### Sidebar
- Same background as content (`base`) with `border-r border-edge`
- Active item: `bg-glow-dim text-glow border border-glow/20`
- Inactive: `text-ink-secondary hover:bg-raised hover:text-ink`

### Cards
- `bg-surface border border-edge rounded-lg`
- Hover: `hover:border-edge-bright` or `hover:bg-raised`
- Collapsible header: `hover:bg-raised` with chevron icon

### Session Tab Dividers
- Left border color-coded per session: `border-l-2 border-l-s{n}`

### Inputs
- `bg-raised border border-edge` (darker than card surface = inset)
- Focus: `focus:ring-1 focus:ring-glow/50 focus:border-glow/50`

### Filter Tabs
- Active: `bg-glow-dim text-glow border border-glow/30`
- Inactive: `bg-surface text-ink-secondary border border-edge`

### Quiz Options
- Default: `border border-edge text-ink-secondary hover:border-glow/30`
- Selected: `border border-glow/50 bg-glow-dim text-glow`
- Correct: `border border-correct/50 bg-correct-dim text-correct`
- Wrong: `border border-wrong/50 bg-wrong-dim text-wrong`
- Dimmed: `border border-edge/50 text-ink-faint`

### Scroll-to-top
- `bg-glow-dim text-glow border border-glow/30 rounded-full`

### Scrollbar
- Thin (6px), dark track, `edge-bright` thumb
