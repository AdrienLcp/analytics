import { optOutQuery, sendsGlobalPrivacyControl } from './browser'

const OPT_OUT_STORAGE_KEY = 'analytics:ignore'

/**
 * `?analytics=off` on any page of a tracked site stops counting this browser
 * there, `?analytics=on` resumes it: the owner's own visits stay out of the
 * numbers without a cookie or an account. A site's own opt-out switch writes
 * the same key.
 */
const isRefusedOnThisSite = (): boolean => {
  try {
    const choice = optOutQuery()

    if (choice === 'off') localStorage.setItem(OPT_OUT_STORAGE_KEY, 'true')
    if (choice === 'on') localStorage.removeItem(OPT_OUT_STORAGE_KEY)

    return localStorage.getItem(OPT_OUT_STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

/**
 * Refused on this site, or everywhere through Global Privacy Control, which
 * `?analytics=on` does not override: that signal is the visitor's choice, not
 * the owner's.
 */
export const isOptedOut = (): boolean =>
  isRefusedOnThisSite() || sendsGlobalPrivacyControl()
