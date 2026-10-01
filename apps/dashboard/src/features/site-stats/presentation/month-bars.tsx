import type React from 'react'

import type { TrafficBucket } from '@analytics/protocol/site-stats'

import { type ChartLayout, monthBarWidth } from '../domain/chart-layout'
import { MonthBar } from './month-bar'

/** The gap between a month's two bars. */
const MONTH_BAR_GAP = 2

type MonthBarsProps = {
  baseline: number
  layout: ChartLayout
  series: readonly TrafficBucket[]
}

/** Each month's page views and visits as two bars side by side, centred in its band. */
export const MonthBars: React.FC<MonthBarsProps> = ({
  baseline,
  layout,
  series
}) => {
  const { xAt, yAt } = layout
  const barWidth = monthBarWidth(layout.band)

  return series.map((bucket, index) => {
    const centre = xAt(index)

    return (
      <g key={bucket.bucket}>
        <MonthBar
          baseline={baseline}
          className='page-views-bar'
          left={centre - barWidth - MONTH_BAR_GAP / 2}
          top={yAt(bucket.pageViews)}
          value={bucket.pageViews}
          width={barWidth}
        />
        <MonthBar
          baseline={baseline}
          className='visits-bar'
          left={centre + MONTH_BAR_GAP / 2}
          top={yAt(bucket.visits)}
          value={bucket.visits}
          width={barWidth}
        />
      </g>
    )
  })
}
