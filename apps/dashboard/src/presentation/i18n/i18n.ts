import { createI18n, type Dictionary } from '@adrienlcp/i18n'

import { EN_DICTIONARY } from './dictionary-en'
import { FR_DICTIONARY } from './dictionary-fr'
import { DEFAULT_LOCALE, type Locale } from './locales'

/**
 * `satisfies` holds the registry to `LOCALES` — a locale added there stops
 * compiling here until it has a dictionary — while leaving the keys literal,
 * which is what `createI18n` reads to type `translator` and `negotiate`.
 */
export const i18n = createI18n({
  defaultLocale: DEFAULT_LOCALE,
  dictionaries: { en: EN_DICTIONARY, fr: FR_DICTIONARY } satisfies Record<
    Locale,
    Dictionary
  >
})
