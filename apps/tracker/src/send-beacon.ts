import type { PageViewBeacon } from '@analytics/protocol/page-view'

/**
 * A string body goes out as `text/plain`, which needs no CORS preflight. The
 * `fetch` fallback is `keepalive` so a beacon sent while the page unloads
 * still leaves.
 */
export const sendBeacon = ({
  beacon,
  collectUrl
}: {
  beacon: PageViewBeacon
  collectUrl: string
}): void => {
  const body = JSON.stringify(beacon)

  if (navigator.sendBeacon?.(collectUrl, body)) return

  fetch(collectUrl, {
    body,
    keepalive: true,
    method: 'POST',
    mode: 'no-cors'
  }).catch(() => undefined)
}
