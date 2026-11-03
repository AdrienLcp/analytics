import type React from 'react'

import { Link } from '@/presentation/components/link'
import { useI18n } from '@/presentation/i18n/i18n-provider'
import { RichText } from '@/presentation/i18n/rich-text'
import { AUTHOR, SOURCE_REPOSITORY_HREF } from '@/presentation/site-credits'

import './site-footer.sass'

/**
 * The annual's imprint: where the figures are counted and in which time zone,
 * then who made the dashboard, linked to his site, and its source.
 */
export const SiteFooter: React.FC = () => {
  const { locale, translate } = useI18n()

  const authorLink = (children: string): React.ReactNode => (
    <Link className='link' href={AUTHOR.siteHref[locale]}>
      {children}
    </Link>
  )

  return (
    <footer className='site-footer'>
      <span>{translate('footer.hosting')}</span>
      <span>{translate('footer.utc')}</span>
      <span className='spacer' />
      <span>
        <RichText
          parts={translate.rich('footer.credit', {
            author: authorLink,
            name: AUTHOR.name
          })}
        />
      </span>
      <Link className='link' href={SOURCE_REPOSITORY_HREF}>
        {translate('footer.source')}
      </Link>
    </footer>
  )
}
