import type React from 'react'

import { Link } from '@/presentation/components/link'
import { focusMain, MAIN_HREF } from '@/presentation/components/main'
import { RegistrationMark } from '@/presentation/components/registration-mark'
import { useTranslate } from '@/presentation/i18n/i18n-provider'

import './masthead.sass'

const REPOSITORY_URL = 'https://github.com/AdrienLcp/analytics'

const skipToMain = (event: React.MouseEvent<HTMLAnchorElement>): void => {
  event.preventDefault()
  focusMain()
}

/** The annual's running head: whose sites, and where the code is. */
export const Masthead: React.FC = () => {
  const translate = useTranslate()

  return (
    <header className='masthead'>
      <a className='skip-link' href={MAIN_HREF} onClick={skipToMain}>
        {translate('masthead.skip')}
      </a>
      <span className='name'>
        <RegistrationMark />
        {translate('masthead.name')}
      </span>
      <span className='owner'>{translate('masthead.owner')}</span>
      <span className='spacer' />
      <Link className='source' href={REPOSITORY_URL}>
        {translate('masthead.source')}
      </Link>
    </header>
  )
}
