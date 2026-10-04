import { type RouteObject, redirect } from 'react-router'

import { SITE_IDS, type SiteId } from '@analytics/protocol/site-ids'

import { NotFoundPage } from '@/features/not-found/not-found-page'
import { SiteStatsFallback } from '@/features/site-stats/site-stats-fallback'
import {
  DEFAULT_SITE,
  periodInSearch,
  sitePathFor
} from '@/infrastructure/router/navigation'
import { RootRoute } from '@/infrastructure/router/root-route'
import { ErrorScreen } from '@/presentation/error-screen'

/**
 * One static route per site rather than a `/:site` param: an address naming
 * no known site falls through to the not-found page with nothing to parse,
 * and each loader already knows which site it reads.
 */
const siteRouteFor = (site: SiteId): RouteObject => ({
  lazy: async () => {
    const [page, loader] = await Promise.all([
      import('@/features/site-stats/site-stats-page'),
      import('@/features/site-stats/site-stats-loader')
    ])

    return {
      Component: page.SiteStatsPage,
      loader: ({ request }) =>
        loader.siteStatsLoader({
          period: periodInSearch(new URL(request.url).searchParams),
          signal: request.signal,
          site
        })
    }
  },
  path: sitePathFor({ site })
})

/** The bare address opens the first site, keeping a period it was given. */
const openDefaultSite: RouteObject['loader'] = ({ request }) =>
  redirect(
    sitePathFor({
      period: periodInSearch(new URL(request.url).searchParams),
      site: DEFAULT_SITE
    })
  )

export const routes: RouteObject[] = [
  {
    Component: RootRoute,
    children: [
      { Component: SiteStatsFallback, index: true, loader: openDefaultSite },
      ...SITE_IDS.map(siteRouteFor),
      { Component: NotFoundPage, path: '*' }
    ],
    ErrorBoundary: ErrorScreen,
    HydrateFallback: SiteStatsFallback
  }
]
