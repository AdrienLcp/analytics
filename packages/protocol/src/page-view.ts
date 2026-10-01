import { z } from 'zod'

import { siteIdSchema } from './site'

export const THEMES = ['light', 'dark'] as const

export type Theme = (typeof THEMES)[number]

export const DEVICES = ['mobile', 'tablet', 'desktop'] as const

export type Device = (typeof DEVICES)[number]

const MAX_PATH_LENGTH = 1024
const MAX_REFERRER_LENGTH = 2048
/** The longest BCP 47 tag a browser reports is far below this. */
const MAX_LOCALE_LENGTH = 35
const MAX_VIEWPORT_WIDTH = 20_000

/**
 * What the tracker sends for one page view. Nothing in it identifies a person:
 * the path carries no query string, and the referrer is cut down to its host
 * before it is stored.
 */
export const pageViewBeaconSchema = z.object({
  locale: z.string().max(MAX_LOCALE_LENGTH).nullable(),
  path: z.string().startsWith('/').max(MAX_PATH_LENGTH),
  referrer: z.string().max(MAX_REFERRER_LENGTH).nullable(),
  site: siteIdSchema,
  theme: z.enum(THEMES),
  viewportWidth: z.int().min(0).max(MAX_VIEWPORT_WIDTH)
})

export type PageViewBeacon = z.infer<typeof pageViewBeaconSchema>
