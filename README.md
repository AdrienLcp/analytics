# Analytics

Privacy-first, self-hosted page analytics on Cloudflare Workers and D1. It
counts page views and visits for my own sites, and the dashboard is public at
https://analytics.adrienlcp.com.

- **Nothing identifies a visitor.** No cookie, no IP address, no user agent,
  no fingerprint and no hash of any of them is stored. A row holds a route, the
  host that referred the visit, a country, a locale, a theme and a device class.
  With nothing to consent to, there is no consent banner.
- **Nothing is kept past 25 months.** A daily Cron Trigger deletes every page
  view and every day of Web Vitals older than that, the longest the CNIL lets
  audience measurement keep its data without consent.
- **A visit needs no identifier.** A page view reached from another page of the
  same site continues a visit; anything else starts one.
- **One small script.** `tracker.js` weighs under 5 kB gzipped, Web Vitals included, follows
  single-page navigation and never runs on `localhost` or in an automated
  browser.

## Add it to a site

```html
<script defer data-site="portfolio" src="https://analytics.adrienlcp.com/tracker.js"></script>
```

The site must be listed in `packages/protocol/src/site-ids.ts`, its
production origin in `apps/api/src/domain/site/site-origins.ts` — beacons from
any other origin are refused — and every route its router declares in
`packages/protocol/src/site-routes.ts`.

### Pages are counted by route

A path can carry an event id, an umpire code, a room or a pairing code: anyone
holding it is let in, and the dashboard is public. So a page view is counted
under the route it matched — `/e/3f9a1c/umpire/481516` is
`/e/:eventId/umpire/:umpireCode` — and never under its path. The tracker
matches the route before the beacon leaves the browser, and the API matches it
again before storing, so an old tracker or a forged beacon stores no more. A
path no listed route matches is counted as `/*`.

A route the site adds goes into `site-routes.ts` with the same pattern as its
`navigation.ts`; until it does, its pages are counted as `/*`. A page whose
parameter is public and worth telling apart can be listed literally
(`/:locale/projects/scoreboard`): the route with the most literal segments wins.

### Refusing to be counted

The tracker counts nobody who has refused, in any of three ways:

| Signal | Set by | Undone by |
| --- | --- | --- |
| `localStorage['analytics:ignore'] === 'true'` on the site's origin | The site's own opt-out switch, on its legal page | The switch removing the key |
| `?analytics=off` on any page of the site | The owner, to keep his own visits out; it writes the key above | `?analytics=on`, which removes it |
| `navigator.globalPrivacyControl === true` | The visitor's browser or extension | Only the visitor; `?analytics=on` does not override it |

A site's switch writes exactly `'true'` under `analytics:ignore` and removes
the key to resume; any other value counts the browser. The tracker reads the
key once, when the page loads.

## API

| Route | Does |
| --- | --- |
| `POST /api/collect` | Records one page view (`text/plain` JSON, sent by `navigator.sendBeacon`) |
| `GET /api/sites/:site/stats?period=7d\|30d\|12m` | Totals, a zero-filled series and the top pages, referrers, countries, locales, themes and devices |

## Layout

```
apps/api/            → the Worker: Hono routes, D1 stores, static assets
apps/tracker/        → tracker.js, built into the Worker's assets
packages/protocol/   → the wire contract, in Zod, shared by both
```

## Develop

```bash
pnpm install
pnpm dev        # builds the tracker, applies migrations locally, runs wrangler dev
pnpm validate   # build, lint, tests against a local D1
pnpm deploy     # remote migrations, then wrangler deploy
```

## License

AGPL-3.0-or-later
