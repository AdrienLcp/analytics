import { preferredLocales } from '@/infrastructure/browser'
import { readStoredLocale } from '@/infrastructure/storage/preferences-storage'

import { i18n } from './i18n'
import type { Locale } from './locales'

/**
 * The language the dashboard opens in: the one this device chose last, then
 * the one its browser asks for. Stamped on `<html lang>` before anything
 * renders, or a browser reading English markup over French text offers to
 * translate the page.
 */
export const applyInitialLocale = (): Locale => {
  const stored = readStoredLocale()

  if (stored.status === 'failure') {
    console.warn(
      'The stored language could not be read; following the browser instead',
      stored.error
    )
  }

  const locale =
    (stored.status === 'success' ? stored.data : null) ??
    i18n.negotiate(preferredLocales())

  document.documentElement.lang = locale

  return locale
}
