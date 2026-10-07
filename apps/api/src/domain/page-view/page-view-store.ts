import { Result } from '@adrienlcp/result'

import { logger } from '@/infrastructure/logging/logger'

import type { PageView } from './page-view'

export type PageViewStore = {
  insert: (pageView: PageView) => Promise<Result<void, 'storage_unavailable'>>
}

export const createPageViewStore = (database: D1Database): PageViewStore => ({
  insert: async (pageView) => {
    try {
      await database
        .prepare(
          `INSERT INTO page_views
            (site, path, is_entry, referrer_host, country, locale, theme, device, viewed_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
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
          pageView.viewedAt
        )
        .run()

      return Result.success()
    } catch (error) {
      logger.error('Could not store a page view', { error: String(error) })
      return Result.failure('storage_unavailable')
    }
  }
})
