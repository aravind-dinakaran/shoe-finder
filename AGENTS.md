# AGENTS.md — Academy Running Shoe Finder

Primary working file: `shoe-finder.html`  
Live page: https://www.academy.com/running-shoe-finder  
Contentstack: `utilityPage2` entry `blt4306ad926c8b4839`  
Stack: `blt964243cdd7810dea`

Deployed as an embedded Contentstack HTML/JS widget (`#brooks-shoe-finder`). Prefer surgical edits. Full investigation notes: `reference/agents/AGENTS_SHOE_FINDER.md`.

---

## Goal

Fix empty / mismatched quiz results. Highest-impact work first.

### Priority order

1. Make Algolia search succeed in the browser (`fetch` instead of default XHR).
2. Fix answer → facet mapping (especially `treadmill` → gym / surface map).
3. Fix Regular cushioning filter + empty-state / fallback honesty.
4. Clean secondary bugs (`enrichHitsWithLongDescription` typo).
5. PIM / merch follow-ups are out of band unless asked.

---

## Architecture (short)

- Quiz answers live in `window.__ShoeFinderState.answers`.
- Results come from Algolia index `prodlive-skus-data-inventoryaware-newarrival` (SKU / inventory), then enrich from `prodlive-products-data`.
- Filters are built by `buildAlgoliaFiltersStringFromState` using `filterMap`.
- If hits &lt; 5, `searchWithFallbacks` drops filters in order: **pronation → stability → cushioning → surface**. It does **not** drop size or gender.
- Algolia app: `EKMP1KFS6W` (search-only key already in widget).

---

## Known bugs (do not re-diagnose from scratch)

| ID | Issue | Why it matters |
|----|--------|----------------|
| A | Algolia lite uses XHR; on prod, XHR often fails (`setRequestHeader` / OPENED) under Clarip / Dynatrace / Quantum Metric | Empty results most of the time |
| B | `searchWithFallbacks` silently relaxes filters | Results feel unrelated to answers |
| C | UI value `treadmill` but `filterMap.surface` key is `gym` | Treadmill adds no surface filter |
| D | Surface map incomplete vs live Algolia facet values | Many shoes never match Road/Trail/Gym |
| E | “Regular” cushioning uses `NOT Extra AND NOT Maximum` instead of `Regular` | Wrong / loose cushion matches |
| F | Calls missing `enrichHitsWithLongDescription` (real fn is `…AndBenefits`) | Console noise; cleanup |
| G | Empty copy says “no in-stock shoes” even when search never ran | Misleading |
| H | Sparse PIM: Underpronation / Max-Support barely exist; name↔facet mismatches (e.g. “Max” shoe tagged Regular) | Empty or odd paths |

---

## Coding standards

- Format: plain HTML/CSS/JS snippet suitable for Contentstack (this file already includes the widget markup + script).
- Match existing style; no drive-by refactors.
- Prefer `fetch` for Algolia over XHR when changing transport.
- After mapping changes, verify against live Algolia facet values for `facet_Surface Type`, `facet_Cushioning`, `facet_Pronation`, `facet_Stability`.
- Do not publish/unpublish Contentstack unless the user asks.

---

## Verify

1. On prod (or with third-party scripts loaded): complete quiz → network shows successful Algolia query; results or honest empty/error.
2. Treadmill path applies a surface filter (gym bucket).
3. Regular cushioning filters `facet_Cushioning:"Regular"`.
4. Fallback path either discloses relaxed filters or no longer silently misleads.
5. No call to undefined `enrichHitsWithLongDescription`.
