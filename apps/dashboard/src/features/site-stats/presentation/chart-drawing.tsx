import type React from 'react'

import type { TrafficBucket } from '@analytics/protocol/site-stats'

import { useTranslate } from '@/presentation/i18n/i18n-provider'

import type { BucketUnit } from '../domain/bucket'
import type { ChartLayout } from '../domain/chart-layout'
import { crispLine } from '../domain/chart-paths'
import { axisTicks } from './axis-ticks'
import { DailyLines } from './daily-lines'
import { EndLabels } from './end-labels'
import { MonthBars } from './month-bars'
import { useTextWidth } from './use-text-width'

const TICK_LENGTH = 5
/** Drops a grid line's figure onto the line, centred on its x-height. */
const AXIS_VALUE_DROP = 4
/** Lifts a date label off the bottom edge, so its descenders show. */
const AXIS_LABEL_RAISE = 6
/** The gap between the last day and its end labels. */
const END_LABELS_OFFSET = 14

type TickAnchor = 'start' | 'middle' | 'end'

type ChartDrawingProps = {
  activeIndex: number | null
  layout: ChartLayout
  series: readonly TrafficBucket[]
  unit: BucketUnit
}

/** The chart itself, hidden from a screen reader, which reads its summary. */
export const ChartDrawing: React.FC<ChartDrawingProps> = ({
  activeIndex,
  layout,
  series,
  unit
}) => {
  const translate = useTranslate()
  const [readAxisFont, textWidth] = useTextWidth<SVGSVGElement>()
  const { bottom, height, isNarrow, left, right, top, width, xAt, yAt } = layout
  const baseline = crispLine(yAt(0))
  const last = series.length - 1
  const lastBucket = series[last]
  const ticks = axisTicks({
    namesWeekdays: true,
    pitch: layout.pitch,
    series,
    textWidth,
    translate,
    unit
  })

  const tickAnchor = (index: number): TickAnchor => {
    if (unit === 'month') return 'middle'
    if (index === 0) return 'start'
    return index === last ? 'end' : 'middle'
  }

  return (
    <svg
      aria-hidden='true'
      focusable='false'
      height={height}
      ref={readAxisFont}
      viewBox={`0 0 ${width} ${height}`}
    >
      {layout.gridValues.map((value, index) => {
        const y = crispLine(yAt(value))

        return (
          <g key={value}>
            <line
              className={index === 0 ? 'zero-line' : 'grid-line'}
              x1={left}
              x2={right}
              y1={y}
              y2={y}
            />
            <text className='axis-value' x={0} y={y + AXIS_VALUE_DROP}>
              {translate('chart.tick', { value })}
            </text>
          </g>
        )
      })}

      {unit === 'month' && activeIndex !== null ? (
        <rect
          className='active-band'
          height={bottom - top}
          width={layout.band}
          x={left + layout.band * activeIndex}
          y={top}
        />
      ) : null}

      {ticks.map((tick) => (
        <g key={tick.key}>
          {unit === 'day' ? (
            <line
              className='tick'
              x1={xAt(tick.index)}
              x2={xAt(tick.index)}
              y1={baseline}
              y2={baseline + TICK_LENGTH}
            />
          ) : null}
          <text
            className='axis-label'
            textAnchor={tickAnchor(tick.index)}
            x={xAt(tick.index)}
            y={height - AXIS_LABEL_RAISE}
          >
            {tick.label}
          </text>
        </g>
      ))}

      {unit === 'day' ? (
        <DailyLines
          activeIndex={activeIndex}
          baseline={baseline}
          layout={layout}
          series={series}
        />
      ) : (
        <MonthBars baseline={baseline} layout={layout} series={series} />
      )}

      {unit === 'day' && !isNarrow && lastBucket !== undefined ? (
        <EndLabels
          bucket={lastBucket}
          x={xAt(last) + END_LABELS_OFFSET}
          yAt={yAt}
        />
      ) : null}
    </svg>
  )
}
