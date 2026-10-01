import type React from 'react'

import type { SiteId } from '@analytics/protocol/site-ids'
import type { StatsPeriod } from '@analytics/protocol/site-stats'

import { Button } from '@/presentation/components/button'
import { useTranslate } from '@/presentation/i18n/i18n-provider'

import { PERIOD_UNIT } from '../domain/bucket'
import type { SiteStatsError } from '../infrastructure/site-stats-api'
import { PlateFrame } from './plate-frame'
import { PlateHead } from './plate-head'
import { PlateNotice } from './plate-notice'

import './plate-error.sass'

type PlateErrorProps = {
  /** An aborted read is never shown, so it is not a reason here. */
  error: Exclude<SiteStatsError, 'aborted'>
  onRetry: () => void
  period: StatsPeriod
  site: SiteId
}

/** The figures did not arrive: the plate says why, and offers to ask again. */
export const PlateError: React.FC<PlateErrorProps> = ({
  error,
  onRetry,
  period,
  site
}) => {
  const translate = useTranslate()

  return (
    <>
      <PlateHead
        lede={translate('error.body', { reason: error })}
        meta={[translate('period.long', { period })]}
        site={site}
      />
      <PlateFrame
        title={translate('plate.title', { unit: PERIOD_UNIT[period] })}
      >
        <PlateNotice title={translate('error.title', { reason: error })}>
          <Button className='plate-retry' onPress={onRetry}>
            {translate('error.retry')}
          </Button>
        </PlateNotice>
      </PlateFrame>
    </>
  )
}
