import { bodyLimit } from 'hono/body-limit'
import type { ContentfulStatusCode } from 'hono/utils/http-status'

import { pageEngagementBeaconSchema } from '@analytics/protocol/page-view'
import { API_ROUTES } from '@analytics/protocol/routes'
import type { ApiErrorResponse } from '@analytics/protocol/site-stats'

import {
  type RecordEngagementError,
  recordEngagement
} from '@/domain/page-view/engagement-service'
import { MAX_BEACON_BYTES, parseJson } from '@/infrastructure/http/beacon-body'
import { invalidInputBody } from '@/infrastructure/http/error-responses'
import type { WorkerApp } from '@/infrastructure/http/worker-env'

const recordEngagementErrorStatus = {
  foreign_origin: 403,
  storage_unavailable: 503
} as const satisfies Record<RecordEngagementError, ContentfulStatusCode>

/** Sent like a page view: a `text/plain` beacon nobody reads the answer to. */
export const registerEngagementRoute = (app: WorkerApp) => {
  app.post(
    API_ROUTES.engagement,
    bodyLimit({ maxSize: MAX_BEACON_BYTES }),
    async (context) => {
      const beacon = pageEngagementBeaconSchema.safeParse(
        parseJson(await context.req.text())
      )
      if (!beacon.success) return context.json(invalidInputBody, 400)

      const recorded = await recordEngagement({
        beacon: beacon.data,
        origin: context.req.header('Origin') ?? null,
        pageViews: context.var.stores.pageViews
      })

      if (recorded.status === 'failure') {
        const error: ApiErrorResponse = {
          code: recorded.error,
          message: 'The engagement was not recorded'
        }

        return context.json(error, recordEngagementErrorStatus[recorded.error])
      }

      return context.body(null, 202)
    }
  )
}
