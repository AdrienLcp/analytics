import { Hono } from 'hono'

import { createPageViewStore } from '@/domain/page-view/page-view-store'
import { createSiteTrafficStore } from '@/domain/site-stats/site-stats-store'
import { createWebVitalsStore } from '@/domain/web-vitals/web-vitals-store'
import { registerCollectRoute } from '@/infrastructure/http/collect-route'
import {
  answerUnexpected,
  notFoundBody
} from '@/infrastructure/http/error-responses'
import { registerSiteStatsRoute } from '@/infrastructure/http/site-stats-route'
import { registerWebVitalsRoute } from '@/infrastructure/http/web-vitals-route'
import type { Stores, WorkerApp } from '@/infrastructure/http/worker-env'

const storesOf = (env: Env): Stores => ({
  pageViews: createPageViewStore(env.DB),
  siteTraffic: createSiteTrafficStore(env.DB),
  webVitals: createWebVitalsStore(env.DB)
})

/**
 * The composition root: the only reader of `env`, it builds every store per
 * request. Built once per isolate by `index.ts`, and by the tests.
 */
export const createApp = (): WorkerApp => {
  const app: WorkerApp = new Hono()

  app.use(async (context, next) => {
    context.set('stores', storesOf(context.env))
    await next()
  })

  registerCollectRoute(app)
  registerSiteStatsRoute(app)
  registerWebVitalsRoute(app)

  app.notFound((context) => context.json(notFoundBody, 404))
  app.onError(answerUnexpected)

  return app
}
