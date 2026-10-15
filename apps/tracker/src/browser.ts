const OPT_OUT_QUERY_PARAMETER = 'analytics'
const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '[::1]'])

/**
 * `location.pathname` only: a query string or a hash can carry a token or an
 * email. Still raw — it leaves the browser only as its route.
 */
export const currentPath = (): string => location.pathname

export const currentOrigin = (): string => location.origin

/**
 * The origin of the page that linked here, `null` without one: the collector
 * keeps no more than its host, so the path, which can carry a code, never
 * leaves the browser.
 */
export const referrerOrigin = (): string | null => {
  if (!document.referrer) return null

  try {
    return new URL(document.referrer).origin
  } catch {
    return null
  }
}

/** The visitor's browser asks every site not to sell or share their data. */
export const sendsGlobalPrivacyControl = (): boolean =>
  'globalPrivacyControl' in navigator && navigator.globalPrivacyControl === true

export const viewportWidth = (): number => Math.round(innerWidth)

/** As the browser reports it, `null` when it reports none. */
export const browserLocale = (): string | null => navigator.language || null

/** A test runner or a crawler driving the browser, never a visitor. */
export const isAutomated = (): boolean => navigator.webdriver

/** Over HTTPS from a real host: a local build or a preview is never counted. */
export const isServedPublicly = (): boolean =>
  location.protocol === 'https:' && !LOCAL_HOSTNAMES.has(location.hostname)

/** The `?analytics=` value on this page: `'off'`, `'on'`, anything else, or `null`. */
export const optOutQuery = (): string | null =>
  new URLSearchParams(location.search).get(OPT_OUT_QUERY_PARAMETER)

/** The theme the site stamped on `<html data-theme>`, whatever it is, or `undefined`. */
export const stampedTheme = (): string | undefined =>
  document.documentElement.dataset.theme

export const prefersDarkScheme = (): boolean =>
  matchMedia('(prefers-color-scheme: dark)').matches
