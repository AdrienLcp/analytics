import type { StatsPeriod } from '@analytics/protocol/site-stats'

import { toIsoString } from '@/infrastructure/dates'

export type BucketUnit = 'day' | 'month'

/** How many leading characters of an ISO 8601 date or timestamp name its bucket. */
export const BUCKET_KEY_LENGTH = {
  day: 'YYYY-MM-DD'.length,
  month: 'YYYY-MM'.length
} as const satisfies Record<BucketUnit, number>

export type StatsWindow = {
  /** Every bucket of the period, oldest first, the current one last. */
  buckets: string[]
  /** ISO 8601 start of the first bucket. */
  since: string
  /** The `YYYY-MM-DD` day the first bucket starts on. */
  sinceDay: string
  unit: BucketUnit
}

const PERIOD_SPAN = {
  '7d': { length: 7, unit: 'day' },
  '12m': { length: 12, unit: 'month' },
  '30d': { length: 30, unit: 'day' }
} as const satisfies Record<StatsPeriod, { length: number; unit: BucketUnit }>

const bucketStart = ({
  offset,
  today,
  unit
}: {
  offset: number
  today: Temporal.PlainDate
  unit: BucketUnit
}): Temporal.PlainDate =>
  unit === 'day'
    ? today.subtract({ days: offset })
    : today.with({ day: 1 }).subtract({ months: offset })

/** Buckets are cut in UTC, so a day starts at midnight UTC whoever reads the stats. */
export const statsWindowFor = ({
  now,
  period
}: {
  now: Temporal.Instant
  period: StatsPeriod
}): StatsWindow => {
  const { length, unit } = PERIOD_SPAN[period]
  const today = now.toZonedDateTimeISO('UTC').toPlainDate()
  const starts = Array.from({ length }, (_, index) =>
    bucketStart({ offset: length - 1 - index, today, unit })
  )
  const first = starts[0] ?? today

  return {
    buckets: starts.map((start) =>
      unit === 'day' ? start.toString() : start.toPlainYearMonth().toString()
    ),
    since: toIsoString(first.toZonedDateTime('UTC').toInstant()),
    sinceDay: first.toString(),
    unit
  }
}
