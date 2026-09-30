import { Result } from '@adrienlcp/result'
import { z } from 'zod'

import type { SiteId } from '@analytics/protocol/site-ids'
import {
  type SiteStatsBreakdowns,
  siteStatsBreakdownsSchema,
  type TrafficBucket
} from '@analytics/protocol/site-stats'

import { logger } from '@/infrastructure/logging/logger'

import { BUCKET_KEY_LENGTH, type StatsWindow } from './stats-window'

const BREAKDOWN_SIZE = 10

/** Literal column names: a breakdown is never built from what a request says. */
const BREAKDOWN_COLUMNS = {
  countries: 'country',
  devices: 'device',
  locales: 'locale',
  pages: 'path',
  referrers: 'referrer_host',
  themes: 'theme'
} as const satisfies Record<keyof SiteStatsBreakdowns, string>

const BREAKDOWN_NAMES = siteStatsBreakdownsSchema.keyof().options

const trafficRowsSchema = z.array(
  z.object({ bucket: z.string(), page_views: z.number(), visits: z.number() })
)

export type SiteTraffic = {
  breakdowns: SiteStatsBreakdowns
  traffic: TrafficBucket[]
}

/** One round trip: the series and every breakdown go to D1 as a single batch. */
export const readSiteTraffic = async ({
  database,
  site,
  window
}: {
  database: D1Database
  site: SiteId
  window: StatsWindow
}): Promise<Result<SiteTraffic, 'storage_unavailable'>> => {
  const trafficStatement = database
    .prepare(
      `SELECT substr(viewed_at, 1, ?) AS bucket, COUNT(*) AS page_views, SUM(is_entry) AS visits
        FROM page_views WHERE site = ? AND viewed_at >= ?
        GROUP BY bucket`
    )
    .bind(BUCKET_KEY_LENGTH[window.unit], site, window.since)

  const breakdownStatements = BREAKDOWN_NAMES.map((name) => {
    const column = BREAKDOWN_COLUMNS[name]

    return database
      .prepare(
        `SELECT ${column} AS key, COUNT(*) AS count
          FROM page_views WHERE site = ? AND viewed_at >= ? AND ${column} IS NOT NULL
          GROUP BY key ORDER BY count DESC, key LIMIT ?`
      )
      .bind(site, window.since, BREAKDOWN_SIZE)
  })

  try {
    const [trafficResult, ...breakdownResults] = await database.batch([
      trafficStatement,
      ...breakdownStatements
    ])
    const traffic = trafficRowsSchema.safeParse(trafficResult?.results)
    const breakdowns = siteStatsBreakdownsSchema.safeParse(
      Object.fromEntries(
        BREAKDOWN_NAMES.map((name, index) => [
          name,
          breakdownResults[index]?.results
        ])
      )
    )

    if (!traffic.success || !breakdowns.success) {
      logger.error('D1 returned rows of an unexpected shape')
      return Result.failure('storage_unavailable')
    }

    return Result.success({
      breakdowns: breakdowns.data,
      traffic: traffic.data.map((row) => ({
        bucket: row.bucket,
        pageViews: row.page_views,
        visits: row.visits
      }))
    })
  } catch (error) {
    logger.error('Could not read site traffic', { error: String(error) })
    return Result.failure('storage_unavailable')
  }
}
