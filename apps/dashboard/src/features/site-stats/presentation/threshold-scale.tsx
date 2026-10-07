import { classNames } from '@adrienlcp/react'
import type React from 'react'

import type { WebVitalMetric } from '@analytics/protocol/web-vitals'

import { useTranslate } from '@/presentation/i18n/i18n-provider'

import { scaleShare, WEB_VITAL_THRESHOLDS } from '../domain/web-vital-rating'
import { webVitalTickText } from './web-vital-text'

import './threshold-scale.sass'

type ThresholdScaleProps = {
  metric: WebVitalMetric
  /** The 75th percentile, marked on the scale; `null` draws the scale dotted. */
  value: number | null
}

/**
 * A metric's good, needs-improvement and poor ranges as one band, with the
 * measured value pinned on it. Decorative: the verdict says it in words.
 */
export const ThresholdScale: React.FC<ThresholdScaleProps> = ({
  metric,
  value
}) => {
  const translate = useTranslate()
  const { good, poor } = WEB_VITAL_THRESHOLDS[metric]
  const goodShare = scaleShare({ metric, value: good })
  const poorShare = scaleShare({ metric, value: poor })

  return (
    <div
      aria-hidden='true'
      className={classNames('threshold-scale', value === null && 'unmeasured')}
      style={{ '--good': goodShare, '--poor': poorShare }}
    >
      <div className='bands'>
        <span className='band good' />
        <span className='band needs-improvement' />
        <span className='band poor' />
      </div>
      {value === null ? null : (
        <span
          className='marker'
          style={{ '--at': scaleShare({ metric, value }) }}
        />
      )}
      <div className='ticks'>
        <span style={{ '--at': goodShare }}>
          {webVitalTickText({ metric, translate, value: good })}
        </span>
        <span style={{ '--at': poorShare }}>
          {webVitalTickText({ metric, translate, value: poor })}
        </span>
      </div>
    </div>
  )
}
