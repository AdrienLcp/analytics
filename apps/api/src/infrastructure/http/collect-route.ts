import { bodyLimit } from 'hono/body-limit'
import type { ContentfulStatusCode } from 'hono/utils/http-status'

import { pageViewBeaconSchema } from '@analytics/protocol/page-view'
import { API_ROUTES } from '@analytics/protocol/routes'
import type { ApiErrorResponse } from '@analytics/protocol/site-stats'

import { countryFromCode } from '@/domain/page-view/country'
import {
  type RecordPageViewError,
  recordPageView
} from '@/domain/page-view/page-view-service'
import { now } from '@/infrastructure/clock'
import { MAX_BEACON_BYTES, parseJson } from '@/infrastructure/http/beacon-body'
import { invalidInputBody } from '@/infrastructure/http/error-responses'
import type { WorkerApp } from '@/infrastructure/http/worker-env'

const recordPageViewErrorStatus = {
  foreign_origin: 403,
  storage_unavailable: 503
} as const satisfies Record<RecordPageViewError, ContentfulStatusCode>

/** Set by Cloudflare's edge on every request; absent when the Worker runs locally. */
const cloudflareCountryOf = (request: Request): string | null => {
  const country = request.cf?.country
  return typeof country === 'string' ? country : null
}

/**
 * The tracker posts with `navigator.sendBeacon`, whose `text/plain` body keeps
 * the request simple: no CORS preflight, and no response the page ever reads.
 */
export const registerCollectRoute = (app: WorkerApp) => {
  app.post(
    API_ROUTES.collect,
    bodyLimit({ maxSize: MAX_BEACON_BYTES }),
    async (context) => {
      const beacon = pageViewBeaconSchema.safeParse(
        parseJson(await context.req.text())
      )
      if (!beacon.success) return context.json(invalidInputBody, 400)

      const recorded = await recordPageView({
        beacon: beacon.data,
        country: countryFromCode(cloudflareCountryOf(context.req.raw)),
        origin: context.req.header('Origin') ?? null,
        pageViews: context.var.stores.pageViews,
        receivedAt: now(),
        userAgent: context.req.header('User-Agent') ?? null
      })

      if (recorded.status === 'failure') {
        const error: ApiErrorResponse = {
          code: recorded.error,
          message: 'The page view was not recorded'
        }

        return context.json(error, recordPageViewErrorStatus[recorded.error])
      }

      return context.body(null, 202)
    }
  )
}
