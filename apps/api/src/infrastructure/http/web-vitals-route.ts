import { bodyLimit } from 'hono/body-limit'
import type { ContentfulStatusCode } from 'hono/utils/http-status'

import { API_ROUTES } from '@analytics/protocol/routes'
import type { ApiErrorResponse } from '@analytics/protocol/site-stats'
import { webVitalsBeaconSchema } from '@analytics/protocol/web-vitals'

import {
  type RecordWebVitalsError,
  recordWebVitals
} from '@/domain/web-vitals/web-vitals-service'
import { now } from '@/infrastructure/clock'
import { MAX_BEACON_BYTES, parseJson } from '@/infrastructure/http/beacon-body'
import { invalidInputBody } from '@/infrastructure/http/error-responses'
import type { WorkerApp } from '@/infrastructure/http/worker-env'

const recordWebVitalsErrorStatus = {
  foreign_origin: 403,
  storage_unavailable: 503
} as const satisfies Record<RecordWebVitalsError, ContentfulStatusCode>

/** Sent like a page view: a `text/plain` beacon nobody reads the answer to. */
export const registerWebVitalsRoute = (app: WorkerApp) => {
  app.post(
    API_ROUTES.webVitals,
    bodyLimit({ maxSize: MAX_BEACON_BYTES }),
    async (context) => {
      const beacon = webVitalsBeaconSchema.safeParse(
        parseJson(await context.req.text())
      )
      if (!beacon.success) return context.json(invalidInputBody, 400)

      const recorded = await recordWebVitals({
        beacon: beacon.data,
        origin: context.req.header('Origin') ?? null,
        receivedAt: now(),
        userAgent: context.req.header('User-Agent') ?? null,
        webVitals: context.var.stores.webVitals
      })

      if (recorded.status === 'failure') {
        const error: ApiErrorResponse = {
          code: recorded.error,
          message: 'The Web Vitals were not recorded'
        }

        return context.json(error, recordWebVitalsErrorStatus[recorded.error])
      }

      return context.body(null, 202)
    }
  )
}
