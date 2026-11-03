import { API_ROUTES } from '@analytics/protocol/routes'
import { isSiteId } from '@analytics/protocol/site-ids'
import { routeOfSitePath } from '@analytics/protocol/site-routes'
import { TRACKER_SITE_DATA_KEY } from '@analytics/protocol/tracker-script'

import {
  currentOrigin,
  currentPath,
  isAutomated,
  newViewKey,
  referrerOrigin,
  viewportWidth
} from './browser'
import { onFirstEngagement } from './engagement'
import { onPathChange } from './navigation'
import { pageViewBeacon } from './page-view-beacon'
import { sendBeacon } from './send-beacon'
import { shouldTrack } from './should-track'
import { reportWebVitalsOnHide } from './web-vitals'

/**
 * Loaded by `<script defer data-site="portfolio" src=".../tracker.js">`. The
 * beacons go back to the origin the script came from.
 */
const startTracking = (script: HTMLScriptElement) => {
  const site = script.dataset[TRACKER_SITE_DATA_KEY]
  if (site === undefined || !isSiteId(site) || !shouldTrack()) return

  const collectUrl = new URL(API_ROUTES.collect, script.src).href
  const engagementUrl = new URL(API_ROUTES.engagement, script.src).href
  const webVitalsUrl = new URL(API_ROUTES.webVitals, script.src).href
  let trackedPath: string | null = null

  const track = () => {
    if (currentPath() === trackedPath) return

    const referrer = trackedPath === null ? referrerOrigin() : currentOrigin()
    const viewKey = newViewKey()

    sendBeacon({
      beacon: pageViewBeacon({ referrer, site, viewKey }),
      url: collectUrl
    })
    onFirstEngagement(() => {
      sendBeacon({ beacon: { site, viewKey }, url: engagementUrl })
    })
    trackedPath = currentPath()
  }

  track()
  onPathChange(track)

  if (isAutomated()) return

  reportWebVitalsOnHide((measurements) => {
    sendBeacon({
      beacon: {
        ...measurements,
        path: routeOfSitePath({ path: measurements.path, site }),
        site,
        viewportWidth: viewportWidth()
      },
      url: webVitalsUrl
    })
  })
}

if (document.currentScript instanceof HTMLScriptElement) {
  startTracking(document.currentScript)
}
