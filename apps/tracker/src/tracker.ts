import { API_ROUTES } from '@analytics/protocol/routes'
import { isSiteId } from '@analytics/protocol/site-ids'

import { onPathChange } from './navigation'
import { pageViewBeacon } from './page-view-beacon'
import { sendBeacon } from './send-beacon'
import { shouldTrack } from './should-track'

/**
 * Loaded by `<script defer data-site="portfolio" src=".../tracker.js">`. The
 * beacons go back to the origin the script came from.
 */
const startTracking = (script: HTMLScriptElement) => {
  const site = script.dataset.site
  if (site === undefined || !isSiteId(site) || !shouldTrack()) return

  const collectUrl = new URL(API_ROUTES.collect, script.src).href
  let trackedPath: string | null = null

  const track = () => {
    if (location.pathname === trackedPath) return

    const referrer =
      trackedPath === null
        ? document.referrer || null
        : `${location.origin}${trackedPath}`

    sendBeacon({ beacon: pageViewBeacon({ referrer, site }), collectUrl })
    trackedPath = location.pathname
  }

  track()
  onPathChange(track)
}

if (document.currentScript instanceof HTMLScriptElement) {
  startTracking(document.currentScript)
}
