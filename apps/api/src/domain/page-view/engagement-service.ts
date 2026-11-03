import { Result } from '@adrienlcp/result'

import type { PageEngagementBeacon } from '@analytics/protocol/page-view'

import { isOriginOfSite } from '@/domain/site/site-origins'

import type { PageViewStore } from './page-view-store'

export type RecordEngagementError = 'foreign_origin' | 'storage_unavailable'

/** `unknown_view`: no stored page view holds the key — already engaged, or never stored. */
export type RecordEngagementOutcome = 'engaged' | 'unknown_view'

export const recordEngagement = async ({
  beacon,
  origin,
  pageViews
}: {
  beacon: PageEngagementBeacon
  origin: string | null
  pageViews: PageViewStore
}): Promise<Result<RecordEngagementOutcome, RecordEngagementError>> => {
  if (origin === null || !isOriginOfSite({ origin, site: beacon.site })) {
    return Result.failure('foreign_origin')
  }

  const marked = await pageViews.markEngaged(beacon)
  if (marked.status === 'failure') return marked

  return Result.success(marked.data ? 'engaged' : 'unknown_view')
}
