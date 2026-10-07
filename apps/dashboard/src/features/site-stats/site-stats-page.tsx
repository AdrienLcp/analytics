import { classNames } from '@adrienlcp/react'
import type React from 'react'

import {
  useIsRouteLoading,
  useRetryRouteData
} from '@/infrastructure/router/navigation'
import { Main } from '@/presentation/components/main'

import { EmptyPlate } from './presentation/empty-plate'
import { FullPlate } from './presentation/full-plate'
import { PlateError } from './presentation/plate-error'
import { PlateLoading } from './presentation/plate-loading'
import { useSiteStatsData } from './site-stats-loader'

import './site-stats-page.sass'

/**
 * One site's plate. While the next site or period loads, the current plate
 * stays up, dimmed, rather than blanking out. A new site rises into place.
 */
export const SiteStatsPage: React.FC = () => {
  const { period, site, stats } = useSiteStatsData()
  const isLoading = useIsRouteLoading()
  const retry = useRetryRouteData()

  const plate = (): React.ReactNode => {
    if (stats.status === 'failure') {
      return stats.error === 'aborted' ? (
        <PlateLoading site={site} />
      ) : (
        <PlateError
          error={stats.error}
          onRetry={retry}
          period={period}
          site={site}
        />
      )
    }

    return stats.data.totals.pageViews === 0 ? (
      <EmptyPlate period={period} site={site} stats={stats.data} />
    ) : (
      <FullPlate period={period} site={site} stats={stats.data} />
    )
  }

  return (
    <Main
      aria-busy={isLoading}
      className={classNames('site-stats-page', isLoading && 'is-loading')}
    >
      <div className='plate' key={site}>
        {plate()}
      </div>
    </Main>
  )
}
