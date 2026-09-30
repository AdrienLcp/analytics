import { zValidator } from '@hono/zod-validator'
import type { Hono } from 'hono'
import { cors } from 'hono/cors'
import { z } from 'zod'

import { API_ROUTES } from '@analytics/protocol/routes'
import { siteIdSchema } from '@analytics/protocol/site'
import {
  type ApiErrorResponse,
  siteStatsQuerySchema
} from '@analytics/protocol/site-stats'

import { readSiteStats } from '@/domain/site-stats/site-stats-service'
import { now } from '@/infrastructure/clock'
import type { WorkerEnv } from '@/infrastructure/http/worker-env'

/** Short enough that a visitor reloading the dashboard sees their own page view. */
const STATS_MAX_AGE_SECONDS = 60

const invalidRequest: ApiErrorResponse = {
  code: 'invalid_request',
  message: 'Unknown site or period'
}

/**
 * Public on purpose: the dashboard is a live demo, and the numbers hold nothing
 * about anyone, so any page may read them.
 */
export const registerSiteStatsRoute = (app: Hono<WorkerEnv>) => {
  app.get(
    API_ROUTES.siteStats,
    cors({ origin: '*' }),
    zValidator('param', z.object({ site: siteIdSchema }), (parsed, context) =>
      parsed.success ? undefined : context.json(invalidRequest, 400)
    ),
    zValidator('query', siteStatsQuerySchema, (parsed, context) =>
      parsed.success ? undefined : context.json(invalidRequest, 400)
    ),
    async (context) => {
      const stats = await readSiteStats({
        database: context.env.DB,
        now: now(),
        period: context.req.valid('query').period,
        site: context.req.valid('param').site
      })

      if (stats.status === 'failure') {
        const error: ApiErrorResponse = {
          code: stats.error,
          message: 'The stats are unavailable right now'
        }

        return context.json(error, 503)
      }

      context.header(
        'Cache-Control',
        `public, max-age=${STATS_MAX_AGE_SECONDS}`
      )
      return context.json(stats.data)
    }
  )
}
