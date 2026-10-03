import type { StatsPeriod } from '@analytics/protocol/site-stats'

import { startOfUtcDay } from '@/infrastructure/dates'

export type BucketUnit = 'day' | 'month'

/** 7 and 30 days are read day by day, 12 months month by month. */
export const PERIOD_UNIT = {
  '7d': 'day',
  '12m': 'month',
  '30d': 'day'
} as const satisfies Record<StatsPeriod, BucketUnit>

/**
 * Midnight UTC at the start of a bucket the API names `YYYY-MM-DD` or
 * `YYYY-MM`. Formatted with `timeZone: 'UTC'`, it reads as that same day or
 * month wherever the reader is.
 */
export const bucketStart = ({
  bucket,
  unit
}: {
  bucket: string
  unit: BucketUnit
}) => startOfUtcDay(unit === 'day' ? bucket : `${bucket}-01`)
