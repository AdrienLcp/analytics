import { API_ROUTES } from '@analytics/protocol/routes'
import { isSiteId } from '@analytics/protocol/site-ids'
import { TRACKER_SITE_DATA_KEY } from '@analytics/protocol/tracker-script'

import { currentOrigin, currentPath, viewportWidth } from './browser'
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
  const webVitalsUrl = new URL(API_ROUTES.webVitals, script.src).href
  const loadedPath = currentPath()
  let trackedPath: string | null = null

  const track = () => {
    if (currentPath() === trackedPath) return

    const referrer =
      trackedPath === null
        ? document.referrer || null
        : `${currentOrigin()}${trackedPath}`

    sendBeacon({
      beacon: pageViewBeacon({ referrer, site }),
      url: collectUrl
    })
    trackedPath = currentPath()
  }

  track()
  onPathChange(track)

  reportWebVitalsOnHide((measurements) => {
    sendBeacon({
      beacon: {
        ...measurements,
        path: loadedPath,
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
