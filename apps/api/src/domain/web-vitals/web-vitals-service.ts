import { Result } from '@adrienlcp/result'

import {
  WEB_VITAL_METRICS,
  type WebVitalsBeacon
} from '@analytics/protocol/web-vitals'

import { isBotUserAgent } from '@/domain/page-view/bot-user-agent'
import { deviceForViewport } from '@/domain/page-view/device'
import { isOriginOfSite } from '@/domain/site/site-origins'
import { toUtcDay } from '@/infrastructure/dates'

import { bucketOfMeasurement } from './web-vital-buckets'
import type { WebVitalsStore } from './web-vitals-store'

export type RecordWebVitalsError = 'foreign_origin' | 'storage_unavailable'

export type RecordWebVitalsOutcome =
  | 'recorded'
  | 'ignored_bot'
  | 'nothing_measured'

export const recordWebVitals = async ({
  beacon,
  origin,
  receivedAt,
  userAgent,
  webVitals
}: {
  beacon: WebVitalsBeacon
  origin: string | null
  receivedAt: Temporal.Instant
  userAgent: string | null
  webVitals: WebVitalsStore
}): Promise<Result<RecordWebVitalsOutcome, RecordWebVitalsError>> => {
  if (origin === null || !isOriginOfSite({ origin, site: beacon.site })) {
    return Result.failure('foreign_origin')
  }

  if (isBotUserAgent(userAgent)) return Result.success('ignored_bot')

  const buckets = WEB_VITAL_METRICS.flatMap((metric) => {
    const value = beacon[metric]
    return value === null
      ? []
      : [{ bucket: bucketOfMeasurement({ metric, value }), metric }]
  })

  if (buckets.length === 0) return Result.success('nothing_measured')

  const stored = await webVitals.increment({
    buckets,
    day: toUtcDay(receivedAt),
    device: deviceForViewport(beacon.viewportWidth),
    path: beacon.path,
    site: beacon.site
  })
  if (stored.status === 'failure') return stored

  return Result.success('recorded')
}
