# Hosting

One Cloudflare Worker serves everything: the dashboard and `tracker.js` as
static assets, and `/api/*` through its code, over one D1 database. All of it
is declared in `apps/api/wrangler.jsonc`; there is no staging, every push to
`main` that passes CI goes live.

| Piece              | Provider                                | Identifier                                                                                      |
| ------------------ | --------------------------------------- | ----------------------------------------------------------------------------------------------- |
| The Worker         | Cloudflare Workers, account `431a5290…` | `analytics` (`name`)                                                                            |
| Dashboard, tracker | Static assets of the Worker             | `apps/api/public` (`assets`), built by `pnpm build`; single-page fallback, `/api/*` to the code |
| The data           | Cloudflare D1                           | database `analytics`, id `b2670059-e5c6-4685-8003-d484cbb38cef`, binding `DB`                   |
| Retention          | Cron Trigger                            | `17 3 * * *`, every day at 03:17 UTC: deletes what is older than 25 months                      |
| Logs               | Workers Logs                            | `observability` on, invocation logs off: they would record IP addresses and user agents         |
| Its address        | Custom domain, zone `adrienlcp.com`     | `analytics.adrienlcp.com` (`routes`); no `workers.dev` host (`workers_dev`)                     |

`scripts/operations/hosting.ts` holds the account, zone, repository and domain
for the scripts. The CI secrets that let GitHub deploy to Cloudflare are
covered in [secrets.md](secrets.md). The Worker reads no secret: its only
binding is the database.

## Create or recreate it

The Worker and its address: nothing to run apart from a deploy.
`wrangler deploy` creates the Worker if it is missing, with its Cron Trigger,
and creates the custom domain with its DNS record. After deleting the Worker
by mistake, re-run the last CI run (`gh run rerun <id>`) or deploy by hand
(below). The domain answers once its certificate is issued, a few minutes
after the first deploy.

The database is not created by a deploy: `wrangler.jsonc` names it by id. If
it is gone, its page views are gone with it (see _Restore the database_
first). Unlocked as in [secrets.md](secrets.md), _Unlocking_:

```powershell
$env:CLOUDFLARE_ACCOUNT_ID = "431a529079f2d76802b95056e39950f0"; $env:CLOUDFLARE_API_TOKEN = bw get password "Cloudflare Pages token"; pnpm --filter @analytics/api exec wrangler d1 create analytics
```

Expected: the new `database_id`. Put it in `apps/api/wrangler.jsonc` under
`d1_databases`, commit, and `pnpm ship`: the deploy applies every migration
of `apps/api/migrations` to the empty database before deploying the Worker.

After any change to `wrangler.jsonc`, regenerate the binding types and commit
`apps/api/worker-configuration.d.ts` (the API build checks them):

```powershell
pnpm --filter @analytics/api cf-typegen
```

## Restore the database

D1 Time Travel brings the database back to any minute of its recent past (7
days on the free plan), after a bad migration or a mistaken delete. In a
terminal set up as above:

```powershell
pnpm --filter @analytics/api exec wrangler d1 time-travel restore analytics --timestamp=<ISO 8601 time before the damage>
```

Everything written since that time is lost, page views included.

## Deploy by hand

The last resort, when CI cannot deploy: from a clean clone of `main` only (it
ships whatever the folder holds). Unlock first ([secrets.md](secrets.md),
_Unlocking_), then in that terminal:

```powershell
pnpm install --frozen-lockfile
```

```powershell
$env:CLOUDFLARE_ACCOUNT_ID = "431a529079f2d76802b95056e39950f0"; $env:CLOUDFLARE_API_TOKEN = bw get password "Cloudflare Pages token"; pnpm run deploy
```

`pnpm run deploy` builds everything, applies the pending migrations to the
remote database, then deploys the Worker (`pnpm deploy` without `run` is
pnpm's own command, not this script). Expected: the migrations applied or
`No migrations to apply`, `Uploaded analytics`, `Deployed analytics triggers`
with the schedule, then `analytics.adrienlcp.com (custom domain)`. Close the
terminal afterwards: it holds the token.

## Common errors

| Message                                                 | Fix                                                                                                                                          |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `Authentication error [code: 10000]`                    | The Cloudflare token lacks a permission listed in [secrets.md](secrets.md), or expired: renew it.                                            |
| The migrations step fails before `wrangler deploy`      | The token lacks _Account · D1 · Edit_, or the database id in `wrangler.jsonc` no longer exists: recreate it as above.                        |
| `No access to the specified resource`, after `Uploaded` | The code is up but the custom domain was refused: the token lacks _Zone · Workers Routes · Edit_ on `adrienlcp.com`.                         |
| A record for `analytics.adrienlcp.com` already exists   | Another record holds the name: dashboard → _adrienlcp.com → DNS → Records_, delete it, deploy again.                                         |
| The site answers `522` or a certificate error           | The certificate is not issued yet: wait ten minutes. Still failing: dashboard → _Workers & Pages → analytics → Settings → Domains & Routes_. |
