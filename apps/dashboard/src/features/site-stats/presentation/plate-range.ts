import type { TrafficBucket } from '@analytics/protocol/site-stats'

import type { Translate } from '@/presentation/i18n/translation'

import { type BucketUnit, bucketStart } from '../domain/bucket'

/** "1 Sep – 30 Sep 2026", or "Oct 2025 – Sep 2026": the span the series covers. */
export const rangeLabel = ({
  series,
  translate,
  unit
}: {
  series: readonly TrafficBucket[]
  translate: Translate
  unit: BucketUnit
}): string => {
  const first = series[0]
  const last = series.at(-1)

  if (first === undefined || last === undefined) return ''

  const from = bucketStart({ bucket: first.bucket, unit })
  const to = bucketStart({ bucket: last.bucket, unit })

  return unit === 'day'
    ? translate('range.days', { from, to })
    : translate('range.months', { from, to })
}
