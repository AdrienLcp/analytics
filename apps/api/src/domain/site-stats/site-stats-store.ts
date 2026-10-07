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

export type SiteTrafficStore = {
  read: (query: {
    site: SiteId
    window: StatsWindow
  }) => Promise<Result<SiteTraffic, 'storage_unavailable'>>
}

/**
 * D1 out of reach is a `Result`; a row of the API's own tables that does not
 * parse is a bug in a past write or a missing migration, and throws.
 */
export const createSiteTrafficStore = (
  database: D1Database
): SiteTrafficStore => {
  /** One round trip: the series and every breakdown go to D1 as a single batch. */
  const runBatch = async (
    statements: D1PreparedStatement[]
  ): Promise<Result<D1Result[], 'storage_unavailable'>> => {
    try {
      return Result.success(await database.batch(statements))
    } catch (error) {
      logger.error('Could not read site traffic', { error: String(error) })
      return Result.failure('storage_unavailable')
    }
  }

  return {
    read: async ({ site, window }) => {
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

      const batch = await runBatch([trafficStatement, ...breakdownStatements])
      if (batch.status === 'failure') return batch

      const [trafficResult, ...breakdownResults] = batch.data
      const traffic = trafficRowsSchema.parse(trafficResult?.results)
      const breakdowns = siteStatsBreakdownsSchema.parse(
        Object.fromEntries(
          BREAKDOWN_NAMES.map((name, index) => [
            name,
            breakdownResults[index]?.results
          ])
        )
      )

      return Result.success({
        breakdowns,
        traffic: traffic.map((row) => ({
          bucket: row.bucket,
          pageViews: row.page_views,
          visits: row.visits
        }))
      })
    }
  }
}
