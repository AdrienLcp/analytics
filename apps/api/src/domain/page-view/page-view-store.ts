import { Result } from '@adrienlcp/result'

import type { PageEngagementBeacon } from '@analytics/protocol/page-view'

import { logger } from '@/infrastructure/logging/logger'

import type { PageView } from './page-view'

export type PageViewStore = {
  /** Stored unengaged: it counts as a human's only once `markEngaged` finds it. */
  insert: (pageView: PageView) => Promise<Result<void, 'storage_unavailable'>>
  /** `true` when a stored page view had that key; the key is cleared with it. */
  markEngaged: (
    engagement: PageEngagementBeacon
  ) => Promise<Result<boolean, 'storage_unavailable'>>
}

export const createPageViewStore = (database: D1Database): PageViewStore => ({
  insert: async (pageView) => {
    try {
      await database
        .prepare(
          `INSERT INTO page_views
            (site, path, is_entry, referrer_host, country, locale, theme, device, viewed_at, is_automated, is_engaged, view_key)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)`
        )
        .bind(
          pageView.site,
          pageView.path,
          pageView.isEntry ? 1 : 0,
          pageView.referrerHost,
          pageView.country,
          pageView.locale,
          pageView.theme,
          pageView.device,
          pageView.viewedAt,
          pageView.isAutomated ? 1 : 0,
          pageView.viewKey
        )
        .run()

      return Result.success()
    } catch (error) {
      logger.error('Could not store a page view', { error: String(error) })
      return Result.failure('storage_unavailable')
    }
  },

  markEngaged: async ({ site, viewKey }) => {
    try {
      const updated = await database
        .prepare(
          `UPDATE page_views SET is_engaged = 1, view_key = NULL
            WHERE site = ? AND view_key = ?`
        )
        .bind(site, viewKey)
        .run()

      return Result.success(updated.meta.changes > 0)
    } catch (error) {
      logger.error('Could not mark a page view engaged', {
        error: String(error)
      })
      return Result.failure('storage_unavailable')
    }
  }
})
