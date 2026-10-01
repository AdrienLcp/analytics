import type React from 'react'

import { useRouteFailure } from '@/infrastructure/router/navigation'
import { Button } from '@/presentation/components/button'
import { Main } from '@/presentation/components/main'
import { useTranslate } from '@/presentation/i18n/i18n-provider'

import { AppShell } from './app-shell'

import './error-screen.sass'

const reload = (): void => {
  window.location.reload()
}

/**
 * The root route's boundary: a render that throws lands here instead of on a
 * white page. Reload rather than retry, because the likeliest cause is a lazy
 * chunk a redeploy removed under an open tab, and retrying asks for it again.
 */
export const ErrorScreen: React.FC = () => {
  const translate = useTranslate()
  const failure = useRouteFailure()

  console.error(
    'The dashboard hit an error it could not render through',
    failure
  )

  return (
    <AppShell>
      <Main className='error-screen'>
        <h1>{translate('error.screen.title')}</h1>
        <p>{translate('error.screen.description')}</p>
        <Button className='reload' onPress={reload}>
          {translate('error.screen.reload')}
        </Button>
      </Main>
    </AppShell>
  )
}
