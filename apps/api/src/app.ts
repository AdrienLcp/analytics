import { Hono } from 'hono'

import { registerCollectRoute } from '@/infrastructure/http/collect-route'
import { registerHomeRedirect } from '@/infrastructure/http/home-redirect'
import { registerSiteStatsRoute } from '@/infrastructure/http/site-stats-route'
import type { WorkerEnv } from '@/infrastructure/http/worker-env'
import { logger } from '@/infrastructure/logging/logger'

/** Built once per isolate by `index.ts`, and on demand by the tests, which hand it a local D1. */
export const createApp = () => {
  const app = new Hono<WorkerEnv>()

  registerCollectRoute(app)
  registerSiteStatsRoute(app)
  registerHomeRedirect(app)

  app.onError((error, context) => {
    logger.error('Unhandled error', { error: String(error) })
    return context.json({ code: 'internal', message: 'Unexpected error' }, 500)
  })

  return app
}
