# AGENTS.md — Homepage Component Build (Template)

Reusable agent instructions for Academy homepage Contentstack components.
Copy this file to the week repo root as `AGENTS.md`, then fill in the
**Week setup** section for that week.

---

## Coding standards

- **Format:** Plain HTML/CSS/JS snippet — no `<html>` / `<body>` tags. Deployed as a Contentstack CMS component.
- **Framework:** Bootstrap 5.1.3 (CSS via CDN already on host page; add the JS bundle only when a component needs it, e.g. accordion/popup).
- **Typography (fluid `clamp`):**
  - Formula: `clamp(floor, Xvw, ceiling)`
  - Desktop Figma width: **1656px** → `vw = (targetPx / 1656) * 100`
  - Mobile Figma width: **375px** → `vw = (targetPx / 375) * 100`
  - Mobile ceiling = desktop ceiling
  - Mobile floor = **8px**

---

## Goal

Build homepage components from provided templates, Figma, and weekly content.

- Match Figma; improvise layout only when needed.
- Produce **one file per audience segment** when that segment has content:
  - `gtm` — Go to Market / default
  - `agf` — Always Game Family
  - `oe` — Outdoor Enthusiasts
  - `sf` — Sporting Families
- Keep all segment files for a component in **one folder** under `components/`.
- Spawn a **separate subagent per component**. Subagents write only their own component file(s).

---

## Week setup

Replace placeholders before starting a week build:

| Placeholder | Example / convention |
|-------------|----------------------|
| `{WEEK}` | `25` |
| `{WEEK_LABEL}` | `Week 25 (7.20-7.26)` |
| `{WK_DIR}` | `reference/wk25/` |
| `{SEGMENT}` | `gtm` (or `agf` / `oe` / `sf`) |

### Required reference paths

- **Figma + reference HTML map:** `{WK_DIR}figma-links-reference-components.txt`
- **Content grid (clickthrough, `data-omni`, alt, aria, copy):** matching `{WEEK_LABEL}` tab in `{WK_DIR}the_grid.xlsx`
- **Title SVGs:** `{WK_DIR}svg/`
- **Image / video assets:** `{WK_DIR}assets.txt` — if multiple assets match a story, use the **most recently modified**
- **Base template:** `reference/components/template.html` (always start from this)
- **Structure / markup reference:** matching finalized file under `reference/components/finalized/` (from the Figma map)

### Grid columns (typical)

| Col | Field |
|-----|--------|
| Story / copy | Card headline, kicker, promo text |
| URL(s) | Clickthrough `href` |
| Alt text | Image `alt` |
| ARIA label | Link `aria-label` |
| data-omni | Analytics attribute |

Confirm column indices against the active week tab before building.

---

## Build recipe (per component)

1. Copy shared head + common `<style>` from `reference/components/template.html`.
2. Clone structure/markup + component `<style>` / `<script>` from the finalized reference.
3. Substitute week content: copy, URL, `data-omni`, alt, aria. Keep `data-pz-seg-name` / `data-pz-seg-id` as `cs_default` unless the brief says otherwise.
4. Swap image/video `src` / `srcset` to week assets (desktop + `-m` mobile when present).
5. Inline title SVG from `{WK_DIR}svg/` when applicable.
6. Apply `clamp()` typography rules. Prefer surgical diffs vs. the reference.
7. Output:

```text
components/<component-folder>/<component-name>-{SEGMENT}.html
```

---

## Plan + progress (multi-component builds)

For a full-week or multi-component segment build, maintain two files at the repo root:

- **Plan (durable):** `wk{WEEK}-{SEGMENT}-plan.md` — scope, per-component mapping (reference template, grid rows, title SVG, assets), and build recipe notes.
- **Progress (living):** `wk{WEEK}-{SEGMENT}-progress.md` — status table + “How to resume”. Update after **each** component finishes so any agent can continue.

### Workflow

1. Coordinating agent reads plan + progress; picks the first non-`done` component.
2. Spawns a subagent for that component only.
3. On completion, marks the component `done` in the progress file.
4. To resume after interruption: read `AGENTS.md` (this file), the plan, and the progress file — then continue from the first non-`done` item.

---

## General working rules

### 1. Think before coding

- Don’t assume. Don’t hide confusion. Surface tradeoffs.
- State assumptions explicitly; ask when uncertain.
- If multiple interpretations exist, present them — don’t pick silently.
- Prefer the simpler approach; push back when warranted.
- If something is unclear, stop, name what’s confusing, and ask.

### 2. Simplicity first

Minimum code that solves the problem. Nothing speculative.

- No features beyond what was asked.
- No abstractions for single-use code.
- No unrequested “flexibility” or configurability.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.
- Ask: “Would a senior engineer say this is overcomplicated?” If yes, simplify.

### 3. Surgical changes

Touch only what you must. Clean up only your own mess.

- Don’t “improve” adjacent code, comments, or formatting.
- Don’t refactor things that aren’t broken.
- Match existing style, even if you’d do it differently.
- Mention unrelated dead code; don’t delete it unless asked.
- Remove imports/variables/functions that **your** changes made unused.
- Every changed line should trace directly to the user’s request.

### 4. Goal-driven execution

Define success criteria. Loop until verified.

- Turn tasks into checks: “Add cards” → “Cards match grid copy, URLs, assets, and render on desktop + mobile.”
- For multi-step work, state a brief plan:

  1. [Step] → verify: [check]
  2. [Step] → verify: [check]
  3. [Step] → verify: [check]
