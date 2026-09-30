import { Result } from '@adrienlcp/result'

import type { SiteId } from '@analytics/protocol/site-ids'
import type {
  SiteStatsResponse,
  StatsPeriod
} from '@analytics/protocol/site-stats'

import { toSiteStats } from './site-stats'
import { readSiteTraffic } from './site-stats-store'
import { statsWindowFor } from './stats-window'

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
  const read = await readSiteTraffic({ database, site, window })
  if (read.status === 'failure') return read

  return Result.success(
    toSiteStats({
      breakdowns: read.data.breakdowns,
      period,
      traffic: read.data.traffic,
      window
    })
  )
}
