import type React from 'react'

import type { TrafficBucket } from '@analytics/protocol/site-stats'

import { useTranslate } from '@/presentation/i18n/i18n-provider'

import { separatedLabels } from '../domain/chart-paths'

/** Sets a figure just above the end of its line. */
const END_VALUE_RAISE = 2
/** Sets a figure's caption one line below the figure. */
const END_LABEL_DROP = 14
/** From the top of a figure to the foot of its caption's descenders. */
const END_LABEL_HEIGHT = 32
/** Clear space between the page views caption and the visits figure below it. */
const END_LABEL_SPACING = 10

type EndLabelsProps = {
  bucket: TrafficBucket
  x: number
  yAt: (value: number) => number
}

/** The last day's two figures, written beside the ends of their lines. */
export const EndLabels: React.FC<EndLabelsProps> = ({ bucket, x, yAt }) => {
  const translate = useTranslate()
  const y = separatedLabels({
    minDistance: END_LABEL_HEIGHT + END_LABEL_SPACING,
    pageViews: yAt(bucket.pageViews),
    visits: yAt(bucket.visits)
  })

  return (
    <>
      <text className='end-value' x={x} y={y.pageViews - END_VALUE_RAISE}>
        {translate('credits.count', { value: bucket.pageViews })}
      </text>
      <text className='end-label' x={x} y={y.pageViews + END_LABEL_DROP}>
        {translate('chart.endPageViews')}
      </text>
      <text className='end-value' x={x} y={y.visits - END_VALUE_RAISE}>
        {translate('credits.count', { value: bucket.visits })}
      </text>
      <text className='end-label' x={x} y={y.visits + END_LABEL_DROP}>
        {translate('chart.endVisits')}
      </text>
    </>
  )
}
