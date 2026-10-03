import type { PageViewBeacon } from '@analytics/protocol/page-view'
import type { SiteId } from '@analytics/protocol/site-ids'

import { browserLocale, currentPath, viewportWidth } from './browser'
import { currentTheme } from './current-theme'

export const pageViewBeacon = ({
  referrer,
  site
}: {
  referrer: string | null
  site: SiteId
}): PageViewBeacon => ({
  locale: browserLocale(),
  path: currentPath(),
  referrer,
  site,
  theme: currentTheme(),
  viewportWidth: viewportWidth()
})
