import { Result } from '@adrienlcp/result'

import type { SiteId } from '@analytics/protocol/site-ids'
import type {
  SiteStatsResponse,
  StatsPeriod
} from '@analytics/protocol/site-stats'

import { summarizeWebVitals } from '@/domain/web-vitals/web-vital-buckets'
import type { WebVitalsStore } from '@/domain/web-vitals/web-vitals-store'

import { toSiteStats } from './site-stats'
import type { SiteTrafficStore } from './site-stats-store'
import { statsWindowFor } from './stats-window'

export type ReadSiteStatsError = 'storage_unavailable'

export const readSiteStats = async ({
  now,
  period,
  site,
  siteTraffic,
  webVitals
}: {
  now: Temporal.Instant
  period: StatsPeriod
  site: SiteId
  siteTraffic: SiteTrafficStore
  webVitals: WebVitalsStore
}): Promise<Result<SiteStatsResponse, ReadSiteStatsError>> => {
  const window = statsWindowFor({ now, period })
  const [read, measured] = await Promise.all([
    siteTraffic.read({ site, window }),
    webVitals.read({ sinceDay: window.sinceDay, site })
  ])
  if (read.status === 'failure') return read
  if (measured.status === 'failure') return measured

  return Result.success(
    toSiteStats({
      breakdowns: read.data.breakdowns,
      period,
      traffic: read.data.traffic,
      webVitals: summarizeWebVitals(measured.data),
      window
    })
  )
}
