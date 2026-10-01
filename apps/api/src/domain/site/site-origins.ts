import type { SiteId } from '@analytics/protocol/site-ids'

/**
 * Where each site is served in production. A page view is only counted from
 * these origins, so a branch preview or a local build never pollutes the
 * numbers.
 */
const SITE_ORIGINS = {
  'on-record': ['https://on-record-203.pages.dev'],
  portfolio: ['https://portfolio-9qi.pages.dev'],
  taverla: ['https://taverla.onrender.com']
} as const satisfies Record<SiteId, readonly string[]>

export const isOriginOfSite = ({
  origin,
  site
}: {
  origin: string
  site: SiteId
}): boolean => SITE_ORIGINS[site].some((allowed) => allowed === origin)

export const hostsOfSite = (site: SiteId): string[] =>
  SITE_ORIGINS[site].map((origin) => new URL(origin).host)
