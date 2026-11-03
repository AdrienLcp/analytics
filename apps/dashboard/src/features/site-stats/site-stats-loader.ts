import type { Audience } from '@analytics/protocol/audiences'
import type { SiteId } from '@analytics/protocol/site-ids'
import type { StatsPeriod } from '@analytics/protocol/site-stats'

import { useRouteData } from '@/infrastructure/router/navigation'

import { fetchSiteStats } from './infrastructure/site-stats-api'

/**
 * Awaited, so the router keeps the current plate up while the next one loads
 * and aborts the request through `signal` when another click overtakes it.
 * A failure comes back as a value for the page to draw, never as a throw.
 */
export const siteStatsLoader = async ({
  audience,
  period,
  signal,
  site
}: {
  audience: Audience
  period: StatsPeriod
  signal: AbortSignal
  site: SiteId
}) => ({
  period,
  site,
  stats: await fetchSiteStats({ audience, period, signal, site })
})

export const useSiteStatsData = () => useRouteData<typeof siteStatsLoader>()
