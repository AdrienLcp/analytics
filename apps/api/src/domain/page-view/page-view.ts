import type { Device, PageViewBeacon } from '@analytics/protocol/page-view'
import type { SiteId } from '@analytics/protocol/site-ids'

import { deviceForViewport } from './device'
import { classifyReferrer } from './referrer'

export type PageView = {
  country: string | null
  device: Device
  isEntry: boolean
  locale: string | null
  path: string
  referrerHost: string | null
  site: SiteId
  theme: PageViewBeacon['theme']
  /** ISO 8601, stamped by the API on arrival. */
  viewedAt: string
}

export const toPageView = ({
  beacon,
  country,
  siteHosts,
  viewedAt
}: {
  beacon: PageViewBeacon
  country: string | null
  siteHosts: readonly string[]
  viewedAt: Temporal.Instant
}): PageView => ({
  ...classifyReferrer({ referrer: beacon.referrer, siteHosts }),
  country,
  device: deviceForViewport(beacon.viewportWidth),
  locale: beacon.locale,
  path: beacon.path,
  site: beacon.site,
  theme: beacon.theme,
  viewedAt: viewedAt.toString({ smallestUnit: 'millisecond' })
})
