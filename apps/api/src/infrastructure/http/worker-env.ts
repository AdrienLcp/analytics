import type { Hono } from 'hono'

import type { PageViewStore } from '@/domain/page-view/page-view-store'
import type { SiteTrafficStore } from '@/domain/site-stats/site-stats-store'
import type { WebVitalsStore } from '@/domain/web-vitals/web-vitals-store'

/** Every store a route hands its service, built from the request's bindings by `app.ts`. */
export type Stores = {
  pageViews: PageViewStore
  siteTraffic: SiteTrafficStore
  webVitals: WebVitalsStore
}

/** Hono's view of the Worker: the bindings `wrangler.jsonc` declares, typed by `wrangler types`, and the stores. */
export type WorkerEnv = {
  Bindings: Env
  Variables: { stores: Stores }
}

export type WorkerApp = Hono<WorkerEnv>
