import type { Traffic, TrafficBucket } from '@analytics/protocol/site-stats'

/** `null` until there is a visit to divide by. */
export const pagesPerVisit = (totals: Traffic): number | null =>
  totals.visits === 0 ? null : totals.pageViews / totals.visits

/** The bucket with the most page views, the earliest on a tie; `null` when all are empty. */
export const busiestBucket = (
  series: readonly TrafficBucket[]
): TrafficBucket | null =>
  series.reduce<TrafficBucket | null>(
    (busiest, bucket) =>
      bucket.pageViews > (busiest?.pageViews ?? 0) ? bucket : busiest,
    null
  )
