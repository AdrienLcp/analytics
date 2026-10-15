import { Result } from '@adrienlcp/result'

import { logger } from '@/infrastructure/logging/logger'

import type { RetentionCutoff } from './retention-window'

export type DeletedRows = { pageViews: number; webVitalBuckets: number }

export type RetentionStore = {
  deleteExpired: (
    cutoff: RetentionCutoff
  ) => Promise<Result<DeletedRows, 'storage_unavailable'>>
}

export const createRetentionStore = (database: D1Database): RetentionStore => ({
  deleteExpired: async ({ before, beforeDay }) => {
    try {
      const [pageViews, webVitalBuckets] = await database.batch([
        database
          .prepare('DELETE FROM page_views WHERE viewed_at < ?')
          .bind(before),
        database
          .prepare('DELETE FROM web_vital_buckets WHERE day < ?')
          .bind(beforeDay)
      ])

      return Result.success({
        pageViews: pageViews?.meta.changes ?? 0,
        webVitalBuckets: webVitalBuckets?.meta.changes ?? 0
      })
    } catch (error) {
      logger.error('Could not delete expired rows', { error: String(error) })
      return Result.failure('storage_unavailable')
    }
  }
})
