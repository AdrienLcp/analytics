import type { Hono } from 'hono'

import type { WorkerEnv } from '@/infrastructure/http/worker-env'

const REPOSITORY_URL = 'https://github.com/AdrienLcp/analytics'

/**
 * Until the dashboard is built into the assets, the root has no page: send a
 * visitor to the source rather than to a 404. Delete this once `index.html`
 * ships, since assets are served before the Worker runs.
 */
export const registerHomeRedirect = (app: Hono<WorkerEnv>) => {
  app.get('/', (context) => context.redirect(REPOSITORY_URL, 302))
}
