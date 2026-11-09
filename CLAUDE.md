# CLAUDE.md — Academy Running Shoe Finder

Read and follow **`AGENTS.md`** at the repo root. Deep investigation notes: **`reference/agents/AGENTS_SHOE_FINDER.md`**.

## Repo

- Primary code: `shoe-finder.html` (Contentstack-deployed Brooks/Academy running shoe quiz).
- Live: https://www.academy.com/running-shoe-finder
- Contentstack: `utilityPage2` / `blt4306ad926c8b4839`

## Mission

Fix empty and mismatched quiz results. Prefer surgical changes.

**Priority:** (1) Algolia `fetch` instead of broken in-page XHR, (2) treadmill/surface `filterMap` fixes, (3) Regular cushioning + honest fallbacks/empty state, (4) enrich function typo, (5) PIM only if asked.

Do not re-litigate the Sep 2026 diagnosis unless verifying a fix or new evidence appears.
