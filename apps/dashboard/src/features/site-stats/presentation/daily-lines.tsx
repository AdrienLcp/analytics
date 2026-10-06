import type React from 'react'

import type { TrafficBucket } from '@analytics/protocol/site-stats'

import type { ChartLayout } from '../domain/chart-layout'
import { areaPath, linePath } from '../domain/chart-paths'

const DOT_RADIUS = 4
/** The dots on the day being read, a touch larger than the last day's. */
const ACTIVE_DOT_RADIUS = 4.5

type DailyLinesProps = {
  activeIndex: number | null
  baseline: number
  layout: ChartLayout
  series: readonly TrafficBucket[]
}

/**
 * Page views as a filled line and visits as a dashed one, dotted at the last
 * day, with a crosshair on the day being read. Visits never exceed page views
 * and are drawn last, dashed: where the two are equal, page views still show
 * between the dashes.
 */
export const DailyLines: React.FC<DailyLinesProps> = ({
  activeIndex,
  baseline,
  layout,
  series
}) => {
  const { top, xAt, yAt } = layout
  const last = series.length - 1
  const pageViewPoints = series.map(
    (bucket, index) => [xAt(index), yAt(bucket.pageViews)] as const
  )
  const visitPoints = series.map(
    (bucket, index) => [xAt(index), yAt(bucket.visits)] as const
  )
  const lastBucket = series[last]
  const active = activeIndex === null ? undefined : series[activeIndex]

  return (
    <>
      <path
        className='page-views-area'
        d={areaPath({ baseline, points: pageViewPoints })}
      />
      <path className='page-views-halo' d={linePath(pageViewPoints)} />
      <path className='page-views-line' d={linePath(pageViewPoints)} />
      <path className='visits-line' d={linePath(visitPoints)} />
      {lastBucket === undefined ? null : (
        <>
          <circle
            className='visits-dot'
            cx={xAt(last)}
            cy={yAt(lastBucket.visits)}
            r={DOT_RADIUS}
          />
          <circle
            className='page-views-dot'
            cx={xAt(last)}
            cy={yAt(lastBucket.pageViews)}
            r={DOT_RADIUS}
          />
        </>
      )}
      {active === undefined || activeIndex === null ? null : (
        <>
          <line
            className='crosshair'
            x1={xAt(activeIndex)}
            x2={xAt(activeIndex)}
            y1={top}
            y2={baseline}
          />
          <circle
            className='visits-dot'
            cx={xAt(activeIndex)}
            cy={yAt(active.visits)}
            r={ACTIVE_DOT_RADIUS}
          />
          <circle
            className='page-views-dot'
            cx={xAt(activeIndex)}
            cy={yAt(active.pageViews)}
            r={ACTIVE_DOT_RADIUS}
          />
        </>
      )}
    </>
  )
}
