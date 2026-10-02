import { z } from 'zod'

import { pagePathSchema, viewportWidthSchema } from './page-view'
import { siteIdSchema } from './site'

/**
 * The three Core Web Vitals: Largest Contentful Paint and Interaction to Next
 * Paint in milliseconds, Cumulative Layout Shift as a score with no unit.
 */
export const WEB_VITAL_METRICS = ['lcp', 'inp', 'cls'] as const

export type WebVitalMetric = (typeof WEB_VITAL_METRICS)[number]

/** A page that took longer than this to paint or answer is reported at the cap. */
const MAX_DURATION_MS = 600_000
const MAX_LAYOUT_SHIFT = 100

const durationSchema = z.number().min(0).max(MAX_DURATION_MS).nullable()

/**
 * Sent once per page load, when the page is hidden. A metric the browser could
 * not measure — no interaction, no LCP support — is `null`. The path is the one
 * the document loaded on: a single-page app's later routes have no LCP of their
 * own.
 */
export const webVitalsBeaconSchema = z.object({
  cls: z.number().min(0).max(MAX_LAYOUT_SHIFT).nullable(),
  inp: durationSchema,
  lcp: durationSchema,
  path: pagePathSchema,
  site: siteIdSchema,
  viewportWidth: viewportWidthSchema
})

export type WebVitalsBeacon = z.infer<typeof webVitalsBeaconSchema>

const webVitalSummarySchema = z.object({
  /** The value three page loads in four stay under, `null` before any sample. */
  p75: z.number().nullable(),
  samples: z.number()
})

export type WebVitalSummary = z.infer<typeof webVitalSummarySchema>

export const webVitalsSummarySchema = z.object({
  cls: webVitalSummarySchema,
  inp: webVitalSummarySchema,
  lcp: webVitalSummarySchema
})

export type WebVitalsSummary = z.infer<typeof webVitalsSummarySchema>
