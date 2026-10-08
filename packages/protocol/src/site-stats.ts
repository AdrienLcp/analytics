import { z } from 'zod'

import { STATS_PERIODS } from './stats-periods'
import { webVitalsSummarySchema } from './web-vitals'

export const statsPeriodSchema = z.enum(STATS_PERIODS)

export type StatsPeriod = z.infer<typeof statsPeriodSchema>

export const siteStatsQuerySchema = z.object({
  period: statsPeriodSchema.default('30d')
})

const tallySchema = z.object({ count: z.number(), key: z.string() })

export type Tally = z.infer<typeof tallySchema>

const trafficSchema = z.object({
  pageViews: z.number(),
  /** A visit starts on a page view that arrived from outside the site. */
  visits: z.number()
})

export type Traffic = z.infer<typeof trafficSchema>

const trafficBucketSchema = trafficSchema.extend({
  /** `YYYY-MM-DD` for a daily bucket, `YYYY-MM` for a monthly one, in UTC. */
  bucket: z.string()
})

export type TrafficBucket = z.infer<typeof trafficBucketSchema>

export const siteStatsBreakdownsSchema = z.object({
  countries: z.array(tallySchema),
  devices: z.array(tallySchema),
  locales: z.array(tallySchema),
  pages: z.array(tallySchema),
  referrers: z.array(tallySchema),
  themes: z.array(tallySchema)
})

export type SiteStatsBreakdowns = z.infer<typeof siteStatsBreakdownsSchema>

export const siteStatsResponseSchema = z.object({
  breakdowns: siteStatsBreakdownsSchema,
  period: statsPeriodSchema,
  series: z.array(trafficBucketSchema),
  totals: trafficSchema,
  webVitals: webVitalsSummarySchema
})

export type SiteStatsResponse = z.infer<typeof siteStatsResponseSchema>

export type ApiErrorResponse = {
  code: string
  message: string
}
