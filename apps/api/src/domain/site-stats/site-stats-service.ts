import { Result } from '@adrienlcp/result'

import type { SiteId } from '@analytics/protocol/site-ids'
import type {
  SiteStatsResponse,
  StatsPeriod
} from '@analytics/protocol/site-stats'

import { summarizeWebVitals } from '@/domain/web-vitals/web-vital-buckets'
import { readWebVitalBuckets } from '@/domain/web-vitals/web-vitals-store'

import { toSiteStats } from './site-stats'
import { readSiteTraffic } from './site-stats-store'
import { BUCKET_KEY_LENGTH, statsWindowFor } from './stats-window'

export const readSiteStats = async ({
  database,
  now,
  period,
  site
}: {
  database: D1Database
  now: Date
  period: StatsPeriod
  site: SiteId
}): Promise<Result<SiteStatsResponse, 'storage_unavailable'>> => {
  const window = statsWindowFor({ now, period })
  const [read, webVitals] = await Promise.all([
    readSiteTraffic({ database, site, window }),
    readWebVitalBuckets({
      database,
      sinceDay: window.since.slice(0, BUCKET_KEY_LENGTH.day),
      site
    })
  ])
  if (read.status === 'failure') return read
  if (webVitals.status === 'failure') return webVitals

  return Result.success(
    toSiteStats({
      breakdowns: read.data.breakdowns,
      period,
      traffic: read.data.traffic,
      webVitals: summarizeWebVitals(webVitals.data),
      window
    })
  )
}
