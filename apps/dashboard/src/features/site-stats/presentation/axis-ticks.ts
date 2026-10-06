import type { TrafficBucket } from '@analytics/protocol/site-stats'

import type { Translate } from '@/presentation/i18n/translation'

import { type BucketUnit, bucketStart } from '../domain/bucket'
import {
  dayTickIndexes,
  isWeekSeries,
  monthTickIndexes
} from '../domain/chart-layout'

export type AxisTick = {
  /** Where the bucket sits in the series. */
  index: number
  key: string
  label: string
}

/**
 * The buckets labelled under the date axis, and their labels, as many as fit
 * `pitch` pixels apart without touching. With `namesWeekdays`, a week reads
 * "Mon", "Tue"; otherwise every day reads as a date.
 */
export const axisTicks = ({
  namesWeekdays,
  pitch,
  series,
  textWidth,
  translate,
  unit
}: {
  namesWeekdays: boolean
  /** The distance between two neighbouring buckets on the axis. */
  pitch: number
  series: readonly TrafficBucket[]
  /** How wide a label draws, in the axis' font. */
  textWidth: (label: string) => number
  translate: Translate
  unit: BucketUnit
}): AxisTick[] => {
  const count = series.length
  const isWeekdayAxis = namesWeekdays && isWeekSeries(count)

  const tickLabel = (bucket: string): string => {
    const start = bucketStart({ bucket, unit })

    if (unit === 'month') return translate('chart.monthTick', { month: start })

    return isWeekdayAxis
      ? translate('chart.weekdayTick', { day: start })
      : translate('chart.dayTick', { day: start })
  }

  const labels = series.map((bucket) => tickLabel(bucket.bucket))
  const labelWidth = Math.max(0, ...labels.map(textWidth))
  const indexes =
    unit === 'month'
      ? monthTickIndexes({ count, labelWidth, pitch })
      : dayTickIndexes({ count, labelWidth, pitch })

  return indexes.flatMap((index) => {
    const bucket = series[index]
    const label = labels[index]
    if (bucket === undefined || label === undefined) return []

    return [{ index, key: bucket.bucket, label }]
  })
}
