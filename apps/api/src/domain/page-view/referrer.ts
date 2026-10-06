export type ReferrerOrigin = {
  isEntry: boolean
  /** The external host the visit came from; `null` for a direct visit or an internal page view. */
  referrerHost: string | null
}

const parseHost = (referrer: string): string | null =>
  URL.parse(referrer)?.host.replace(/^www\./, '') ?? null

/**
 * A page view reached from another page of the same site continues a visit;
 * anything else — another site, a bookmark, a typed address — starts one. Only
 * the host of an external referrer is kept, never its path.
 */
export const classifyReferrer = ({
  referrer,
  siteHosts
}: {
  referrer: string | null
  siteHosts: readonly string[]
}): ReferrerOrigin => {
  const host = referrer === null ? null : parseHost(referrer)

  if (host === null) return { isEntry: true, referrerHost: null }

  if (siteHosts.some((siteHost) => siteHost.replace(/^www\./, '') === host)) {
    return { isEntry: false, referrerHost: null }
  }

  return { isEntry: true, referrerHost: host }
}
