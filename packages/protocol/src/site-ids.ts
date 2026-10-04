/**
 * The sites the collector accepts page views from; their origins are the API's.
 * Kept apart from the schema so the tracker can read the list without shipping Zod.
 */
export const SITE_IDS = [
  'portfolio',
  'taverla',
  'on-record',
  'scoreboard'
] as const

export type SiteId = (typeof SITE_IDS)[number]

export const isSiteId = (value: string): value is SiteId =>
  SITE_IDS.some((siteId) => siteId === value)
