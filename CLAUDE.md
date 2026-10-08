# Analytics

Personal project (`github.com/AdrienLcp`): conventions come from
`C:/git/toolkit/conventions`, through the `adrien-stack` skill.

## Where it departs from toolkit

The API follows `backend.md` and `workers.md` as written: `app.ts` builds the
stores from `context.env` per request, routes read them from `context.var`, and
`build` fails on a stale `worker-configuration.d.ts` — rerun
`pnpm --filter @analytics/api cf-typegen` after changing `wrangler.jsonc` or
bumping wrangler.

- **The beacon routes read their body as text**: `navigator.sendBeacon` posts
  `text/plain`, which no `zValidator` target reads, so the handler
  `safeParse`s it and answers the shared `invalid_input` body itself.
- **The tracker keeps a local `try/catch`** where `Result` would outweigh the
  script (`errors.md`, embedded scripts).
- **No `@adrienlcp/theme-preference`.** The dashboard has no theme switch: the
  palette follows the system through `light-dark()` and nothing is ever
  stamped on `<html>`, so there is no choice to store or stamp.
- **`--text-m`, the body, is a step smaller on a phone** (17px, 16px below
  35rem), redefined on `:root` as DESIGN.md pins it.
- **The sections answer `body`'s width**: `layout.below-wide`, `-medium` and
  `-narrow` are container queries on `body` at the twelve-column grid's steps;
  the `:root` tokens read the same steps off the viewport
  (`layout.screen-below-*`).

## Build order

`apps/api/public/` is generated and served as the Worker's static assets. The
tracker builds into it with `emptyOutDir: false`; a dashboard building there
must build first and may empty it. The root `build` script fixes the order.

## Tests

`createTestHarness` from `wrangler` runs the real Worker over a local D1;
`reset()` recreates the database and the migrations are applied again before
each test.

## Privacy is the product

Never store or log an IP address, a user agent, a full referrer URL or a query
string. A new column has to answer "could this tell two visitors apart?" with
no.
