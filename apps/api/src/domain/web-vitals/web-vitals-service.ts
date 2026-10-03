import { Result } from '@adrienlcp/result'

import {
  WEB_VITAL_METRICS,
  type WebVitalsBeacon
} from '@analytics/protocol/web-vitals'

import { isBotUserAgent } from '@/domain/page-view/bot-user-agent'
import { deviceForViewport } from '@/domain/page-view/device'
import { isOriginOfSite } from '@/domain/site/site-origins'
import { BUCKET_KEY_LENGTH } from '@/domain/site-stats/stats-window'

import { bucketOfMeasurement } from './web-vital-buckets'
import { incrementWebVitalBuckets } from './web-vitals-store'

export type RecordWebVitalsError = 'foreign_origin' | 'storage_unavailable'

export type RecordWebVitalsOutcome =
  | 'recorded'
  | 'ignored_bot'
  | 'nothing_measured'

export const recordWebVitals = async ({
  beacon,
  database,
  origin,
  receivedAt,
  userAgent
}: {
  beacon: WebVitalsBeacon
  database: D1Database
  origin: string | null
  receivedAt: Temporal.Instant
  userAgent: string | null
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

  const stored = await incrementWebVitalBuckets({
    buckets,
    database,
    day: receivedAt.toString().slice(0, BUCKET_KEY_LENGTH.day),
    device: deviceForViewport(beacon.viewportWidth),
    path: beacon.path,
    site: beacon.site
  })
  if (stored.status === 'failure') return stored

  return Result.success('recorded')
}
