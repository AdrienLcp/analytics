import type { PageViewBeacon } from '@analytics/protocol/page-view'
import type { SiteId } from '@analytics/protocol/site-ids'
import { routeOfSitePath } from '@analytics/protocol/site-routes'

import {
  browserLocale,
  currentPath,
  isAutomated,
  viewportWidth
} from './browser'
import { currentTheme } from './current-theme'

export const pageViewBeacon = ({
  referrer,
  site,
  viewKey
}: {
  referrer: string | null
  site: SiteId
  viewKey: string
}): PageViewBeacon => ({
  isAutomated: isAutomated(),
  locale: browserLocale(),
  path: routeOfSitePath({ path: currentPath(), site }),
  referrer,
  site,
  theme: currentTheme(),
  viewKey,
  viewportWidth: viewportWidth()
})
