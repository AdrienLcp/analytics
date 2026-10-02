import type {
  WebVitalMetric,
  WebVitalSummary,
  WebVitalsSummary
} from '@analytics/protocol/web-vitals'

/** Fine enough that every "good" and "poor" threshold of each metric falls on a bucket edge. */
const BUCKET_WIDTH = {
  cls: 0.01,
  inp: 10,
  lcp: 100
} as const satisfies Record<WebVitalMetric, number>

/** The last bucket holds every value from `BUCKET_WIDTH × LAST_BUCKET` up. */
const LAST_BUCKET = 100

const PERCENTILE = 0.75

export type WebVitalBucketCount = {
  bucket: number
  count: number
  metric: WebVitalMetric
}

/** `0.29 / 0.01` is `28.999999999999996` in floating point. */
const withoutFloatNoise = (value: number): number =>
  Number(value.toPrecision(12))

export const bucketOfMeasurement = ({
  metric,
  value
}: {
  metric: WebVitalMetric
  value: number
}): number =>
  Math.min(
    LAST_BUCKET,
    Math.floor(withoutFloatNoise(value / BUCKET_WIDTH[metric]))
  )

/**
 * A bucket reads as its upper edge, so the p75 never flatters the site. The
 * last bucket has no upper edge and reads as its lower one.
 */
const bucketValue = ({
  bucket,
  metric
}: {
  bucket: number
  metric: WebVitalMetric
}): number =>
  withoutFloatNoise(Math.min(bucket + 1, LAST_BUCKET) * BUCKET_WIDTH[metric])

const summarizeMetric = ({
  counts,
  metric
}: {
  counts: readonly WebVitalBucketCount[]
  metric: WebVitalMetric
}): WebVitalSummary => {
  const buckets = counts
    .filter((count) => count.metric === metric)
    .toSorted((a, b) => a.bucket - b.bucket)
  const samples = buckets.reduce((sum, { count }) => sum + count, 0)

  let seen = 0
  const p75Bucket = buckets.find(({ count }) => {
    seen += count
    return seen >= samples * PERCENTILE
  })

  return {
    p75:
      p75Bucket === undefined
        ? null
        : bucketValue({ bucket: p75Bucket.bucket, metric }),
    samples
  }
}

export const summarizeWebVitals = (
  counts: readonly WebVitalBucketCount[]
): WebVitalsSummary => ({
  cls: summarizeMetric({ counts, metric: 'cls' }),
  inp: summarizeMetric({ counts, metric: 'inp' }),
  lcp: summarizeMetric({ counts, metric: 'lcp' })
})
