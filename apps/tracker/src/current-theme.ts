import type { PageViewBeacon } from '@analytics/protocol/page-view'

import { prefersDarkScheme, stampedTheme } from './browser'

/**
 * A site that lets the visitor pick a theme stamps it on `<html data-theme>`;
 * without that choice, the page follows the system.
 */
export const currentTheme = (): PageViewBeacon['theme'] => {
  const chosen = stampedTheme()
  if (chosen === 'light' || chosen === 'dark') return chosen

  return prefersDarkScheme() ? 'dark' : 'light'
}
