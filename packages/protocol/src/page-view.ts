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

/** `location.pathname` only: a query string or a hash can carry a token or an email. */
export const pagePathSchema = z.string().startsWith('/').max(MAX_PATH_LENGTH)

export const viewportWidthSchema = z.int().min(0).max(MAX_VIEWPORT_WIDTH)

/**
 * Drawn afresh by the tracker for every page view, so it names one page load
 * and never a visitor: the next page of the same visit gets another.
 */
export const viewKeySchema = z.uuid()

/**
 * What the tracker sends for one page view. Nothing in it identifies a person:
 * the path carries no query string, and the referrer is cut down to its host
 * before it is stored.
 */
export const pageViewBeaconSchema = z.object({
  /** `navigator.webdriver`: a test runner or a crawler driving the browser. */
  isAutomated: z.boolean(),
  locale: z.string().max(MAX_LOCALE_LENGTH).nullable(),
  path: pagePathSchema,
  referrer: z.string().max(MAX_REFERRER_LENGTH).nullable(),
  site: siteIdSchema,
  theme: z.enum(THEMES),
  viewKey: viewKeySchema,
  viewportWidth: viewportWidthSchema
})

export type PageViewBeacon = z.infer<typeof pageViewBeaconSchema>

/**
 * Sent the first time someone touches, scrolls, types in or leaves the page:
 * a headless browser that loads a page and is killed never sends it, so the
 * page view `viewKey` names counts as a human's only once it arrives.
 */
export const pageEngagementBeaconSchema = z.object({
  site: siteIdSchema,
  viewKey: viewKeySchema
})

export type PageEngagementBeacon = z.infer<typeof pageEngagementBeaconSchema>
