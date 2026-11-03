import { Result } from '@adrienlcp/result'

import type { PageViewBeacon } from '@analytics/protocol/page-view'

import { hostsOfSite, isOriginOfSite } from '@/domain/site/site-origins'

import { isBotUserAgent } from './bot-user-agent'
import { toPageView } from './page-view'
import type { PageViewStore } from './page-view-store'

export type RecordPageViewError = 'foreign_origin' | 'storage_unavailable'

/**
 * A crawler's page view is kept, marked automated, so the dashboard can show
 * what the human figures leave out.
 */
export const recordPageView = async ({
  beacon,
  country,
  origin,
  pageViews,
  receivedAt,
  userAgent
}: {
  beacon: PageViewBeacon
  country: string | null
  origin: string | null
  pageViews: PageViewStore
  receivedAt: Temporal.Instant
  userAgent: string | null
}): Promise<Result<void, RecordPageViewError>> => {
  if (origin === null || !isOriginOfSite({ origin, site: beacon.site })) {
    return Result.failure('foreign_origin')
  }

  const pageView = toPageView({
    beacon,
    country,
    isAutomated: beacon.isAutomated || isBotUserAgent(userAgent),
    siteHosts: hostsOfSite(beacon.site),
    viewedAt: receivedAt
  })

  return pageViews.insert(pageView)
}
