# Running Shoe Finder: considerations, mappings, and open issues

Last updated Sep 29, 2026. Covers `shoe-finder.html` (the Contentstack widget at https://www.academy.com/running-shoe-finder).

Related: `AGENTS.md` (agent instructions), `reference/agents/CLARIP_DNSS_BLOCKING.md` (why opted-out shoppers get no results), `reference/agents/AGENTS_SHOE_FINDER.md` (original investigation).

All counts below come from live Algolia queries on Sep 28–29, 2026, and will drift as inventory changes.

---

## 1. How the widget finds shoes

1. The shopper answers five questions: surface, cushioning, pronation, stability, and audience with size. Answers live in `window.__ShoeFinderState.answers`.
2. `buildAlgoliaFiltersStringFromState` turns the answers into an Algolia filter string using `filterMap`.
3. `searchWithFallbacks` queries Algolia. If fewer than 5 shoes match, it drops answers one at a time (pronation, then stability, then cushioning, then surface) and tries again. It never drops size or gender.
4. `enrichHitsWithLongDescriptionAndBenefits` adds descriptions and feature bullets from a second index.
5. The results page shows the matches, the shopper's filters as removable chips, and a match count.

### Algolia indexes

| Index | Used for |
|---|---|
| `prodlive-skus-data-inventoryaware-newarrival` | The search itself. One record per size (SKU); `parentPartNumber` is the product. Results are grouped so each product appears once. |
| `prodlive-products-data` | Descriptions and feature bullets only. Doesn't affect matching or stock. |

App ID `EKMP1KFS6W`, search-only key in the widget. Requests go to `https://ekmp1kfs6w-dsn.algolia.net` via `fetch`.

Because size and stock are on the same record, a "Men's 10" match means the Men's 10 itself is in stock, not just some size of that shoe.

---

## 2. Answer-to-filter mappings

Every filter is an exact string match on a `facet_*` attribute. Values inside one answer are OR'd; different answers are AND'd. Every search also requires `facet_Activity:"Running"` and `"facet_Product Type":"Shoes"`.

### Surface (`facet_Surface Type`)

- **Road** uses the `road` list.
- **Trail** uses the `trail` list.
- **Treadmill (Gym)** is stored as `treadmill` and converted to the `gym` list in the filter builder.
- **No Preference** (`any`) adds no surface filter.

Live values and which answers they match. "In-stock records" counts in-stock sizes of running shoes, not products.

| Algolia value | Road | Trail | Treadmill | In-stock records |
|---|:-:|:-:|:-:|--:|
| Road | ✓ | | ✓ | 1,984 |
| Trail | | ✓ | | 237 |
| Multi | ✓ | ✓ | ✓ | 23 |
| Road/Track | ✓ | | ✓ | 16 |
| Off-road, All-terrain, Trail | | ✓ | | 14 |
| Road, Trail, Indoors | ✓ | ✓ | ✓ | 9 |
| Gym, Track | | | ✓ | 3 |
| Hard, paved | ✓ | | ✓ | 2 |
| Track | ✓ | | ✓ | 1 |
| Road and Trail | ✓ | ✓ | | 0 |
| Road, Trail | ✓ | ✓ | | 0 |
| On- and Off-Road | ✓ | ✓ | | 0 |
| Multiple | ✓ | ✓ | ✓ | 0 |
| Multi-surface | ✓ | ✓ | ✓ | 0 |
| Various surfaces | ✓ | ✓ | ✓ | 0 |
| Indoor/Outdoor | ✓ | | ✓ | 0 |
| Street | ✓ | | ✓ | 0 |
| Firm Ground | | ✓ | | 0 |
| Off-road, Wet and Dry | | ✓ | | 0 |
| Rough surfaces | | ✓ | | 0 |

The pattern behind the lists:

- **Road** covers anything paved or hard, plus multi-surface values.
- **Trail** covers anything off-road, plus multi-surface values.
- **Treadmill** is the Road list minus values that mention trail explicitly, plus `Gym, Track`. Because very few shoes are tagged `Gym, Track`, Treadmill results are mostly road shoes. That's by design, not the fallback relaxing filters.

Entries in the lists that match nothing in today's catalog: `Court`, `Training`, `All-surface`, `Most surfaces`, `Trail / All-terrain`, `All-Terrain`, `Trail, Outdoor`, `Tough terrain`. They're harmless but would start matching if those values ever appear. `Court` (a tennis surface) under Road and Treadmill is probably a leftover.

### Cushioning (`facet_Cushioning`)

| Answer | Filter |
|---|---|
| Regular | `NOT Extra AND NOT Maximum AND NOT Low`. Includes shoes tagged `Regular`, `Yes`, or with no cushioning value. |
| Extra | `Extra` |
| Maximum | `Maximum` |
| No Preference | no filter |

In-stock records by value: Regular 2,666 · Extra 1,321 · Maximum 724 · Low 11 · Yes 10.

Regular is negated on purpose so shoes with no cushioning value still count. An exact `"Regular"` match gave 66 in-stock products; the negated rule gives 241.

### Pronation (`facet_Pronation`)

| Answer (quiz label) | Filter |
|---|---|
| over ("My Feet Point Outward") | `Overpronation` |
| normal ("My Feet Stay Parallel") | `Normal Pronation OR Neutral OR Mid` |
| under ("My Feet Point Inward") | `Underpronation` |

In-stock records by value: Normal Pronation 4,048 · Overpronation 174 · Underpronation 90 · Neutral 49 · Mid 10.

### Stability (`facet_Stability`)

| Answer | Filter |
|---|---|
| Neutral | `Neutral` |
| Support | `Support` |
| Max-Support | `Max-Support` |

In-stock records by value: Neutral 3,959 · Support 602 · Max-Support 12.

### Gender (`facet_Gender`) and size

| Answer | Filter |
|---|---|
| Men's | `Men's OR Unisex OR "Men's , Women's" OR Adults'` |
| Women's | `Women's OR Unisex OR "Men's , Women's"` |
| No Preference | no gender or size filter |

Live gender values are `Men's`, `Women's`, `Boys'`, `Girls'`, and one `Unisex`. `"Men's , Women's"` and `Adults'` don't exist in the catalog today.

Sizes use `facet_mensShoeSize` or `facet_womensShoeSize`, OR'd, up to 3 sizes. No sizes are applied when audience is No Preference.

---

## 3. What counts as "in stock"

`getInventoryFilterV2` first looks for store IDs in:

- `localStorage` key `aso_WC_StLocId_Selected`: the shopper's selected store. Used for pickup and ship-to-store.
- Cookie `nbmsids`: nearby stores. Used for pickup and ship-to-store.
- Cookie `sddStoreId`: the same-day-delivery store. Used for pickup only.

Cookies are read with `document.cookie`, so HttpOnly cookies are invisible to the widget. Every run of digits in a value is treated as a store ID.

**No store IDs found:** a size is in stock when `sth_oos:0`.

**Any store IDs found:** a size is in stock when any of these is true:

```
sth_oos:0 OR lsi_oos:0 OR stsfs_oos:0
OR inventory_pick:<store id> ... OR inventory_sts:<store id> ...
```

Field meanings are inferred from names and not confirmed:

- `sth_oos`: ship to home, out of stock
- `lsi_oos`: probably in stock at any store
- `stsfs_oos`: probably ship-to-store
- `inventory_pick`: stores with pickup stock
- `inventory_sts`: stores that can receive ship-to-store

Running-shoe products matching each flag:

| Filter | Products |
|---|--:|
| No stock filter | 692 |
| `sth_oos:0` | 329 |
| `lsi_oos:0` | 623 |
| `stsfs_oos:0` | 1 |

**Concern:** `lsi_oos:0` alone matches 623 of 692 products and doesn't depend on the shopper's store. So for anyone with a saved store, "in stock" effectively means "stocked at some Academy store somewhere," and the store-specific checks add almost nothing. See open issue O3.

---

## 4. Results page behavior

- **Filter chips.** Each answered filter shows as a chip, for example "Surface: Road" or "Size 10". Clicking × drops that filter and reruns the search.
  - Surface and cushioning go to No Preference.
  - Pronation and stability are cleared; there's no No Preference option for them, so the shopper must re-pick if they go back through those steps.
  - Removing Men's or Women's also removes sizes, since sizes are gender-specific.
- **Relaxed filters.** If the fallback dropped answers, their chips are grey with "(not applied)", and a note explains which preferences were loosened.
- **Match count.** Shows "N shoes match your filters." When more than 24 match: "N shoes match your filters. Showing the top 24." The count is products, not sizes.
- **Empty results.** These only happen after every optional answer has been dropped, so the message says no in-stock shoes were found in the shopper's size, or at all if no size was picked.
- **Search failure.** Shows "We couldn't load your shoe matches" with a Try again button, separate from empty results.

---

## 5. Catalog data problems code can't fix

These need the product-information (PIM) or merchandising team.

1. **About half of in-stock running-shoe records have no surface type.** Those shoes never match Road, Trail, or Treadmill; they only appear with No Preference or when the fallback drops surface.
2. **Almost nothing is tagged for treadmill or gym.** Only 3 in-stock records are `Gym, Track`, so Treadmill mostly returns road shoes.
3. **Thin coverage for some answers.** Max-Support has 12 in-stock records and Underpronation has 90, so those paths often trigger the fallback.
4. **Inconsistent surface values.** There are 20 variants for what's really about 3 concepts ("Multi", "Multiple", "Multi-surface", "Various surfaces", and so on). Any new variant silently matches no quiz answer until it's added to `filterMap`.
5. **Pronation values mixed with stability terms.** `Neutral` and `Mid` appear in `facet_Pronation`; they're mapped to normal pronation as a workaround.
6. **Missing cushioning values.** Many shoes have no `facet_Cushioning`, so they're counted as Regular by assumption. The `Yes` value is also ambiguous.
7. **Product names that contradict facets.** For example, a shoe with "Max" in its name tagged Regular cushioning.

---

## 6. Open issues

| ID | Issue | Owner / next step |
|---|---|---|
| O1 | **Clarip blocks Algolia for opted-out and GPC shoppers.** Anyone with the `dnss_cookie=1` opt-out cookie, an account-level opt-out, or Global Privacy Control gets the error state. See `reference/agents/CLARIP_DNSS_BLOCKING.md`. | Privacy/legal decision: allowlist `^ekmp1kfs6w-dsn\.algolia\.net$` in Clarip, or route search through an academy.com endpoint. Don't bypass Clarip in code. |
| O2 | **Algolia search analytics are on by default.** Searches are logged in Algolia's dashboard, tied to IP. | Add `analytics: false` to the query params in `queryAlgolia`. Recommended alongside O1. |
| O3 | **"In stock" is too loose for shoppers with a saved store** (see section 3). | Confirm what `lsi_oos` means with the index owner, then likely remove it from the OR list. |
| O4 | **Only the top 24 matches can be viewed.** `hitsPerPage` is 24; the count shows the true total. | Product decision whether to raise the limit or add paging. |
| O5 | **Catalog data problems** (section 5). | PIM / merchandising. |
| O6 | **Unused `filterMap` entries** (section 2), including `Court`. | Cleanup when convenient. |
| O7 | **Nothing is browser-tested or published yet.** Changes pass a JavaScript syntax check and live Algolia filter checks only. | Test in a browser on a staging entry, then publish in Contentstack (`utilityPage2` / `blt4306ad926c8b4839`). |
| O8 | **`AGENTS.md` is out of date.** Its known-bugs table still lists fixed bugs and describes bug A as an XHR failure. | Update it and link this document and the Clarip write-up. |

---

## 7. Other issues and notes

- **Console noise.** `attachEvents` logs `console.log('targets: ', targets)` on every render; the `targets: NodeList(0)` lines in the console come from this.
- **Dropping pronation or stability from a chip** leaves that answer empty, so "Edit Answers" requires re-picking it before continuing.
- **Filter chip removal uses the fallback too.** After a chip is removed, the search can still relax other answers if fewer than 5 shoes match; those chips will show "(not applied)".
- **Session restore.** Answers are saved in `sessionStorage` (`brooksShoeFinder.session.v1`). Results aren't saved; they're refetched on reload.
- **Rerun the facet check** whenever the catalog team adds values. Query `facet_Surface Type`, `facet_Cushioning`, `facet_Pronation`, `facet_Stability` with `facets` and `hitsPerPage: 0` against the SKU index, filtered to running shoes, and compare with `filterMap`.
- **Testing tip.** If you personally have opted out on academy.com, use an Incognito window (logged out) to see results.

---

## 8. What's been fixed

| Original bug | Status |
|---|---|
| A: Algolia requests fail on prod | Widget now uses `fetch`. The remaining failures are Clarip blocking (O1), not a code bug. |
| B: Fallback silently relaxes filters | Fixed. Relaxed answers are disclosed with a note and "(not applied)" chips. |
| C: Treadmill adds no surface filter | Fixed. `treadmill` maps to the `gym` list. |
| D: Surface map incomplete | Fixed against live values (section 2). |
| E: Regular cushioning filter | Now negated to include shoes with no value, and excludes `Low`. |
| F: Call to undefined `enrichHitsWithLongDescription` | Already fixed before this pass. |
| G: Misleading empty copy | Fixed. Separate error state; empty message reflects size and stock. |
| — | `getBoundingClientRect` crash on the results step (off-by-one in `positionDoneLine`) fixed. |
| — | Added: surface No Preference, Neutral/Mid as normal pronation, filter chips, match count. |
