import type { Translate } from '@/presentation/i18n/translation'

import { type BucketUnit, bucketStart } from '../domain/bucket'

/** "30 Sep 2026", or "Sep 2026": one bucket named in full. */
export const bucketLabel = ({
  bucket,
  translate,
  unit
}: {
  bucket: string
  translate: Translate
  unit: BucketUnit
}): string => {
  const start = bucketStart({ bucket, unit })

  return unit === 'day'
    ? translate('table.day', { day: start })
    : translate('table.month', { month: start })
}
