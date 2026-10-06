import type { SiteId } from '@analytics/protocol/site-ids'

/**
 * Where each site is served in production. A page view is only counted from
 * these origins, so a branch preview or a local build never pollutes the
 * numbers. The current host comes first; the hosts after it now redirect to it
 * but stay listed while cached pages may still send from them.
 */
const SITE_ORIGINS = {
  'on-record': [
    'https://on-record.adrienlcp.com',
    'https://on-record-203.pages.dev'
  ],
  portfolio: [
    'https://adrienlcp.com',
    'https://www.adrienlcp.com',
    'https://adrienlacourpaille.dev',
    'https://www.adrienlacourpaille.dev',
    'https://portfolio-9qi.pages.dev'
  ],
  scoreboard: [
    'https://scoreboard.adrienlcp.com',
    'https://scoreboard.adrienlcp.workers.dev'
  ],
  taverla: [
    'https://taverla.adrienlcp.com',
    'https://taverla.adrienlcp.workers.dev'
  ]
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
