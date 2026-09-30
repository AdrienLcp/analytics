import type { PageViewBeacon } from '@analytics/protocol/page-view'

/**
 * A site that lets the visitor pick a theme stamps it on `<html data-theme>`;
 * without that choice, the page follows the system.
 */
export const currentTheme = (): PageViewBeacon['theme'] => {
  const chosen = document.documentElement.dataset.theme
  if (chosen === 'light' || chosen === 'dark') return chosen

  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}
