import type { Device, PageViewBeacon } from '@analytics/protocol/page-view'
import type { SiteId } from '@analytics/protocol/site-ids'
import { routeOfSitePath } from '@analytics/protocol/site-routes'

import { toIsoString } from '@/infrastructure/dates'

import { deviceForViewport } from './device'
import { classifyReferrer } from './referrer'

export type PageView = {
  country: string | null
  device: Device
  /** The browser declared itself automated, or its user agent is a crawler's. */
  isAutomated: boolean
  isEntry: boolean
  locale: string | null
  path: string
  referrerHost: string | null
  site: SiteId
  theme: PageViewBeacon['theme']
  /** ISO 8601, stamped by the API on arrival. */
  viewedAt: string
  viewKey: string
}

export const toPageView = ({
  beacon,
  country,
  isAutomated,
  siteHosts,
  viewedAt
}: {
  beacon: PageViewBeacon
  country: string | null
  isAutomated: boolean
  siteHosts: readonly string[]
  viewedAt: Temporal.Instant
}): PageView => ({
  ...classifyReferrer({ referrer: beacon.referrer, siteHosts }),
  country,
  device: deviceForViewport(beacon.viewportWidth),
  isAutomated,
  locale: beacon.locale,
  path: routeOfSitePath({ path: beacon.path, site: beacon.site }),
  site: beacon.site,
  theme: beacon.theme,
  viewedAt: toIsoString(viewedAt),
  viewKey: beacon.viewKey
})
