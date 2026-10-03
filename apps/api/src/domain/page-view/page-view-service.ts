import { Result } from '@adrienlcp/result'

import type { PageViewBeacon } from '@analytics/protocol/page-view'

import { hostsOfSite, isOriginOfSite } from '@/domain/site/site-origins'

import { isBotUserAgent } from './bot-user-agent'
import { toPageView } from './page-view'
import { insertPageView } from './page-view-store'

export type RecordPageViewError = 'foreign_origin' | 'storage_unavailable'

export type RecordPageViewOutcome = 'recorded' | 'ignored_bot'

export const recordPageView = async ({
  beacon,
  country,
  database,
  origin,
  receivedAt,
  userAgent
}: {
  beacon: PageViewBeacon
  country: string | null
  database: D1Database
  origin: string | null
  receivedAt: Temporal.Instant
  userAgent: string | null
}): Promise<Result<RecordPageViewOutcome, RecordPageViewError>> => {
  if (origin === null || !isOriginOfSite({ origin, site: beacon.site })) {
    return Result.failure('foreign_origin')
  }

  if (isBotUserAgent(userAgent)) return Result.success('ignored_bot')

  const pageView = toPageView({
    beacon,
    country,
    siteHosts: hostsOfSite(beacon.site),
    viewedAt: receivedAt
  })

  const stored = await insertPageView({ database, pageView })
  if (stored.status === 'failure') return stored

  return Result.success('recorded')
}
