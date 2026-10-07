import { Result } from '@adrienlcp/result'
import { z } from 'zod'

import type { Device } from '@analytics/protocol/page-view'
import type { SiteId } from '@analytics/protocol/site-ids'
import { WEB_VITAL_METRICS } from '@analytics/protocol/web-vitals'

import { logger } from '@/infrastructure/logging/logger'

import type { WebVitalBucketCount } from './web-vital-buckets'

const bucketCountRowsSchema = z.array(
  z.object({
    bucket: z.number(),
    count: z.number(),
    metric: z.enum(WEB_VITAL_METRICS)
  })
)

export type WebVitalsStore = {
  increment: (measured: {
    buckets: readonly Omit<WebVitalBucketCount, 'count'>[]
    day: string
    device: Device
    path: string
    site: SiteId
  }) => Promise<Result<void, 'storage_unavailable'>>
  read: (query: {
    /** `YYYY-MM-DD`, included. */
    sinceDay: string
    site: SiteId
  }) => Promise<Result<WebVitalBucketCount[], 'storage_unavailable'>>
}

/**
 * D1 out of reach is a `Result`; a row of the API's own tables that does not
 * parse is a bug in a past write or a missing migration, and throws.
 */
export const createWebVitalsStore = (database: D1Database): WebVitalsStore => {
  const readRows = async (
    statement: D1PreparedStatement
  ): Promise<Result<unknown[], 'storage_unavailable'>> => {
    try {
      const { results } = await statement.all()
      return Result.success(results)
    } catch (error) {
      logger.error('Could not read Web Vitals', { error: String(error) })
      return Result.failure('storage_unavailable')
    }
  }

  return {
    increment: async ({ buckets, day, device, path, site }) => {
      const statement = database.prepare(
        `INSERT INTO web_vital_buckets (site, day, path, device, metric, bucket, count)
          VALUES (?, ?, ?, ?, ?, ?, 1)
          ON CONFLICT (site, day, path, device, metric, bucket) DO UPDATE SET count = count + 1`
      )

      try {
        await database.batch(
          buckets.map(({ bucket, metric }) =>
            statement.bind(site, day, path, device, metric, bucket)
          )
        )

        return Result.success()
      } catch (error) {
        logger.error('Could not store Web Vitals', { error: String(error) })
        return Result.failure('storage_unavailable')
      }
    },

    read: async ({ sinceDay, site }) => {
      const rows = await readRows(
        database
          .prepare(
            `SELECT metric, bucket, SUM(count) AS count
              FROM web_vital_buckets WHERE site = ? AND day >= ?
              GROUP BY metric, bucket`
          )
          .bind(site, sinceDay)
      )
      if (rows.status === 'failure') return rows

      return Result.success(bucketCountRowsSchema.parse(rows.data))
    }
  }
}
