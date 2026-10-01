import type React from 'react'

import { useTranslate } from '@/presentation/i18n/i18n-provider'

import './site-footer.sass'

export const SiteFooter: React.FC = () => {
  const translate = useTranslate()

  return (
    <footer className='site-footer'>
      <span>{translate('footer.hosting')}</span>
      <span className='spacer' />
      <span>{translate('footer.utc')}</span>
    </footer>
  )
}
