const OPT_OUT_STORAGE_KEY = 'analytics:ignore'
const OPT_OUT_QUERY_PARAMETER = 'analytics'

/**
 * `?analytics=off` on any page of a tracked site stops counting this browser
 * there, `?analytics=on` resumes it: the owner's own visits stay out of the
 * numbers without a cookie or an account.
 */
export const isOptedOut = (): boolean => {
  try {
    const choice = new URLSearchParams(location.search).get(
      OPT_OUT_QUERY_PARAMETER
    )

    if (choice === 'off') localStorage.setItem(OPT_OUT_STORAGE_KEY, 'true')
    if (choice === 'on') localStorage.removeItem(OPT_OUT_STORAGE_KEY)

    return localStorage.getItem(OPT_OUT_STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}
