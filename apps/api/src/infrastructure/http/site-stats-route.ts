import { zValidator } from '@hono/zod-validator'
import { cors } from 'hono/cors'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import { z } from 'zod'

import { API_ROUTES } from '@analytics/protocol/routes'
import { siteIdSchema } from '@analytics/protocol/site'
import {
  type ApiErrorResponse,
  siteStatsQuerySchema
} from '@analytics/protocol/site-stats'

import {
  type ReadSiteStatsError,
  readSiteStats
} from '@/domain/site-stats/site-stats-service'
import { now } from '@/infrastructure/clock'
import { invalidInput } from '@/infrastructure/http/error-responses'
import type { WorkerApp } from '@/infrastructure/http/worker-env'

/** Short enough that a visitor reloading the dashboard sees their own page view. */
const STATS_MAX_AGE_SECONDS = 60

const readSiteStatsErrorStatus = {
  storage_unavailable: 503
} as const satisfies Record<ReadSiteStatsError, ContentfulStatusCode>

/**
 * Public on purpose: the dashboard is a live demo, and the numbers hold nothing
 * about anyone, so any page may read them.
 */
export const registerSiteStatsRoute = (app: WorkerApp) => {
  app.get(
    API_ROUTES.siteStats,
    cors({ origin: '*' }),
    zValidator('param', z.object({ site: siteIdSchema }), invalidInput),
    zValidator('query', siteStatsQuerySchema, invalidInput),
    async (context) => {
      const stats = await readSiteStats({
        now: now(),
        period: context.req.valid('query').period,
        site: context.req.valid('param').site,
        siteTraffic: context.var.stores.siteTraffic,
        webVitals: context.var.stores.webVitals
      })

      if (stats.status === 'failure') {
        const error: ApiErrorResponse = {
          code: stats.error,
          message: 'The stats are unavailable right now'
        }

        return context.json(error, readSiteStatsErrorStatus[stats.error])
      }

      context.header(
        'Cache-Control',
        `public, max-age=${STATS_MAX_AGE_SECONDS}`
      )
      return context.json(stats.data)
    }
  )
}
