import type { PageViewBeacon } from '@analytics/protocol/page-view'
import type { WebVitalsBeacon } from '@analytics/protocol/web-vitals'

/**
 * A string body goes out as `text/plain`, which needs no CORS preflight. The
 * `fetch` fallback is `keepalive` so a beacon sent while the page unloads
 * still leaves.
 */
export const sendBeacon = ({
  beacon,
  url
}: {
  beacon: PageViewBeacon | WebVitalsBeacon
  url: string
}): void => {
  const body = JSON.stringify(beacon)

  if (navigator.sendBeacon?.(url, body)) return

  fetch(url, {
    body,
    keepalive: true,
    method: 'POST',
    mode: 'no-cors'
  }).catch(() => undefined)
}
