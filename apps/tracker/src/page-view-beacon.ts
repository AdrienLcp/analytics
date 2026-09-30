import type { PageViewBeacon } from '@analytics/protocol/page-view'
import type { SiteId } from '@analytics/protocol/site-ids'

import { currentTheme } from './current-theme'

/** `location.pathname` alone: a query string or a hash can carry a token or an email. */
export const pageViewBeacon = ({
  referrer,
  site
}: {
  referrer: string | null
  site: SiteId
}): PageViewBeacon => ({
  locale: navigator.language || null,
  path: location.pathname,
  referrer,
  site,
  theme: currentTheme(),
  viewportWidth: Math.round(window.innerWidth)
})
