import type { Device } from '@analytics/protocol/page-view'

const TABLET_MIN_WIDTH = 640
const DESKTOP_MIN_WIDTH = 1024

/** The device is read from the viewport, never from the user agent, which is not kept. */
export const deviceForViewport = (viewportWidth: number): Device => {
  if (viewportWidth < TABLET_MIN_WIDTH) return 'mobile'
  if (viewportWidth < DESKTOP_MIN_WIDTH) return 'tablet'
  return 'desktop'
}
