import type { StatsPeriod } from '@analytics/protocol/site-stats'

export type BucketUnit = 'day' | 'month'

/** How many leading characters of an ISO 8601 timestamp name its bucket. */
export const BUCKET_KEY_LENGTH = {
  day: 'YYYY-MM-DD'.length,
  month: 'YYYY-MM'.length
} as const satisfies Record<BucketUnit, number>

export type StatsWindow = {
  /** Every bucket of the period, oldest first, the current one last. */
  buckets: string[]
  /** ISO 8601 start of the first bucket. */
  since: string
  unit: BucketUnit
}

const PERIOD_SPAN = {
  '7d': { length: 7, unit: 'day' },
  '12m': { length: 12, unit: 'month' },
  '30d': { length: 30, unit: 'day' }
} as const satisfies Record<StatsPeriod, { length: number; unit: BucketUnit }>

const bucketStart = ({
  now,
  offset,
  unit
}: {
  now: Date
  offset: number
  unit: BucketUnit
}): Date =>
  unit === 'day'
    ? new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate() - offset
        )
      )
    : new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - offset, 1))

/** Buckets are cut in UTC, so a day starts at midnight UTC whoever reads the stats. */
export const statsWindowFor = ({
  now,
  period
}: {
  now: Date
  period: StatsPeriod
}): StatsWindow => {
  const { length, unit } = PERIOD_SPAN[period]
  const starts = Array.from({ length }, (_, index) =>
    bucketStart({ now, offset: length - 1 - index, unit })
  )
  const first = starts[0] ?? now

  return {
    buckets: starts.map((start) =>
      start.toISOString().slice(0, BUCKET_KEY_LENGTH[unit])
    ),
    since: first.toISOString(),
    unit
  }
}
