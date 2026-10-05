import { createSafeContext } from '@adrienlcp/react'
import type React from 'react'
import { useEffect, useState } from 'react'
import { I18nProvider as ReactAriaI18nProvider } from 'react-aria-components'

import { warnOnFailure } from '@/infrastructure/diagnostics'
import { writeStoredLocale } from '@/infrastructure/storage/preferences-storage'

import { i18n } from './i18n'
import type { Locale } from './locales'
import { REGIONAL_LOCALES } from './regional-locales'
import type { Translate } from './translation'

type I18nContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  translate: Translate
}

export const [I18nContext, useI18n] =
  createSafeContext<I18nContextValue>('I18nProvider')

export const useTranslate = (): Translate => useI18n().translate

type I18nProviderProps = {
  children: React.ReactNode
  /** Settled by `applyInitialLocale` before the first render. */
  locale: Locale
}

export const I18nProvider: React.FC<I18nProviderProps> = ({
  children,
  locale: initialLocale
}) => {
  const [locale, setLocale] = useState<Locale>(initialLocale)

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const chooseLocale = (next: Locale): void => {
    setLocale(next)
    warnOnFailure(
      writeStoredLocale(next),
      'The chosen language could not be stored; the next visit will follow the browser'
    )
  }

  return (
    <I18nContext
      value={{
        locale,
        setLocale: chooseLocale,
        translate: i18n.translator(locale)
      }}
    >
      <ReactAriaI18nProvider locale={REGIONAL_LOCALES[locale]}>
        {children}
      </ReactAriaI18nProvider>
    </I18nContext>
  )
}
