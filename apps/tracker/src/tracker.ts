import { API_ROUTES } from '@analytics/protocol/routes'
import { isSiteId } from '@analytics/protocol/site-ids'
import { TRACKER_SITE_DATA_KEY } from '@analytics/protocol/tracker-script'

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
  const loadedPath = location.pathname
  let trackedPath: string | null = null

  const track = () => {
    if (location.pathname === trackedPath) return

    const referrer =
      trackedPath === null
        ? document.referrer || null
        : `${location.origin}${trackedPath}`

    sendBeacon({
      beacon: pageViewBeacon({ referrer, site }),
      url: collectUrl
    })
    trackedPath = location.pathname
  }

  track()
  onPathChange(track)

  reportWebVitalsOnHide((measurements) => {
    sendBeacon({
      beacon: {
        ...measurements,
        path: loadedPath,
        site,
        viewportWidth: Math.round(window.innerWidth)
      },
      url: webVitalsUrl
    })
  })
}

if (document.currentScript instanceof HTMLScriptElement) {
  startTracking(document.currentScript)
}
