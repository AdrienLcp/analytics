import type React from 'react'

import type { TrafficBucket } from '@analytics/protocol/site-stats'

import { Button } from '@/presentation/components/button'
import { ChevronIcon } from '@/presentation/components/chevron-icon'
import {
  Disclosure,
  DisclosurePanel
} from '@/presentation/components/disclosure'
import { useTranslate } from '@/presentation/i18n/i18n-provider'

import type { BucketUnit } from '../domain/bucket'
import { bucketLabel } from './bucket-label'

import './traffic-table.sass'

type TrafficTableProps = {
  /** The period as the head names it, for the caption. */
  range: string
  series: readonly TrafficBucket[]
  unit: BucketUnit
}

/** The chart's figures as rows, folded under it for whoever wants the numbers. */
export const TrafficTable: React.FC<TrafficTableProps> = ({
  range,
  series,
  unit
}) => {
  const translate = useTranslate()

  return (
    <Disclosure className='traffic-table'>
      <Button className='toggle' slot='trigger'>
        <ChevronIcon />
        {translate('table.toggle')}
      </Button>
      <DisclosurePanel className='panel'>
        <div className='scroller'>
          <table>
            <caption>{translate('table.caption', { range })}</caption>
            <thead>
              <tr>
                <th scope='col'>{translate('table.unit', { unit })}</th>
                <th scope='col'>{translate('credits.pageViews')}</th>
                <th scope='col'>{translate('credits.visits')}</th>
              </tr>
            </thead>
            <tbody>
              {series.map((bucket) => (
                <tr key={bucket.bucket}>
                  <td>
                    {bucketLabel({ bucket: bucket.bucket, translate, unit })}
                  </td>
                  <td>
                    {translate('credits.count', { value: bucket.pageViews })}
                  </td>
                  <td>
                    {translate('credits.count', { value: bucket.visits })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}
