import type React from 'react'

import { currentPath } from '@/infrastructure/browser'
import { DEFAULT_SITE, sitePathFor } from '@/infrastructure/router/navigation'
import { Link } from '@/presentation/components/link'
import { Main } from '@/presentation/components/main'
import { useTranslate } from '@/presentation/i18n/i18n-provider'

import './not-found-page.sass'

/** An address no site answers to: named back, with the way to a real plate. */
export const NotFoundPage: React.FC = () => {
  const translate = useTranslate()

  return (
    <Main className='not-found-page'>
      <h1>{translate('notFound.title')}</h1>
      <p>{translate('notFound.body', { path: currentPath() })}</p>
      <Link className='back' href={sitePathFor({ site: DEFAULT_SITE })}>
        {translate('notFound.back', { site: DEFAULT_SITE })}
      </Link>
    </Main>
  )
}
