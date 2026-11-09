# Clarip "Do Not Sell" blocking and the Shoe Finder

Investigated Sep 28, 2026. Explains why the running shoe finder shows no results for some shoppers, and what can fix it.

## TL;DR

Clarip is a privacy-compliance tool that Academy loads on every page of academy.com. It lets shoppers opt out of having their data "sold or shared," and it enforces that opt-out in the browser. It does this by replacing the browser's built-in networking functions (`fetch`, `XMLHttpRequest`, and others) with its own versions that check each request first. Algolia isn't on Clarip's allowlist, so for opted-out or GPC shoppers the shoe finder's search is blocked before it ever leaves the browser.

Console symptom:

```
[ShoeFinder] Algolia search error: Error: Blocked fetch request to URL:
https://ekmp1kfs6w-dsn.algolia.net/1/indexes/prodlive-skus-data-inventoryaware-newarrival/query
    at donotsell-block.min.js
    at window.fetch (quantum-academy.js)
    at queryAlgolia ...
```

## Why Academy uses it

US state privacy laws give shoppers the right to say "don't sell or share my personal information." California's CCPA/CPRA was first, and Colorado, Virginia, Texas and others followed. "Share" here mostly means sending data to third parties for cross-site advertising. Businesses also have to honor **Global Privacy Control (GPC)**, a signal some browsers send automatically to say "opt me out."

Clarip does three jobs for this:

- It shows the **"Do Not Sell or Share"** link and form, and records the opt-out (the `dnss_cookie`, plus a lookup by account email for logged-in users).
- It shows the **cookie consent banner**. This is a separate Clarip tool, so "accept all cookies" does not affect the blocker.
- It **enforces** the opt-out by stopping the browser from talking to third-party services. This is the part that breaks the shoe finder.

Scripts on the page:

- `//cdn.clarip.com/academy/donotsell/assets/js/donotsell-block.min.js`: the blocker
- `//cdn.clarip.com/academy/cookieconsent/assets/js/cookieconsent.min.js`: the cookie banner
- Live config: `https://cdn.clarip.com/academy/donotsell/dsr-configuration_1778584292.json`

## How it decides to block

On each page load, the blocker checks, in order:

1. **Is the browser sending GPC?** (`navigator.globalPrivacyControl === true`) If so, block. Clearing cookies doesn't help.
2. **Is there an opt-out cookie?** Academy's config names it `dnss_cookie` with value `1`, and it lasts 5475 days (15 years). If it's set, block.
3. **Is the user logged in?** If so, Clarip sends the account email to `https://academy.clarip.com/donotsell/api/check`. If that account has opted out, Clarip sets `dnss_cookie` again and blocks. So the opt-out follows the account, even after cookies are cleared.

If none of these is true, it does nothing, and the page behaves normally.

Other triggers exist in the script but are turned off in Academy's config: region-based "force stop tracking" and health-related page blocking.

## How it "wraps" requests

JavaScript lets any script replace built-in browser functions. Once blocking is on, Clarip swaps out the functions a page uses to load things:

- **`window.fetch`** and **`XMLHttpRequest`**: the two ways JavaScript calls APIs (the Algolia search uses these)
- **`navigator.sendBeacon`**: used by analytics to send data as a page closes
- **`<script>` and `<iframe>`** loading, so third-party tags don't run
- Images and links are **not** blocked in Academy's config (`trackingOptImages: false`, `trackingOptLinks: false`)

The replacement `fetch` works roughly like this:

```js
const realFetch = window.fetch;
window.fetch = (url, options) => {
  if (allowlist.test(hostnameOf(url))) return realFetch(url, options);
  return Promise.reject(new Error(`Blocked fetch request to URL: ${url}`));
};
```

When the shoe finder calls `fetch("https://ekmp1kfs6w-dsn.algolia.net/...")`, it's really calling Clarip's version. Clarip checks the hostname against its allowlist. `algolia.net` isn't on it, so Clarip rejects the request immediately, and no network request is ever made.

### The allowlist is deny by default

Only `academy.com`, `clarip.com`, and the domains Academy has approved in the `domainList` config get through. Everything else is blocked, whether or not it actually tracks anyone. Clarip can't tell a search API from an ad tracker; it only compares domains.

Allowlisted domains as of Sep 28, 2026, grouped here for readability:

- **Ads and data vendors:** contextweb.com, creativecdn.com, eyeota.net, kargo.com, rlcdn.com, sjv.io, captiv8.io, yahoo.com, yahoo.net
- **Payments:** paypal.com, paypalobjects.com, klarna.com, klarnaservices.com, klarnacdn.net, tokenex.com, paymentjs.firstdata.com, breadpayments.com, chasepaymentech.com, comenity.net, pay.google.com
- **Content and CDN:** contentstack.io, jsdelivr.net, akamaihd.net, googleapis.com, gstatic.com, oraclecloud.com, static-assets
- **Analytics and tag management:** tealiumiq.com, tiqcdn.com, quantummetric.com, google.com, google-analytics.com, googletagmanager.com, monetate.net, px-cloud.net
- **Commerce features:** bazaarvoice.com, stylitics.com, curalate.com, tvpage.com, flippenterprise.net, kmsmep.com
- **Support and surveys:** custhelp.com, rightnowtech.com, insitez.blob.core.windows.net, app.informizely.com
- **Other:** live.streamtheworld.com, clarip.com

Entries are unanchored regular expressions tested against the hostname.

## Why the stack trace has several scripts

Clarip isn't the only script that wraps `fetch`. Quantum Metric (`quantum-academy.js`) and Dynatrace (`ruxitagentjs_...`) wrap it too, to record requests for performance and session analytics. Each one wraps the version it found, so a call passes through a chain of wrappers:

1. The shoe finder calls `window.fetch`.
2. Quantum Metric's wrapper records the call.
3. Clarip's wrapper checks the allowlist and blocks.
4. The browser's real `fetch` would only run if Clarip allowed it.

Only Clarip decides to block. The others are just passing the call along and logging it.

## How this connects to the original bug

The earlier notes blamed "XHR fails on prod under Clarip / Dynatrace / Quantum Metric." That was most likely the same thing all along. Clarip wraps `XMLHttpRequest` too, so opted-out shoppers failed on the old XHR code and still fail on `fetch`. Switching transport was never going to fix it for them. It's a policy decision, not a code problem.

## How we confirmed it

- `navigator.globalPrivacyControl` returned `undefined`, so GPC was not the trigger.
- `document.cookie` contained `dnss_cookie=1`, so the tester was marked as opted out.
- `window.IS_VISITOR_TRACKING_PREVENTION_EXECUTED` was `undefined`, which rules out region-based blocking.
- The quiz returned results in Chrome Incognito, where there's no opt-out cookie.

### Testing tips

- Use Incognito or a separate Chrome profile, logged out.
- Or delete `dnss_cookie` in DevTools (Application, then Cookies, then `www.academy.com`) and reload. If it comes back after logging in, the opt-out is saved on the account.
- A normal window that has `dnss_cookie=1` shows exactly what opted-out and GPC shoppers see.

## What the shoe finder sends to Algolia

This matters for the compliance discussion:

- Quiz answers as facet filters (size, gender, cushioning, surface, and so on). There's no free-text search.
- Store IDs for the in-stock filter, from `localStorage` (`aso_WC_StLocId_Selected`) and the `sddStoreId` and `nbmsids` cookies. These reveal rough location.
- Standard browser request data: IP address, user agent and referrer.

It does **not** send a `userToken`, turn on `clickAnalytics`, or call Algolia Insights (`insights.algolia.io`).

## Ways forward

1. **Add Algolia's search host to Clarip's allowlist.** This is a config change in Clarip, and privacy/legal needs to agree that product search isn't "selling or sharing." Use the narrowest entry, `^ekmp1kfs6w-dsn\.algolia\.net$`, rather than `algolia.net`. Keep `algolia.io` (Insights) off the list.
2. **Route search through an academy.com endpoint.** Clarip always allows the site's own domain. This needs backend work, and legal should still know Algolia is behind it.

Recommended alongside either option: add `analytics: false` to the Algolia query params in `queryAlgolia`, so opted-out users' searches aren't logged in Algolia analytics.

**Not recommended:** working around Clarip in code, for example by borrowing an unwrapped `fetch` from a hidden iframe. That gets around a privacy control for users who opted out, which is a compliance risk.

### Questions for privacy/legal

- Does Academy have a data processing agreement with Algolia that makes it a "service provider" under CCPA/CPRA?
- Can we allowlist `^ekmp1kfs6w-dsn\.algolia\.net$` in Clarip, with Algolia search analytics turned off?
- Should nearby store IDs be left out of the search for opted-out users? (They'd lose in-stock filtering by store.)

Until one of these options ships, opted-out and GPC shoppers see the quiz's error state instead of results.
