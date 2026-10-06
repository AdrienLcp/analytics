import { CLSThresholds, INPThresholds, LCPThresholds } from 'web-vitals'

import type {
  WebVitalMetric,
  WebVitalsSummary
} from '@analytics/protocol/web-vitals'

/** Google's three verdicts on a Core Web Vital, read at the 75th percentile. */
export type WebVitalRating = 'good' | 'needs-improvement' | 'poor'

type WebVitalThresholds = {
  /** The most a value can be and still be good. */
  good: number
  /** The most a value can be before it is poor. */
  poor: number
  /** Where the drawn scale ends: anything past it is pinned to the end. */
  scaleMax: number
}

const thresholds = (
  [good, poor]: readonly [good: number, poor: number],
  scaleMax: number
): WebVitalThresholds => ({ good, poor, scaleMax })

/**
 * Google's thresholds, as its `web-vitals` library publishes them: milliseconds
 * for LCP and INP, a unitless score for CLS. The scale ends far enough past
 * "poor" to show how far past.
 */
export const WEB_VITAL_THRESHOLDS = {
  cls: thresholds(CLSThresholds, 0.4),
  inp: thresholds(INPThresholds, 800),
  lcp: thresholds(LCPThresholds, 6000)
} as const satisfies Record<WebVitalMetric, WebVitalThresholds>

/** A value equal to a threshold falls on its better side. */
export const rateWebVital = ({
  metric,
  value
}: {
  metric: WebVitalMetric
  value: number
}): WebVitalRating => {
  const { good, poor } = WEB_VITAL_THRESHOLDS[metric]

  if (value <= good) {
    return 'good'
  }

  return value <= poor ? 'needs-improvement' : 'poor'
}

/** How far along the metric's scale a value sits, from 0 to 1, capped at the end. */
export const scaleShare = ({
  metric,
  value
}: {
  metric: WebVitalMetric
  value: number
}): number => Math.min(1, value / WEB_VITAL_THRESHOLDS[metric].scaleMax)

/** Whether any browser reported any of the three metrics. */
export const hasWebVitalSamples = (summary: WebVitalsSummary): boolean =>
  Object.values(summary).some((metric) => metric.samples > 0)
