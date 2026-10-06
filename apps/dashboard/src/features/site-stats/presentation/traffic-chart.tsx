import type React from 'react'
import { useState } from 'react'

import type { TrafficBucket } from '@analytics/protocol/site-stats'

import { useTranslate } from '@/presentation/i18n/i18n-provider'

import type { BucketUnit } from '../domain/bucket'
import { chartLayout } from '../domain/chart-layout'
import { bucketLabel } from './bucket-label'
import { ChartDrawing } from './chart-drawing'
import { ChartTip } from './chart-tip'
import { useElementWidth } from './use-element-width'

import './traffic-chart.sass'

type TrafficChartProps = {
  series: readonly TrafficBucket[]
  /** Read by a screen reader in place of the drawing. */
  summary: string
  unit: BucketUnit
}

const STEP_KEYS = {
  ArrowLeft: -1,
  ArrowRight: 1
} as const

const isStepKey = (key: string): key is keyof typeof STEP_KEYS =>
  key in STEP_KEYS

/**
 * Page views and visits over the period: two lines over days, paired bars over
 * months. Hovering or arrowing through it reads one bucket at a time.
 *
 * A hand-rolled `role='slider'`: react-aria's slider always holds a value and
 * moves only on press or drag, where this one reads nothing until hovered,
 * follows the pointer without a press, and lets go on Escape or blur.
 */
export const TrafficChart: React.FC<TrafficChartProps> = ({
  series,
  summary,
  unit
}) => {
  const translate = useTranslate()
  const [measure, width] = useElementWidth<HTMLDivElement>()
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const count = series.length
  const layout =
    width > 0
      ? chartLayout({
          count,
          maximum: Math.max(0, ...series.map((bucket) => bucket.pageViews)),
          unit,
          width
        })
      : null
  const active = activeIndex === null ? undefined : series[activeIndex]

  const pointAt = (event: React.PointerEvent<HTMLDivElement>) => {
    if (layout === null || count === 0) return

    const bounds = event.currentTarget.getBoundingClientRect()
    setActiveIndex(layout.indexAtX(event.clientX - bounds.left))
  }

  const step = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (count === 0) return

    if (isStepKey(event.key)) {
      event.preventDefault()
      const direction = STEP_KEYS[event.key]
      const start = direction > 0 ? -1 : count
      setActiveIndex(
        Math.max(0, Math.min(count - 1, (activeIndex ?? start) + direction))
      )
      return
    }

    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      setActiveIndex(event.key === 'Home' ? 0 : count - 1)
      return
    }

    if (event.key === 'Escape') setActiveIndex(null)
  }

  const leave = () => setActiveIndex(null)

  const tipX =
    layout === null || activeIndex === null ? 0 : layout.xAt(activeIndex)
  const isTipFlipped = layout !== null && tipX > layout.width / 2
  const readIndex = activeIndex ?? count - 1
  const readBucket = series[readIndex]

  const valueText = (bucket: TrafficBucket): string =>
    translate('chart.valueText', {
      bucket: bucketLabel({ bucket: bucket.bucket, translate, unit }),
      pageViews: bucket.pageViews,
      visits: bucket.visits
    })

  return (
    <div
      aria-label={summary}
      aria-valuemax={count}
      aria-valuemin={1}
      aria-valuenow={readIndex + 1}
      aria-valuetext={
        readBucket === undefined ? undefined : valueText(readBucket)
      }
      className='traffic-chart'
      onBlur={leave}
      onKeyDown={step}
      onPointerDown={pointAt}
      onPointerLeave={leave}
      onPointerMove={pointAt}
      ref={measure}
      role='slider'
      tabIndex={0}
    >
      {layout === null ? null : (
        <ChartDrawing
          activeIndex={activeIndex}
          layout={layout}
          series={series}
          unit={unit}
        />
      )}
      <ChartTip bucket={active} isFlipped={isTipFlipped} unit={unit} x={tipX} />
    </div>
  )
}
