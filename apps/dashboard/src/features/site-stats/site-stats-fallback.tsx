import type React from 'react'

import { useLocationSite } from '@/infrastructure/router/navigation'
import { AppShell } from '@/presentation/app-shell'
import { Main } from '@/presentation/components/main'

import { PlateLoading } from './presentation/plate-loading'

import './site-stats-page.sass'

/**
 * What a cold load shows while the first figures are read: the plate already
 * set, waiting for its numbers, rather than a spinner on an empty page.
 */
export const SiteStatsFallback: React.FC = () => {
  const site = useLocationSite()

  return (
    <AppShell>
      <Main className='site-stats-page'>
        {site === null ? null : <PlateLoading site={site} />}
      </Main>
    </AppShell>
  )
}
