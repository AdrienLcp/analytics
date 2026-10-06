# Analytics

Privacy-first, self-hosted page analytics on Cloudflare Workers and D1. It
counts page views and visits for my own sites, and the dashboard is public at
https://analytics.adrienlcp.com.

- **Nothing identifies a visitor.** No cookie, no IP address, no user agent,
  no fingerprint and no hash of any of them is stored. A row holds a path, the
  host that referred the visit, a country, a locale, a theme and a device class.
  With nothing to consent to, there is no consent banner.
- **A visit needs no identifier.** A page view reached from another page of the
  same site continues a visit; anything else starts one.
- **One small script.** `tracker.js` weighs under 1 kB gzipped, follows
  single-page navigation and never runs on `localhost` or in an automated
  browser.

## Add it to a site

```html
<script defer data-site="portfolio" src="https://analytics.adrienlcp.com/tracker.js"></script>
```

The site must be listed in `packages/protocol/src/site-ids.ts` and its
production origin in `apps/api/src/domain/site/site-origins.ts`: beacons from
any other origin are refused.

Visiting any page with `?analytics=off` stops counting that browser on that
site; `?analytics=on` resumes it.

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
