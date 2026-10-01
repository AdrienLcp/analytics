/** Everything under it runs on the Worker; every other path is a static asset or the dashboard. */
export const API_PREFIX = '/api'

/**
 * Every path either end of the wire names: the API registers the pattern, the
 * tracker and the dashboard call it.
 */
export const API_ROUTES = {
  collect: `${API_PREFIX}/collect`,
  siteStats: `${API_PREFIX}/sites/:site/stats`
} as const
