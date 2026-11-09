# AGENTS_SHOE_FINDER.md — Investigation & fix context

Context captured from production debugging of the Academy Running Shoe Finder (Sep 2026).  
Use with root `AGENTS.md`. Source widget: `../../shoe-finder.html` (repo root).

---

## Background

Shoppers report:

1. Quiz results are **empty most of the time**.
2. When products do appear, they often **don’t match** the answers.

Reproduced on https://www.academy.com/running-shoe-finder against the Contentstack `utilityPage2` entry that embeds this HTML/JS.

---

## How the widget works

1. Steps: intro → surface → cushioning → pronation → stability → audience/size → results.
2. `runAlgoliaSearch` → `searchWithFallbacks` → inventory index search with a filters string.
3. Optional enrich from products index for long description / feature benefits.
4. UI empty state: **“No in-stock shoes found for those answers.”**

### Algolia config (in widget)

```js
appId: "EKMP1KFS6W"
index: "prodlive-skus-data-inventoryaware-newarrival"
productsIndex: "prodlive-products-data"
```

### Filter dimensions (AND)

Gender, `facet_Activity:"Running"`, surface, cushioning, stability, pronation, optional size, inventory (`getInventoryFilterV2`), `facet_Product Type:"Shoes"`.

### `searchWithFallbacks`

If `hits.length < minHits` (5), clears answers in this order only:

1. `pronation`
2. `stability`
3. `cushioning`
4. `surface`

**Never drops `size` or `audience`.** Removed labels are collected in `meta.removedFilters` but not clearly shown to the shopper in the results UI.

---

## Findings

### 1. In-page XHR / Algolia client failure (primary empty-results cause)

- Algolia lite loads from jsDelivr and uses **XMLHttpRequest** in the browser.
- On the live Academy page, search throws:

  `InvalidStateError: Failed to execute 'setRequestHeader' on 'XMLHttpRequest': The object's state must be OPENED.`

- Stack implicated Clarip `donotsell-block`, Dynatrace, Quantum Metric wrapping XHR.
- Widget catch returns `{ hits: [], nbHits: 0 }` → empty UI.
- Same index/query works outside the page; the **in-page XHR path** is broken.

**Fix:** Use `window.fetch` (custom Algolia requester or direct REST POST). Re-test with Clarip/Dynatrace/QM present. Optionally allowlist Algolia hosts in Clarip.

### 2. Strict AND + sparse inventory

Sweep of gender × surface × cushion × pronation × stability combos against the live index: ~**71% zero hits**, ~**19% under 5 hits** (trigger fallback), ~**9% ≥5 exact matches**. Underpronation and Max-Support are especially thin.

### 3. Silent fallback → “wrong” products

When fallbacks fire, shoppers still see “best fit” copy without being told filters were dropped.

### 4. Treadmill mapping bug

- Option: `{ label: "Treadmill (Gym)", value: "treadmill" }`
- `filterMap.surface` keys: `road`, `trail`, `gym` only
- `addGroupFromMap("surface", "treadmill")` → no defs → **no surface filter**

Treadmill is a valid running surface; the bug is the key mismatch, not that the option exists.

### 5. Incomplete surface catalog mapping

Live Algolia has values not in the map (examples): `Hard, paved`, `Road/Track`, `Gym, Track`, `Multi`, `On- and Off-Road`, `Road, Trail, Indoors`. Map also references rare/nonexistent synonyms. Map every live `facet_Surface Type` into Road / Trail / Gym (treadmill → gym). One catalog value may belong to multiple buckets.

### 6. Regular cushioning

Catalog facet includes `Regular`. Quiz “regular” uses negation of Extra/Maximum, so Low / Yes / untagged can slip through. Prefer `"facet_Cushioning":"Regular"`.

### 7. PIM / naming mismatch

Example observed: a “Max”-named shoe tagged `facet_Cushioning: "Regular"`. Shopper picks Maximum → product excluded. Separate from search bugs; needs merch/PIM alignment or fewer rare quiz options.

### 8. Secondary JS bug

`enrichHitsWithLongDescription` is called but undefined; real function is `enrichHitsWithLongDescriptionAndBenefits`. Caught and logged; does not alone empty the grid.

### 9. Misleading empty copy

Same message for failed search and true zero inventory.

---

## Effort (ballpark)

| Work | Estimate |
|------|----------|
| Fetch transport + empty-state accuracy + enrich typo | 2–4 hrs |
| Treadmill + full surface map | 4–8 hrs |
| Regular cushioning + fallback disclosure | 4–8 hrs |
| Eng “must ship” (above) | **1–2 days** |
| PIM cleanup (merch-owned) | **1–3 days** calendar |

---

## Suggested verify checklist

- [ ] Prod quiz completes; Algolia network request 200; hits or distinct error state
- [ ] Trail / Extra / Over / Max-Support path: either honest empty or disclosed fallback—not unexplained empty from XHR
- [ ] Treadmill applies gym surface group
- [ ] Regular → `facet_Cushioning:"Regular"`
- [ ] No undefined enrich function calls
- [ ] Optional: audit Algolia facet dump for unmapped surface values

---

## Related links

- Live: https://www.academy.com/running-shoe-finder
- Contentstack edit: https://app.contentstack.com/#!/stack/blt964243cdd7810dea/content-type/utilityPage2/en-us/entry/blt4306ad926c8b4839/edit
- Debug globals: `window.__ShoeFinderState`, `window.__brooksShoeFinderInitialized`
