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

export const incrementWebVitalBuckets = async ({
  buckets,
  database,
  day,
  device,
  path,
  site
}: {
  buckets: readonly Omit<WebVitalBucketCount, 'count'>[]
  database: D1Database
  day: string
  device: Device
  path: string
  site: SiteId
}): Promise<Result<void, 'storage_unavailable'>> => {
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
}

export const readWebVitalBuckets = async ({
  database,
  sinceDay,
  site
}: {
  database: D1Database
  /** `YYYY-MM-DD`, included. */
  sinceDay: string
  site: SiteId
}): Promise<Result<WebVitalBucketCount[], 'storage_unavailable'>> => {
  try {
    const { results } = await database
      .prepare(
        `SELECT metric, bucket, SUM(count) AS count
          FROM web_vital_buckets WHERE site = ? AND day >= ?
          GROUP BY metric, bucket`
      )
      .bind(site, sinceDay)
      .all()
    const rows = bucketCountRowsSchema.safeParse(results)

    if (!rows.success) {
      logger.error('D1 returned Web Vitals rows of an unexpected shape')
      return Result.failure('storage_unavailable')
    }

    return Result.success(rows.data)
  } catch (error) {
    logger.error('Could not read Web Vitals', { error: String(error) })
    return Result.failure('storage_unavailable')
  }
}
