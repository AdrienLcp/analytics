import type React from 'react'

import type { TrafficBucket } from '@analytics/protocol/site-stats'

import { useTranslate } from '@/presentation/i18n/i18n-provider'

import type { BucketUnit } from '../domain/bucket'
import { bucketLabel } from './bucket-label'

type ChartTipProps = {
  /** The bucket being read; the tip fades out without one. */
  bucket: TrafficBucket | undefined
  /** Set on the left of `x` rather than its right, so it stays in the chart. */
  isFlipped: boolean
  unit: BucketUnit
  x: number
}

/**
 * The figures of the bucket under the pointer or the arrow keys. Hidden from a
 * screen reader, which hears the same through the chart's value text.
 */
export const ChartTip: React.FC<ChartTipProps> = ({
  bucket,
  isFlipped,
  unit,
  x
}) => {
  const translate = useTranslate()

  return (
    <div
      aria-hidden='true'
      className={`chart-tip${bucket === undefined ? '' : ' is-shown'}${isFlipped ? ' is-flipped' : ''}`}
      style={{ '--tip-x': `${x}px` }}
    >
      {bucket === undefined ? null : (
        <>
          <div className='tip-date'>
            {bucketLabel({ bucket: bucket.bucket, translate, unit })}
          </div>
          <dl>
            <dt>
              <i className='page-views' />
              {translate('credits.pageViews')}
            </dt>
            <dd>{translate('credits.count', { value: bucket.pageViews })}</dd>
            <dt>
              <i className='visits' />
              {translate('credits.visits')}
            </dt>
            <dd>{translate('credits.count', { value: bucket.visits })}</dd>
          </dl>
        </>
      )}
    </div>
  )
}
