# Deploying

The CI workflow validates every push to `main`, then its last step, _Migrate
and deploy the Worker_, runs `pnpm --filter @analytics/api run deploy`: the
pending D1 migrations against the remote database, then `wrangler deploy` of
the Worker `analytics`. Each push runs on its own; a run whose commit is no
longer the head of `main` when it gets there skips the deploy, so an older
commit never overwrites a newer one. There is no staging: a green push is
live. Shipping is pushing; nothing is built or deployed from this machine.

## Ship — `pnpm ship`

Prerequisites: on `main`, everything committed, `origin/main` pulled.

```powershell
pnpm ship
```

Expected: `git push` output, then `ship: pushed; watching CI run <id>`, the
run's jobs ticking green, and `ship: deployed to https://analytics.adrienlcp.com`.
Open the dashboard and check the change.

| Error                                         | Fix                                                                                                      |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `only main deploys`                           | `git switch main`, merge or cherry-pick the work there.                                                  |
| `the working tree has uncommitted changes`    | Commit (or `git stash`) first.                                                                           |
| `origin/main has commits this checkout lacks` | `git pull --rebase`, then `pnpm validate`, then `pnpm ship`.                                             |
| `nothing to ship`                             | Every commit is already pushed. To re-deploy the same commit, re-run its CI run: `gh run rerun <id>`.    |
| `the CI run failed`                           | Open the run link it prints; see [troubleshooting.md](troubleshooting.md).                               |
| `pushed; follow the deploy on …/actions`      | `gh` is missing or logged out; the push is done, watch the page. `gh auth login` fixes it for next time. |

## Undo a deploy

The way that leaves the history right: revert the commit and ship.

```powershell
git revert <commit>
```

```powershell
pnpm ship
```

Faster, while the fix is prepared: put the previous version of the Worker
back at once, with no build (unlocked as in [secrets.md](secrets.md),
_Unlocking_):

```powershell
$env:CLOUDFLARE_ACCOUNT_ID = "431a529079f2d76802b95056e39950f0"; $env:CLOUDFLARE_API_TOKEN = bw get password "Cloudflare Pages token"; pnpm --filter @analytics/api exec wrangler rollback
```

Or the dashboard: _Workers & Pages → analytics → Deployments_, a previous
version → _Rollback_. The next deploy replaces the rollback.

A rollback or a revert brings back the code, never the database: a migration
the deploy applied stays applied. Reverse it with a new migration in
`apps/api/migrations`, or bring the data back as in [hosting.md](hosting.md),
_Restore the database_.
