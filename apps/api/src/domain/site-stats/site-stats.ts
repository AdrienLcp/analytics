import type {
  SiteStatsBreakdowns,
  SiteStatsResponse,
  StatsPeriod,
  Traffic,
  TrafficBucket
} from '@analytics/protocol/site-stats'
import type { WebVitalsSummary } from '@analytics/protocol/web-vitals'

import type { StatsWindow } from './stats-window'

const NO_TRAFFIC: Traffic = { pageViews: 0, visits: 0 }

/** A bucket nobody visited is absent from the query and present, at zero, in the series. */
export const toSiteStats = ({
  breakdowns,
  period,
  traffic,
  webVitals,
  window
}: {
  breakdowns: SiteStatsBreakdowns
  period: StatsPeriod
  traffic: readonly TrafficBucket[]
  webVitals: WebVitalsSummary
  window: StatsWindow
}): SiteStatsResponse => {
  const trafficByBucket = new Map(traffic.map((row) => [row.bucket, row]))
  const series = window.buckets.map((bucket) => ({
    ...(trafficByBucket.get(bucket) ?? NO_TRAFFIC),
    bucket
  }))
  const totals = series.reduce(
    (sum, { pageViews, visits }) => ({
      pageViews: sum.pageViews + pageViews,
      visits: sum.visits + visits
    }),
    NO_TRAFFIC
  )

  return { breakdowns, period, series, totals, webVitals }
}
