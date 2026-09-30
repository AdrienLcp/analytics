# Analytics

Personal project (`github.com/AdrienLcp`): conventions come from
`C:/git/toolkit/conventions`, through the `adrien-stack` skill.

## Where it departs from toolkit

- **Hono, not Express.** The API runs on Cloudflare Workers, where Express does
  not run. The layering of `backend.md` holds: `domain/<feature>/` with
  service, store and rules; routes in `infrastructure/http/`.
- **No `env.ts`.** A Worker has no `process.env`: bindings arrive per request
  as `context.env`, typed by the generated `worker-configuration.d.ts`. Rerun
  `pnpm --filter @analytics/api cf-typegen` after changing `wrangler.jsonc`.
- **The D1 binding is handed to each store call**, since it only exists inside
  a request.

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
